import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Layers, 
  ArrowLeftRight, 
  Search, 
  Brain, 
  Shield, 
  Clock 
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Case Backlog Management",
    description: "Intelligent prioritization and tracking of pending cases with AI-powered insights to optimize court scheduling.",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: ArrowLeftRight,
    title: "Smart Case Reassignment",
    description: "Seamlessly move cases between priority queues with full audit trails and automated notifications.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Search,
    title: "Precedent Finder",
    description: "AI-powered search through millions of case records to find relevant precedents based on abstract relevance.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Brain,
    title: "Legal AI Assistant",
    description: "24/7 intelligent chatbot trained on Indian legal corpus to answer queries and assist research.",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with end-to-end encryption and full compliance with data protection regulations.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "Real-time Analytics",
    description: "Live dashboards showing case progress, bottlenecks, and predictive timelines for resolution.",
    gradient: "from-emerald-500 to-purple-500",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  // Determine animation direction based on position
  const isLeft = index % 3 === 0;
  const isRight = index % 3 === 2;
  const initialX = isLeft ? -50 : isRight ? 50 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, x: initialX, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative h-full glass-dark border-neon rounded-3xl p-8 hover:shadow-neon transition-all duration-500 overflow-hidden">
        {/* Gradient background on hover */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Icon */}
        <motion.div 
          className="relative mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-xl rounded-full`}
            initial={{ opacity: 0.3 }}
            whileHover={{ opacity: 0.6, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-gradient-neon transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* Hover line */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{ originX: 0 }}
        />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  return (
    <section id="features" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-hero"
        style={{ y: backgroundY }}
      />
      <motion.div 
        className="absolute inset-0 particles-bg"
        style={{ opacity: opacityParallax }}
      />

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full glass-dark border-neon text-sm text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Powerful Features
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
            <motion.span 
              className="text-gradient-white block"
              initial={{ opacity: 0, x: -30 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Everything You Need to
            </motion.span>
            <motion.span 
              className="text-gradient-neon block"
              initial={{ opacity: 0, x: 30 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Transform Legal Operations
            </motion.span>
          </h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Purpose-built tools designed for the unique challenges of India's legal system,
            powered by cutting-edge AI technology.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;