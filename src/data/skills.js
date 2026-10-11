/**
 * Skills Data Structure
 * Categorized technical competencies based on verified Flutter, mobile,
 * hardware integration, and React web development experience.
 */

export const skillCategories = [
  {
    id: 'mobile-core',
    title: 'Mobile & Flutter Engineering',
    description: 'Production mobile application development for Android and iOS using Flutter and Dart',
    skills: [
      { name: 'Flutter', category: 'Framework', highlight: true, note: 'Cross-platform mobile apps for Android & iOS' },
      { name: 'Dart', category: 'Language', highlight: true, note: 'Object-oriented, sound null-safety, asynchronous streams' },
      { name: 'Platform Channels', category: 'Native', highlight: true, note: 'Bridging native Android (Kotlin/Java) & iOS (Swift)' },
      { name: 'Custom UI & Animations', category: 'UI', highlight: true, note: 'Canvas painters, implicit & explicit animations' },
      { name: 'Responsive Layouts', category: 'Layout', highlight: false, note: 'Adaptive layouts for mobile, tablets, and kiosks' },
      { name: 'App Lifecycle & Permissions', category: 'System', highlight: false, note: 'Background execution, camera, microphone, GPS' },
    ],
  },
  {
    id: 'state-architecture',
    title: 'State Management & Architecture',
    description: 'Deterministic state coordination and scalable architectural patterns',
    skills: [
      { name: 'Riverpod & Hooks Riverpod', category: 'State', highlight: true, note: 'Compile-safe, decoupled state providers & hooks' },
      { name: 'BLoC / Cubit', category: 'State', highlight: true, note: 'Stream-based predictable state machines' },
      { name: 'Clean Architecture', category: 'Architecture', highlight: true, note: 'Separation of Presentation, Domain & Data layers' },
      { name: 'Repository Pattern', category: 'Design Pattern', highlight: false, note: 'Abstracting data sources and local caches' },
      { name: 'GoRouter', category: 'Routing', highlight: true, note: 'Declarative routing, deep-linking & route guards' },
    ],
  },
  {
    id: 'hardware-iot',
    title: 'Hardware & Device Integrations',
    description: 'Interfacing mobile devices with physical hardware peripherals and sensors',
    skills: [
      { name: 'Thermal Receipt Printers', category: 'Hardware', highlight: true, note: 'ESC/POS binary command streams via Bluetooth & WiFi' },
      { name: 'Speech-to-Text & Audio', category: 'Voice', highlight: true, note: 'Real-time voice dictation for hands-free POS input' },
      { name: 'Camera & Image Processing', category: 'Sensors', highlight: true, note: 'Client-side image compression, EXIF tagging' },
      { name: 'Bluetooth & Connectivity', category: 'Peripherals', highlight: false, note: 'Peripheral discovery and byte stream protocols' },
      { name: 'GPS & Geolocation', category: 'Sensors', highlight: false, note: 'High-accuracy location capture and geofencing' },
    ],
  },
  {
    id: 'networking-storage',
    title: 'Networking, Cloud & Persistence',
    description: 'API communications, offline synchronization, and embedded databases',
    skills: [
      { name: 'Dio & REST APIs', category: 'Networking', highlight: true, note: 'Interceptors, automatic token refresh & retry queues' },
      { name: 'Hive NoSQL Cache', category: 'Storage', highlight: true, note: 'Ultra-fast key-value & binary object local caching' },
      { name: 'SQLite / Drift', category: 'Database', highlight: false, note: 'Relational local databases and schema migrations' },
      { name: 'Firebase & FCM', category: 'Cloud', highlight: true, note: 'High-priority push notifications & authentication' },
      { name: 'WebSockets', category: 'Real-time', highlight: false, note: 'Bi-directional live communication for chat and order sync' },
    ],
  },
  {
    id: 'web-frontend',
    title: 'Modern Web & React',
    description: 'Expanding mobile engineering discipline into modern web development',
    skills: [
      { name: 'React 19', category: 'Library', highlight: true, note: 'Component composition, hooks, performance memoization' },
      { name: 'JavaScript (ES6+)', category: 'Language', highlight: true, note: 'Async/await, closures, modern array pipelines' },
      { name: 'Vite', category: 'Build Tool', highlight: true, note: 'Lightning-fast dev server and optimized production bundles' },
      { name: 'React Router DOM', category: 'Routing', highlight: true, note: 'Declarative client-side SPA routing and navigation' },
      { name: 'Framer Motion', category: 'Animation', highlight: true, note: 'Physics-based micro-interactions and transitions' },
      { name: 'HTML5 & Modern CSS', category: 'Core Web', highlight: true, note: 'CSS Grid, Flexbox, custom properties, responsive layout' },
    ],
  },
  {
    id: 'tools-devops',
    title: 'Tooling, Quality & Deployment',
    description: 'Engineering workflows, version control, build pipelines, and quality assurance',
    skills: [
      { name: 'Git & GitHub', category: 'VCS', highlight: true, note: 'Feature branches, PR reviews, merge workflows' },
      { name: 'Android Studio & Gradle', category: 'IDE/Build', highlight: true, note: 'Android SDK, build optimization, bundle generation' },
      { name: 'VS Code', category: 'Editor', highlight: false, note: 'Productive development, debugging configurations' },
      { name: 'Vercel Deployment', category: 'Hosting', highlight: true, note: 'Automated CI/CD deployments and SPA routing configs' },
      { name: 'ESLint & Code Standards', category: 'Linting', highlight: false, note: 'Static code analysis and React hook safety' },
      { name: 'Performance Profiling', category: 'Optimization', highlight: true, note: 'Flutter DevTools, Chrome DevTools, zero-jank frame rates' },
    ],
  },
];
