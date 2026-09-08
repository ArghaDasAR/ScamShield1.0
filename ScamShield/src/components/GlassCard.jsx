import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, style = {} }) {
  return (
    <motion.div
      className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
      style={style}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
