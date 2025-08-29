import { Link } from "wouter";
import Logo from "@/components/ui/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: "ITR Filing", href: "/itr-filing" },
    { label: "GST Software", href: "/gst-management" },
    { label: "TDS Software", href: "/tds-services" },
    { label: "Tax Calculator", href: "/calculator" },
    { label: "Expert Consultation", href: "/experts" },
  ];

  const serviceLinks = [
    { label: "Expert Filing", href: "/experts" },
    { label: "Legal Services", href: "/legal-services" },
    { label: "Investment Planning", href: "/investment" },
    { label: "Tax Planning", href: "/tax-planning" },
    { label: "Business Registration", href: "/business-registration" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Live Chat", href: "/chat" },
    { label: "Tax Guide", href: "/guide" },
    { label: "Video Tutorials", href: "/tutorials" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Partners", href: "/partners" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
  ];

  return (
    <footer className="bg-gray-900 text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2" data-testid="footer-company-info">
            <Logo size="lg" textClassName="text-white" />
            <p className="text-gray-400 mb-6 leading-relaxed" data-testid="footer-description">
              India's most advanced AI-powered tax platform. Revolutionizing tax filing with artificial intelligence, providing 100% accurate returns and expert guidance for millions of Indians.
            </p>
            
            {/* Certifications */}
            <div className="mb-6" data-testid="footer-certifications">
              <p className="text-sm text-gray-400 mb-2">Certified & Secure</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="bg-gray-800 px-2 py-1 rounded">ISO 27001</span>
                <span className="bg-gray-800 px-2 py-1 rounded">SOC 2</span>
                <span className="bg-gray-800 px-2 py-1 rounded">256-bit SSL</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4" data-testid="footer-social">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-facebook">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-twitter">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-linkedin">
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-youtube">
                <i className="fab fa-youtube text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-instagram">
                <i className="fab fa-instagram text-lg"></i>
              </a>
            </div>
          </div>
          
          {/* Products */}
          <div data-testid="footer-products">
            <h4 className="font-semibold mb-4 text-white">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`product-link-${index}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div data-testid="footer-services">
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`service-link-${index}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div data-testid="footer-support">
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`support-link-${index}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div data-testid="footer-company">
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`company-link-${index}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-800 mt-12 pt-8" data-testid="footer-contact">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left" data-testid="contact-phone">
              <h5 className="font-semibold text-white mb-2">Phone Support</h5>
              <p className="text-gray-400 text-sm">Mon-Fri: 9 AM - 6 PM</p>
              <p className="text-primary font-medium">1800-XXX-XXXX</p>
            </div>
            
            <div className="text-center md:text-left" data-testid="contact-email">
              <h5 className="font-semibold text-white mb-2">Email Support</h5>
              <p className="text-gray-400 text-sm">24/7 Email Support</p>
              <p className="text-primary font-medium">support@bettertaxai.com</p>
            </div>
            
            <div className="text-center md:text-left" data-testid="contact-address">
              <h5 className="font-semibold text-white mb-2">Headquarters</h5>
              <p className="text-gray-400 text-sm">
                BETTERTAXAI Technologies Pvt. Ltd.<br />
                Bangalore, Karnataka, India
              </p>
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="border-t border-gray-800 mt-8 pt-8" data-testid="footer-awards">
          <div className="text-center">
            <h5 className="font-semibold text-white mb-4">Trusted & Recognized</h5>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
              <span>⭐ 4.9/5 on Google Play</span>
              <span>🏆 Best Fintech App 2024</span>
              <span>🔒 ISO 27001 Certified</span>
              <span>✅ Government Approved</span>
              <span>💯 7.5M+ Users</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8" data-testid="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm" data-testid="footer-copyright">
                &copy; {currentYear} BETTERTAXAI Technologies Pvt. Ltd. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                India's most advanced AI-powered tax filing platform with government recognition
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6" data-testid="footer-legal">
              {legalLinks.map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-xs"
                  data-testid={`legal-link-${index}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
