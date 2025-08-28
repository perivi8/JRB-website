import { Award, Shield, Users, TrendingUp, CheckCircle, Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import goldCollectionImage from "@/assets/gold-collection.jpg";

const About = () => {
  useScrollToTop();

  const milestones = [
    { year: '1990', title: 'Founded', description: 'JRB Gold established as family jewelry business' },
    { year: '2000', title: 'Expansion', description: 'Opened flagship store and introduced certified hallmarking' },
    { year: '2010', title: 'Innovation', description: 'Launched gold savings schemes and digital services' },
    { year: '2020', title: 'Digital Growth', description: 'E-commerce platform and online gold investments' },
    { year: '2024', title: 'Industry Leader', description: 'Recognized as trusted premium jewelry brand' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Every transaction is backed by complete transparency in pricing, quality, and processes. No hidden charges, ever.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'All our jewelry comes with certified hallmarking and quality guarantee from recognized testing centers.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We build lasting relationships through exceptional service and support.',
    },
    {
      icon: Heart,
      title: 'Heritage Craftsmanship',
      description: 'Three generations of skilled artisans creating timeless pieces that blend tradition with modern design.',
    },
  ];

  const achievements = [
    { number: '30+', label: 'Years of Excellence' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '₹500Cr+', label: 'Gold Transacted' },
    { number: '99.8%', label: 'Customer Satisfaction' },
  ];

  const certifications = [
    'Bureau of Indian Standards (BIS) Hallmarking',
    'Gems & Jewelry Export Promotion Council Member',
    'Gold & Silver Dealers Association Certified',
    'ISO 9001:2015 Quality Management',
    'Responsible Jewelry Council Certified',
  ];

  const team = [
    {
      name: 'Jagdish R. Bajaj',
      position: 'Founder & Chairman',
      experience: '40+ years',
      description: 'Visionary leader who established JRB Gold with a commitment to quality and customer trust.',
    },
    {
      name: 'Rakesh J. Bajaj',
      position: 'Managing Director',
      experience: '25+ years',
      description: 'Driving innovation and digital transformation while maintaining traditional values.',
    },
    {
      name: 'Bharti R. Bajaj',
      position: 'Creative Director',
      experience: '20+ years',
      description: 'Leading jewelry design and ensuring every piece reflects contemporary elegance.',
    },
  ];

  const testimonialHighlights = [
    {
      text: "JRB Gold has been our family's trusted jeweler for over 15 years. Their transparency and quality is unmatched.",
      author: "Mrs. Sharma, Loyal Customer"
    },
    {
      text: "The gold savings scheme helped me buy my dream wedding jewelry. Excellent service and genuine people.",
      author: "Priya K., Thiruvannamalai"
    },
    {
      text: "Best exchange rates and honest evaluation. They truly value customer relationships over profits.",
      author: "Rajesh M., Delhi"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-hero font-playfair text-foreground mb-6">
                Our Story
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Three decades of craftsmanship, trust, and innovation in the jewelry industry. 
                Built on the foundation of transparency, quality, and customer relationships that last generations.
              </p>
              <div className="divider-gold mt-8 max-w-24 mx-auto" />
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2 font-playfair">
                    {achievement.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display font-playfair text-foreground mb-6">
                  From Humble Beginnings to Industry Leadership
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 1990 by Jagdish R. Bajaj, JRB Gold began as a small family jewelry 
                    business with a simple mission: provide genuine, high-quality gold and silver 
                    jewelry at fair prices with complete transparency.
                  </p>
                  <p>
                    What started as a single store has grown into a trusted brand serving thousands 
                    of customers across India. Our success stems from our unwavering commitment to 
                    quality, ethical business practices, and building relationships that span generations.
                  </p>
                  <p>
                    Today, we continue to honor our founder's vision while embracing innovation 
                    through digital services, modern retail experiences, and sustainable practices 
                    that respect both our customers and the environment.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gold/10 text-gold border-gold/20">Heritage Brand</Badge>
                    <Badge className="bg-gold/10 text-gold border-gold/20">Family Business</Badge>
                    <Badge className="bg-gold/10 text-gold border-gold/20">Certified Quality</Badge>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src={craftsmanshipImage}
                  alt="JRB Gold Craftsmanship"
                  className="rounded-lg shadow-luxury w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-gold p-6 rounded-lg text-charcoal shadow-elevated">
                  <div className="text-2xl font-bold mb-1">30+</div>
                  <div className="text-sm font-medium">Years of Trust</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-gradient-surface">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display font-playfair text-foreground mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                Key milestones that shaped our growth and success
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gold to-gold/30" />

              <div className="space-y-8 md:space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    <div className={`flex-1 ${
                      index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                    }`}>
                      <Card className="card-luxury">
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold text-gold mb-2 font-playfair">
                            {milestone.year}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden md:block w-4 h-4 bg-gold rounded-full border-4 border-background shadow-lg z-10" />

                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display font-playfair text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-luxury text-center group hover:shadow-elevated transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="h-8 w-8 text-charcoal" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications & Trust Section */}
        <section className="py-16 bg-gradient-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display font-playfair text-foreground mb-6">
                  Certified Excellence
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our commitment to quality is validated by industry-leading certifications 
                  and memberships that ensure every piece of jewelry meets the highest standards.
                </p>

                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-gold mr-3 flex-shrink-0" />
                      <span className="text-foreground">{cert}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Badge className="bg-gold/10 text-gold border-gold/20 py-2 px-4">
                    <Award className="h-4 w-4 mr-2" />
                    BIS Certified
                  </Badge>
                  <Badge className="bg-gold/10 text-gold border-gold/20 py-2 px-4">
                    <Shield className="h-4 w-4 mr-2" />
                    ISO Certified
                  </Badge>
                  <Badge className="bg-gold/10 text-gold border-gold/20 py-2 px-4">
                    <Star className="h-4 w-4 mr-2" />
                    Industry Leader
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="card-luxury p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">Hallmarked Gold</div>
                  </Card>
                  <Card className="card-luxury p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-1">Zero</div>
                    <div className="text-sm text-muted-foreground">Wastage Charges</div>
                  </Card>
                </div>
                <div className="space-y-4 mt-8">
                  <Card className="card-luxury p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Customer Support</div>
                  </Card>
                  <Card className="card-luxury p-6 text-center">
                    <div className="text-2xl font-bold text-gold mb-1">30 Days</div>
                    <div className="text-sm text-muted-foreground">Return Policy</div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display font-playfair text-foreground mb-4">
                Leadership Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Experienced leaders driving our vision forward
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="card-luxury text-center">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="h-12 w-12 text-charcoal" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <div className="text-gold font-medium mb-2">
                      {member.position}
                    </div>
                    <Badge variant="secondary" className="mb-4">
                      {member.experience}
                    </Badge>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-16 bg-ink text-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-display font-playfair text-ivory mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-ivory/80">
                Building relationships that last generations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonialHighlights.map((testimonial, index) => (
                <Card key={index} className="bg-ivory/10 border-ivory/20">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                      ))}
                    </div>
                    
                    <blockquote className="text-ivory/90 mb-4 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="text-gold font-medium">
                      {testimonial.author}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold text-gold mb-2">4.9/5</div>
                  <div className="text-ivory/80 text-sm">Customer Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold mb-2">98%</div>
                  <div className="text-ivory/80 text-sm">Repeat Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold mb-2">15K+</div>
                  <div className="text-ivory/80 text-sm">Positive Reviews</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold mb-2">24hrs</div>
                  <div className="text-ivory/80 text-sm">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display font-playfair text-foreground mb-4">
              Experience the JRB Gold Difference
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Visit our store or explore our online collection to discover jewelry 
              that combines traditional craftsmanship with contemporary elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="hero">
                Visit Our Store
              </Button>
              <Button size="lg" variant="outline-gold">
                Shop Online
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;