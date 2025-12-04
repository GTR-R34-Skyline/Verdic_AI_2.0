import { useNavigate } from "react-router-dom";
import { Scale, ArrowRight, Sparkles, TrendingUp, Users, Zap, Shield, Clock, BarChart3, FileText, Brain, MessageSquare, Search, Star, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotEmbed from "@/components/ChatbotEmbed";
import chatbotConfig from "@/config/chatbot";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "4.7Cr+", label: "Pending Cases in India", sublabel: "A crisis demanding action" },
    { value: "60%", label: "Faster Resolution", sublabel: "With AI-powered triage" },
    { value: "100+", label: "Courts Empowered", sublabel: "Across the nation" },
    { value: "98.5%", label: "Accuracy Rate", sublabel: "In case classification" },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Deep learning models trained on millions of legal documents understand context, precedent, and nuance like a seasoned advocate.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Smart Prioritization",
      description: "Automatically surface urgent cases, flag stale matters, and ensure no citizen waits longer than necessary for justice.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Search,
      title: "Instant Precedent Lookup",
      description: "Find relevant judgments in seconds, not hours. Semantic search understands legal concepts, not just keywords.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-grade encryption, role-based access, and complete audit trails. Your data stays sovereign and protected.",
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  const impactMetrics = [
    { metric: "12,450+", label: "Cases Resolved", icon: CheckCircle2 },
    { metric: "3.2M", label: "Hours Saved", icon: Clock },
    { metric: "₹47Cr", label: "Costs Reduced", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Dark, Cinematic, Powerful */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(245 60% 8%) 0%, hsl(220 40% 12%) 50%, hsl(245 40% 15%) 100%)' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse-glow animation-delay-500" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="opacity-0 animate-fade-in-up">
              <Badge className="mb-8 rounded-full px-5 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Transforming India's Judicial System
              </Badge>
            </div>

            {/* Main headline */}
            <h1 className="opacity-0 animate-fade-in-up animation-delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tight">
              <span className="text-gradient-hero">Justice Delayed</span>
              <br />
              <span className="text-gradient-hero">Is Justice</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                Denied.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="opacity-0 animate-fade-in-up animation-delay-200 text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              4.7 crore cases await resolution. <span className="text-slate-200 font-medium">Verdic AI</span> empowers courts 
              with intelligent case management, instant precedent lookup, and AI-driven prioritization to 
              deliver justice <span className="text-amber-400 font-semibold">faster than ever.</span>
            </p>

            {/* CTA Buttons */}
            <div className="opacity-0 animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                size="lg" 
                className="group rounded-full px-8 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-violet-600 hover:from-primary-hover hover:to-violet-700 shadow-glow transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/auth")}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 h-14 text-lg font-semibold border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300"
                onClick={() => navigate("/dashboard")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="opacity-0 animate-fade-in-up animation-delay-400 flex items-center justify-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Bank-grade Security</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-slate-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section - The Crisis */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 to-transparent" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              The Scale of the <span className="text-gradient">Challenge</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              India's judicial backlog is one of the world's largest. Technology isn't optional anymore—it's essential.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <Card key={idx} className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 lg:p-8 text-center relative">
                  <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-foreground font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bold Cards */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 rounded-full px-4 py-1.5" variant="secondary">
              Capabilities
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Built for the <span className="text-gradient">Future of Law</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature designed with one goal: accelerating justice while maintaining the highest standards of accuracy and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />
                <CardContent className="p-8 lg:p-10 relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section - Dark Banner */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(245 60% 8%) 0%, hsl(220 40% 12%) 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Real Impact, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">Real Results</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Numbers that speak louder than words. This is what happens when AI meets justice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {impactMetrics.map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                  <item.icon className="h-8 w-8 text-amber-400" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">{item.metric}</div>
                <div className="text-slate-400 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -top-8 -left-4 text-8xl text-primary/10 font-serif">"</div>
              <Card className="relative overflow-hidden border-0 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <CardContent className="p-10 lg:p-16 relative">
                  <p className="text-2xl lg:text-3xl text-foreground leading-relaxed mb-8 font-medium">
                    Verdic AI has fundamentally changed how we approach case management. What used to take our team 
                    <span className="text-primary font-bold"> days</span> now takes 
                    <span className="text-primary font-bold"> hours</span>. The AI-powered prioritization ensures 
                    urgent matters never slip through the cracks.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white text-xl font-bold">
                      PS
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg">Justice Priya Sharma</div>
                      <div className="text-muted-foreground">High Court of Karnataka</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Ready to Transform<br />
              <span className="text-gradient">Your Legal Workflow?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join hundreds of courts and legal professionals already using Verdic AI to deliver justice faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="group rounded-full px-10 h-16 text-lg font-semibold bg-gradient-to-r from-primary to-violet-600 hover:from-primary-hover hover:to-violet-700 shadow-glow transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-10 h-16 text-lg font-semibold border-2 hover:bg-muted transition-all duration-300"
                onClick={() => navigate("/legal-assistant")}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Talk to AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {chatbotConfig.enabled && chatbotConfig.enabledOnHomepage && (
        <ChatbotEmbed 
          context={{ title: "Homepage", description: "Verdic AI - AI-powered legal backlog management for Indian judiciary" }}
        />
      )}
    </div>
  );
};

export default Index;
