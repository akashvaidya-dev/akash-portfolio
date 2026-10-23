import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { socialLinks } from '../data/socials';

/**
 * ResumeModal Component
 * Interactive resume viewer allowing visitors to preview, read, and download
 * Akash Vaidya's updated professional resume PDF directly inside the browser.
 */
function ResumeModal({ isOpen, onClose }) {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resumePath = socialLinks.resumeUrl || '/Akash_Vaidya_resume.pdf';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop resume-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
        >
          <motion.div
            className="modal-card resume-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header resume-modal-header">
              <div className="modal-header-info">
                <div className="modal-badges">
                  <span className="badge badge-accent">
                    <Sparkles size={12} style={{ marginRight: 4 }} />
                    Verified Resume
                  </span>
                  <span className="badge badge-subtle">PDF Document · 110 KB</span>
                </div>
                <h2 id="resume-modal-title" className="modal-title resume-modal-title">
                  <FileText size={22} className="text-accent" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
                  Akash Vaidya — Resume
                </h2>
                <p className="modal-tagline">
                  Junior Software Developer (Flutter · Dart · 1.5 Years Experience)
                </p>
              </div>

              <div className="resume-header-actions">
                <a
                  href={resumePath}
                  download="Akash_Vaidya_resume.pdf"
                  className="btn btn-primary btn-sm resume-action-btn"
                  title="Download Resume PDF"
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm resume-action-btn"
                  title="Open in New Browser Tab"
                >
                  <ExternalLink size={15} />
                  <span className="hidden sm:inline">New Tab</span>
                </a>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={onClose}
                  aria-label="Close resume viewer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quick Information Strip */}
            <div className="resume-info-strip">
              <div className="resume-info-item">
                <CheckCircle2 size={14} className="text-accent" />
                <span>Mobile: Flutter, Dart, Riverpod, BLoC, GetX</span>
              </div>
              <div className="resume-info-item">
                <CheckCircle2 size={14} className="text-accent" />
                <span>Backend/Services: Firebase, REST APIs, Hive, Dio</span>
              </div>
              <div className="resume-info-item">
                <CheckCircle2 size={14} className="text-accent" />
                <span>Status: Available for immediate hiring</span>
              </div>
            </div>

            {/* Modal Body / Embedded PDF Viewer */}
            <div className="resume-modal-body">
              <object
                data={`${resumePath}#toolbar=1&navpanes=0&scrollbar=1`}
                type="application/pdf"
                className="resume-pdf-object"
              >
                <div className="resume-pdf-fallback">
                  <FileText size={48} className="text-accent" style={{ marginBottom: 16 }} />
                  <h3>Previewing Akash Vaidya's Resume</h3>
                  <p>
                    Your browser does not support embedded PDF viewing, or you are on a mobile device.
                    Click below to open or download the complete PDF directly:
                  </p>
                  <div className="resume-fallback-actions">
                    <a
                      href={resumePath}
                      download="Akash_Vaidya_resume.pdf"
                      className="btn btn-primary"
                    >
                      <Download size={16} />
                      <span>Download Resume (PDF)</span>
                    </a>
                    <a
                      href={resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <ExternalLink size={16} />
                      <span>Open in Browser Tab</span>
                    </a>
                  </div>
                </div>
              </object>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer resume-modal-footer">
              <div className="resume-footer-links">
                <a
                  href={resumePath}
                  download="Akash_Vaidya_resume.pdf"
                  className="btn btn-primary btn-sm"
                >
                  <Download size={15} />
                  <span>Download Resume (PDF)</span>
                </a>
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <ExternalLink size={15} />
                  <span>Open Fullscreen / New Tab</span>
                </a>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResumeModal;
