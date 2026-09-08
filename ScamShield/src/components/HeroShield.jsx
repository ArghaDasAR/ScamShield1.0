import { motion } from 'framer-motion';
import { MessageSquare, Mail, AlertTriangle, CreditCard, Link, Smartphone } from 'lucide-react';

const floatingCards = [
  { icon: MessageSquare, label: 'WhatsApp', color: '#22C55E', angle: -25, radius: 130, delay: 0, x: -145, y: -90 },
  { icon: Smartphone, label: 'SMS', color: '#3B82F6', angle: 20, radius: 120, delay: 0.4, x: 145, y: -70 },
  { icon: Mail, label: 'Email', color: '#8B5CF6', angle: -15, radius: 140, delay: 0.8, x: -130, y: 80 },
  { icon: AlertTriangle, label: 'Warning', color: '#EF4444', angle: 35, radius: 125, delay: 0.3, x: 140, y: 85 },
  { icon: CreditCard, label: 'Payment', color: '#F59E0B', angle: 0, radius: 155, delay: 0.6, x: 0, y: 160 },
  { icon: Link, label: 'Link', color: '#EC4899', angle: 10, radius: 145, delay: 1.0, x: 0, y: -165 },
];

export default function HeroShield() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 380, height: 380 }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
          border: '1px solid rgba(37, 99, 235, 0.15)',
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Second ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260, height: 260,
          border: '1px solid rgba(124, 58, 237, 0.2)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* Dot on ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500" />
      </motion.div>

      {/* Main shield SVG */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          filter: 'drop-shadow(0 0 40px rgba(37, 99, 235, 0.7)) drop-shadow(0 0 80px rgba(124, 58, 237, 0.4))',
        }}
      >
        <svg width="160" height="190" viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="160" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="shieldInner" x1="0" y1="0" x2="160" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="shieldGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Shield base shape */}
          <path
            d="M80 5 L150 35 L150 95 Q150 155 80 185 Q10 155 10 95 L10 35 Z"
            fill="url(#shieldGrad)"
            opacity="0.95"
          />

          {/* Shield inner highlight */}
          <path
            d="M80 18 L140 44 L140 95 Q140 148 80 173 Q20 148 20 95 L20 44 Z"
            fill="url(#shieldInner)"
          />

          {/* Shield top shine */}
          <path
            d="M80 18 L140 44 L140 65 Q125 55 80 52 Q35 55 20 65 L20 44 Z"
            fill="white"
            opacity="0.08"
          />

          {/* Lock icon */}
          <rect x="60" y="88" width="40" height="30" rx="4" fill="white" opacity="0.95" />
          <path d="M68 88 L68 82 Q68 68 80 68 Q92 68 92 82 L92 88" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.95" />
          <circle cx="80" cy="103" r="5" fill="#2563EB" />
          <rect x="78" y="103" width="4" height="8" rx="2" fill="#2563EB" />

          {/* Edge highlights */}
          <path
            d="M80 5 L150 35 L150 40 L80 10 L10 40 L10 35 Z"
            fill="white"
            opacity="0.2"
          />
        </svg>
      </motion.div>

      {/* Floating threat cards */}
      {floatingCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            className="absolute z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{
              left: `calc(50% + ${card.x}px)`,
              top: `calc(50% + ${card.y}px)`,
              transform: 'translate(-50%, -50%)',
              background: 'rgba(9, 24, 44, 0.9)',
              border: `1px solid ${card.color}40`,
              backdropFilter: 'blur(8px)',
              boxShadow: `0 4px 16px ${card.color}25`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { delay: card.delay, duration: 0.5 },
              scale: { delay: card.delay, duration: 0.5, type: 'spring' },
              y: { duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: card.delay * 2 },
            }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${card.color}20` }}
            >
              <Icon size={13} style={{ color: card.color }} />
            </div>
            <span className="text-xs font-medium text-slate-300 whitespace-nowrap">{card.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
