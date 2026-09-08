import { Link, useLocation } from 'react-router-dom';
import { Shield, History, LogIn, LogOut, ChevronDown, Menu, X, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-blue-900/30"
        style={{ background: 'rgba(2, 8, 23, 0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Shield className="w-4.5 h-4.5 text-white" size={18} />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">ScamShield</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const active = pathname === link.to && link.to !== '/';
                const homeActive = link.to === '/' && pathname === '/';
                const isActive = active || homeActive;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative
                      ${isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-500"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/history"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${pathname === '/history' ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <History size={16} />
                History
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 pl-3 border-l border-slate-700/50 cursor-pointer group focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                      {user.initials || 'US'}
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700/80 shadow-xl py-1.5 z-50 backdrop-blur-xl"
                      >
                        <div className="px-3 py-2 border-b border-slate-800">
                          <p className="text-xs text-slate-400">Signed in as</p>
                          <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                >
                  <LogIn size={15} />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-blue-900/30 overflow-hidden"
              style={{ background: 'rgba(6, 17, 31, 0.95)' }}
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/history"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <History size={16} />
                  History
                </Link>

                <div className="pt-3 border-t border-slate-800">
                  {user ? (
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                          {user.initials || 'US'}
                        </div>
                        <span className="text-sm text-slate-300">{user.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                    >
                      <LogIn size={16} />
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Sign In & Sign Up Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
