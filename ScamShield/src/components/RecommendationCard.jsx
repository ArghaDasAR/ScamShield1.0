import { motion } from 'framer-motion';
import { Shield, CheckCircle, ExternalLink, Flag } from 'lucide-react';

export default function RecommendationCard({ recommendations }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(22,163,74,0.25)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3"
        style={{ background: 'rgba(22,163,74,0.1)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(22,163,74,0.2)' }}>
          <Shield size={18} className="text-green-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Recommended Action</h3>
        </div>
      </div>

      {/* Primary alert */}
      <div className="mx-4 mt-4 mb-3 px-4 py-3 rounded-xl flex items-center gap-3"
        style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)' }}>
        <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-green-300">Do not click the link or make any payment.</p>
      </div>

      {/* Recommendations list */}
      <div className="px-4 pb-4 space-y-2">
        {recommendations.slice(1).map((rec, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 mt-2 flex-shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-5 flex flex-col sm:flex-row gap-2.5">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
          onClick={() => window.open('https://cybercrime.gov.in', '_blank')}
        >
          <ExternalLink size={15} />
          Check Official Website
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10"
          style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          onClick={() => window.open('https://cybercrime.gov.in', '_blank')}
        >
          <Flag size={15} />
          Report Scam
        </button>
      </div>
    </motion.div>
  );
}
