import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { TrendingUp, Users, Clock, Award } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

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

  return (
    <section id="benefits" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <ScrollFadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-dark border-neon text-sm text-primary mb-4">
            Impact & Results
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
            <span className="text-gradient-white">The Numbers</span>
            <br />
            <span className="text-gradient-neon">Speak for Themselves</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            India faces one of the world's largest judicial backlogs. 
            Verdic AI is here to change that.
          </p>
        </ScrollFadeIn>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollFadeIn key={stat.label} delay={index * 0.1}>
                <div className="group h-full">
                  <div className="relative h-full glass-dark border-neon rounded-3xl p-6 text-center hover:shadow-neon transition-all duration-500 overflow-hidden">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-4xl lg:text-5xl font-bold text-gradient-neon mb-2">
                      <AnimatedCounter 
                        value={stat.value} 
                        suffix={stat.suffix} 
                        isInView={isInView} 
                      />
                    </div>

                    {/* Label */}
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {stat.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;