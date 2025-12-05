import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Scale, Menu, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isHomePage = location.pathname === "/";

  const { scrollY } = useScroll();
  
  // Transform navbar background opacity based on scroll
  const navBg = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 20]);
  const navScale = useTransform(scrollY, [0, 50], [1, 0.98]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  // Track scroll direction for hide/show
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  // Check auth status properly with useEffect
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  // Nav links with type definition
  interface NavLink {
    label: string;
    href: string;
    isRoute?: boolean;
  }

  // Public nav links (always visible)
  const publicNavLinks: NavLink[] = [
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  // Protected nav links (only for authenticated users)
  const protectedNavLinks: NavLink[] = isAuthenticated
    ? [
        { label: "Dashboard", href: "/dashboard", isRoute: true },
        { label: "Backlog", href: "/backlog", isRoute: true },
      ]
    : [];

  const navLinks: NavLink[] = [...publicNavLinks, ...protectedNavLinks];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ 
        y: hidden && isHomePage ? -100 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        style={{
          scale: isHomePage ? navScale : 1,
        }}
        className="relative"
      >
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 glass-navbar"
          style={{
            opacity: isHomePage ? navBg : 1,
          }}
        />
        
        {/* Neon border line at bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          style={{
            opacity: isHomePage ? navBg : 0.5,
          }}
        />

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                className="relative"
                style={{ scale: isHomePage ? logoScale : 1 }}
              >
                <Scale className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                <motion.div 
                  className="absolute inset-0 bg-primary/30 blur-lg rounded-full"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.span 
                className="text-xl font-bold text-foreground font-display"
                style={{ scale: isHomePage ? logoScale : 1 }}
              >
                Verdic <span className="text-gradient-neon">AI</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300" />
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300" />
                    </a>
                  )}
                </motion.div>
              ))}
              {/* Show locked backlog hint for unauthenticated */}
              {!isAuthenticated && (
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1, duration: 0.5 }}
                  onClick={() => navigate("/auth")}
                  className="text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1"
                  title="Login required to access backlog"
                >
                  <Lock className="h-3 w-3" />
                  Backlog
                </motion.button>
              )}
            </div>

            {/* CTA Buttons - Right */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button 
                  onClick={handleGetStarted} 
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                >
                  {isAuthenticated ? "Dashboard" : "Login"}
                </Button>
              </motion.div>
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleGetStarted} 
                    size="sm" 
                    className="rounded-full bg-gradient-neon hover:shadow-neon transition-all duration-300 border-0"
                  >
                    Get Started
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: mobileMenuOpen ? "auto" : 0,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 border-t border-border/30 glass-dark rounded-b-2xl">
              <div className="flex flex-col gap-4 px-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    )}
                  </motion.div>
                ))}
                {/* Mobile: Show locked backlog for unauthenticated */}
                {!isAuthenticated && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -20 }}
                    transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/auth");
                    }}
                    className="text-sm font-medium text-muted-foreground/50 flex items-center gap-1 text-left py-2"
                  >
                    <Lock className="h-3 w-3" />
                    Backlog (Login required)
                  </motion.button>
                )}
                <div className="flex flex-col gap-2 pt-4 border-t border-border/30">
                  <Button 
                    onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    {isAuthenticated ? "Dashboard" : "Login"}
                  </Button>
                  {!isAuthenticated && (
                    <Button 
                      onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }} 
                      size="sm" 
                      className="rounded-full w-full bg-gradient-neon"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;