import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollText, Phone, Mail, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-display font-playfair text-foreground mb-4 flex items-center gap-3">
            <ScrollText className="h-8 w-8" />
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground">
            Last Updated: August 2025
          </p>
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        <Card className="card-luxury mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">
              Welcome to JRB Gold. By accessing and using our website, store, or services, you agree to comply with and be bound by the following Terms & Conditions. These terms govern all purchases, transactions, and interactions with JRB Gold, whether in-store, online, or via our customer support channels.
            </p>
            <p className="text-muted-foreground font-medium">
              If you do not agree with these terms, we kindly ask you to discontinue use of our services.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Section 1: General Use */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>1. General Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>By engaging with JRB Gold, you confirm that you are at least 18 years of age or acting under the supervision of a legal guardian.</li>
                <li>You agree to use our services only for lawful purposes and in compliance with all applicable regulations.</li>
                <li>We reserve the right to refuse service, restrict access, or cancel transactions at our discretion if misuse, fraud, or policy violation is suspected.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2: Product Listings & Pricing */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>2. Product Listings & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All product images, descriptions, and weights are provided for reference. Slight variations may occur due to the handmade and natural nature of gold and silver jewelry.</li>
                <li>Prices are based on prevailing gold and silver market rates and may change daily without prior notice.</li>
                <li>Errors in pricing or descriptions may occasionally occur; JRB Gold reserves the right to correct such errors, cancel affected orders, and issue refunds where applicable.</li>
                <li>For bulk or wholesale orders, minimum quantities apply, and final quotations will be provided directly to buyers.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: Orders & Payments */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>3. Orders & Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Orders are confirmed only after successful payment or advance (for made-to-order/custom items).</li>
                <li>We accept major credit/debit cards, UPI, net banking, and other secure digital payment methods.</li>
                <li>JRB Gold does not store payment information; all transactions are processed via secure third-party gateways.</li>
                <li>In case of duplicate charges, errors, or unauthorized transactions, customers must report immediately for resolution.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Shipping & Delivery */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>4. Shipping & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Domestic and international shipping is offered via trusted courier/logistics partners.</li>
                <li>Estimated delivery timelines will be provided at checkout or during order confirmation.</li>
                <li>Tracking details will be shared once the order is dispatched.</li>
                <li>JRB Gold is not responsible for delays caused by third-party logistics, customs clearance, or force majeure events.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Custom & Personalized Orders */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>5. Custom & Personalized Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Custom-made jewelry (engraved, personalized, or made-to-specification pieces) cannot be cancelled or refunded once production has begun.</li>
                <li>Production timelines for custom orders vary and will be communicated at the time of order confirmation.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: User Conduct */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>6. User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">By using our services, you agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide false or misleading information</li>
                <li>Resell our products without authorization</li>
                <li>Misuse our website, images, or branding for unauthorized commercial purposes</li>
                <li>Engage in fraudulent chargebacks or abusive claims</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                Violations may result in suspension of service or legal action.
              </p>
            </CardContent>
          </Card>

          {/* Section 7: Intellectual Property */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All content on this website—including logos, jewelry designs, product images, and text—is the intellectual property of JRB Gold. Unauthorized use, reproduction, or distribution is strictly prohibited without written consent.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: Limitation of Liability */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">JRB Gold shall not be held liable for:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Indirect or consequential losses arising from product use</li>
                <li>Minor variations in product appearance or weight</li>
                <li>Delays or disruptions caused by third-party logistics providers</li>
                <li>Any issues arising from customer negligence in handling or storing jewelry</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 9: Governing Law & Jurisdiction */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>9. Governing Law & Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms & Conditions are governed by the laws of India. Any disputes shall fall under the exclusive jurisdiction of courts located in Thiruvannamalai, Tamil Nadu.
              </p>
            </CardContent>
          </Card>

          {/* Section 10: Contact Us */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                For any queries, clarifications, or disputes regarding these Terms & Conditions, please reach out to:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold text-foreground mb-4">JRB Gold</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        No: 1539, 1st Floor,<br />
                        Soundar Complex, Vellore Road<br />
                        Near Anna Arch<br />
                        Thiruvannamalai<br />
                        Tamil Nadu - 606604
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">82204 21317</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">contact@jrbgold.co.in</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ScrollText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">https://www.jrbgold.co.in</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing to use our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
