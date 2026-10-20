/**
 * Journey: Diploma → B.Tech → Job (chronological).
 */

export const experienceTimeline = [
  {
    period: '2019 — 2021',
    role: 'Diploma in Computer Science (Polytechnic)',
    organization: 'JK Institute of Engineering, Bilaspur',
    badge: 'Diploma',
    description:
      'Polytechnic diploma in Computer Science — programming foundations, computer systems, and applied software projects. Score: 81%.',
    achievements: [
      'Completed diploma with 81%.',
      'Built early software and app projects during the program.',
      'Strong base in programming and problem-solving before B.Tech.',
    ],
    tech: ['C++', 'Java', 'HTML', 'CSS', 'Computer Science fundamentals'],
  },
  {
    period: '2022 — 2025',
    role: 'B.Tech — Computer Science & Engineering',
    organization: 'JK Institute of Engineering, Bilaspur',
    badge: 'B.Tech',
    description:
      'Bachelor of Technology in CSE while growing into Flutter / mobile development and industry-ready skills.',
    achievements: [
      'Studied core CS: data structures, OOP, networks, and software engineering.',
      'Focused on Flutter and Dart for Android & iOS apps.',
      'Combined college learning with real hands-on mobile work.',
    ],
    tech: ['Dart', 'Flutter', 'Java', 'C++', 'JavaScript'],
  },
  {
    period: '1.5 years · Present',
    role: 'Junior Software Developer — Flutter',
    organization: 'Industry experience (Android & iOS)',
    badge: 'Job',
    description:
      'About one and a half years building and shipping Flutter apps — UI, APIs, Firebase, maps, payments, push notifications, and release support.',
    achievements: [
      'Shipped cross-platform Flutter features from screens to store-ready builds.',
      'Integrated REST (Dio/HTTP), Firebase (Auth, FCM, Firestore, Crashlytics), maps, and payments.',
      'Used GetX, Riverpod, and BLoC depending on the app.',
      'Handled bugs, notifications, local storage, and day-to-day releases with the team.',
    ],
    tech: ['Flutter', 'Dart', 'GetX', 'Riverpod', 'BLoC', 'Dio', 'Firebase', 'Google Maps', 'Mapbox', 'Razorpay', 'Stripe'],
  },
];

export const engineeringPrinciples = [
  {
    title: 'Ship what works',
    subtitle: 'Real devices, real users',
    description:
      'I care that the app runs on a phone in someone’s hand — not just that the demo looks pretty. Android and iOS both matter.',
  },
  {
    title: 'Clear state',
    subtitle: 'GetX · Riverpod · BLoC',
    description:
      'Pick the state tool that fits the project. Keep screens thin and data flow easy to follow for the next person.',
  },
  {
    title: 'Wire it properly',
    subtitle: 'APIs · Firebase · maps · pay',
    description:
      'Most mobile work is integration. I hook up REST, Firebase, maps, payments, and push — and handle bad networks without panic.',
  },
  {
    title: 'Readable code',
    subtitle: 'Written for humans',
    description:
      'Names that make sense, small modules, no magic. Future-me (and teammates) should not need a treasure map.',
  },
];
