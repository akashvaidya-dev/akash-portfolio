import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Copy, Check, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Github, Linkedin } from '../components/Icons';
import { socialLinks } from '../data/socials';
import SectionTitle from '../components/SectionTitle';

/**
 * Contact Page Component
 * Validated contact form with direct mailto generation, clipboard payload helper,
 * verified direct contact channels, and honest configuration notice.
 */
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submittedMode, setSubmittedMode] = useState(null); // 'mailto' | 'copied' | null

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      newErrors.subject = 'Please specify a subject (at least 3 characters).';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please write a message with at least 10 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socialLinks.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Construct mailto link with pre-filled fields
    const subjectEncoded = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject}`);
    const bodyEncoded = encodeURIComponent(
      `Hello Akash,

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
`
    );
    const mailtoUrl = `mailto:${socialLinks.email}?subject=${subjectEncoded}&body=${bodyEncoded}`;

    // Open user's default email client
    window.location.href = mailtoUrl;
    setSubmittedMode('mailto');
  };

  const handleCopyMessagePayload = () => {
    const payload = `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;
    navigator.clipboard.writeText(payload);
    setSubmittedMode('copied');
  };

  return (
    <div className="page-wrapper contact-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="container">
          <SectionTitle
            badge="Get in Touch"
            title="Start a Conversation"
            subtitle="Junior Flutter developer · 1.5 years · Bilaspur, Chhattisgarh, India"
          />
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details & Channels Column */}
            <div className="contact-info-col">
              <h3 className="contact-col-title">// Direct Channels</h3>
              <p className="contact-info-desc">
                Feel free to reach out directly via email or check my GitHub repositories. I typically respond within
                24 hours on weekdays.
              </p>

              <div className="contact-channels-list">
                {/* Email Channel */}
                <div className="contact-channel-card">
                  <div className="channel-icon-wrap">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div className="channel-body">
                    <span className="channel-label">Direct Email</span>
                    <a href={`mailto:${socialLinks.email}`} className="channel-value text-accent">
                      {socialLinks.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm copy-btn"
                    onClick={handleCopyEmail}
                    title="Copy email to clipboard"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* GitHub Channel */}
                <div className="contact-channel-card">
                  <div className="channel-icon-wrap">
                    <Github size={20} className="text-accent" />
                  </div>
                  <div className="channel-body">
                    <span className="channel-label">GitHub Profile</span>
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="channel-value"
                    >
                      {socialLinks.handle}
                    </a>
                  </div>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink size={14} />
                    <span>View</span>
                  </a>
                </div>

                {/* LinkedIn Channel */}
                <div className="contact-channel-card">
                  <div className="channel-icon-wrap">
                    <Linkedin size={20} className="text-accent" />
                  </div>
                  <div className="channel-body">
                    <span className="channel-label">LinkedIn</span>
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="channel-value"
                    >
                      Akash Vaidya
                    </a>
                  </div>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink size={14} />
                    <span>Connect</span>
                  </a>
                </div>
              </div>

              {/* Status Note */}
              <div className="contact-status-card">
                <span className="pulsing-dot" aria-hidden="true" />
                <div>
                  <strong>Current Status:</strong>
                  <p>{socialLinks.availability}</p>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form Column */}
            <div className="contact-form-col">
              <div className="contact-form-card">
                <h3 className="form-card-title">// Send a Message</h3>
                <p className="form-card-desc">
                  Fill in your details below. Clicking "Launch in Email Client" will format your message and open your
                  default mail application directly.
                </p>

                <form onSubmit={handleSubmit} noValidate className="contact-form">
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Your Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Sarah Connor"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'input-error' : ''}`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      required
                    />
                    {errors.name && (
                      <span id="name-error" className="error-text">
                        <AlertCircle size={13} /> {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      required
                    />
                    {errors.email && (
                      <span id="email-error" className="error-text">
                        <AlertCircle size={13} /> {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="e.g. Flutter mobile app architecture discussion"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`form-input ${errors.subject ? 'input-error' : ''}`}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      required
                    />
                    {errors.subject && (
                      <span id="subject-error" className="error-text">
                        <AlertCircle size={13} /> {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project, timeline, tech requirements, or role details..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      required
                    />
                    {errors.message && (
                      <span id="message-error" className="error-text">
                        <AlertCircle size={13} /> {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-block">
                      <Send size={16} />
                      <span>Launch in Email Client</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={handleCopyMessagePayload}
                    >
                      <Copy size={16} />
                      <span>Copy Message to Clipboard</span>
                    </button>
                  </div>
                </form>

                {/* Submission Feedback Banners */}
                {submittedMode === 'mailto' && (
                  <motion.div
                    className="form-feedback-box feedback-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Info size={16} className="text-accent" />
                    <div>
                      <strong>Mail client triggered!</strong>
                      <p>
                        Your default email software opened with this message prefilled. If it didn't open, you can copy the
                        message above and email directly to <code>{socialLinks.email}</code>.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submittedMode === 'copied' && (
                  <motion.div
                    className="form-feedback-box feedback-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Check size={16} className="text-accent" />
                    <div>
                      <strong>Message text copied to clipboard!</strong>
                      <p>
                        You can now paste it into your email provider or messaging platform and send it to{' '}
                        <code>{socialLinks.email}</code>.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Backend Delivery Notice */}
                <div className="form-backend-notice">
                  <Info size={14} className="text-muted" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p>
                    <strong>Architecture Note:</strong> This static frontend generates client-verified mailto payloads
                    without pretending to send backend requests. To integrate an automated API gateway (e.g. Resend,
                    EmailJS, or Formspree), supply a <code>VITE_CONTACT_ENDPOINT</code> environment variable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
