import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HistoryList from '../components/HistoryList';

export default function History() {
  const { history, clearHistory } = useApp();

  return (
    <div className="min-h-screen py-10"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-2"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Your Analysis History</h1>
            <p className="text-slate-400 text-sm">View your recent scam checks and analysis results.</p>
          </div>
          {history.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <Trash2 size={13} />
              Clear All
            </motion.button>
          )}
        </motion.div>

        {/* Stats row with liquid glass */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 mt-6"
          >
            {[
              { label: 'Total Checks', value: history.length, color: '#3B82F6' },
              { label: 'Critical / High', value: history.filter(h => h.severity === 'CRITICAL' || h.severity === 'HIGH' || h.riskScore >= 70).length, color: '#EF4444' },
              { label: 'Suspicious (55-69%)', value: history.filter(h => h.severity === 'SUSPICIOUS' || (h.riskScore >= 55 && h.riskScore < 70)).length, color: '#FBBF24' },
              { label: 'Safe / Verified', value: history.filter(h => h.severity === 'LOW' || h.riskScore < 35).length, color: '#10B981' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* History list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <HistoryList entries={history} />
        </motion.div>
      </div>
    </div>
  );
}
