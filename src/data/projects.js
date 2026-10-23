/**
 * Play Store apps — local screenshots + liveUrl.
 * Screenshots already include phone chrome; UI shows them flat.
 */

const play = (id) =>
  `https://play.google.com/store/apps/details?id=${id}`;

const shots = (folder, count = 6) =>
  Array.from({ length: count }, (_, i) => `/projects/${folder}/shot-${i + 1}.webp`);

export const projects = [
  {
    id: 'medipilot360-doctor',
    title: 'Medipilot360 Doctor',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Clinic doctor app — appointments, digital Rx, and instant print.',
    description:
      'Doctor app for clinic days: appointment dashboard, patient context, digital prescriptions, and printer output. Pairs with the receptionist app.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST', 'Printing'],
    liveUrl: play('com.medipilot360.doctor'),
    liveLabel: 'Play Store',
    icon: '/projects/medipilot360-doctor/icon.png',
    images: shots('medipilot360-doctor', 7),
  },
  {
    id: 'medipilot360-receptionist',
    title: 'Medipilot360 Receptionist',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Front-desk clinic app — book, track, and hand off to the doctor.',
    description:
      'Receptionist companion for Medipilot360: schedule appointments, manage the queue, and keep the doctor app in sync.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST'],
    liveUrl: play('com.medipilot360.receptionist'),
    liveLabel: 'Play Store',
    icon: '/projects/medipilot360-receptionist/icon.png',
    images: shots('medipilot360-receptionist'),
  },
  {
    id: 'tiffinmitra',
    title: 'Tiffin Mitra',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Tiffin ordering and delivery flows on Flutter.',
    description:
      'Customer-facing tiffin app for browsing plans, placing orders, and tracking delivery — built for day-to-day meal subscriptions.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST'],
    liveUrl: play('com.tiffinmitra.app'),
    liveLabel: 'Play Store',
    icon: '/projects/tiffinmitra/icon.png',
    images: shots('tiffinmitra'),
  },
  {
    id: 'student-leave',
    title: 'Student Leave App',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Students apply for leave and track approval status.',
    description:
      'School leave app for students: submit leave requests, attach reasons, and follow status until parent/school approval.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST'],
    liveUrl: play('com.rs.student_leave_app'),
    liveLabel: 'Play Store',
    icon: '/projects/student-leave/icon.png',
    images: shots('student-leave'),
  },
  {
    id: 'parent-leave',
    title: 'Parent Leave Approver',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Parents review and approve student leave requests.',
    description:
      'Companion app for parents: see pending leave requests from the student app and approve or reject with a clear audit trail.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST'],
    liveUrl: play('com.rs.parent_leave_approval_app'),
    liveLabel: 'Play Store',
    icon: '/projects/parent-leave/icon.png',
    images: shots('parent-leave'),
  },
  {
    id: 'trust-management',
    title: 'Trust Management',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Trust / society operations — members, records, and day-to-day admin.',
    description:
      'Mobile app for trust management workflows: members, records, and operational tools for day-to-day administration.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST'],
    liveUrl: play('com.trustmanagement'),
    liveLabel: 'Play Store',
    icon: '/projects/trust-management/icon.png',
    images: shots('trust-management'),
  },
  {
    id: 'even-pay',
    title: 'Even Pay',
    category: 'Mobile · Flutter',
    categoryFilter: 'mobile',
    featured: true,
    tagline: 'Payments app — clean flows for everyday transactions.',
    description:
      'Even Pay on Google Play: payment-focused Flutter app with practical screens for everyday money movement.',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST', 'Payments'],
    liveUrl: play('com.even_pay'),
    liveLabel: 'Play Store',
    icon: '/projects/even-pay/icon.png',
    images: shots('even-pay'),
  },
];
