import { Scale, Twitter, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#security" },
      { label: "Roadmap", href: "#roadmap" },
    ],
    Company: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
    Legal: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Cookies", href: "#cookies" },
      { label: "Licenses", href: "#licenses" },
    ],
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Verdic AI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              AI-powered legal case management system reducing India's case backlog through intelligent automation and prioritization.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
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
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 Verdic AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
