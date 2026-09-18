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
  BookOpen,
  X,
  Copy,
  Send
} from 'lucide-react';

export interface ActivationGatewayProps {
  onActivated?: () => void;
  onOpenSuperAdmin?: () => void;
}

export function ActivationGateway({ onActivated, onOpenSuperAdmin }: ActivationGatewayProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Request Pilot Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [reqForm, setReqForm] = useState({
    instName: '',
    instCode: '',
    contactName: '',
    email: '',
    phone: '',
    scheme: 'MSBTE J-Scheme / PCI ER-2020'
  });

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

  const emailText = 
    `FACULTY AI GENIE — Institutional Pilot Request\n` +
    `To: agrawal.hiteshkumar@gmail.com\n\n` +
    `Institution: ${reqForm.instName || '[Institute Name]'}\n` +
    `Code: ${reqForm.instCode || '[DTE/MSBTE/PCI Code]'}\n` +
    `Curriculum: ${reqForm.scheme}\n` +
    `Contact: ${reqForm.contactName || '[Name]'}\n` +
    `Official Email: ${reqForm.email || '[Email]'}\n` +
    `Phone: ${reqForm.phone || '[Phone]'}`;

  const copyEmailDetails = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <div className="w-full max-w-xl mx-auto flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 font-bold text-blue-900 tracking-wide">
          <BookOpen className="w-4 h-4 text-blue-700"/>
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
              <ShieldCheck className="w-8 h-8"/>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Institutional Workspace Activation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              AI-powered academic operating system for curriculum planning, attendance, MSBTE J-Scheme continuous assessment, and NBA Tier-II outcome intelligence.
            </p>
          </div>

          <form onSubmit={handleActivationSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="licenseKey" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Institutional License Key
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
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
                <AlertCircle className="w-4 h-4 shrink-0"/>
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isValidating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-700/20 cursor-pointer"
            >
              <span>{isValidating ? 'Validating Credentials...' : 'Activate Institution Workspace'}</span>
              <ArrowRight className="w-4 h-4"/>
            </button>
          </form>

          {/* Request Pilot Access Box */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-900">
              <Building2 className="w-4 h-4 shrink-0 text-blue-700"/>
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Request Institutional Pilot Access
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Institutions onboarding for PCI ER-2020, MSBTE J-Scheme, or NBA Tier-II accreditation can request an authorized institutional license key.
            </p>
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors pt-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5"/>
              <span>Contact Platform Super Admin</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>
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
          <HelpCircle className="w-3 h-3 text-slate-400"/>
          Technical Support &amp; Governance
        </span>
      </div>

      {/* REQUEST ACCESS IN-APP MODAL (Bypasses desktop mail apps) */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-lg w-full space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>Institutional Pilot &amp; Access Request</span>
              </div>
              <button
                onClick={() => {
                  setIsRequestModalOpen(false);
                  setFormSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Request Prepared Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your institutional onboarding details have been compiled for MSBTE J-Scheme &amp; PCI ER-2020. You can copy or send them below:
                </p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-left font-mono text-xs text-slate-700 whitespace-pre-wrap">
                  {emailText}
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={copyEmailDetails}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Form Details'}</span>
                  </button>
                  <a
                    href={`mailto:agrawal.hiteshkumar@gmail.com?subject=${encodeURIComponent('FACULTY AI GENIE — Institutional Pilot Request (MSBTE J-Scheme)')}&body=${encodeURIComponent(emailText)}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-300 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Open in Email App</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Provide your institution's statutory credentials to initiate multi-tenant license key generation for MSBTE J-Scheme.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institution Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samarth Institute of Pharmacy"
                    value={reqForm.instName}
                    onChange={(e) => setReqForm({ ...reqForm, instName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Institute Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="AISHE / DTE / MSBTE / PCI"
                      value={reqForm.instCode}
                      onChange={(e) => setReqForm({ ...reqForm, instCode: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Curriculum Scheme</label>
                    <input
                      type="text"
                      value={reqForm.scheme}
                      onChange={(e) => setReqForm({ ...reqForm, scheme: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authorized Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Principal / HOD Name"
                      value={reqForm.contactName}
                      onChange={(e) => setReqForm({ ...reqForm, contactName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="principal@college.edu.in"
                      value={reqForm.email}
                      onChange={(e) => setReqForm({ ...reqForm, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98XXXXXXXX"
                    value={reqForm.phone}
                    onChange={(e) => setReqForm({ ...reqForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ActivationGateway;
