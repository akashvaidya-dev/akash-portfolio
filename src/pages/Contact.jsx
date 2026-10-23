import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Copy, Check, AlertCircle, Info, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { Github, Linkedin } from '../components/Icons';
import { socialLinks } from '../data/socials';
import SectionTitle from '../components/SectionTitle';

/**
 * Contact Page Component
 * Direct REST API email transmission directly to Akash's inbox (FormSubmit / custom API endpoint),
 * with validation, loading indicator, real-time feedback, and fallback mail options.
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
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle' | 'success' | 'activation' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [lastSentDetails, setLastSentDetails] = useState(null);

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
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

  // Direct email delivery via REST API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setStatusMessage('');

    const senderName = formData.name.trim();
    const senderEmail = formData.email.trim();
    const messageSubject = formData.subject.trim();
    const messageContent = formData.message.trim();

    try {
      const endpoint =
        import.meta.env.VITE_CONTACT_ENDPOINT ||
        `https://formsubmit.co/ajax/${socialLinks.email}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          _subject: `[Portfolio Contact] ${messageSubject} - from ${senderName}`,
          subject: messageSubject,
          message: messageContent,
          _replyto: senderEmail,
          _captcha: 'false',
          _template: 'box',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true)) {
        setSubmissionStatus('success');
        setLastSentDetails({ name: senderName, email: senderEmail });
        setStatusMessage(
          `Your message has been directly sent to Akash (${socialLinks.email})! Akash will reply back to ${senderEmail} shortly.`
        );
        // Clear form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else if (
        data.message &&
        (data.message.toLowerCase().includes('activation') ||
          data.message.toLowerCase().includes('activate'))
      ) {
        setSubmissionStatus('activation');
        setStatusMessage(
          `FormSubmit requires one-time activation. A confirmation link has been sent to ${socialLinks.email}. Akash, please click 'Activate Form' in your email inbox once to enable continuous direct delivery!`
        );
      } else {
        setSubmissionStatus('error');
        setStatusMessage(
          data.message || 'Unable to send message directly at this moment. Please try again or use the fallback mail options.'
        );
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setSubmissionStatus('error');
      setStatusMessage(
        'Network request failed. Please check your internet connection or use the fallback mail button below.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback to local mail client if desired
  const handleLaunchEmailClient = () => {
    const subjectEncoded = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject || 'Hello Akash'}`);
    const bodyEncoded = encodeURIComponent(
      `Hello Akash,

Name: ${formData.name || 'Anonymous'}
Email: ${formData.email || 'Not specified'}

Message:
${formData.message || ''}
`
    );
    window.location.href = `mailto:${socialLinks.email}?subject=${subjectEncoded}&body=${bodyEncoded}`;
  };

  // Copy message payload to clipboard
  const handleCopyMessagePayload = () => {
    const payload = `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
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
                <h3 className="form-card-title">// Send a Message Directly</h3>
                <p className="form-card-desc">
                  Fill in your details below. Clicking "Send Message Directly" will deliver your message directly to Akash's email inbox ({socialLinks.email}) without opening your email client.
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="spin-loader" />
                          <span>Sending Message Directly...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Message Directly</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={handleCopyMessagePayload}
                      disabled={isSubmitting}
                    >
                      {copiedPayload ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                      <span>{copiedPayload ? 'Message Copied to Clipboard!' : 'Copy Message to Clipboard'}</span>
                    </button>
                  </div>
                </form>

                {/* Submission Feedback Banners */}
                {submissionStatus === 'success' && (
                  <motion.div
                    className="form-feedback-box feedback-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle2 size={18} className="text-accent" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>Message Sent Directly to Akash!</strong>
                      <p>
                        Thank you{lastSentDetails?.name ? `, ${lastSentDetails.name}` : ''}! Your message was successfully dispatched straight to <code>{socialLinks.email}</code>. Akash will review and reply to <code>{lastSentDetails?.email}</code> soon.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submissionStatus === 'activation' && (
                  <motion.div
                    className="form-feedback-box feedback-warning"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Info size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>First-Time Activation Notice</strong>
                      <p>{statusMessage}</p>
                    </div>
                  </motion.div>
                )}

                {submissionStatus === 'error' && (
                  <motion.div
                    className="form-feedback-box feedback-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>Delivery Notice</strong>
                      <p>{statusMessage}</p>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '8px' }}
                        onClick={handleLaunchEmailClient}
                      >
                        <Send size={14} />
                        <span>Open in Email App Instead</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Backend Delivery Notice */}
                <div className="form-backend-notice">
                  <Info size={14} className="text-muted" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p>
                    <strong>Direct Delivery:</strong> Form submissions are posted directly to{' '}
                    <code>{socialLinks.email}</code> via FormSubmit REST API without opening your local mail app. To point to an alternate endpoint, configure <code>VITE_CONTACT_ENDPOINT</code>.
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
