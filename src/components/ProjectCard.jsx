import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

/**
 * Flat Play Store project card.
 * Screenshots already include phone chrome — no extra device frame.
 */
function ProjectCard({ project, index = 0 }) {
  return (
    <motion.article
      className="store-project-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <header className="store-project-head">
        <div className="store-project-identity">
          {project.icon && (
            <img
              className="store-project-icon"
              src={project.icon}
              alt=""
              width={48}
              height={48}
            />
          )}
          <div>
            <p className="store-project-cat">{project.category}</p>
            <h3 className="store-project-title">{project.title}</h3>
            <p className="store-project-tagline">{project.tagline}</p>
          </div>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm store-project-cta"
          >
            <ExternalLink size={14} />
            <span>{project.liveLabel || 'Play Store'}</span>
          </a>
        )}
      </header>

      {project.images?.length > 0 && (
        <div className="store-shot-strip" role="list" aria-label={`${project.title} screenshots`}>
          {project.images.map((src, i) => (
            <img
              key={src}
              role="listitem"
              className="store-shot"
              src={src}
              alt={`${project.title} screenshot ${i + 1}`}
              loading="lazy"
            />
          ))}
        </div>
      )}

      <div className="store-project-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default ProjectCard;
