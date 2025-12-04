import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Animated glow orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/3 w-72 h-72 bg-neon-purple/10 rounded-full blur-[100px]"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated particles/grid lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(270 100% 60% / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(270 100% 60% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating legal elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-[10%]"
          style={{ y }}
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scale className="w-16 h-16 text-primary/20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-[15%]"
          style={{ y }}
          animate={{ rotate: [0, -10, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-16 rounded-sm bg-gradient-to-b from-primary/10 to-transparent border border-primary/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-[20%]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 rounded-full border border-primary/20 border-dashed" />
        </motion.div>
      </div>

      {/* Light sweep effect */}
      <div className="absolute inset-0 light-sweep" />

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
            Reduce backlogs, accelerate justice, and empower legal professionals
            with intelligent automation.
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
              className="group relative px-8 py-6 text-lg rounded-full bg-gradient-neon hover:shadow-neon-hover transition-all duration-500 border-0 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                className="glass-dark border-neon rounded-2xl p-4 hover:shadow-neon transition-all duration-300"
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
