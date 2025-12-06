import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ScrollFadeIn from "./ScrollFadeIn";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Animated gradient orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative container mx-auto px-4">
        <ScrollFadeIn className="max-w-4xl mx-auto">
          <div className="relative glass-dark border-neon rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer" />

            {/* Content */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Start Your Journey Today</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
                <span className="text-gradient-white">Ready to Transform</span>
                <br />
                <span className="text-gradient-neon">Your Legal Practice?</span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of legal professionals who are already using Verdic AI 
                to streamline their work and deliver faster justice.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate("/auth")}
                  size="lg"
                  className="group relative px-8 py-6 text-lg rounded-full bg-gradient-neon hover:shadow-neon-hover transition-all duration-500 border-0 w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 w-full sm:w-auto"
                >
                  Schedule Demo
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free 14-day trial • Cancel anytime
              </p>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default CTASection;
