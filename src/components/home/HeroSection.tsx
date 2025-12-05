import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Enhanced parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yFast = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const rotateReverse = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Animated glow orbs with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
          style={{ y: ySlow, x: xLeft }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-[700px] h-[700px] bg-accent/15 rounded-full blur-[180px]"
          style={{ y: yFast, x: xRight }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px]"
          style={{ y, rotate }}
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated particles/grid lines */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y: ySlow }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(270 100% 60% / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(270 100% 60% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </motion.div>

      {/* Floating legal elements with enhanced parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[8%]"
          style={{ y: yFast, rotate, x: xLeft }}
        >
          <Scale className="w-20 h-20 text-primary/30" />
        </motion.div>
        
        <motion.div
          className="absolute top-[25%] right-[12%]"
          style={{ y, rotate: rotateReverse, x: xRight }}
        >
          <div className="w-16 h-24 rounded-sm bg-gradient-to-b from-primary/15 to-transparent border border-primary/20" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[30%] left-[15%]"
          style={{ y: ySlow }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-24 h-24 rounded-full border border-primary/20 border-dashed" />
        </motion.div>

        <motion.div
          className="absolute top-[40%] right-[20%]"
          style={{ y: yFast, rotate }}
        >
          <Sparkles className="w-12 h-12 text-accent/30" />
        </motion.div>

        <motion.div
          className="absolute bottom-[20%] right-[10%]"
          style={{ y, x: xRight }}
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-sm" />
        </motion.div>

        {/* Additional floating elements */}
        <motion.div
          className="absolute top-[60%] left-[5%]"
          style={{ y: yFast }}
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20" />
        </motion.div>

        <motion.div
          className="absolute top-[70%] right-[25%]"
          style={{ y: ySlow }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-6 rounded-sm bg-accent/20 rotate-45" />
        </motion.div>
      </div>

      {/* Light sweep effect */}
      <div className="absolute inset-0 light-sweep" />

      {/* Content */}
      <motion.div
        style={{ opacity, scale, y: ySlow }}
        className="relative z-10 container mx-auto px-4 pt-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border-neon mb-8"
          >
            <motion.span 
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">
              AI-Powered Legal Revolution
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.9] mb-6"
          >
            <motion.span 
              className="text-gradient-white inline-block"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Justice Delayed
            </motion.span>
            <br />
            <motion.span 
              className="text-gradient-neon glow-neon-text inline-block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Is Justice Denied
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            Transforming India's judiciary with AI-powered case management.
            Reduce backlogs, accelerate justice, and empower legal professionals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="group relative px-10 py-7 text-lg rounded-full bg-gradient-neon hover:shadow-neon-hover transition-all duration-500 border-0 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="group px-10 py-7 text-lg rounded-full border-primary/30 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats row with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto"
          >
            {[
              { value: "5Cr+", label: "Pending Cases" },
              { value: "40%", label: "Time Saved" },
              { value: "10K+", label: "Legal Pros" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-dark border-neon rounded-2xl p-5 hover:shadow-neon transition-all duration-300"
              >
                <motion.div 
                  className="text-3xl sm:text-4xl font-bold text-gradient-neon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-12 rounded-full border-2 border-primary/40 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;