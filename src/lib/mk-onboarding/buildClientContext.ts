// Supabase Edge Function helpers.
// Used by WebPresenceTab → mk-enrich-web (PageSpeed + HTML scraper).

export function edgeFnUrl(name: string): string {
  return `https://tydafqhnzxmrpnclaxnl.supabase.co/functions/v1/${name}`;
}

export const EDGE_FN_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGFmcWhuenhtcnBuY2xheG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODUwNzEsImV4cCI6MjA4MDU2MTA3MX0.FgsGS_hNQysbMbyxdAG0VPWaHMgBFNrCe0xJezR1R_M";
