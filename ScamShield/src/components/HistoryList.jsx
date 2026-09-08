import { motion } from 'framer-motion';
import { Image, MessageSquare, Mail, Link, Clock } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const typeIcons = {
  screenshot: Image,
  message: MessageSquare,
  email: Mail,
  url: Link,
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) +
    '\n' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export default function HistoryList({ entries }) {
  const navigate = useNavigate();
  const { setAnalysisResult, setCurrentInput } = useApp();

  const handleClick = (entry) => {
    if (entry.result) {
      setAnalysisResult(entry.result);
      if (entry.input) setCurrentInput(entry.input);
      navigate('/result');
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
          <Clock size={28} className="text-blue-400" />
        </div>
        <p className="text-slate-400 text-base">No analysis history yet.</p>
        <p className="text-slate-500 text-sm mt-1">Analyze a message to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const Icon = typeIcons[entry.type] || MessageSquare;
        const isCritical = entry.severity === 'CRITICAL' || entry.riskScore >= 85;
        const isHigh = entry.severity === 'HIGH' || (entry.riskScore >= 70 && entry.riskScore < 85);
        const isSuspicious = entry.severity === 'SUSPICIOUS' || (entry.riskScore >= 55 && entry.riskScore < 70);
        const isModerate = entry.severity === 'MODERATE' || entry.severity === 'MEDIUM' || (entry.riskScore >= 35 && entry.riskScore < 55);

        const scoreColor = isCritical
          ? '#EF4444'
          : isHigh
          ? '#F97316'
          : isSuspicious
          ? '#FBBF24'
          : isModerate
          ? '#FCD34D'
          : '#10B981';

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            onClick={() => handleClick(entry)}
            className={`glass-card p-4 flex items-center gap-4 transition-all duration-200
              ${entry.result ? 'cursor-pointer hover:border-blue-500/40 hover:-translate-y-0.5' : ''}`}
            style={{ cursor: entry.result ? 'pointer' : 'default' }}
            whileHover={entry.result ? { y: -2 } : {}}
          >
            {/* Type icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <Icon size={18} className="text-blue-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-blue-400 capitalize">{entry.type}</span>
              </div>
              <p className="text-sm text-slate-200 font-medium truncate">{entry.preview}</p>
            </div>

            {/* Risk score */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: scoreColor }}>{entry.riskScore}%</span>
                <RiskBadge severity={entry.severity} />
              </div>
              <p className="text-xs text-slate-500">
                {new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
