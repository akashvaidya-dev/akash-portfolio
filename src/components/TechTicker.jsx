import { motion } from 'framer-motion';

const skillsTicker = [
  'Flutter & Dart',
  'ESC/POS Thermal Printing',
  'Riverpod State Architecture',
  'Voice POS Dictation',
  'Hive NoSQL Offline Cache',
  'React 19 & Vite',
  'GoRouter Deep-Linking',
  'WebSocket Live Inboxes',
  'Dio REST Networking',
  'Framer Motion',
  'Clean Architecture',
  'Smart India Hackathon',
];

export default function TechTicker() {
  return (
    <div className="ticker-container" aria-label="Core Technology Highlights">
      <div className="ticker-fade-left" />
      <div className="ticker-fade-right" />
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 25,
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
