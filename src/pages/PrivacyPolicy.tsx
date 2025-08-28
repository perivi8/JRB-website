import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Phone, Mail, MapPin, Lock, Eye, UserCheck, Database } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-display font-playfair text-foreground mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Your Privacy, Our Promise of Transparency
          </p>
          <div className="divider-gold mt-4 max-w-24" />
        </div>

        <Card className="card-luxury mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">
              At JRB Gold, your trust is our most valuable asset. Since our founding in 2016, we've built our reputation on offering genuine, high-quality gold and silver jewelry at fair prices—with honesty and transparency at the heart of every transaction. Protecting your privacy and safeguarding the information you share with us is an extension of these values.
            </p>
            <p className="text-muted-foreground font-medium">
              This Privacy Policy explains what data we collect, how we use it, how it's protected, and your rights as a valued customer.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Information We Collect */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                When you interact with our website, store, or customer service team, we may collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Full Name</li>
                <li>Contact details (email, phone number)</li>
                <li>Billing & shipping address</li>
                <li>Payment details (processed via secure third-party gateways – we do not store card details)</li>
                <li>Order history & jewelry preferences</li>
                <li>Business details (for wholesale/B2B clients)</li>
                <li>Device, browser, and cookie data (for website analytics)</li>
              </ul>
              <p className="text-muted-foreground font-medium mt-4">
                We only collect the information necessary to provide you with seamless shopping, customization, and support experiences.
              </p>
            </CardContent>
          </Card>

          {/* Why We Collect Your Information */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Why We Collect Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Your information helps us to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Process orders, invoices, and payments securely</li>
                <li>Provide shipping and delivery updates</li>
                <li>Offer customer service and after-sales support</li>
                <li>Customize offers or savings schemes (with your consent)</li>
                <li>Share promotions, updates, or newsletters (optional opt-in)</li>
                <li>Improve our website and in-store experience</li>
                <li>Comply with legal, tax, and regulatory requirements</li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Protect Your Information */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                How We Protect Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We follow strict security protocols to ensure your information is safe:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>SSL Encryption on all website interactions</li>
                <li>PCI-compliant payment gateways (we never store payment data)</li>
                <li>Firewall & server protections for data storage</li>
                <li>Limited access to sensitive customer information (only authorized staff)</li>
                <li>Regular monitoring and audits of our systems</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights & Choices */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Request access to the data we hold about you</li>
                <li>Update or correct your personal details</li>
                <li>Request deletion of your information (subject to legal obligations)</li>
                <li>Opt out of marketing emails or WhatsApp updates at any time</li>
                <li>Raise privacy concerns directly with our team</li>
              </ul>
              <p className="text-muted-foreground font-medium mt-4">
                We aim to respond to all verified requests within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Sharing */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Third-Party Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We do not sell or rent your information. Data may be shared only with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Courier/logistics partners (for order deliveries)</li>
                <li>Payment processors (for secure transaction handling)</li>
                <li>Regulatory authorities, if legally required</li>
              </ul>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From time to time, we may update this Privacy Policy to reflect new services, technology, or legal requirements. The revised policy will always be published on our website with the "Last Updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                If you have questions or concerns about your data, please contact:
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
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">https://www.jrbgold.co.in</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and maintaining your trust.
          </p>
          <p>
            By using our services, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
