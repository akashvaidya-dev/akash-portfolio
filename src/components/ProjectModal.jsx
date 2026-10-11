import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Cpu, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { Github } from './Icons';

/**
 * ProjectModal Component
 * Interactive deep-dive modal displaying full technical architecture,
 * problem-solution breakdown, engineering decisions, and metrics.
 */
function ProjectModal({ project, isOpen, onClose }) {
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

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-info">
                <div className="modal-badges">
                  <span className="badge badge-accent">
                    <Sparkles size={12} style={{ marginRight: 4 }} />
                    {project.category}
                  </span>
                  {project.isProprietary && (
                    <span className="badge badge-subtle">Client / Enterprise</span>
                  )}
                </div>
                <h2 id="modal-title" className="modal-title">
                  {project.title}
                </h2>
                <p className="modal-tagline">{project.tagline}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close project details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Highlight Metric Banner */}
              {project.metric && (
                <div className="modal-metric-banner">
                  <Cpu size={18} className="text-accent" />
                  <div>
                    <span className="modal-metric-label">Key Engineering Result:</span>
                    <strong className="modal-metric-val">{project.metric}</strong>
                  </div>
                </div>
              )}

              {/* Architecture Blueprint Callout */}
              {project.architecture && (
                <div className="modal-section modal-arch-box">
                  <h4 className="modal-section-title">
                    <Layers size={16} className="text-accent" />
                    Architecture & State Design
                  </h4>
                  <p className="modal-arch-desc">{project.architecture}</p>
                </div>
              )}

              {/* Problem & Solution Grid */}
              <div className="modal-grid-two">
                {project.problem && (
                  <div className="modal-problem-box">
                    <h4 className="modal-section-title">
                      <ShieldAlert size={16} style={{ color: '#f59e0b' }} />
                      The Engineering Challenge
                    </h4>
                    <p>{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="modal-solution-box">
                    <h4 className="modal-section-title">
                      <CheckCircle2 size={16} className="text-accent" />
                      The Technical Solution
                    </h4>
                    <p>{project.solution}</p>
                  </div>
                )}
              </div>

              {/* Technical Decisions & Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Key Implementation Details</h4>
                  <ul className="modal-highlights-list">
                    {project.highlights.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={15} className="text-accent" style={{ flexShrink: 0, marginTop: 3 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies Used */}
              <div className="modal-section">
                <h4 className="modal-section-title">Tech Stack & Packages</h4>
                <div className="modal-tags-wrap">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="modal-footer">
              <div className="modal-links">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Github size={15} />
                    View Repository
                  </a>
                ) : (
                  <span className="repo-note">
                    {project.isProprietary ? 'Enterprise / Client Code (Private)' : 'Repository available upon request'}
                  </span>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <ExternalLink size={15} />
                    Live Demo
                  </a>
                )}
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectModal;
