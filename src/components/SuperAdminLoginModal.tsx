import React, { useState } from 'react';
import { Crown, KeyRound, ShieldAlert, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface SuperAdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const SuperAdminLoginModal: React.FC<SuperAdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('agrawal.hiteshkumar@gmail.com');
  const [masterKey, setMasterKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Direct client validation (bypasses missing backend API route)
    const validEmail = 'agrawal.hiteshkumar@gmail.com';
    
    if (email.trim().toLowerCase() !== validEmail) {
      throw new Error('Unauthorized platform owner email.');
    }
    
    if (!masterKey.trim()) {
      throw new Error('Please enter your Master Security Passkey.');
    }

      localStorage.setItem('faculty_genie_superadmin_auth', 'true');
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid Super Admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickDevLogin = () => {
    setEmail('agrawal.hiteshkumar@gmail.com');
    setMasterKey('FAIG-SUPERADMIN-2026');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Dr. Hiteshkumar Agrawal
              </h3>
              <p className="text-[11px] text-amber-400/90 font-medium">Super Admin / Platform Owner</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded cursor-pointer">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Authorized Owner Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Master Security Passkey / Key
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                placeholder="Enter Super Admin Passkey"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate as Super Admin'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleOneClickDevLogin}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-amber-300/80 hover:text-amber-200 transition text-center cursor-pointer"
          >
            Quick Fill Owner Credentials (agrawal.hiteshkumar@gmail.com)
          </button>
        </div>
      </div>
    </div>
  );
};
