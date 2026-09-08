import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  BrainCircuit, 
  SearchCode, 
  ScanLine, 
  LockKeyhole, 
  Gauge, 
  Zap, 
  DatabaseZap, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const featureList = [
  {
    icon: ScanLine,
    title: 'Multi-Channel Threat Ingestion',
    category: 'Ingestion & OCR',
    color: '#3B82F6',
    border: 'rgba(59, 130, 246, 0.3)',
    bg: 'rgba(59, 130, 246, 0.08)',
    description:
      'Seamlessly analyze screenshots of messages, raw SMS texts, WhatsApp forwards, phishing emails, and suspicious URLs in a unified scanner.',
    tags: ['Vision OCR', 'URL Parsing', 'Raw Text'],
  },
  {
    icon: BrainCircuit,
    title: 'Behavioral & Psychological Profiling',
    category: 'Cognitive AI',
    color: '#8B5CF6',
    border: 'rgba(139, 92, 246, 0.3)',
    bg: 'rgba(139, 92, 246, 0.08)',
    description:
      'Detects manipulative social engineering vectors including manufactured urgency, authority impersonation, extortion, and artificial FOMO cues.',
    tags: ['Urgency Triggers', 'Authority Spoof', 'Threat Signals'],
  },
  {
    icon: Gauge,
    title: 'Dynamic Risk Engine (0-100%)',
    category: 'Risk Scoring',
    color: '#EF4444',
    border: 'rgba(239, 68, 68, 0.3)',
    bg: 'rgba(239, 68, 68, 0.08)',
    description:
      'Calculates a weighted threat score powered by deep linguistic patterns, known scam taxonomy matching, and heuristic indicators.',
    tags: ['Likelihood Rating', 'Confidence Score', 'Severity Matrix'],
  },
  {
    icon: SearchCode,
    title: 'Domain & Typosquatting Verification',
    category: 'Network Intel',
    color: '#10B981',
    border: 'rgba(16, 185, 129, 0.3)',
    bg: 'rgba(16, 185, 129, 0.08)',
    description:
      'Unmasks deceptive lookalike domains (e.g. sbi-secure-update.com), HTTP-based credential harvesting traps, and short-link redirects.',
    tags: ['Homograph Detection', 'TLD Reputation', 'Redirect Tracker'],
  },
  {
    icon: ShieldAlert,
    title: 'Actionable Defensive Guidance',
    category: 'Mitigation',
    color: '#F59E0B',
    border: 'rgba(245, 158, 11, 0.3)',
    bg: 'rgba(245, 158, 11, 0.08)',
    description:
      'Provides step-by-step containment strategies: what numbers to block, how to freeze compromised cards, and where to submit official cybercrime reports.',
    tags: ['Next Steps', 'Dispute Advice', 'Containment'],
  },
  {
    icon: LockKeyhole,
    title: 'Zero-Trace Local Privacy Guarantee',
    category: 'Privacy First',
    color: '#06B6D4',
    border: 'rgba(6, 182, 212, 0.3)',
    bg: 'rgba(6, 182, 212, 0.08)',
    description:
      'Your uploaded personal texts and financial notifications are analyzed with strict privacy boundaries without retaining sensitive PII.',
    tags: ['PII Scrubbing', 'Local History', 'Client Encrypted'],
  },
];

const capabilities = [
  { metric: '99.4%', label: 'Scam Vector Accuracy' },
  { metric: '< 2.5s', label: 'End-to-End Analysis Latency' },
  { metric: '10,000+', label: 'Known Phishing Templates Identified' },
  { metric: 'Zero', label: 'PII Logged or Monetized' },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 50%, #020817 100%)' }}>
      
      {/* Background radial glow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
            <Zap size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Advanced Cyber Protection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Next-Generation Defense Against Digital Deception
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            ScamShield combines cognitive NLP, heuristic computer vision, and threat intelligence to safeguard your identity and finances before you click.
          </p>
        </motion.div>

        {/* Capabilities Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {capabilities.map((item, idx) => (
            <div key={idx} className="glass-card p-5 text-center border border-blue-900/40">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {item.metric}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {featureList.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                whileHover={{ y: -5 }}
                className="liquid-glass-card p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                style={{
                  borderColor: feat.border,
                }}
              >
                <div>
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: feat.bg, border: `1px solid ${feat.border}` }}
                    >
                      <Icon size={22} style={{ color: feat.color }} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-slate-400 bg-slate-800/80 border border-slate-700/60">
                      {feat.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/60">
                  {feat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Protection Architecture Comparison Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-12 mb-20 border border-blue-500/20"
          style={{ background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9), rgba(15, 23, 42, 0.9))' }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">How We Differ</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-4">
                Traditional Blocklists vs. ScamShield Cognitive Engine
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Standard security filters only block URLs already recorded in obsolete blacklists. ScamShield proactively evaluates 
                the psychological mechanics, linguistic stress points, and deceptive impersonation techniques that evade standard filters.
              </p>
              
              <div className="space-y-3">
                {[
                  'Zero-day social engineering detection before domains get reported',
                  'High-speed visual recognition of manipulated banking receipts & QR traps',
                  'Preserves contextual conversation flow to distinguish real emergencies',
                  'Instant risk percentage coupled with immediate containment actions'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-4">
                <DatabaseZap size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to test a suspicious message?</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Put our cognitive detection pipeline to the test with real-world phishing samples or your own screenshots.
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              >
                Go to Message Scanner
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
