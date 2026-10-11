import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Layers, ShieldCheck, Zap, Terminal, ExternalLink } from 'lucide-react';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';
import { engineeringPrinciples } from '../data/experience';
import { socialLinks } from '../data/socials';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';

/**
 * Home Page Component
 * Premium editorial layout introducing Akash Vaidya's Flutter & React engineering background,
 * key architectural pillars, flagship projects, and quick contact action.
 */
function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="page-wrapper home-page">
      {/* =========================================================================
          Hero Section
          ========================================================================= */}
      <section className="hero-section" aria-label="Introduction">
        <div className="container">
          <div className="hero-content">
            {/* Availability Badge */}
            <motion.div
              className="hero-badge-wrap"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hero-status-badge">
                <span className="pulsing-dot" aria-hidden="true" />
                <span className="hero-status-text">{socialLinks.availability}</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Engineering <span className="text-gradient">High-Performance</span> Mobile Apps &amp; Modern Web Systems.
            </motion.h1>

            {/* Subtitle / Positioning */}
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              I am <strong className="text-primary-light">Akash Vaidya</strong>, an experienced{' '}
              <span className="text-accent">Flutter Developer</span> specializing in enterprise-grade mobile
              architecture, hardware-level POS integrations (thermal printers, voice dictation), and modern{' '}
              <span className="text-accent">React</span> web applications. Focused on deterministic state management,
              offline resilience, and 60 FPS polish.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/projects" className="btn btn-primary btn-lg">
                <span>Explore Projects</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                <span>Get In Touch</span>
              </Link>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <span>GitHub Profile</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </motion.div>

            {/* Metrics & Highlights Strip */}
            <motion.div
              className="hero-stats-strip"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="stat-card">
                <div className="stat-number">Flutter &amp; Dart</div>
                <div className="stat-label">Core Mobile Specialization</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">Hardware &amp; IoT</div>
                <div className="stat-label">Thermal Printers &amp; Voice POS</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">Riverpod &amp; Hive</div>
                <div className="stat-label">Deterministic &amp; Offline-First</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">React 19 &amp; Vite</div>
                <div className="stat-label">Expanding Web Architecture</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Architecture Principles Section
          ========================================================================= */}
      <section className="section-padding bg-surface" aria-label="Engineering Principles">
        <div className="container">
          <SectionTitle
            badge="Engineering Rigor"
            title="How I Build Software"
            subtitle="I approach both mobile apps and web platforms with architectural discipline, real-world fault tolerance, and zero-compromise UX."
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
        </div>
      </section>

      {/* =========================================================================
          Featured Projects Section
          ========================================================================= */}
      <section className="section-padding" aria-label="Featured Projects">
        <div className="container">
          <div className="section-header-flex">
            <SectionTitle
              badge="Selected Work"
              title="Featured Engineering Projects"
              subtitle="Real commercial mobile applications, hardware automation systems, and full-stack web platforms."
            />
            <Link to="/projects" className="btn btn-outline btn-sm desktop-only-btn">
              <span>View All Projects ({projects.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="projects-grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="center-actions mobile-only-btn" style={{ marginTop: 'var(--space-8)' }}>
            <Link to="/projects" className="btn btn-outline">
              <span>View All Projects ({projects.length})</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Skills Overview Snapshot
          ========================================================================= */}
      <section className="section-padding bg-surface" aria-label="Technical Skills Overview">
        <div className="container">
          <SectionTitle
            badge="Technical Toolkit"
            title="Core Technologies &amp; Capabilities"
            subtitle="Hands-on experience across the mobile and web stack, focused on tools with proven production value."
          />

          <div className="skills-overview-grid">
            {skillCategories.slice(0, 4).map((category, catIdx) => (
              <motion.div
                key={category.id}
                className="skill-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: catIdx * 0.08 }}
              >
                <div className="skill-card-header">
                  <Terminal size={18} className="text-accent" />
                  <h3 className="skill-card-title">{category.title}</h3>
                </div>
                <p className="skill-card-desc">{category.description}</p>
                <div className="skill-tags">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`badge ${skill.highlight ? 'badge-accent' : ''}`}
                      title={skill.note}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="center-actions" style={{ marginTop: 'var(--space-10)' }}>
            <Link to="/about" className="btn btn-secondary">
              <span>Learn More About My Journey &amp; Skills</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Call to Action Banner
          ========================================================================= */}
      <section className="cta-section" aria-label="Contact Call to Action">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <span className="section-badge">Ready to Collaborate</span>
              <h2 className="cta-title">
                Looking for an engineer who treats mobile &amp; web architecture seriously?
              </h2>
              <p className="cta-desc">
                Whether you need a Flutter specialist to build or scale your flagship application, integrate
                hardware peripherals, or engineer a responsive React web interface, let’s discuss how I can help.
              </p>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">
                  <span>Send a Message</span>
                  <ArrowRight size={18} />
                </Link>
                <a href={`mailto:${socialLinks.email}`} className="btn btn-outline btn-lg">
                  <span>{socialLinks.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
