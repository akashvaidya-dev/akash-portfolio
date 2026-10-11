/**
 * Professional experience, journey, and engineering principles.
 * Accurately represents Flutter mobile engineering and expansion into React web.
 */

export const experienceTimeline = [
  {
    period: 'Current / Recent',
    role: 'Senior Flutter & Mobile Application Developer',
    organization: 'Client Solutions & Enterprise Products',
    badge: 'Mobile Specialist',
    description:
      'Architected and delivered multiple commercial Flutter applications spanning retail POS, healthcare operations, and consultation marketplaces. Specialized in complex hardware integrations, custom audio/voice pipelines, and deterministic state management.',
    achievements: [
      'Engineered Xtream Arena: hybrid voice-dictation and touch POS system with ESC/POS thermal printing.',
      'Developed VedicMitra: dual-audience mobile app with Hive offline caching and declarative GoRouter navigation.',
      'Created Clinic Management suite: doctor and reception apps coordinating patient intake and digital prescriptions.',
      'Integrated physical Bluetooth & WiFi thermal printers using direct binary ESC/POS command streams.',
    ],
    tech: ['Flutter', 'Dart', 'Riverpod', 'Dio', 'Hive', 'Speech-to-Text', 'Thermal Printers'],
  },
  {
    period: 'Recent',
    role: 'Modern Web & Frontend Development',
    organization: 'React & Web Architecture Expansion',
    badge: 'Web Expansion',
    description:
      'Applying mobile engineering rigors (deterministic state, clean architecture, performance optimization) to modern web applications. Building responsive SPAs with React 19, Vite, and WebSocket real-time architectures.',
    achievements: [
      'Built multi-agent WhatsApp CRM web dashboard with real-time WebSocket communication.',
      'Engineered production-grade developer portfolio with React 19, Framer Motion, and custom design tokens.',
      'Implemented clean component hierarchies, accessible keyboard navigation, and responsive CSS Grid/Flexbox layouts.',
    ],
    tech: ['React 19', 'JavaScript (ES6+)', 'Vite', 'React Router', 'Framer Motion', 'Modern CSS'],
  },
  {
    period: 'Milestone',
    role: 'Project Lead & Mobile Developer',
    organization: 'Smart India Hackathon (SIH)',
    badge: 'Hackathon Innovation',
    description:
      'Designed and developed SIH-Fixly, a civic infrastructure reporting platform enabling citizens to report public defects with tamper-resistant geotagged camera verification.',
    achievements: [
      'Integrated on-device camera hardware and GPS location sensors to bind tamper-proof EXIF coordinates.',
      'Designed client-side image compression pipeline cutting upload bandwidth by over 70%.',
      'Built interactive multi-stage municipal ticket lifecycle tracking interface.',
    ],
    tech: ['Flutter', 'Dart', 'GPS / Geolocation', 'Camera API', 'REST API'],
  },
];

export const engineeringPrinciples = [
  {
    title: 'Architecture Over Shortcuts',
    subtitle: 'Strict Separation of Concerns',
    description:
      'Whether using Riverpod in Flutter or modular components in React, I isolate presentation from business logic and data persistence. This guarantees that features remain testable, refactorable, and bug-resistant.',
  },
  {
    title: 'Hardware-Software Synergy',
    subtitle: 'Real-World Peripheral Reliability',
    description:
      'Software is only as good as its real-world performance. Having integrated thermal printers, microphones, and sensors, I build resilient error handlers, buffer streams, and reconnect logic for unpredictable environments.',
  },
  {
    title: 'Performance & 60 FPS Fluidity',
    subtitle: 'Zero-Jank User Interfaces',
    description:
      'A great app feels weightless. I eliminate unnecessary re-renders, leverage skeleton shimmer loaders, implement lightweight physics animations, and benchmark frame budgets rigorously.',
  },
  {
    title: 'Honest, Craftsmanship-Driven Code',
    subtitle: 'Production-Ready Maintainability',
    description:
      'No boilerplate spaghetti or blind library imports. Every package in package.json and pubspec.yaml has a clear purpose. Code is written for clarity, maintainability, and longevity.',
  },
];
