import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RiskScore({ score, severity }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1200;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getTheme = (sev, sc) => {
    if (sev === 'CRITICAL' || sc >= 85) {
      return {
        color: '#EF4444',
        glowColor: 'rgba(239,68,68,0.5)',
        label: 'CRITICAL DANGER',
      };
    }
    if (sev === 'HIGH' || sc >= 70) {
      return {
        color: '#F97316',
        glowColor: 'rgba(249,115,22,0.5)',
        label: 'HIGH RISK',
      };
    }
    if (sev === 'SUSPICIOUS' || sc >= 55) {
      return {
        color: '#FBBF24',
        glowColor: 'rgba(251,191,36,0.5)',
        label: 'MAYBE SUSPICIOUS',
      };
    }
    if (sev === 'MODERATE' || sev === 'MEDIUM' || sc >= 35) {
      return {
        color: '#FCD34D',
        glowColor: 'rgba(252,211,77,0.4)',
        label: 'CAUTION ADVISED',
      };
    }
    return {
      color: '#10B981',
      glowColor: 'rgba(16,185,129,0.5)',
      label: 'LIKELY SAFE',
    };
  };

  const theme = getTheme(severity, score);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        {/* Progress ring */}
        <motion.circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={theme.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform="rotate(-90 70 70)"
          style={{ filter: `drop-shadow(0 0 8px ${theme.glowColor})` }}
        />
        {/* Score text */}
        <text x="70" y="65" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="Inter, sans-serif">
          {displayScore}%
        </text>
        <text x="70" y="84" textAnchor="middle" fill={theme.color} fontSize="8.5" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.8">
          {theme.label}
        </text>
      </svg>
    </div>
  );
}
