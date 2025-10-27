import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SEOHead } from "@/components/SEOHead";
import { Download } from "lucide-react";

const PaymentAndPolicies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Schema markup for legal page
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Legal & Payment Policies",
    "description": "Comprehensive legal information for card payments and e-commerce operations in cooperation with OTP Banka Serbia. Privacy policy, refund policy, and consumer rights.",
    "url": "https://montekristobelgrade.com/legal/payment-and-policies"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MonteKristo AI",
    "legalName": "MonteKristo AI",
    "url": "https://montekristobelgrade.com",
    "logo": "https://montekristobelgrade.com/logo/favicon-512.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kostolačka 51a",
      "addressLocality": "Belgrade",
      "addressCountry": "Serbia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+381641102394",
      "email": "info@montekristobelgrade.com",
      "contactType": "customer service"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Legal & Payment Policies | MonteKristo AI"
        description="Comprehensive legal information for card payments and e-commerce operations in cooperation with OTP Banka Serbia. Privacy policy, refund policy, and consumer rights."
        canonical="/legal/payment-and-policies"
        schema={[webPageSchema, organizationSchema]}
      />
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Page Title & Intro */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Legal & Payment Policies
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              This page contains all legally required information for card payments and e-commerce operations in cooperation with OTP Banka Serbia.
            </p>
          </div>

          <Separator className="mb-12" />

          {/* Section 1: Company Details */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              1. Company Details
            </h2>
            <div className="grid md:grid-cols-[220px_1fr] gap-4 bg-muted/50 p-6 rounded-lg">
              <div className="font-semibold text-foreground">Company name:</div>
              <div className="text-lg text-muted-foreground">MonteKristo AI</div>
              
              <div className="font-semibold text-foreground">Registered address:</div>
              <div className="text-lg text-muted-foreground">Kostolačka 51a, Belgrade, Serbia</div>
              
              <div className="font-semibold text-foreground">Registration number:</div>
              <div className="text-lg text-muted-foreground">65856883</div>
              
              <div className="font-semibold text-foreground">Tax ID (PIB):</div>
              <div className="text-lg text-muted-foreground">112078183</div>
              
              <div className="font-semibold text-foreground">IBAN:</div>
              <div className="text-lg text-muted-foreground">RS35105051012001499213</div>
              
              <div className="font-semibold text-foreground">Phone:</div>
              <div className="text-lg text-muted-foreground">+381641102394</div>
              
              <div className="font-semibold text-foreground">Email:</div>
              <div className="text-lg text-muted-foreground">info@montekristobelgrade.com</div>
              
              <div className="font-semibold text-foreground">Responsible person:</div>
              <div className="text-lg text-muted-foreground">Darko Srdić</div>
              
              <div className="font-semibold text-foreground">Website:</div>
              <div className="text-lg text-muted-foreground">https://montekristobelgrade.com</div>
            </div>
          </section>

          {/* Section 2: Prices & Currency */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              2. Prices & Currency
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                All prices are displayed in Serbian dinars (RSD).
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Payments are processed exclusively in RSD.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Any amounts shown in other currencies are for informational purposes only.
              </p>
            </div>
          </section>

          {/* Section 3: Currency Conversion Notice */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              3. Currency Conversion Notice
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                All payments are processed in RSD.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                If you pay with an international card, your bank may convert the amount to your local currency using its exchange rate and internal policies, which may differ from the rate shown on this website.
              </p>
            </div>
          </section>

          {/* Section 4: Delivery & Service Terms */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              4. Delivery & Service Terms
            </h2>
            <div className="grid md:grid-cols-[200px_1fr] gap-4">
              <div className="font-semibold text-foreground">Delivery methods:</div>
              <div className="text-lg text-muted-foreground">Courier delivery (or digital delivery for software/services)</div>
              
              <div className="font-semibold text-foreground">Delivery area:</div>
              <div className="text-lg text-muted-foreground">Serbia and international (as agreed)</div>
              
              <div className="font-semibold text-foreground">Dispatch time:</div>
              <div className="text-lg text-muted-foreground">Typically within 1–2 business days</div>
              
              <div className="font-semibold text-foreground">Delivery time:</div>
              <div className="text-lg text-muted-foreground">2–5 business days depending on destination</div>
              
              <div className="font-semibold text-foreground">Limitations:</div>
              <div className="text-lg text-muted-foreground">Remote areas or international customs clearance may cause delays</div>
              
              <div className="font-semibold text-foreground">Tracking:</div>
              <div className="text-lg text-muted-foreground">Provided for all courier shipments</div>
            </div>
          </section>

          {/* Section 5: Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              5. Privacy Policy
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We collect only the data necessary to fulfill your order and provide our services (such as name, email, phone, and delivery address).
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We do not store card data.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You can request access, correction, or deletion of your data by contacting <a href="mailto:info@montekristobelgrade.com" className="text-primary hover:underline">info@montekristobelgrade.com</a>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cookies are used only as necessary for site functionality and analytics.
              </p>
            </div>
          </section>

          {/* Section 6: Protection of Confidential Transaction Data */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              6. Protection of Confidential Transaction Data
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                When entering card details, confidential information is transmitted via a secure (SSL/TLS) connection directly to OTP Bank's hosted payment page.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Card data is never stored or processed on our servers.
              </p>
            </div>
          </section>

          {/* Section 7: Complaints Policy */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              7. Complaints Policy
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                If your parcel shows visible damage upon delivery, please refuse it and contact us immediately at <a href="tel:+381641102394" className="text-primary hover:underline">+381641102394</a>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                If you received a wrong or defective item, contact us within 24 hours at <a href="mailto:info@montekristobelgrade.com" className="text-primary hover:underline">info@montekristobelgrade.com</a>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We respond to complaints within 8 days and aim to resolve them within 14 days.
              </p>
            </div>
          </section>

          {/* Section 8: Refunds for Card Payments */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              8. Refunds for Card Payments
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Refunds for transactions made with payment cards are processed exclusively to the same card used for the original transaction, via Visa, Mastercard/Maestro, or Dina channels.
            </p>
          </section>

          {/* Section 9: VAT Statement */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              9. VAT Statement
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                MonteKristo AI is not a VAT payer.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                All displayed prices are final, with no additional taxes or fees.
              </p>
            </div>
          </section>

          {/* Section 10: Right of Withdrawal */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              10. Right of Withdrawal (14 Days)
            </h2>
            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <p className="text-lg font-medium text-foreground">
                Consumers purchasing online have the right to withdraw from a contract within 14 days without giving any reason.
              </p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              To exercise this right, please complete and send the "Model Withdrawal Form" below to <a href="mailto:info@montekristobelgrade.com" className="text-primary hover:underline">info@montekristobelgrade.com</a>.
            </p>
            <Button 
              onClick={() => alert('PDF download will be available soon. Please contact info@montekristobelgrade.com for the withdrawal form.')}
              className="bg-[#FF615A] hover:bg-[#ff4747] text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Model Withdrawal Form (PDF)
            </Button>
          </section>

          {/* Section 11: Payment Security Programs */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              11. Payment Security Programs
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We support secure card payments through the following programs:
              </p>
              <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground ml-4">
                <li><strong className="text-foreground">Visa Secure</strong></li>
                <li><strong className="text-foreground">Mastercard ID Check</strong></li>
              </ul>
              <p className="text-lg text-muted-foreground leading-relaxed">
                All transactions are processed by OTP Banka Serbia in accordance with PCI DSS standards.
              </p>
            </div>
          </section>

          {/* Section 12: Contact for Customer Support */}
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 border-b-2 border-border pb-3">
              12. Contact for Customer Support
            </h2>
            <div className="space-y-4 bg-muted/50 p-6 rounded-lg">
              <p className="text-lg text-muted-foreground leading-relaxed">
                For any issues regarding payments or transactions:
              </p>
              <div className="grid md:grid-cols-[150px_1fr] gap-4">
                <div className="font-semibold text-foreground">Email:</div>
                <div className="text-lg text-muted-foreground">
                  <a href="mailto:info@montekristobelgrade.com" className="text-primary hover:underline">
                    info@montekristobelgrade.com
                  </a>
                </div>
                
                <div className="font-semibold text-foreground">Phone:</div>
                <div className="text-lg text-muted-foreground">
                  <a href="tel:+381641102394" className="text-primary hover:underline">
                    +381641102394
                  </a>
                </div>
                
                <div className="font-semibold text-foreground">Working hours:</div>
                <div className="text-lg text-muted-foreground">Monday–Friday, 09:00–17:00 EST</div>
              </div>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
            <p className="mt-2">This page complies with Serbian e-commerce law, GDPR, and PCI DSS requirements.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentAndPolicies;
