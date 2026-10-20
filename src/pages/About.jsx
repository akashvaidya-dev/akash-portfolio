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
            subtitle="Junior Flutter developer · 1.5 years · Android & iOS · Bilaspur, India"
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
                  I am a <strong>Junior Software Developer</strong> focused on <strong>Flutter</strong>, with about{' '}
                  <strong>1.5 years</strong> of hands-on experience building Android and iOS apps. I am finishing a
                  B.Tech in Computer Science &amp; Engineering at JK Institute of Engineering, Bilaspur.
                </p>
                <p>
                  Most days I work in Dart: screens, navigation, <strong>GetX / Riverpod / BLoC</strong>, Dio REST
                  calls, Firebase (Auth, FCM, Firestore), maps, payments, and push. I like code that is easy to
                  read and apps that survive a bad network.
                </p>
                <p>
                  This portfolio is something I coded myself in React + Vite. Client and office projects stay private —
                  only personal / public work is listed on the Projects page.
                </p>
              </div>

              {/* Core Strengths Checklist */}
              <div className="about-strengths-box">
                <h4 className="strengths-title">Core Engineering Strengths</h4>
                <ul className="strengths-list">
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Flutter &amp; Dart:</strong> Production Android/iOS apps across CRM, health, commerce, and ops.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>State that scales:</strong> GetX, Riverpod, and BLoC for clear, testable UI flows.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>APIs &amp; Cloud:</strong> Dio/REST, Firebase Auth/FCM/Firestore, Crashlytics, Remote Config.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Maps &amp; Payments:</strong> Google Maps, Mapbox, Razorpay, Stripe, QR/barcode.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-accent" />
                    <span>
                      <strong>Realtime:</strong> Socket.IO, SignalR, WebRTC, Agora — chat, live ops, and calls.
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
                    <span className="fact-val">Flutter, Dart, Firebase</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">State Management:</span>
                    <span className="fact-val">GetX, Riverpod, BLoC</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Location:</span>
                    <span className="fact-val">{socialLinks.location}</span>
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
                  <h3 className="education-title">B.Tech — Computer Science &amp; Engineering</h3>
                  <span className="education-subtitle">JK Institute of Engineering · 2022 – 2025 · Bilaspur, CG</span>
                </div>
              </div>
              <p className="education-desc">
                B.Tech CSE with parallel industry work in Flutter. Diploma in Computer Science (2019–2021, 81%)
                from the same institute; Matriculation 2018 (66%).
              </p>
            </div>

            <div className="education-card">
              <div className="education-header">
                <Sparkles size={20} className="text-accent" />
                <div>
                  <h3 className="education-title">Smart India Hackathon — Fixly</h3>
                  <span className="education-subtitle">On-demand services marketplace</span>
                </div>
              </div>
              <p className="education-desc">
                Built Fixly: role-based bookings, Mapbox live location, Razorpay payments, Socket.IO updates,
                and WebRTC calling under hackathon deadlines.
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
                  Junior Flutter developer · 1.5 years · Android &amp; iOS apps with Dart and Firebase.
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
