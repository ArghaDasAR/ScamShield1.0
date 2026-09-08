import { motion } from 'framer-motion';
import { MessageSquare, Mail, Link, Zap, UserX, Building2, Gift, ChevronRight } from 'lucide-react';
import { demoScams } from '../data/demoScams';
import { useApp } from '../context/AppContext';

const iconMap = {
  zap: Zap,
  'user-x': UserX,
  mail: Mail,
  gift: Gift,
  'check-circle': Building2,
  link: Link,
};

const primaryExamples = [
  { id: 'electricity-scam', label: 'SMS / WhatsApp', desc: 'URGENT! Your electricity connection will be disconnected tonight...', icon: MessageSquare, color: '#EF4444' },
  { id: 'suspicious-website', label: 'Website (60% Suspicious)', desc: 'https://mega-discount-portal-sale2026.shop/checkout...', icon: Link, color: '#FBBF24' },
  { id: 'bank-alert', label: 'Email Phish', desc: 'Suspicious activity detected on your account...', icon: Mail, color: '#F97316' },
  { id: 'legitimate-bill', label: 'Legitimate Reminder', desc: 'Your electricity bill of ₹843 is due on 15th April...', icon: Building2, color: '#10B981' },
];

const quickExamples = [
  { id: 'electricity-scam', label: 'Electricity (94%)', color: '#EF4444' },
  { id: 'suspicious-website', label: 'Suspicious Site (60%)', color: '#FBBF24' },
  { id: 'kyc-scam', label: 'Fake KYC (78%)', color: '#F97316' },
  { id: 'legitimate-bill', label: 'Safe Bill (9%)', color: '#10B981' },
];

export default function ExampleInputs({ onSelect, activeTab, setActiveTab }) {
  const { setCurrentInput } = useApp();

  const handleSelect = (scamId) => {
    const scam = demoScams.find(s => s.id === scamId);
    if (!scam) return;

    const newInput = {
      type: scam.type,
      content: scam.content,
      imageUrl: null,
      sender: scam.sender || '',
      subject: scam.subject || '',
      demoId: scam.id,
    };
    setCurrentInput(newInput);

    // Switch to correct tab
    if (scam.type === 'message') setActiveTab('message');
    else if (scam.type === 'email') setActiveTab('email');
    else if (scam.type === 'url') setActiveTab('url');
    else if (scam.type === 'screenshot') setActiveTab('screenshot');

    if (onSelect) onSelect(newInput);
  };

  return (
    <div className="glass-card p-5">
      <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Example Inputs</h3>

      {/* Primary examples */}
      <div className="space-y-2.5 mb-4">
        {primaryExamples.map((ex, i) => {
          const Icon = ex.icon;
          return (
            <motion.button
              key={ex.id}
              onClick={() => handleSelect(ex.id)}
              whileHover={{ x: 2 }}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37,99,235,0.08)';
                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${ex.color}15`, border: `1px solid ${ex.color}30` }}>
                <Icon size={15} style={{ color: ex.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 mb-0.5">{ex.label}</p>
                <p className="text-xs text-slate-500 truncate leading-relaxed">{ex.desc}</p>
              </div>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 flex-shrink-0 mt-2 transition-colors" />
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-white/5 pt-4 mb-3">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">Quick Examples</p>
        <div className="grid grid-cols-2 gap-2">
          {quickExamples.map((ex) => (
            <motion.button
              key={ex.id}
              onClick={() => handleSelect(ex.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
              style={{
                background: `${ex.color}15`,
                border: `1px solid ${ex.color}30`,
                color: ex.color,
              }}
            >
              {ex.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
