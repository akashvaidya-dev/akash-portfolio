import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { Github } from './Icons';
import ProjectModal from './ProjectModal';

/**
 * ProjectCard Component
 * Reusable developer portfolio project card with hover states, tags,
 * and interactive case-study deep-dive modal.
 */
function ProjectCard({ project, index = 0 }) {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    title,
    tagline,
    description,
    tags = [],
    liveUrl,
    githubUrl,
    metric,
    featured = false,
  } = project;

  return (
    <>
      <motion.article
        className="project-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      >
        <div className="project-card-top">
          <div className="project-card-meta">
            <div className="project-folder-icon" aria-hidden="true">
              <Layers size={18} />
            </div>
            {featured && (
              <span className="badge badge-accent">
                <Sparkles size={11} aria-hidden="true" style={{ marginRight: 4 }} />
                Featured Project
              </span>
            )}
          </div>

          <div className="project-card-ext-links">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-icon-link"
                aria-label={`View ${title} source code on GitHub`}
                title="GitHub Repository"
              >
                <Github size={17} />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-icon-link"
                aria-label={`Open ${title} live preview`}
                title="Live Demo"
              >
                <ExternalLink size={17} />
              </a>
            )}
          </div>
        </div>

        <div className="project-card-body">
          <h3 className="project-card-title">
            <button
              type="button"
              className="project-title-btn"
              onClick={() => setModalOpen(true)}
              aria-label={`View case study for ${title}`}
            >
              {title}
              <ArrowUpRight size={16} className="title-arrow" aria-hidden="true" />
            </button>
          </h3>

          {tagline && <p className="project-card-tagline">{tagline}</p>}

          <p className="project-card-description">{description}</p>

          {metric && (
            <div className="project-card-metric" role="note">
              <span className="metric-label">// Outcome:</span> {metric}
            </div>
          )}
        </div>

        <div className="project-card-footer">
          <div className="project-tags-list" aria-label="Technologies used">
            {tags.slice(0, 5).map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="badge badge-subtle">+{tags.length - 5}</span>
            )}
          </div>

          <div className="project-card-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setModalOpen(true)}
            >
              Case Study
            </button>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Source
                <Github size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </motion.article>

      {/* Case Study Modal */}
      <ProjectModal
        project={project}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default ProjectCard;
