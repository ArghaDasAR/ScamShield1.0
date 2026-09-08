import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Current analysis state
  const [currentInput, setCurrentInput] = useState({
    type: 'message', // 'screenshot' | 'message' | 'email' | 'url'
    content: '',
    imageUrl: null,
    sender: '',
    subject: '',
    demoId: null,
  });

  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'done'
  const [analysisResult, setAnalysisResult] = useState(null);

  // User auth state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('scamshield-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('scamshield-user', JSON.stringify(userData));
    } catch {
      // Storage unavailable
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('scamshield-user');
    } catch {
      // Storage unavailable
    }
  };

  // History persisted in localStorage - deduplicated on load
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('scamshield-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no duplicate IDs exist
        const seen = new Set();
        return parsed.filter(item => {
          if (!item?.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      }
      const initial = getDefaultHistory();
      localStorage.setItem('scamshield-history', JSON.stringify(initial));
      return initial;
    } catch {
      return getDefaultHistory();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('scamshield-history', JSON.stringify(history));
    } catch {
      // Storage full or unavailable
    }
  }, [history]);

  const addToHistory = (result, input) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: input.type,
      preview: (input.content || 'Screenshot analysis').slice(0, 40) + '...',
      riskScore: result.riskScore,
      severity: result.severity,
      verdict: result.verdict,
      date: new Date().toISOString(),
      result,
      input,
    };
    setHistory(prev => {
      // Prevent duplicate entry
      const filtered = prev.filter(item => item.id !== entry.id);
      return [entry, ...filtered].slice(0, 50);
    });
    return entry;
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('scamshield-history');
    } catch {}
  };

  return (
    <AppContext.Provider value={{
      currentInput, setCurrentInput,
      scanState, setScanState,
      analysisResult, setAnalysisResult,
      history, addToHistory, clearHistory,
      user, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// Default demo history entries for a fresh install with diverse score distribution
function getDefaultHistory() {
  return [
    {
      id: '1',
      type: 'screenshot',
      preview: 'Electricity bill unpaid, disconnection...',
      riskScore: 94,
      severity: 'CRITICAL',
      verdict: 'CRITICAL DANGER / SCAM',
      date: '2025-04-12T08:42:00.000Z',
    },
    {
      id: '2',
      type: 'url',
      preview: 'https://mega-discount-portal-sale2026.shop...',
      riskScore: 60,
      severity: 'SUSPICIOUS',
      verdict: 'MAYBE SUSPICIOUS',
      date: '2025-04-11T16:20:00.000Z',
    },
    {
      id: '3',
      type: 'message',
      preview: 'KYC expired, account will be blocked...',
      riskScore: 78,
      severity: 'HIGH',
      verdict: 'HIGH RISK SCAM',
      date: '2025-04-10T14:17:00.000Z',
    },
    {
      id: '4',
      type: 'email',
      preview: 'Exclusive reward program points expiration...',
      riskScore: 42,
      severity: 'MODERATE',
      verdict: 'PROCEED WITH CAUTION',
      date: '2025-04-09T11:03:00.000Z',
    },
    {
      id: '5',
      type: 'message',
      preview: 'Your electricity bill of ₹843 is due...',
      riskScore: 9,
      severity: 'LOW',
      verdict: 'LIKELY SAFE / VERIFIED',
      date: '2025-04-08T09:12:00.000Z',
    },
  ];
}
