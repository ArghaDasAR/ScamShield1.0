import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Shield, RefreshCw, ArrowLeft, Hash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskScore from '../components/RiskScore';
import TacticList from '../components/TacticList';
import RecommendationCard from '../components/RecommendationCard';

const getAnalysisId = () => 'ID: #' + Math.random().toString(36).substr(2, 8).toUpperCase();

export default function Result() {
  const navigate = useNavigate();
  const { analysisResult, currentInput } = useApp();

  // If no result, show fallback
  if (!analysisResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 100%)' }}>
        <div className="text-center">
          <Shield size={48} className="text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Analysis Found</h2>
          <p className="text-slate-400 mb-6">Please run an analysis first.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            Start Analysis
          </button>
        </div>
      </div>
    );
  }

  const { riskScore, severity, verdict, tactics, recommendations, urlRisk, extractedText } = analysisResult;
  const isCritical = severity === 'CRITICAL' || riskScore >= 85;
  const isHigh = severity === 'HIGH' || (riskScore >= 70 && riskScore < 85);
  const isSuspicious = severity === 'SUSPICIOUS' || (riskScore >= 55 && riskScore < 70);
  const isModerate = severity === 'MODERATE' || severity === 'MEDIUM' || (riskScore >= 35 && riskScore < 55);
  const isLow = severity === 'LOW' || riskScore < 35;

  const dangerColor = isCritical
    ? '#EF4444'
    : isHigh
    ? '#F97316'
    : isSuspicious
    ? '#FBBF24'
    : isModerate
    ? '#FCD34D'
    : '#10B981';

  const dangerBg = isCritical
    ? 'linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(185,28,28,0.1) 100%), rgba(10,22,40,0.7)'
    : isHigh
    ? 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(194,65,12,0.08) 100%), rgba(10,22,40,0.7)'
    : isSuspicious
    ? 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(217,119,6,0.08) 100%), rgba(10,22,40,0.7)'
    : isModerate
    ? 'linear-gradient(135deg, rgba(252,211,77,0.15) 0%, rgba(202,138,4,0.06) 100%), rgba(10,22,40,0.7)'
    : 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.08) 100%), rgba(10,22,40,0.7)';

  const dangerBorder = isCritical
    ? 'rgba(239,68,68,0.45)'
    : isHigh
    ? 'rgba(249,115,22,0.4)'
    : isSuspicious
    ? 'rgba(251,191,36,0.4)'
    : isModerate
    ? 'rgba(252,211,77,0.3)'
    : 'rgba(16,185,129,0.35)';

  const statusHeadline = isCritical
    ? 'Critical Threat Detected'
    : isHigh
    ? 'High Risk Scam Detected'
    : isSuspicious
    ? 'Maybe Suspicious Content'
    : isModerate
    ? 'Caution Advised'
    : 'Content Appears Safe';

  const analysisId = getAnalysisId();

  return (
    <div className="min-h-screen py-8"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          New Analysis
        </motion.button>

        {/* Risk banner with liquid glass refraction */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden"
          style={{
            background: dangerBg,
            borderColor: dangerBorder,
            boxShadow: `0 20px 40px -15px ${dangerColor}33, inset 0 1px 2px rgba(255,255,255,0.2)`
          }}
        >
          {/* Icon + verdict */}
          <div className="flex items-center gap-5 flex-1 z-10">
            <motion.div
              animate={isCritical || isHigh ? { scale: [1, 1.07, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-xl"
              style={{
                background: `${dangerColor}25`,
                border: `1px solid ${dangerColor}55`,
                boxShadow: `0 0 20px ${dangerColor}40, inset 0 1px 1px rgba(255,255,255,0.3)`
              }}
            >
              {isCritical || isHigh || isSuspicious ? (
                <AlertTriangle size={30} style={{ color: dangerColor }} />
              ) : (
                <CheckCircle size={30} style={{ color: dangerColor }} />
              )}
            </motion.div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider mb-1"
                style={{ color: dangerColor }}>
                {statusHeadline}
              </p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-6xl sm:text-7xl font-black text-white leading-none drop-shadow-md">{riskScore}%</span>
                <span className="text-sm sm:text-base font-bold px-3.5 py-1 rounded-full backdrop-blur-md"
                  style={{ background: `${dangerColor}22`, color: dangerColor, border: `1px solid ${dangerColor}50` }}>
                  {verdict}
                </span>
              </div>
            </div>
          </div>

          {/* Risk ring + meta */}
          <div className="flex flex-col items-center gap-2">
            <RiskScore score={riskScore} severity={severity} />
            <div className="text-center">
              <p className="text-xs text-slate-500">{analysisId}</p>
              <p className="text-xs text-slate-500">Scanned just now</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {isHigh && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm mb-6 px-1"
          >
            This message shows multiple signs of social engineering designed to manipulate you into making a payment.
          </motion.p>
        )}

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Why this is risky */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-5 h-full">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <AlertTriangle size={16} className="text-red-400" />
                </div>
                <h3 className="font-bold text-white">Why this is risky?</h3>
              </div>

              {tactics && tactics.length > 0 ? (
                <TacticList tactics={tactics} />
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle size={32} className="text-green-400 mb-3" />
                  <p className="text-slate-400 text-sm">No significant threats detected.</p>
                  <p className="text-slate-500 text-xs mt-1">This content appears legitimate.</p>
                </div>
              )}

              {/* URL risk indicator */}
              {urlRisk && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">URL Risk Level</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    urlRisk === 'Highly Suspicious' || urlRisk === 'Suspicious' ? 'risk-high' :
                    urlRisk === 'Unknown' ? 'risk-medium' : 'risk-low'
                  }`}>
                    {urlRisk}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RecommendationCard recommendations={recommendations} />
          </motion.div>
        </div>

        {/* Extracted text preview */}
        {extractedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 glass-card p-4"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Extracted Content Preview</p>
            <p className="text-sm text-slate-400 italic">"{extractedText}..."</p>
          </motion.div>
        )}

        {/* Analyze another button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 mt-6"
        >
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            <RefreshCw size={15} />
            Analyze Another
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-slate-700/50 hover:border-blue-500/40 transition-all"
          >
            View History
          </button>
        </motion.div>
      </div>
    </div>
  );
}
