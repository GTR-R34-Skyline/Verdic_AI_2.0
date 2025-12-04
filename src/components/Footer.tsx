import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Case Studies", href: "#" },
      { label: "Documentation", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Compliance", href: "#" },
    ],
  };

  return (
    <footer className="relative border-t border-border/30 bg-card/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Scale className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              </div>
              <span className="text-xl font-bold font-display">
                Verdic <span className="text-gradient-neon">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transforming India's judiciary with AI-powered case management. 
              Reduce backlogs, accelerate justice, and empower legal professionals.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@verdicai.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 11 4567 8900</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Verdic AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Made with ❤️ for Indian Judiciary
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
