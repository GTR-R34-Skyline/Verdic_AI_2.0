import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Menu, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
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
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#blog" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Scale className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-foreground">Verdic AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
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

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={handleGetStarted} 
              variant="ghost"
              size="sm"
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </Button>
            {!isAuthenticated && (
              <Button 
                onClick={handleGetStarted} 
                size="sm" 
                className="rounded-full"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                  className="text-sm font-medium text-muted-foreground/50 flex items-center gap-1 text-left"
                >
                  <Lock className="h-3 w-3" />
                  Backlog (Login required)
                </button>
              )}
              <Button onClick={handleGetStarted} variant="ghost" size="sm" className="w-full">
                {isAuthenticated ? "Dashboard" : "Login"}
              </Button>
              {!isAuthenticated && (
                <Button onClick={handleGetStarted} size="sm" className="rounded-full w-full">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
