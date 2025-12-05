import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { TrendingUp, Users, Clock, Award } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: 5000000,
    suffix: "+",
    label: "Cases Pending in India",
    description: "Active cases awaiting resolution",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Users,
    value: 40,
    suffix: "%",
    label: "Efficiency Boost",
    description: "Average improvement with Verdic AI",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Clock,
    value: 70,
    suffix: "%",
    label: "Time Saved",
    description: "On legal research tasks",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    value: 10000,
    suffix: "+",
    label: "Legal Professionals",
    description: "Trust Verdic AI daily",
    color: "from-cyan-500 to-teal-500",
  },
];

const AnimatedCounter = ({ 
  value, 
  suffix, 
  isInView 
}: { 
  value: number; 
  suffix: string; 
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };

  return (
    <span>
      {formatNumber(count)}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const lineX = useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]);

  return (
    <section id="benefits" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-hero"
        style={{ y: backgroundY }}
      />
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          style={{ x: lineX }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full glass-dark border-neon text-sm text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Impact & Results
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
            <motion.span 
              className="text-gradient-white block"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The Numbers
            </motion.span>
            <motion.span 
              className="text-gradient-neon block"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Speak for Themselves
            </motion.span>
          </h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            India faces one of the world's largest judicial backlogs. 
            Verdic AI is here to change that.
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 60, x: isEven ? -30 : 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group"
              >
                <div className="relative h-full glass-dark border-neon rounded-3xl p-6 text-center hover:shadow-neon transition-all duration-500 overflow-hidden">
                  {/* Gradient background */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Icon */}
                  <motion.div 
                    className="relative mb-4"
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  {/* Value */}
                  <motion.div 
                    className="text-4xl lg:text-5xl font-bold text-gradient-neon mb-2"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix} 
                      isInView={isInView} 
                    />
                  </motion.div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;