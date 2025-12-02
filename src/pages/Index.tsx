import { useNavigate } from "react-router-dom";
import { Scale, ArrowRight, CheckCircle, TrendingUp, Users, Zap, Shield, Clock, BarChart3, FileText, Brain, MessageSquare, Search, Star, Twitter, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Backlog Management",
      description: "Automatically prioritize and organize cases based on urgency, filing date, and complexity."
    },
    {
      icon: Users,
      title: "Dynamic Case Reassignment",
      description: "Seamlessly move cases between priority queues with full audit trails and reasoning logs."
    },
    {
      icon: Search,
      title: "AI Precedent Finding",
      description: "Find similar cases and relevant precedents instantly using abstract-based semantic matching."
    },
    {
      icon: Brain,
      title: "Legal AI Assistant",
      description: "Get instant answers to legal queries with context-aware AI that understands Indian law."
    },
  ];

  const benefits = [
    "Reduce case resolution time by 40%",
    "Improve court efficiency with smart scheduling",
    "Ensure transparency with complete audit trails",
    "Empower citizens with accessible legal information"
  ];

  const stats = [
    { label: "Cases Managed", value: "50K+", icon: FileText },
    { label: "Time Saved", value: "60%", icon: Clock },
    { label: "Courts Using", value: "100+", icon: Scale },
    { label: "User Satisfaction", value: "4.9/5", icon: Star }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for individual lawyers and small practices",
      features: [
        "Up to 50 cases",
        "Basic case management",
        "Legal research access",
        "Email support"
      ],
      cta: "Start Free",
      highlighted: false
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "per month",
      description: "For law firms and legal teams",
      features: [
        "Unlimited cases",
        "AI-powered prioritization",
        "Precedent finding",
        "Priority support",
        "Team collaboration",
        "Custom workflows"
      ],
      cta: "Start Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For courts and government institutions",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Training & onboarding",
        "Advanced analytics"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  const testimonials = [
    {
      name: "Justice Priya Sharma",
      role: "High Court Judge",
      content: "Verdic AI has transformed how we manage our case backlog. The AI-powered prioritization ensures urgent cases get immediate attention.",
      avatar: "👩‍⚖️"
    },
    {
      name: "Advocate Rajesh Kumar",
      role: "Senior Lawyer",
      content: "The precedent finding feature is incredible. What used to take hours of research now takes minutes.",
      avatar: "👨‍💼"
    },
    {
      name: "Meera Patel",
      role: "Legal Officer",
      content: "Managing hundreds of cases was overwhelming. Verdic AI brought order and clarity to our workflow.",
      avatar: "👩‍💻"
    }
  ];

  const blogPosts = [
    {
      title: "Reducing India's Case Backlog with AI",
      excerpt: "How artificial intelligence is helping courts tackle the 4.7 crore pending cases in India's judicial system.",
      date: "Nov 28, 2024",
      category: "AI & Law"
    },
    {
      title: "Smart Case Prioritization: A Guide",
      excerpt: "Learn how algorithmic case prioritization can reduce wait times and improve justice delivery.",
      date: "Nov 25, 2024",
      category: "Best Practices"
    },
    {
      title: "The Future of Legal Tech in India",
      excerpt: "Exploring emerging technologies that will shape the Indian legal system in the next decade.",
      date: "Nov 20, 2024",
      category: "Industry Insights"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Full viewport, Dreelio-style */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-32" style={{ background: 'linear-gradient(135deg, hsl(210 80% 92%) 0%, hsl(25 60% 90%) 50%, hsl(0 0% 98%) 100%)' }}>
        {/* Law-themed background elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 text-9xl">⚖️</div>
          <div className="absolute bottom-40 right-20 text-9xl">🏛️</div>
          <div className="absolute top-1/2 left-1/4 text-7xl">📚</div>
          <div className="absolute bottom-20 left-1/3 text-6xl">⚖️</div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 lg:px-8 pt-32 text-center relative z-10 flex-1 flex flex-col items-center justify-center">
          <Badge className="mb-6 rounded-full px-6 py-2 text-sm font-medium" variant="secondary">
            AI-Powered Legal Backlog Management
          </Badge>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-foreground leading-tight max-w-5xl mx-auto">
            Solve India's Case Backlog with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your legal workflow with intelligent case management, AI-powered research, and automated prioritization. Justice, delivered faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" onClick={() => navigate("/auth")}>
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-semibold border-2" onClick={() => navigate("/dashboard")}>
              View Demo
            </Button>
          </div>
        </div>

        {/* Dashboard Preview Card - Overlapping bottom of hero */}
        <div className="container mx-auto px-4 lg:px-8 relative z-20 -mb-20">
          <Card className="shadow-2xl border-2 overflow-hidden rounded-2xl max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 lg:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <stat.icon className="h-8 w-8 lg:h-10 lg:w-10 mx-auto mb-3 text-primary" />
                    <div className="text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm lg:text-base text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <CardContent className="p-8 lg:p-12 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-success/10 rounded-xl transition-all hover:scale-105">
                  <CheckCircle className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-success" />
                  <div className="text-2xl lg:text-3xl font-bold">12,450</div>
                  <div className="text-sm lg:text-base text-muted-foreground mt-1">Cases Resolved</div>
                </div>
                <div className="text-center p-6 bg-warning/10 rounded-xl transition-all hover:scale-105">
                  <Clock className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-warning" />
                  <div className="text-2xl lg:text-3xl font-bold">3,892</div>
                  <div className="text-sm lg:text-base text-muted-foreground mt-1">In Progress</div>
                </div>
                <div className="text-center p-6 bg-destructive/10 rounded-xl transition-all hover:scale-105">
                  <TrendingUp className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-destructive" />
                  <div className="text-2xl lg:text-3xl font-bold">486</div>
                  <div className="text-sm lg:text-base text-muted-foreground mt-1">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Work From Anywhere Section */}
      <section id="benefits" className="py-32 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Justice accessible from anywhere
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Empower courts, lawyers, and citizens with a unified platform. Stay connected, track cases in real-time, and make informed decisions from any device.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
              <Card className="relative shadow-xl">
                <CardHeader>
                  <CardTitle>Real-Time Sync</CardTitle>
                  <CardDescription>Updates across all devices instantly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-3 w-3 bg-success rounded-full animate-pulse"></div>
                      <span className="text-sm">Case #2024-0156 updated</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-sm">New hearing scheduled</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-3 w-3 bg-warning rounded-full animate-pulse"></div>
                      <span className="text-sm">Priority changed to High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful features for modern legal work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage cases efficiently, from AI-powered insights to seamless collaboration.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Management Table Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Keep every case moving forward
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track status, deadlines, and priorities at a glance with our intuitive case dashboard.
            </p>
          </div>
          <Card className="shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Case ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Next Hearing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { id: "2024-0156", title: "Contract Dispute", status: "In Progress", priority: "High", date: "Dec 15" },
                      { id: "2024-0157", title: "Property Case", status: "Under Review", priority: "Medium", date: "Dec 20" },
                      { id: "2024-0158", title: "Family Law", status: "Scheduled", priority: "Low", date: "Jan 5" },
                    ].map((caseItem, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{caseItem.id}</td>
                        <td className="px-6 py-4 text-sm">{caseItem.title}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{caseItem.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={caseItem.priority === "High" ? "destructive" : "secondary"}>
                            {caseItem.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">{caseItem.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track your metrics in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Resolution Rate</span>
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Avg. Case Duration</span>
                      <span className="text-sm font-semibold">45 days</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">User Satisfaction</span>
                      <span className="text-sm font-semibold">4.8/5</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Track outcomes, reduce delay, stress less
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get comprehensive insights into your legal operations with real-time analytics and reporting.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Visual dashboards for quick insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Trend analysis and predictions</span>
                </li>
                <li className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Automated reporting and exports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Courts Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for courts, powered by AI simplicity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade features designed specifically for the Indian legal system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bank-level encryption and compliance with Indian data protection laws.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-2">
              <CardHeader>
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Optimized performance handling thousands of cases without slowdown.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-2">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Collaborative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seamless teamwork with real-time updates and role-based access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by legal professionals
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users say about Verdic AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <Card key={idx} className={`relative ${plan.highlighted ? "border-primary border-2 shadow-xl" : "border-2"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period !== "contact us" && <span className="text-muted-foreground">/{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full rounded-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Latest insights & updates
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay informed about legal tech trends and Verdic AI updates
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <Card key={idx} className="border-2 hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stay in the loop
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community and get the latest updates, tips, and insights from the Verdic AI team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-6 py-3 rounded-full border border-border bg-background w-full sm:w-auto min-w-[300px]"
            />
            <Button size="lg" className="rounded-full px-8">
              Subscribe
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
