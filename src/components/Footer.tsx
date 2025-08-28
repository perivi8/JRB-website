import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/about#story" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  const shopLinks = [
    { name: "Gold Jewelry", href: "/shop?category=gold" },
    { name: "Silver Collection", href: "/shop?category=silver" },
    { name: "Coins", href: "/shop?category=coins" },
    { name: "Gift Cards", href: "/gift-cards" },
  ];

  const serviceLinks = [
    { name: "Exchange Old Gold", href: "/services#exchange" },
    { name: "Re-Pledge Transfer", href: "/services#repledge" },
    { name: "Gold Savings Scheme", href: "/schemes" },
    { name: "Appraiser Training", href: "/training" },
  ];

  const helpLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Care Instructions", href: "/care" },
    { name: "Track Order", href: "/track" },
  ];

  return (
    <footer style={{ backgroundColor: 'hsl(218 18% 9%)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Newsletter Subscription */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gold mb-4">Stay Updated</h3>
          <p className="text-ivory/70 mb-4">Subscribe to get latest offers and updates</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 max-w-xs bg-ivory/10 border-ivory/20 text-ivory placeholder:text-ivory/50"
              required
            />
            <Button type="submit" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Separator Line */}
        <div className="border-t border-ivory/20 my-8"></div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Call Us */}
          <div className="flex items-center justify-center md:justify-start">
            <Phone className="h-6 w-6 text-gold mr-4 flex-shrink-0" />
            <div>
              <div className="font-semibold text-gold text-lg">Call Us</div>
              <div className="text-ivory/70">+91 82204 21317</div>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-center justify-center md:justify-start">
            <Mail className="h-6 w-6 text-gold mr-4 flex-shrink-0" />
            <div>
              <div className="font-semibold text-gold text-lg">Email</div>
              <div className="text-ivory/70">contact@jrbgold.co.in</div>
            </div>
          </div>
          
          {/* Address */}
          <div className="flex items-start justify-center md:justify-start">
            <MapPin className="h-6 w-6 text-gold mr-4 flex-shrink-0 mt-1" />
            <div>
              <div className="font-semibold text-gold text-lg">Address</div>
              <div className="text-ivory/70">
                No: 1539, 1st Floor,<br />
                Soundar Complex, Vellore Road<br />
                Near Anna Arch<br />
                Thiruvannamalai<br />
                Tamil Nadu - 606604
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <Button variant="ghost" size="icon" className="text-ivory/70 hover:text-gold transition-colors">
            <Instagram className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-ivory/70 hover:text-gold transition-colors">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-ivory/70 hover:text-gold transition-colors">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* Separator Line */}
        <div className="border-t border-ivory/20 my-8"></div>

        {/* Footer Navigation Sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-gold mb-4">Company</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="/about" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="/story" className="hover:text-gold transition-colors">Our Story</a></li>
              <li><a href="/craftsmanship" className="hover:text-gold transition-colors">Craftsmanship</a></li>
              <li><a href="/contact" className="hover:text-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold text-gold mb-4">Shop</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="/shop?category=gold" className="hover:text-gold transition-colors">Gold Jewelry</a></li>
              <li><a href="/shop?category=silver" className="hover:text-gold transition-colors">Silver Collection</a></li>
              <li><a href="/shop?category=coins" className="hover:text-gold transition-colors">Coins</a></li>
              <li><a href="/shop" className="hover:text-gold transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-gold mb-4">Services</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="/services" className="hover:text-gold transition-colors">Gold Exchange</a></li>
              <li><a href="/services" className="hover:text-gold transition-colors">Jewelry Repair</a></li>
              <li><a href="/schemes" className="hover:text-gold transition-colors">Gold Savings Scheme</a></li>
              <li><a href="/services" className="hover:text-gold transition-colors">Custom Design</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-bold text-gold mb-4">Help</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="/contact" className="hover:text-gold transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-gold transition-colors">FAQs</a></li>
              <li><a href="/shipping" className="hover:text-gold transition-colors">Shipping Policy</a></li>
              <li><a href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-conditions" className="hover:text-gold transition-colors">Terms & Conditions</a></li>
              <li><a href="/cancellation" className="hover:text-gold transition-colors">Cancellation & Refund</a></li>
            </ul>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-ivory/20 my-6"></div>

        {/* Quick Links and Copyright */}
        <div className="text-center">
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-ivory/70 mb-8">
            <a href="/about" className="hover:text-gold transition-colors duration-200">
              About Us
            </a>
            <a href="/contact" className="hover:text-gold transition-colors duration-200">
              Contact
            </a>
            <a href="/schemes" className="hover:text-gold transition-colors duration-200">
              Gold Schemes
            </a>
            <a href="/services" className="hover:text-gold transition-colors duration-200">
              Services
            </a>
            <a href="/terms-conditions" className="hover:text-gold transition-colors duration-200">
              Terms & Conditions
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-ivory/70">
            &copy; 2024 JRB Gold Private Limited. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;