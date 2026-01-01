import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ScrollFadeIn from "./ScrollFadeIn";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string | null;
  testimonial_text: string;
  rating: number | null;
}

// Fallback testimonials in case database is empty
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Justice Ramesh Kumar",
    role: "High Court Judge",
    organization: "Delhi High Court",
    testimonial_text: "Verdic AI has revolutionized how we manage our case docket. The AI-powered prioritization has helped us reduce pending cases by 35% in just six months.",
    rating: 5,
  },
  {
    id: "2",
    name: "Advocate Priya Sharma",
    role: "Senior Counsel",
    organization: "Supreme Court",
    testimonial_text: "The precedent finder is extraordinary. What used to take hours of research now takes minutes. It's like having a team of researchers at my fingertips.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching testimonials:", error);
          return;
        }

        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

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
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];
  const displayRole = currentTestimonial.organization 
    ? `${currentTestimonial.role}, ${currentTestimonial.organization}`
    : currentTestimonial.role;

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <ScrollFadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-dark border-neon text-sm text-primary mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
            <span className="text-gradient-white">Trusted by Legal</span>
            <br />
            <span className="text-gradient-neon">Professionals Nationwide</span>
          </h2>
        </ScrollFadeIn>

        {/* Carousel */}
        <ScrollFadeIn delay={0.2} className="max-w-4xl mx-auto">
          <div className="relative glass-dark border-neon rounded-3xl p-8 md:p-12 min-h-[320px]">
            {/* Quote icon */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <Quote className="w-12 h-12 text-primary/30" />
            </div>

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
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-center pt-8"
                >
                  {/* Avatar */}
                  <div className="mb-6">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gradient-neon p-0.5">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                          <span className="text-2xl font-bold text-gradient-neon">
                            {currentTestimonial.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
                    "{currentTestimonial.testimonial_text}"
                  </blockquote>

                  {/* Author */}
                  <div>
                    <p className="font-semibold text-foreground">
                      {currentTestimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {displayRole}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-gradient-neon"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(1)}
                className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default TestimonialsSection;
