import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Play, Shield, Brain, CheckCircle, ArrowRight, Scan, Lock } from 'lucide-react';
import HeroShield from '../components/HeroShield';
import Footer from '../components/Footer';

const features = [
  {
    icon: Scan,
    title: 'Detects',
    desc: 'Scams in messages, screenshots, emails & URLs',
    color: '#3B82F6',
    bg: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.2)',
  },
  {
    icon: Brain,
    title: 'Analyzes',
    desc: 'Psychological manipulation such as authority, urgency & threats',
    color: '#8B5CF6',
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.2)',
  },
  {
    icon: CheckCircle,
    title: 'Provides',
    desc: 'Risk scores and clear safety recommendations',
    color: '#22C55E',
    bg: 'rgba(22,163,74,0.1)',
    border: 'rgba(22,163,74,0.2)',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 50%, #020817 100%)' }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left column */}
            <div>
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">AI Powered. Human Focused.</span>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-2 text-white tracking-tight">
                  ScamShield
                </h1>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 60%, #A78BFA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  Think Before<br />You Click.
                </h2>
              </motion.div>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl"
              >
                An AI-powered security copilot that detects social engineering, analyzes suspicious messages,
                and warns you before you make a risky decision.
              </motion.p>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  onClick={() => navigate('/analyze')}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                    boxShadow: '0 4px 24px rgba(37,99,235,0.35)',
                  }}
                  id="upload-message-btn"
                >
                  <Upload size={18} />
                  Upload Message
                </motion.button>

                <motion.button
                  onClick={() => navigate('/how-it-works')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-300 border border-slate-700/50 hover:border-blue-500/50 hover:text-white transition-all duration-200"
                >
                  <Play size={16} className="text-blue-400" />
                  How It Works
                </motion.button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="flex items-center gap-5 mt-8"
              >
                {[
                  { icon: Lock, text: 'Privacy First' },
                  { icon: Shield, text: 'AI Protected' },
                  { icon: CheckCircle, text: 'Free to Use' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={13} className="text-blue-400/70" />
                    <span className="text-xs text-slate-500">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column — Shield */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <HeroShield />
            </motion.div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-6"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How it works teaser */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 sm:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.06))' }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Something feels off? <span className="gradient-text">Check before you click.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
              Don't let urgency make the decision for you. ScamShield's behavioral AI analyzes
              the psychological patterns behind scams — not just malicious links.
            </p>
            <motion.button
              onClick={() => navigate('/analyze')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              Analyze a Message
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </section>
      </div>

      {/* Multi-column Reference Footer (Zerodha styled layout, tailored for ScamShield) */}
      <Footer />
    </div>
  );
}
