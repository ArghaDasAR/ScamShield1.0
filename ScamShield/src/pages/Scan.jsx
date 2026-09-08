import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeContent } from '../services/scamAnalyzer';

const steps = [
  { id: 1, label: 'Extracting text (OCR)', duration: 600 },
  { id: 2, label: 'Analyzing language (NLP)', duration: 700 },
  { id: 3, label: 'Detecting social engineering tactics', duration: 800 },
  { id: 4, label: 'Checking URL reputation', duration: 500 },
  { id: 5, label: 'Calculating risk score', duration: 400 },
];

export default function Scan() {
  const navigate = useNavigate();
  const { currentInput, setScanState, setAnalysisResult, addToHistory } = useApp();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  useEffect(() => {
    if (analysisStarted) return;
    setAnalysisStarted(true);

    // Animate steps sequentially
    let elapsed = 0;
    steps.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(step.id);
      }, elapsed);
      elapsed += step.duration;
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.id]);
      }, elapsed - 50);
    });

    // Run actual analysis in parallel
    const totalStepDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    const analysisStartTime = Date.now();

    analyzeContent(currentInput).then((result) => {
      const entry = addToHistory(result, currentInput);
      setAnalysisResult(result);
      setScanState('done');

      // Wait for all step animations to complete before navigating
      const elapsed = Date.now() - analysisStartTime;
      const remaining = Math.max(0, totalStepDuration - elapsed + 400);
      setTimeout(() => navigate('/result'), remaining);
    }).catch(() => {
      navigate('/result');
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 100%)' }}>
      <div className="w-full max-w-lg">
        {/* Scanning animation */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-8">
            {/* Outer ring */}
            <motion.div
              className="w-36 h-36 rounded-full absolute inset-0"
              style={{ border: '2px solid rgba(37,99,235,0.2)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            {/* Middle ring with dot */}
            <motion.div
              className="w-28 h-28 rounded-full absolute"
              style={{ inset: '16px', border: '2px solid rgba(124,58,237,0.3)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-500"
                style={{ boxShadow: '0 0 8px rgba(124,58,237,0.8)' }} />
            </motion.div>

            {/* Center shield */}
            <div className="w-36 h-36 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }}>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    'drop-shadow(0 0 12px rgba(37,99,235,0.5))',
                    'drop-shadow(0 0 24px rgba(37,99,235,0.9))',
                    'drop-shadow(0 0 12px rgba(37,99,235,0.5))',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield size={48} className="text-blue-500" />
              </motion.div>
            </div>
          </div>

          <motion.h2
            className="text-2xl font-black text-white mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Analyzing your message...
          </motion.h2>
          <p className="text-slate-400 text-sm text-center max-w-xs">
            Our AI is checking for social engineering patterns, suspicious links and psychological manipulation.
          </p>
        </div>

        {/* Steps */}
        <div className="glass-card px-6 py-5 space-y-4">
          {steps.map((step) => {
            const done = completedSteps.includes(step.id);
            const active = activeStep === step.id && !done;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: done || active ? 1 : 0.4 }}
                className="flex items-center gap-3"
              >
                {/* Step indicator */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {done ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.3 }}
                    >
                      <CheckCircle size={20} className="text-green-400" />
                    </motion.div>
                  ) : active ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent" />
                    </motion.div>
                  ) : (
                    <Circle size={20} className="text-slate-700" />
                  )}
                </div>

                {/* Step label */}
                <span className={`text-sm font-medium transition-colors ${
                  done ? 'text-green-400' : active ? 'text-blue-300' : 'text-slate-600'
                }`}>
                  {step.label}
                </span>

                {/* Time indicator */}
                {done && (
                  <span className="ml-auto text-xs text-slate-600">
                    {(step.duration / 1000).toFixed(1)}s
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
