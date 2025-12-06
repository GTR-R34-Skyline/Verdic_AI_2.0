import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";

const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Subtle glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(270 100% 60% / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(270 100% 60% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[10%]"
          style={{ y }}
        >
          <Scale className="w-16 h-16 text-primary/20" />
        </motion.div>
        
        <motion.div
          className="absolute top-[30%] right-[15%]"
          style={{ y }}
        >
          <div className="w-12 h-16 rounded-sm bg-gradient-to-b from-primary/10 to-transparent border border-primary/20" />
        </motion.div>
        
        <div className="absolute bottom-[35%] left-[18%]">
          <div className="w-20 h-20 rounded-full border border-primary/15 border-dashed animate-rotate-slow" />
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 container mx-auto px-4 pt-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border-neon mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              AI-Powered Legal Revolution
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6"
          >
            <span className="text-gradient-white">Justice Delayed</span>
            <br />
            <span className="text-gradient-neon glow-neon-text">
              Is Justice Denied
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            Transforming India's judiciary with AI-powered case management.
            Reduce backlogs, accelerate justice, and empower legal professionals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="group relative px-8 py-6 text-lg rounded-full bg-gradient-neon hover:shadow-neon transition-all duration-300 border-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="group px-8 py-6 text-lg rounded-full border-primary/30 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2 text-primary" />
              View Demo
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {[
              { value: "5Cr+", label: "Pending Cases" },
              { value: "40%", label: "Time Saved" },
              { value: "10K+", label: "Legal Pros" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="glass-dark border-neon rounded-2xl p-4 hover:shadow-neon transition-shadow duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold text-gradient-neon">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;