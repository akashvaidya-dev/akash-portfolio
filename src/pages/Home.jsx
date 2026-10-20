import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';
import { engineeringPrinciples } from '../data/experience';
import { socialLinks } from '../data/socials';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';
import CodePlayground from '../components/CodePlayground';
import TechTicker from '../components/TechTicker';
import ThemePlayground from '../components/ThemePlayground';
import BugDeathNote from '../components/BugDeathNote';
import Hero3DExperience from '../components/Hero3DExperience';

const rotatingRoles = [
  'Flutter Developer',
  'Android & iOS',
  'Firebase · Dio · Maps',
  'GetX · Riverpod · BLoC',
];

/** Home — simple intro, personal projects only. */
function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const featuredProjects = projects.filter((p) => p.featured);

  // Auto-rotate role title every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-wrapper home-page">
      {/* =========================================================================
          Hero Section
          ========================================================================= */}
      <section className="hero-section" aria-label="Introduction">
        <div className="container">
          <div className="hero-split-grid">
            <div className="hero-content hero-content-split">
            {/* Availability Status Badge */}
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

            {/* Main Headline with Animated Rotating Role */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Hi — I build <span className="text-gradient">Flutter</span> apps for Android &amp; iOS
            </motion.h1>

            {/* Dynamic Animated Role Badge */}
            <motion.div
              className="hero-role-ticker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="role-prefix">// Focus: </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingRoles[roleIndex]}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="role-highlight"
                >
                  {rotatingRoles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Subtitle / Positioning */}
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              I am <strong className="text-primary-light">Akash Vaidya</strong> — a{' '}
              <span className="text-accent">Junior Software Developer</span> with{' '}
              <strong>1.5 years</strong> of Flutter experience. I write Dart every day: screens,
              REST APIs, Firebase, maps, payments, and push notifications. This site is handmade —
              just my personal / public work (client apps stay private).
            </motion.p>

            {/* Primary Calls to Action */}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
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

            {/* Quick Metrics / Proof Points */}
            <motion.div
              className="hero-stats-strip"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div className="stat-card">
                <div className="stat-number">1.5 years</div>
                <div className="stat-label">Junior Flutter Developer</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">Flutter &amp; Dart</div>
                <div className="stat-label">Android &amp; iOS</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">Firebase</div>
                <div className="stat-label">Auth · FCM · Firestore</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">State</div>
                <div className="stat-label">GetX · Riverpod · BLoC</div>
              </div>
            </motion.div>
            </div>

            {/* Interactive 3D Room & Developer Workspace Experience */}
            <motion.div
              className="hero-photo-column"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Hero3DExperience />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Animated Tech Marquee */}
      <TechTicker />

      {/* =========================================================================
          Interactive Code & Architecture Showcase
          ========================================================================= */}
      <section className="section-padding bg-surface" aria-label="Interactive Code & Architecture">
        <div className="container">
          <SectionTitle
            badge="Code"
            title="A few patterns I use"
            subtitle="Small playgrounds — state, networking ideas, nothing fancy. I wrote this site myself."
            align="center"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 960, margin: '0 auto' }}
          >
            <CodePlayground />
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          Adaptive Design System & Theme Playground
          ========================================================================= */}
      <ThemePlayground />

      {/* =========================================================================
          Engineering Principles Section
          ========================================================================= */}
      <section className="section-padding" aria-label="Engineering Principles">
        <div className="container">
          <SectionTitle
            badge="How I work"
            title="Simple rules I try to follow"
            subtitle="Ship on real phones, keep state clear, wire APIs carefully, write code people can read."
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
          Death Note — The Bug Log
          ========================================================================= */}
      <BugDeathNote />

      {/* =========================================================================
          Featured Projects Section
          ========================================================================= */}
      <section className="section-padding bg-surface" aria-label="Featured Projects">
        <div className="container">
          <div className="section-header-flex">
            <SectionTitle
              badge="Projects"
              title="Personal &amp; public work"
              subtitle="Only things I can show here. Client / office apps are not listed."
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
      <section className="section-padding" aria-label="Technical Skills Overview">
        <div className="container">
          <SectionTitle
            badge="Skills"
            title="What I use in Flutter"
            subtitle="Full stack I work with — state, Firebase, maps, payments, storage, and tools."
          />

          <div className="skills-overview-grid">
            {skillCategories.map((category, catIdx) => (
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
              <span className="section-badge">Say hello</span>
              <h2 className="cta-title">
                Need a junior Flutter developer on your team?
              </h2>
              <p className="cta-desc">
                1.5 years building Android &amp; iOS apps with Dart, Firebase, and clean state
                management. Happy to talk about roles or freelance Flutter work.
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
