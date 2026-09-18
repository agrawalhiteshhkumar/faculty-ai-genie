'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Building2, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface ActivationGatewayProps {
  onActivated?: () => void;
  onOpenSuperAdmin?: () => void;
}

export default function ActivationGateway({ onActivated, onOpenSuperAdmin }: ActivationGatewayProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setStatusMessage('Please enter an institutional license key.');
      return;
    }

    setIsValidating(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsValidating(false);
      const cleanKey = licenseKey.trim().toUpperCase();
      if (cleanKey.startsWith('GENIE-') || cleanKey.length >= 8) {
        if (onActivated) onActivated();
      } else {
        setStatusMessage('Invalid license key. Please verify with your Institution Administrator.');
      }
    }, 700);
  };

  const institutionalEmailHref = 
    'mailto:agrawal.hiteshkumar@gmail.com?subject=' + 
    encodeURIComponent('FACULTY AI GENIE — Institutional Pilot & Access Request') + 
    '&body=' + 
    encodeURIComponent(
      'Dear Platform Super Admin,\n\n' +
      'We request institutional pilot onboarding for FACULTY AI GENIE.\n\n' +
      'Institution Legal Name:\n' +
      'AISHE / DTE / MSBTE / PCI Code:\n' +
      'Programmes Offered (e.g., D.Pharm, B.Pharm):\n' +
      'Curriculum Scheme (e.g., MSBTE K-Scheme / J-Scheme / PCI ER-2020):\n' +
      'Authorized Contact Person:\n' +
      'Designation (Principal / HOD / Coordinator):\n' +
      'Official Institutional Email:\n' +
      'Phone Number:\n\n' +
      'Thank you.'
    );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      
      {/* Top Header */}
      <div className="w-full max-w-xl mx-auto flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 font-bold text-blue-900 tracking-wide">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span>FACULTY AI GENIE™</span>
        </div>
        {onOpenSuperAdmin && (
          <button 
            type="button" 
            onClick={onOpenSuperAdmin}
            className="text-slate-500 hover:text-blue-700 font-medium transition-colors"
          >
            SuperAdmin Access
          </button>
        )}
      </div>

      {/* Main Activation Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 mb-1">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Institutional Workspace Activation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              AI-powered academic operating system for curriculum planning, attendance, MSBTE CIAAN-2023 marks, and NBA Tier-II outcome intelligence.
            </p>
          </div>

          <form onSubmit={handleActivationSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="licenseKey" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Institutional License Key
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="licenseKey"
                  type="text"
                  autoComplete="off"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="e.g. GENIE-INST-2026-XXXX"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                />
              </div>
            </div>

            {statusMessage && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isValidating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-700/20"
            >
              <span>{isValidating ? 'Validating Credentials...' : 'Activate Institution Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-900">
              <Building2 className="w-4 h-4 shrink-0 text-blue-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Request Institutional Pilot Access
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Institutions onboarding for PCI ER-2020, MSBTE (K-Scheme &amp; J-Scheme), or NBA Tier-II accreditation can request an authorized institutional license key.
            </p>
            <a
              href={institutionalEmailHref}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors pt-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Platform Super Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Multi-tenant architecture: Each institution operates with dedicated data isolation and PostgreSQL Row-Level Security (RLS).
            </span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1.5 pt-2">
        <span>FACULTY AI GENIE™ • Academic Operating System</span>
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          Technical Support &amp; Governance
        </span>
      </div>

    </div>
  );
}
