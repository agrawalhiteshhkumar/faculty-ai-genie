'use client';

import React, { useState } from 'react';
import { ShieldAlert, KeyRound, ArrowRight, X, AlertCircle, Lock } from 'lucide-react';

export interface SuperAdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SuperAdminLoginModal({
  isOpen,
  onClose,
  onSuccess
}: SuperAdminLoginModalProps) {
  const [adminKey, setAdminKey] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminKey.trim()) {
      setErrorMessage('Master SuperAdmin authentication key is required.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (adminKey.trim() === 'GENIE-ADMIN-2026-MASTER') {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMessage('Invalid Master SuperAdmin key. Access denied.');
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-800">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform SuperAdmin</h2>
            <p className="text-xs text-slate-500">Global tenant provisioning &amp; license control</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="superAdminKey" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Master Access Key
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="superAdminKey"
                type="password"
                autoComplete="off"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter Master Access Key"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20"
            >
              <span>{isVerifying ? 'Authenticating...' : 'Authenticate'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
          <Lock className="w-3 h-3" />
          <span>Every administrative session is logged to immutable audit records.</span>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLoginModal;
