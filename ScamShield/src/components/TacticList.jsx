import { motion } from 'framer-motion';
import { ShieldAlert, Clock, AlertTriangle, CreditCard, Link, Globe, Key, Database, Zap, UserX } from 'lucide-react';

const iconMap = {
  'shield-alert': ShieldAlert,
  'clock': Clock,
  'alert-triangle': AlertTriangle,
  'credit-card': CreditCard,
  'link': Link,
  'globe': Globe,
  'key': Key,
  'database': Database,
  'zap': Zap,
  'user-x': UserX,
};

export default function TacticList({ tactics }) {
  if (!tactics || tactics.length === 0) return null;

  return (
    <div className="space-y-3">
      {tactics.map((tactic, i) => {
        const Icon = iconMap[tactic.icon] || AlertTriangle;
        const isRed = tactic.color === 'red';
        const isOrange = tactic.color === 'orange';
        const color = isRed ? '#EF4444' : isOrange ? '#F59E0B' : '#22C55E';
        const bg = isRed ? 'rgba(239,68,68,0.1)' : isOrange ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)';
        const border = isRed ? 'rgba(239,68,68,0.2)' : isOrange ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)';

        return (
          <motion.div
            key={tactic.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${color}20` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{tactic.name}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{tactic.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
