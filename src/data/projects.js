/**
 * Personal / public projects only. Client & office work stays off the site.
 */

export const projects = [
  {
    id: 'sih-fixly',
    title: 'Fixly — On-Demand Services (SIH)',
    category: 'Hackathon · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Role-based service marketplace I built for Smart India Hackathon.',
    description:
      'A Flutter app that connects customers and workers — bookings, reviews, live maps, payments, and video calling. Built under SIH timelines with a focus on clear flows and realtime updates.',
    tags: ['Flutter', 'Dart', 'BLoC', 'GoRouter', 'Mapbox', 'WebRTC', 'Razorpay', 'Socket.IO', 'Firebase'],
    githubUrl: null,
    liveUrl: null,
    isProprietary: false,
    metric: 'Customer + worker roles · maps · pay · video call',
    architecture: 'Flutter · BLoC · GoRouter · Mapbox · Socket.IO / WebRTC',
    problem:
      'On-demand help needs trusted booking, live location, payment, and a way to talk — in one mobile flow.',
    solution:
      'I built Fixly with separate customer/worker roles, Mapbox tracking, Razorpay checkout, Socket.IO updates, and WebRTC calling.',
    highlights: [
      'Bookings, payments, and reviews for both roles',
      'Mapbox live location and Socket.IO status updates',
      'WebRTC video calling and push notifications',
      'Secure storage and multilingual UI',
    ],
  },
  {
    id: 'portfolio-site',
    title: 'Personal Portfolio (this site)',
    category: 'Web · React',
    categoryFilter: 'web',
    featured: true,
    tagline: 'Hand-built React portfolio — pages, motion, and my own content.',
    description:
      'The site you are on now. React + Vite, custom CSS, Framer Motion where it helps, and copy I wrote about my Flutter work. No client repos, no fake case studies.',
    tags: ['React', 'Vite', 'JavaScript', 'CSS', 'Framer Motion', 'React Router'],
    githubUrl: 'https://github.com/arao62916-sys',
    liveUrl: null,
    isProprietary: false,
    metric: 'Custom UI · dark/light theme · project case cards',
    architecture: 'React SPA · Vite · CSS variables · React Router',
    problem: 'I needed a simple place to show who I am and what I can do with Flutter.',
    solution: 'Coded this portfolio myself — routes, theme, project cards, contact form.',
    highlights: [
      'Multi-page layout with React Router',
      'Theme tokens and responsive CSS',
      'Project detail modals and contact mailto flow',
    ],
  },
];
