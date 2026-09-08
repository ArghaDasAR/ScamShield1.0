import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Users2, 
  Cpu, 
  Sparkles, 
  Lock, 
  FileCheck2, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Democratize enterprise-grade defensive AI so everyday digital citizens never fall victim to extortion, phishing, and psychological traps.'
  },
  {
    icon: Cpu,
    title: 'Cognitive Defense AI',
    description: 'Going beyond simple URL blacklists by decoding the subconscious cues—panic, authority impersonation, and falsified debt notices.'
  },
  {
    icon: Lock,
    title: 'Uncompromised Privacy',
    description: 'Client-first architecture ensuring that your personal communication screenshots and alerts remain private and unmonetized.'
  },
  {
    icon: HeartHandshake,
    title: 'Community Protection',
    description: 'Empowering seniors, students, and digital shoppers with instantaneous safety verification before they approve any financial action.'
  }
];

const teamMembers = [
  {
    name: 'ScamShield Core Research',
    role: 'Cybersecurity & Behavioral Analysis',
    tag: 'Threat Intelligence',
    avatar: 'CR'
  },
  {
    name: 'Neural Vision Group',
    role: 'OCR & Multimodal Vision Models',
    tag: 'Deep Learning',
    avatar: 'NV'
  },
  {
    name: 'Platform Engineering',
    role: 'Real-Time Inference & High Availability',
    tag: 'Distributed Systems',
    avatar: 'PE'
  }
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 50%, #020817 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">About ScamShield</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Building the Digital Immune System for the Modern Web
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Every day, millions of malicious messages, spoofed bank notices, and fraudulent investment offers flood our inboxes. ScamShield acts as your personal vigilant security guardian.
          </p>
        </motion.div>

        {/* Pillars / Values Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card p-7 border border-blue-900/40"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{v.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-10 mb-16 border border-indigo-500/20 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(124, 58, 237, 0.08))' }}
        >
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-blue-400">3.4 Billion</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Phishing emails sent daily worldwide</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-400">82%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Involve human social engineering elements</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">2.5 Seconds</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">ScamShield median time to verdict</p>
            </div>
          </div>
        </motion.div>

        {/* Research Team / Initiative */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Engineered with Purpose</h2>
            <p className="text-xs text-slate-400 mt-1">Cross-disciplinary innovation combining cybersecurity intelligence with neural NLP</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={member.name} className="glass-card p-6 border border-slate-800 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg">
                  {member.avatar}
                </div>
                <h4 className="font-bold text-white text-base">{member.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 mb-3">{member.role}</p>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40">
                  {member.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white shadow-xl transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            Start Analyzing Messages
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
