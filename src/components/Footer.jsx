import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import { socialLinks } from '../data/socials';
import { ArrowUp } from 'lucide-react';

/**
 * Footer Component
 * Minimal, modern footer with site navigation, availability status indicator,
 * and social channels.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrap" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          {/* Brand & Status Column */}
          <div className="footer-brand-col">
            <Link to="/" className="navbar-brand">
              <span className="brand-bracket">&lt;</span>
              <span>Akash Vaidya</span>
              <span className="brand-bracket">/&gt;</span>
            </Link>
            <p className="footer-brand-bio">
              Senior Flutter Developer &amp; Modern Frontend Engineer. Specializing in high-performance
              cross-platform mobile architectures, hardware-level POS integrations, and modern React web interfaces.
            </p>
            <div className="pulsing-dot-wrap">
              <span className="pulsing-dot" aria-hidden="true" />
              <span>{socialLinks.availability}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="footer-col-title">// Navigation</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About &amp; Philosophy</Link>
              </li>
              <li>
                <Link to="/projects">Projects &amp; Case Studies</Link>
              </li>
              <li>
                <Link to="/experience">Experience Timeline</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="footer-col-title">// Connect</h4>
            <SocialLinks className="footer-socials" />
            <p className="footer-connect-note">
              Direct inquiries: <a href={`mailto:${socialLinks.email}`} className="text-accent">{socialLinks.email}</a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} Akash Vaidya. Built with craftsmanship &amp; clean code.</p>
          <div className="footer-bottom-actions">
            <p className="footer-stack-note">
              React 19 • Vite • Framer Motion • Lucide Icons
            </p>
            <button
              type="button"
              className="scroll-top-btn"
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              title="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
