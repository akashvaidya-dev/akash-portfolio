import { Mail } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { socialLinks } from '../data/socials';

/**
 * SocialLinks Component
 * Renders verified developer social channels and email action.
 */
function SocialLinks({ showLabels = false, className = '' }) {
  const links = [
    {
      name: 'GitHub',
      href: socialLinks.github,
      icon: Github,
      label: 'Visit GitHub Profile (akashvaidya-dev)',
    },
    {
      name: 'LinkedIn',
      href: socialLinks.linkedin,
      icon: Linkedin,
      label: 'Connect on LinkedIn (Akash Vaidya)',
    },
    {
      name: 'Email',
      href: `mailto:${socialLinks.email}`,
      icon: Mail,
      label: `Send email to ${socialLinks.email}`,
    },
  ];

  return (
    <div className={`social-links ${className}`} role="list" aria-label="Social links">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target={link.href.startsWith('mailto:') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className={showLabels ? 'btn btn-secondary btn-sm' : 'social-link-btn'}
            aria-label={link.label}
            role="listitem"
            title={link.label}
          >
            <Icon size={showLabels ? 16 : 18} aria-hidden="true" />
            {showLabels && <span>{link.name}</span>}
          </a>
        );
      })}
    </div>
  );
}

export default SocialLinks;
