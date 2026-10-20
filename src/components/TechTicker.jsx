import { motion } from 'framer-motion';

const skillsTicker = [
  'Flutter & Dart',
  'GetX',
  'Riverpod',
  'BLoC',
  'GoRouter',
  'Dio & REST',
  'Firebase Auth',
  'FCM',
  'Firestore',
  'Google Maps',
  'Mapbox',
  'Razorpay',
  'Stripe',
  'Hive & Sqflite',
  'WebRTC',
  'Socket.IO',
  '1.5 years Flutter',
];

export default function TechTicker() {
  return (
    <div className="ticker-container" aria-label="Skills ticker">
      <div className="ticker-fade-left" />
      <div className="ticker-fade-right" />
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 28,
        }}
      >
        {[...skillsTicker, ...skillsTicker].map((item, idx) => (
          <div key={idx} className="ticker-item">
            <span className="ticker-bullet">//</span>
            <span className="ticker-text">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
