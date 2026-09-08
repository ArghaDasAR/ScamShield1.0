import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Image, MessageSquare, Mail, Globe, AlertCircle, Zap } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ExampleInputs from '../components/ExampleInputs';
import { useApp } from '../context/AppContext';
import { analyzeContent } from '../services/scamAnalyzer';

const tabs = [
  { id: 'screenshot', label: 'Screenshot', icon: Image },
  { id: 'message', label: 'Message (Text)', icon: MessageSquare },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'url', label: 'URL', icon: Globe },
];

export default function Analyze() {
  const navigate = useNavigate();
  const { currentInput, setCurrentInput, setScanState, setAnalysisResult, addToHistory } = useApp();
  const [activeTab, setActiveTab] = useState(currentInput.type || 'message');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync tab with currentInput.type when example is clicked
  useEffect(() => {
    if (currentInput.type && currentInput.type !== activeTab) {
      setActiveTab(currentInput.type);
    }
  }, [currentInput.type]);

  const updateInput = (field, value) => {
    setCurrentInput(prev => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentInput(prev => ({ ...prev, type: tabId }));
    setError('');
  };

  const handleImageReady = (data) => {
    if (data) {
      updateInput('imageUrl', data.url);
      updateInput('type', 'screenshot');
    } else {
      updateInput('imageUrl', null);
    }
  };

  const handleAnalyze = async () => {
    const input = { ...currentInput, type: activeTab };

    // Validate
    if (activeTab === 'screenshot' && !input.imageUrl) {
      setError('Please upload a screenshot first.');
      return;
    }
    if (activeTab === 'message' && !input.content?.trim()) {
      setError('Please paste a suspicious message.');
      return;
    }
    if (activeTab === 'email' && !input.content?.trim()) {
      setError('Please enter the email content.');
      return;
    }
    if (activeTab === 'url' && !input.content?.trim()) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setScanState('scanning');

    // Navigate to scan page, analysis happens there
    navigate('/scan');
  };

  const isReadyToAnalyze = () => {
    if (activeTab === 'screenshot') return !!currentInput.imageUrl;
    return !!(currentInput.content?.trim());
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #020817 0%, #06111F 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Check a Suspicious Message</h1>
          <p className="text-slate-400 text-base">Upload a screenshot, paste a message, or enter a URL to analyze potential scams.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main analyzer panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-5 sm:p-6">
              {/* Tabs */}
              <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      style={active ? {
                        background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(124,58,237,0.3))',
                        border: '1px solid rgba(37,99,235,0.35)',
                      } : {}}
                    >
                      <Icon size={15} className={active ? 'text-blue-400' : ''} />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'screenshot' && (
                    <UploadBox onImageReady={handleImageReady} />
                  )}

                  {activeTab === 'message' && (
                    <div>
                      <textarea
                        className="w-full h-48 px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 resize-none outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        style={{
                          background: 'rgba(9,24,44,0.8)',
                          border: '1px solid rgba(37,99,235,0.15)',
                        }}
                        placeholder="Paste the suspicious message here..."
                        value={currentInput.content || ''}
                        onChange={(e) => updateInput('content', e.target.value)}
                        id="message-input"
                      />
                      <p className="text-xs text-slate-600 mt-2">
                        Example: "URGENT! Your electricity connection will be disconnected tonight..."
                      </p>
                    </div>
                  )}

                  {activeTab === 'email' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Sender</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                          style={{ background: 'rgba(9,24,44,0.8)', border: '1px solid rgba(37,99,235,0.15)' }}
                          placeholder="security@bank-alert.com"
                          value={currentInput.sender || ''}
                          onChange={(e) => updateInput('sender', e.target.value)}
                          id="email-sender"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Subject</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                          style={{ background: 'rgba(9,24,44,0.8)', border: '1px solid rgba(37,99,235,0.15)' }}
                          placeholder="URGENT: Action Required"
                          value={currentInput.subject || ''}
                          onChange={(e) => updateInput('subject', e.target.value)}
                          id="email-subject"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Message</label>
                        <textarea
                          className="w-full h-36 px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 resize-none outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                          style={{ background: 'rgba(9,24,44,0.8)', border: '1px solid rgba(37,99,235,0.15)' }}
                          placeholder="Paste the email body here..."
                          value={currentInput.content || ''}
                          onChange={(e) => updateInput('content', e.target.value)}
                          id="email-body"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'url' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Suspicious URL</label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        style={{ background: 'rgba(9,24,44,0.8)', border: '1px solid rgba(37,99,235,0.15)' }}
                        placeholder="https://secure-bank-example.com/login"
                        value={currentInput.content || ''}
                        onChange={(e) => updateInput('content', e.target.value)}
                        id="url-input"
                      />
                      <p className="text-xs text-slate-600 mt-2">
                        Enter the full URL including https://
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
                >
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-300">{error}</span>
                </motion.div>
              )}

              {/* Analyze button */}
              <motion.button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                whileHover={!isAnalyzing ? { scale: 1.01, y: -1 } : {}}
                whileTap={!isAnalyzing ? { scale: 0.99 } : {}}
                className="w-full mt-5 py-3.5 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                }}
                id="analyze-btn"
              >
                <Zap size={18} />
                Analyze
              </motion.button>
            </div>
          </motion.div>

          {/* Example inputs sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ExampleInputs activeTab={activeTab} setActiveTab={handleTabChange} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
