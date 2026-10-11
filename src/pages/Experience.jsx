import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle2, ArrowRight, Layers, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { experienceTimeline, engineeringPrinciples } from '../data/experience';
import SectionTitle from '../components/SectionTitle';

/**
 * Experience Page Component
 * Detailed timeline of real engineering milestones, client product deliveries,
 * hackathon achievements, and foundational engineering principles.
 */
function Experience() {
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
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="timeline-wrap">
            {experienceTimeline.map((item, index) => (
              <motion.div
                key={item.role + index}
                className="timeline-item"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Marker */}
                <div className="timeline-marker">
                  <div className="timeline-dot">
                    <Briefcase size={14} className="text-accent" />
                  </div>
                  {index < experienceTimeline.length - 1 && <div className="timeline-line" />}
                </div>

                {/* Timeline Card */}
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="timeline-header-titles">
                      <span className="timeline-badge">{item.badge}</span>
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
