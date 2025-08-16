import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts"

// Mock environment variables for testing
Deno.env.set('AIRTABLE_TOKEN', 'test_token_123')
Deno.env.set('AIRTABLE_BASE_ID', 'test_base_123')
Deno.env.set('AIRTABLE_TABLE_ID', 'test_table_123')

// Test data
const validFormData = {
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  bottleneck: "Lead Outreach & Qualification",
  notes: "Looking to scale our lead generation process.",
  website: "" // Honeypot field
}

const invalidFormData = {
  name: "", // Too short
  email: "invalid-email",
  company: "A", // Too short
  bottleneck: "Invalid Option",
  notes: "",
  website: ""
}

const botFormData = {
  ...validFormData,
  website: "https://spam-site.com" // Honeypot triggered
}

// Mock fetch for Airtable API
let mockFetchResponse: Response
let mockFetchCalled = false
let mockFetchUrl = ""
let mockFetchOptions: RequestInit | undefined

// Save original fetch
const originalFetch = globalThis.fetch

function mockFetch(url: string | Request | URL, options?: RequestInit): Promise<Response> {
  mockFetchCalled = true
  mockFetchUrl = url.toString()
  mockFetchOptions = options
  return Promise.resolve(mockFetchResponse)
}

// Import the function after setting up mocks
const module = await import("../index.ts")

Deno.test("Form Submit - Valid submission", async () => {
  // Mock successful Airtable response
  mockFetchResponse = new Response(
    JSON.stringify({
      records: [{ id: "rec123456789", fields: validFormData }]
    }),
    { status: 200 }
  )
  
  globalThis.fetch = mockFetch
  mockFetchCalled = false
  
  const request = new Request("https://test.com/form-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validFormData)
  })
  
  const response = await module.default.fetch(request)
  const result = await response.json()
  
  assertEquals(response.status, 200)
  assertEquals(result.ok, true)
  assertEquals(mockFetchCalled, true)
  assertEquals(mockFetchUrl.includes("api.airtable.com"), true)
  
  globalThis.fetch = originalFetch
})

Deno.test("Form Submit - Invalid data validation", async () => {
  const request = new Request("https://test.com/form-submit", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invalidFormData)
  })
  
  const response = await module.default.fetch(request)
  const result = await response.json()
  
  assertEquals(response.status, 400)
  assertEquals(result.ok, false)
  assertEquals(typeof result.error, "string")
})

Deno.test("Form Submit - Honeypot detection", async () => {
  const request = new Request("https://test.com/form-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(botFormData)
  })
  
  const response = await module.default.fetch(request)
  const result = await response.json()
  
  assertEquals(response.status, 400)
  assertEquals(result.ok, false)
  assertEquals(result.error, "Bot detected")
})

Deno.test("Form Submit - Rate limiting", async () => {
  const requests: Promise<Response>[] = []
  
  // Make 12 requests rapidly (exceeds 10/min limit)
  for (let i = 0; i < 12; i++) {
    const request = new Request("https://test.com/form-submit", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.100" // Same IP
      },
      body: JSON.stringify(validFormData)
    })
    requests.push(module.default.fetch(request))
  }
  
  const responses = await Promise.all(requests)
  
  // Some requests should be rate limited (429)
  const rateLimitedCount = responses.filter(r => r.status === 429).length
  assertEquals(rateLimitedCount > 0, true)
})

Deno.test("Form Submit - Airtable 422 error handling", async () => {
  // Mock Airtable 422 response (invalid select value)
  mockFetchResponse = new Response(
    JSON.stringify({
      error: {
        type: "INVALID_REQUEST_BODY",
        message: "Invalid select option"
      }
    }),
    { status: 422 }
  )
  
  globalThis.fetch = mockFetch
  mockFetchCalled = false
  
  const request = new Request("https://test.com/form-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validFormData)
  })
  
  const response = await module.default.fetch(request)
  const result = await response.json()
  
  assertEquals(response.status, 400)
  assertEquals(result.ok, false)
  assertEquals(result.error, "Invalid form data. Please check your selections.")
  
  globalThis.fetch = originalFetch
})

Deno.test("Form Submit - Airtable 429 retry logic", async () => {
  let callCount = 0
  
  // Mock function that returns 429 first, then 200
  globalThis.fetch = async (url: string | Request | URL, options?: RequestInit): Promise<Response> => {
    callCount++
    
    if (callCount === 1) {
      // First call returns 429
      return new Response("Rate limited", { status: 429 })
    } else {
      // Second call returns success
      return new Response(
        JSON.stringify({
          records: [{ id: "rec123456789", fields: validFormData }]
        }),
        { status: 200 }
      )
    }
  }
  
  const request = new Request("https://test.com/form-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validFormData)
  })
  
  const response = await module.default.fetch(request)
  const result = await response.json()
  
  assertEquals(callCount, 2) // Should have retried once
  assertEquals(response.status, 200)
  assertEquals(result.ok, true)
  
  globalThis.fetch = originalFetch
})

Deno.test("Form Submit - CORS preflight", async () => {
  const request = new Request("https://test.com/form-submit", {
    method: "OPTIONS"
  })
  
  const response = await module.default.fetch(request)
  
  assertEquals(response.status, 200)
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*")
  assertEquals(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS")
})

Deno.test("Form Submit - Invalid JSON", async () => {
  const request = new Request("https://test.com/form-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "invalid json{"
  })
  
  const response = await module.default.fetch(request)
  const result = await response.json()
  
  assertEquals(response.status, 400)
  assertEquals(result.ok, false)
  assertEquals(result.error, "Invalid JSON in request body")
})