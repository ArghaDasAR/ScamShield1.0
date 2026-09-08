import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Brain, Shield, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload',
    desc: 'Upload a screenshot, message, email or URL.',
    color: '#3B82F6',
    bg: 'rgba(37,99,235,0.1)',
  },
  {
    number: '02',
    icon: Brain,
    title: 'Analyze',
    desc: 'AI examines language, intent, psychological signals and threat intelligence.',
    color: '#8B5CF6',
    bg: 'rgba(124,58,237,0.1)',
  },
  {
    number: '03',
    icon: Shield,
    title: 'Protect',
    desc: 'Receive a risk score and a recommended safe action.',
    color: '#22C55E',
    bg: 'rgba(22,163,74,0.1)',
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <div
      className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 100%)' }}
    >
      {/* Subtle background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10 py-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10 text-center sm:text-left"
        >
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">How It Works</p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">3 Simple Steps to Stay Safe</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            ScamShield uses AI to analyze messages, detect social engineering and give you clear, actionable advice.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="relative"
              >
                <div className="glass-card p-6 sm:p-7 h-full flex flex-col justify-between border border-blue-900/40">
                  <div>
                    <div className="text-4xl sm:text-5xl font-black mb-3"
                      style={{ color: `${step.color}30`, fontVariantNumeric: 'tabular-nums' }}>
                      {step.number}
                    </div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: step.bg, border: `1px solid ${step.color}25` }}>
                      <Icon size={22} style={{ color: step.color }} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Arrow connector */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={18} className="text-blue-500/50" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white shadow-xl transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 24px rgba(37,99,235,0.3)' }}
          >
            Try ScamShield Now
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
