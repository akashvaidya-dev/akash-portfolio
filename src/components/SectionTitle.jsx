import { motion } from 'framer-motion';

/**
 * SectionTitle Component
 * Reusable section heading with optional badge, title, subtitle, and smooth scroll animation.
 */
function SectionTitle({
  badge,
  title,
  subtitle,
  align = 'left',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <motion.div
      className={`section-title-wrap ${className}`}
      style={{
        textAlign: isCenter ? 'center' : 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCenter ? 'center' : 'flex-start',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {badge && <span className="section-badge">{badge}</span>}
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

export default SectionTitle;
