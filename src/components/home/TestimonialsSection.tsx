import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Justice Ramesh Kumar",
    role: "High Court Judge, Delhi",
    image: "/placeholder.svg",
    quote: "Verdic AI has revolutionized how we manage our case docket. The AI-powered prioritization has helped us reduce pending cases by 35% in just six months.",
  },
  {
    name: "Advocate Priya Sharma",
    role: "Senior Counsel, Supreme Court",
    image: "/placeholder.svg",
    quote: "The precedent finder is extraordinary. What used to take hours of research now takes minutes. It's like having a team of researchers at my fingertips.",
  },
  {
    name: "Dr. Anil Mehta",
    role: "Registrar, District Court Mumbai",
    image: "/placeholder.svg",
    quote: "Implementation was seamless and the support team is exceptional. Our court efficiency has improved dramatically since adopting Verdic AI.",
  },
  {
    name: "Advocate Sunita Reddy",
    role: "Legal Aid Counsel, Hyderabad",
    image: "/placeholder.svg",
    quote: "For legal aid services, Verdic AI has been transformative. We can now serve more clients effectively and ensure no case falls through the cracks.",
  },
  {
    name: "Justice M.S. Rao",
    role: "Sessions Court Judge, Bengaluru",
    image: "/placeholder.svg",
    quote: "The analytics dashboard provides insights we never had before. We can now predict bottlenecks and allocate resources proactively.",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const orbX = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    if (dir === 1) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <motion.div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[180px]"
        style={{ y: orbY, x: orbX }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[180px]"
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
      />

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
            Testimonials
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
            <motion.span 
              className="text-gradient-white block"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Trusted by Legal
            </motion.span>
            <motion.span 
              className="text-gradient-neon block"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Professionals Nationwide
            </motion.span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            className="relative glass-dark border-neon rounded-3xl p-8 md:p-12 min-h-[320px]"
            whileHover={{ boxShadow: "0 0 60px hsl(270 100% 60% / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Quote icon */}
            <motion.div 
              className="absolute top-6 left-6 md:top-8 md:left-8"
              animate={{ rotate: [0, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Quote className="w-12 h-12 text-primary/30" />
            </motion.div>

            {/* Testimonial content */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center pt-8"
                >
                  {/* Avatar */}
                  <motion.div 
                    className="mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gradient-neon p-0.5">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                          <span className="text-2xl font-bold text-gradient-neon">
                            {testimonials[currentIndex].name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <motion.div 
                        className="absolute inset-0 bg-primary/30 blur-xl rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Author */}
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-gradient-neon"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(1)}
                  className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;