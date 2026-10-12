import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle2, ArrowRight, Layers, Cpu, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { experienceTimeline, engineeringPrinciples } from '../data/experience';
import SectionTitle from '../components/SectionTitle';

const filters = [
  { id: 'all', label: 'All Milestones' },
  { id: 'mobile', label: 'Mobile & Hardware' },
  { id: 'web', label: 'Web Expansion' },
];

/**
 * Experience Page Component
 * Enhanced interactive timeline of real engineering milestones, client product deliveries,
 * hackathon achievements, and standing engineering principles.
 */
function Experience() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTimeline = experienceTimeline.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mobile') return item.tech.includes('Flutter') || item.tech.includes('Dart');
    if (activeFilter === 'web') return item.tech.includes('React 19') || item.tech.includes('Modern CSS');
    return true;
  });

  return (
    <div className="page-wrapper experience-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="container">
          <SectionTitle
            badge="Career & Milestones"
            title="Engineering Experience &amp; Journey"
            subtitle="Verified history of building production Flutter applications, hardware integrations, and modern web systems."
          />

          {/* Interactive Filter Pills */}
          <div className="timeline-filter-tabs">
            {filters.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`category-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-experience-pill"
                      className="tab-active-pill"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="timeline-wrap">
            <AnimatePresence mode="popLayout">
              {filteredTimeline.map((item, index) => (
                <motion.div
                  layout
                  key={item.role + index}
                  className="timeline-item"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  {/* Timeline Marker */}
                  <div className="timeline-marker">
                    <div className="timeline-dot">
                      <Briefcase size={14} className="text-accent" />
                    </div>
                    {index < filteredTimeline.length - 1 && <div className="timeline-line" />}
                  </div>

                  {/* Timeline Card with Hover Glow */}
                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div className="timeline-header-titles">
                        <span className="timeline-badge">
                          <Sparkles size={11} style={{ marginRight: 4, display: 'inline' }} />
                          {item.badge}
                        </span>
                        <h3 className="timeline-role">{item.role}</h3>
                        <h4 className="timeline-org">{item.organization}</h4>
                      </div>
                      <div className="timeline-date">
                        <Calendar size={14} style={{ marginRight: 6 }} />
                        <span>{item.period}</span>
                      </div>
                    </div>

                    <p className="timeline-desc">{item.description}</p>

                    <div className="timeline-achievements">
                      <h5 className="timeline-achievements-title">// Key Engineering Deliverables:</h5>
                      <ul className="timeline-achievements-list">
                        {item.achievements.map((ach, achIdx) => (
                          <li key={achIdx}>
                            <CheckCircle2 size={15} className="text-accent" style={{ flexShrink: 0, marginTop: 3 }} />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="timeline-tech-stack">
                      {item.tech.map((t) => (
                        <span key={t} className="badge">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Engineering Principles Section */}
      <section className="section-padding bg-surface" aria-label="Core Engineering Pillars">
        <div className="container">
          <SectionTitle
            badge="Code Standards"
            title="Standing Engineering Principles"
            subtitle="The fundamental technical rules and standards I apply to every codebase."
          />

          <div className="principles-grid">
            {engineeringPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                className="principle-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <div className="principle-icon-wrap">
                  {index === 0 && <Layers size={22} className="text-accent" />}
                  {index === 1 && <Cpu size={22} className="text-accent" />}
                  {index === 2 && <Zap size={22} className="text-accent" />}
                  {index === 3 && <ShieldCheck size={22} className="text-accent" />}
                </div>
                <h3 className="principle-title">{principle.title}</h3>
                <span className="principle-subtitle">// {principle.subtitle}</span>
                <p className="principle-desc">{principle.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="cta-banner-mini" style={{ marginTop: 'var(--space-12)' }}>
            <div className="cta-mini-text">
              <h4>Ready to review code or discuss technical requirements?</h4>
              <p>I am available for in-depth technical discussions, system architecture reviews, and interviews.</p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              <span>Get in Touch</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Experience;
