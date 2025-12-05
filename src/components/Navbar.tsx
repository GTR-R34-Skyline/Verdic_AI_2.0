import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Scale, Menu, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass-navbar shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Scale className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-foreground font-display">
              Verdic <span className="text-gradient-neon">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300" />
                </a>
              )
            ))}
            {/* Show locked backlog hint for unauthenticated */}
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1"
                title="Login required to access backlog"
              >
                <Lock className="h-3 w-3" />
                Backlog
              </button>
            )}
          </div>

          {/* CTA Buttons - Right */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              onClick={handleGetStarted} 
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </Button>
            {!isAuthenticated && (
              <Button 
                onClick={handleGetStarted} 
                size="sm" 
                className="rounded-full bg-gradient-neon hover:shadow-neon transition-all duration-300 border-0"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/30 glass-dark rounded-b-2xl">
            <div className="flex flex-col gap-4 px-2">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              {/* Mobile: Show locked backlog for unauthenticated */}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth");
                  }}
                  className="text-sm font-medium text-muted-foreground/50 flex items-center gap-1 text-left py-2"
                >
                  <Lock className="h-3 w-3" />
                  Backlog (Login required)
                </button>
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;