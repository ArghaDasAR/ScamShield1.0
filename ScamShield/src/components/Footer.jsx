import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Mail, PhoneCall, AlertOctagon, FileCheck, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-blue-900/30 bg-[#010612] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Shield className="w-4.5 h-4.5 text-white" size={18} />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">ScamShield</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI-driven defensive intelligence platform safeguarding everyday users against social engineering, digital fraud, and phishing campaigns.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              © 2024 – 2026 ScamShield Security Labs.<br />All rights reserved.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/analyze" className="hover:text-blue-400 transition-colors">Analyze Message</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-400 transition-colors">Cognitive AI Features</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-blue-400 transition-colors">Scan History</Link>
              </li>
              <li>
                <a href="#detection-matrix" className="hover:text-blue-400 transition-colors">Threat Matrix</a>
              </li>
              <li>
                <a href="#supported-formats" className="hover:text-blue-400 transition-colors">Supported Formats</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Cyber Defense & Support */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Emergency Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink size={10} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.cert-in.org.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>CERT-In Advisories</span>
                  <ExternalLink size={10} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://sancharsaathi.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>Chakshu Fraud Reporting</span>
                  <ExternalLink size={10} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                  <span>National Consumer Helpline</span>
                  <ExternalLink size={10} className="text-slate-500" />
                </a>
              </li>
              <li>
                <span className="text-emerald-400 font-semibold block mt-1">Helpline: 1930 (Cyber Fraud)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Organization */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Organization</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">About ScamShield</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">Research & Philosophy</Link>
              </li>
              <li>
                <a href="#threat-bulletins" className="hover:text-blue-400 transition-colors">Security Bulletins</a>
              </li>
              <li>
                <a href="#open-source" className="hover:text-blue-400 transition-colors">Open Threat Data</a>
              </li>
              <li>
                <a href="#careers" className="hover:text-blue-400 transition-colors">Careers & Research</a>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Verification */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Security Standards</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-blue-400" />
                <span>Zero Retention Policy</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-blue-400" />
                <span>Client-Side Sanitization</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-blue-400" />
                <span>Encrypted Inference Pipe</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} className="text-blue-400" />
                <span>Local Session Isolation</span>
              </li>
              <li className="mt-3">
                <span className="inline-block px-2.5 py-1 rounded bg-blue-950/70 border border-blue-800/40 text-[11px] text-blue-300">
                  ISO / IEC 27001 Aligned
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Safety Reference Notices (Zerodha Style Disclaimers, Tailored for Cyber Protection) */}
        <div className="pt-8 border-t border-slate-800/70 text-[11px] leading-relaxed text-slate-500 space-y-3">
          <p>
            <strong className="text-slate-400">ScamShield Cyber Defense Notice:</strong> ScamShield is an autonomous heuristic and neural cognitive safety tool designed to assist individuals in recognizing social engineering tactics, deceptive hyperlinks, and fraudulent digital solicitations. Results provided reflect probabilistic AI confidence ratings and should not substitute for official statutory verification by banking, law enforcement, or telecommunication authorities.
          </p>
          <p>
            <strong className="text-slate-400">Reporting Financial Cyber Fraud:</strong> If you suspect that your net banking credentials, UPI PIN, OTP, or debit/credit card details have been compromised, immediately initiate a freeze via your bank's official mobile application or national toll-free helpline. Promptly register financial incidents at the Cyber Crime Portal (<a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-blue-400 underline">cybercrime.gov.in</a>) or dial 1930 within the golden hour to facilitate account freezing.
          </p>
          <p>
            <strong className="text-slate-400">Privacy & Data Handling Standard:</strong> ScamShield does not trade, syndicate, or monetize your submitted communications or uploaded attachments. Personal identifiers including bank account numbers, phone contacts, and physical addresses are scrubbed prior to semantic risk pattern indexing.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 text-slate-500 text-[11px]">
            <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
            <span>•</span>
            <a href="#responsible-disclosure" className="hover:text-slate-300">Responsible Disclosure</a>
            <span>•</span>
            <a href="#incident-response" className="hover:text-slate-300">Incident Escalation Matrix</a>
            <span>•</span>
            <a href="#cookie-preferences" className="hover:text-slate-300">Telemetry Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
