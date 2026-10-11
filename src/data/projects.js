/**
 * Real projects data based on Akash Vaidya's verified development work.
 * Highlights mobile engineering (Flutter/Dart), hardware integration (Thermal printers, Voice POS),
 * and modern web/CRM applications.
 */

export const projects = [
  {
    id: 'xtream-arena',
    title: 'Xtream Arena — Voice POS & Operations Portal',
    category: 'Mobile & Hardware',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Voice-directed restaurant order entry & ESC/POS hardware thermal receipt printing system.',
    description:
      'Engineered a staff operations and point-of-sale mobile application that accelerates order entry during peak restaurant rush hours. Features voice-to-text dictation for fast order item logging and automated receipt generation to ESC/POS thermal printers.',
    tags: ['Flutter', 'Dart', 'Riverpod', 'Dio', 'Speech-to-Text', 'Thermal Printer', 'GoRouter'],
    githubUrl: null,
    liveUrl: null,
    isProprietary: true,
    metric: '65% faster table ordering & instant Bluetooth/WiFi receipt dispatch',
    architecture: 'Unidirectional State Flow with Riverpod + Hardware ESC/POS Byte Stream Generator',
    problem:
      'In high-density dining spaces, waiter touch-navigation on traditional POS interfaces causes order bottlenecks, delayed kitchen tickets, and human data-entry errors.',
    solution:
      'Architected a hybrid speech-and-touch POS workflow. Waiters speak item names and table numbers, which are transcribed into structured cart items in real time, with immediate one-tap ESC/POS receipt printing.',
    highlights: [
      'Speech-to-text voice dictation engine tuned with customized restaurant menu vocabularies',
      'Direct binary ESC/POS command generator supporting Bluetooth & WiFi thermal printers',
      'Robust offline-ready Dio networking with automatic queue retry on reconnection',
      'Clean Riverpod state management ensuring reactive cart totals, taxes, and split-bill calculation',
    ],
  },
  {
    id: 'vedic-mitra',
    title: 'VedicMitra — Astrology & Consultation Platform',
    category: 'Mobile Application',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Multi-tenant client and consultant lifestyle ecosystem with low-latency caching.',
    description:
      'Production dual-audience mobile application serving both consultation seekers and verified practitioners. Implements declarative navigation, high-speed local caching with Hive, and interactive video streaming.',
    tags: ['Flutter', 'Hooks Riverpod', 'Hive', 'Dio', 'GoRouter', 'Shimmer', 'Video Player'],
    githubUrl: 'https://github.com/arao62916-sys/VedicMitra',
    liveUrl: null,
    isProprietary: false,
    metric: 'Sub-100ms screen transitions & 100% offline profile accessibility via Hive',
    architecture: 'Declarative GoRouter + Hive Local Cache + Hooks Riverpod State Layer',
    problem:
      'Consultation users experience flaky network connections when browsing profiles, viewing video intros, or checking consultant availability.',
    solution:
      'Designed an offline-first architecture with Hive for instant key-value and object caching, paired with skeleton shimmer loading states and resilient video playback buffering.',
    highlights: [
      'Declarative deep-linking navigation powered by GoRouter with type-safe parameters',
      'High-speed NoSQL local persistence with Hive for zero-latency offline schedule lookups',
      'Customized video player controllers with graceful buffering and playback states',
      'Clean Riverpod architecture separating data repositories, DTO mappers, and UI hooks',
    ],
  },
  {
    id: 'whatsapp-crm',
    title: 'WhatsApp CRM & Multi-Agent Inbox',
    category: 'Web & Fullstack',
    categoryFilter: 'web',
    featured: true,
    tagline: 'Enterprise web CRM for unified team inboxes and automated WhatsApp business workflows.',
    description:
      'A multi-user web customer communication portal integrating WhatsApp Business Cloud API. Supports synchronized multi-agent inboxes, automated message sequences, ticket routing, and campaign analytics.',
    tags: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'WhatsApp API', 'Tailwind CSS'],
    githubUrl: null,
    liveUrl: null,
    isProprietary: true,
    metric: 'Real-time multi-agent conversation routing with WebSocket sync',
    architecture: 'React Component Hierarchy + WebSocket Bi-Directional Event Stream + REST Webhooks',
    problem:
      'Growing businesses handling customer inquiries via personal phones suffer from lost leads, no response tracking, and lack of team accountability.',
    solution:
      'Developed a centralized desktop web application allowing multiple team agents to handle customer chats simultaneously, with automated status tagging and quick-reply templates.',
    highlights: [
      'Real-time WebSocket chat synchronization with automatic reconnection and delivery receipts',
      'Clean split-pane conversation interface with search, tag filters, and customer detail cards',
      'Automated campaign dispatch workers with delivery status verification',
      'Role-based permissions for support agents and supervisors',
    ],
  },
  {
    id: 'clinic-management',
    title: 'Clinic Management — Doctor & Frontdesk Suite',
    category: 'Mobile & Healthcare',
    categoryFilter: 'mobile',
    featured: false,
    tagline: 'Coordinated healthcare operations suite for patient triage and digital prescriptions.',
    description:
      'A two-application operational ecosystem for outpatient clinics. The frontdesk app manages intake, patient queues, and billing; the doctor app provides instantaneous medical history and digital prescription generation.',
    tags: ['Flutter', 'Riverpod', 'REST API', 'SQLite', 'Print Service', 'Role Auth'],
    githubUrl: null,
    liveUrl: null,
    isProprietary: true,
    metric: 'Streamlined waiting room triage & eliminated paper prescription loss',
    architecture: 'Micro-App Pattern + Shared Healthcare REST API + SQLite Local Storage',
    problem:
      'Clinic front desks struggle with waiting-room crowding while doctors lose time deciphering handwritten records or re-entering patient histories.',
    solution:
      'Built a synchronized dual-app workflow where patient registration instantly reflects on the doctor examination queue, enabling one-click digital prescriptions with formatted print outputs.',
    highlights: [
      'Role-based secure authentication isolating medical records from administrative billing',
      'Real-time queue monitoring with optimistic UI updates and live patient token calling',
      'Formatted prescription template rendering ready for wireless printing',
      'Local SQLite database caching for rapid offline patient search',
    ],
  },
  {
    id: 'digislips',
    title: 'DigiSlips — School Circular & Parent Consent Suite',
    category: 'Mobile Application',
    categoryFilter: 'mobile',
    featured: false,
    tagline: 'Paperless school circular distribution with digital signatures and parent verification.',
    description:
      'Mobile communication ecosystem replacing physical school permission slips with cryptographic digital acknowledgement signatures, real-time push alerts, and administrative status dashboards.',
    tags: ['Flutter', 'FCM Push Notifications', 'Digital Signatures', 'REST API'],
    githubUrl: null,
    liveUrl: null,
    isProprietary: true,
    metric: '98% consent return rate within 24 hours of notification broadcast',
    architecture: 'Event-Driven Push Notifications + Flutter Canvas Signature Engine',
    problem:
      'Physical paper slips for excursions and school circulars had high loss rates, forged signatures, and required days of manual administrative collection.',
    solution:
      'Implemented dedicated Parent and Student apps with high-priority FCM notifications, allowing parents to review circulars and sign consent forms directly on glass.',
    highlights: [
      'Touch-canvas signature capture with timestamped cryptographic verification',
      'FCM push notification integration with delivery tracking and reminder nudges',
      'Secure document viewer with offline PDF caching',
    ],
  },
  {
    id: 'sih-fixly',
    title: 'SIH Fixly — Civic Grievance & Municipality Tracker',
    category: 'Mobile & Civic Tech',
    categoryFilter: 'mobile',
    featured: false,
    tagline: 'Smart India Hackathon project for geotagged civic issue reporting & audit trails.',
    description:
      'Civic engagement application created for Smart India Hackathon. Allows citizens to document public infrastructure defects (potholes, water leaks, sanitation) with geotagged photo proof and track municipal resolution in real time.',
    tags: ['Flutter', 'GPS Geolocation', 'Camera Hardware', 'REST API', 'Dart'],
    githubUrl: null,
    liveUrl: null,
    isProprietary: false,
    metric: 'Smart India Hackathon project featuring automated GPS verification & audit trails',
    architecture: 'Hardware Sensors + Image Compression Pipeline + REST Audit API',
    problem:
      'Citizen complaints to city councils lack precise geolocation, photos, or verifiable tracking, resulting in neglected public infrastructure repairs.',
    solution:
      'Built an accessible mobile report flow requiring device camera capture with locked GPS coordinates, rendering an immutable progress timeline from submission to resolution.',
    highlights: [
      'Device camera and GPS sensor synchronization with automated EXIF coordinate embedding',
      'Client-side image compression reducing payload size by 70% for low-bandwidth mobile connections',
      'Interactive multi-stage resolution timeline for public transparency',
    ],
  },
];
