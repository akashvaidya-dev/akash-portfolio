import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import { socialLinks } from '../data/socials';
import { ArrowUp } from 'lucide-react';

/**
 * Footer Component
 * Minimal, modern footer with site navigation, availability status indicator,
 * and social channels.
 */
function Footer({ onOpenResume }) {
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
              Junior Software Developer · Flutter · 1.5 years. I build Android &amp; iOS apps with Dart,
              Firebase, and careful state management. This site is handmade.
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
              <li>
                {onOpenResume ? (
                  <button
                    type="button"
                    onClick={onOpenResume}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "var(--accent-light)",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    Resume (Read &amp; Download PDF)
                  </button>
                ) : (
                  <a href="/Akash_Vaidya_resume.pdf" download="Akash_Vaidya_resume.pdf" className="text-accent">
                    Download Resume (PDF)
                  </a>
                )}
              </li>
              <li>
                <a href="#death-note-bug-log">Death Note — The Bug Log</a>
              </li>
              <li>
                <a href="#developer-status">Live GitHub Status</a>
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

        {/* Bottom bar — left copyright + subtle stack; Akash-OS stays floating HUD */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Akash Vaidya. Built with care &amp; clean code.
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
    </footer>
  );
}

export default Footer;
