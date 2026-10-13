import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import avatarPhoto from '../assets/images/akash-vaidya-avatar.jpg';
import fullPhoto from '../assets/images/akash-vaidya-full.jpg';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Code2, Sparkles, BookOpen, ExternalLink, X, Maximize2 } from 'lucide-react';
import { skillCategories } from '../data/skills';
import { socialLinks } from '../data/socials';
import SectionTitle from '../components/SectionTitle';

/**
 * About Page Component
 * Detailed professional background, engineering philosophy, categorized skillsets,
 * and genuine career trajectory without fabricated claims.
 */
function About() {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  return (
    <div className="page-wrapper about-page">
      {/* Page Header */}
      <section className="page-header-section">
        <div className="container">
          <SectionTitle
            badge="Engineering Profile"
            title="About Akash Vaidya"
            subtitle="Senior Flutter Developer & Frontend Engineer crafting robust mobile apps and modern web systems."
          />
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="about-grid">
            {/* Story & Philosophy Column */}
            <div className="about-story-col">
              <h3 className="about-col-title">// Professional Background</h3>
              <div className="prose">
                <p>
                  My engineering foundation is built on <strong>Flutter and Dart</strong> mobile application
                  development. Over the course of my career, I have designed, architected, and shipped production
                  mobile applications that solve real operational bottlenecks across retail, outpatient healthcare,
                  lifestyle consultation, and public infrastructure.
                </p>
                <p>
                  Beyond standard UI screens, my work frequently involves <strong>hardware-level integrations</strong>.
                  I have built systems that interface directly with physical Bluetooth and WiFi thermal receipt
                  printers using binary ESC/POS streams, speech-to-text voice dictation engines for high-speed POS
                  order entry, and camera sensor pipelines with cryptographic geolocation tags.
                </p>
                <p>
                  I am actively expanding my mobile architectural expertise into <strong>modern React and web development</strong>.
                  The same disciplines that make mobile applications robust—deterministic state management with Riverpod,
                  clean architecture, offline resilience with Hive, and 60 FPS animation budgets—translate directly to
                  building exceptional, responsive SPAs with React 19, Vite, and modern CSS.
                </p>
              </div>

              {/* Core Strengths Checklist */}
              <div className="about-strengths-box">
                <h4 className="strengths-title">Core Engineering Strengths</h4>
                <ul className="strengths-list">
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Cross-Platform Mastery:</strong> Building native-feeling Android and iOS applications with Flutter &amp; Dart.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Predictable State Architecture:</strong> Proven implementations of Riverpod, Hooks Riverpod, and BLoC.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Hardware &amp; Peripherals:</strong> ESC/POS thermal printers, speech recognition, camera sensors, and audio streams.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Offline-First Systems:</strong> Sub-millisecond local caching using Hive and SQLite with sync queues.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Modern Web Expansion:</strong> React 19, Vite, React Router DOM, Framer Motion, and WebSocket APIs.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Fact Card & Contact Callout */}
            <div className="about-sidebar-col">
              <div className="fact-card">
                <div className="fact-card-header">
                  <div
                    className="about-photo-avatar-wrapper"
                    onClick={() => setIsPhotoOpen(true)}
                    title="Click to view Akash Vaidya photo"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setIsPhotoOpen(true);
                    }}
                  >
                    <img
                      src={avatarPhoto}
                      alt={socialLinks.name}
                      className="about-photo-avatar-img"
                    />
                    <span className="about-avatar-status-dot" title="Active & Open for Roles" />
                  </div>
                  <div>
                    <h4 className="fact-name">{socialLinks.name}</h4>
                    <span className="fact-role">{socialLinks.role}</span>
                  </div>
                </div>

                <div className="fact-details-list">
                  <div className="fact-item">
                    <span className="fact-label">Primary Stack:</span>
                    <span className="fact-val">Flutter, Dart, React, Vite</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">State Management:</span>
                    <span className="fact-val">Riverpod, Hooks, BLoC</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Peripherals:</span>
                    <span className="fact-val">ESC/POS Thermal, Voice POS</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">GitHub:</span>
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fact-val text-accent"
                    >
                      {socialLinks.handle} <ExternalLink size={12} style={{ display: 'inline', marginLeft: 2 }} />
                    </a>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Email:</span>
                    <a href={`mailto:${socialLinks.email}`} className="fact-val text-accent">
                      {socialLinks.email}
                    </a>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Status:</span>
                    <span className="fact-val text-accent">{socialLinks.availability}</span>
                  </div>
                </div>

                <div className="fact-actions">
                  <Link to="/contact" className="btn btn-primary btn-block">
                    <span>Contact Me</span>
                    <ArrowRight size={15} />
                  </Link>
                  <Link to="/projects" className="btn btn-outline btn-block">
                    <span>View Projects</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Detailed Technical Skills Matrix
          ========================================================================= */}
      <section className="section-padding bg-surface" aria-label="Skills Matrix">
        <div className="container">
          <SectionTitle
            badge="Technical Competencies"
            title="Complete Skills &amp; Technology Matrix"
            subtitle="Structured by functional category, supported by actual production and project implementations."
          />

          <div className="skills-matrix-grid">
            {skillCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                className="matrix-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="matrix-card-header">
                  <div className="matrix-icon">
                    <Code2 size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="matrix-title">{cat.title}</h3>
                    <p className="matrix-desc">{cat.description}</p>
                  </div>
                </div>

                <div className="matrix-skills-list">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="matrix-skill-item">
                      <div className="matrix-skill-top">
                        <span className={`matrix-skill-name ${skill.highlight ? 'text-accent' : ''}`}>
                          {skill.name}
                        </span>
                        <span className="badge badge-subtle">{skill.category}</span>
                      </div>
                      <p className="matrix-skill-note">{skill.note}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          Education & Continuous Learning
          ========================================================================= */}
      <section className="section-padding" aria-label="Education & Professional Development">
        <div className="container">
          <SectionTitle
            badge="Foundation"
            title="Education &amp; Professional Growth"
            subtitle="Continuous learning, software engineering discipline, and hackathon participation."
          />

          <div className="education-grid">
            <div className="education-card">
              <div className="education-header">
                <BookOpen size={20} className="text-accent" />
                <div>
                  <h3 className="education-title">Computer Science &amp; Software Engineering</h3>
                  <span className="education-subtitle">Academic Background &amp; Practical Systems Engineering</span>
                </div>
              </div>
              <p className="education-desc">
                Rigorous focus on core computer science foundations: object-oriented programming, data structures,
                asynchronous stream architectures, relational and NoSQL databases, and network protocols.
              </p>
            </div>

            <div className="education-card">
              <div className="education-header">
                <Sparkles size={20} className="text-accent" />
                <div>
                  <h3 className="education-title">Smart India Hackathon (SIH)</h3>
                  <span className="education-subtitle">National Technical Innovation Competitions</span>
                </div>
              </div>
              <p className="education-desc">
                Led mobile development for SIH-Fixly, solving civic infrastructure reporting challenges with on-device
                sensors, image compression pipelines, and municipal audit workflows under tight event deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {isPhotoOpen && (
          <motion.div
            className="photo-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPhotoOpen(false)}
          >
            <motion.div
              className="photo-lightbox-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="photo-lightbox-close"
                onClick={() => setIsPhotoOpen(false)}
                aria-label="Close photo preview"
              >
                <X size={20} />
              </button>
              <div className="photo-lightbox-img-wrap">
                <img
                  src={fullPhoto}
                  alt={socialLinks.name}
                  className="photo-lightbox-img"
                />
              </div>
              <div className="photo-lightbox-caption">
                <div className="photo-lightbox-header">
                  <h3 className="photo-lightbox-name">{socialLinks.name}</h3>
                  <span className="badge badge-subtle">{socialLinks.role}</span>
                </div>
                <p className="photo-lightbox-desc">
                  Senior Flutter Developer &amp; Frontend Engineer crafting high-performance mobile and web software.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default About;
