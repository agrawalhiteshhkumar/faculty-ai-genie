import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Building2,
  Mail,
  FileCheck2,
  Sparkles,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Crown,
  ExternalLink,
} from 'lucide-react';
import { InstitutionalLicense } from '../types';

interface ActivationGatewayProps {
  onActivationSuccess: (tenantId: string, license: InstitutionalLicense, configured: boolean) => void;
  onOpenSuperAdmin: () => void;
  initialError?: string | null;
}

export const ActivationGateway: React.FC<ActivationGatewayProps> = ({
  onActivationSuccess,
  onOpenSuperAdmin,
  initialError,
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [aisheCode, setAisheCode] = useState('');
  const [pciCode, setPciCode] = useState('');
  const [dteCode, setDteCode] = useState('');
  const [msbteCode, setMsbteCode] = useState('');
  const [department, setDepartment] = useState('Department of Pharmaceutics');
  const [adminEmail, setAdminEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError || null);

  // Auto-format license key as user types: FAIG-2026-XXXX-XXXX
  const handleKeyChange = (val: string) => {
    let clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.startsWith('FAIG2026')) {
      clean = clean.replace('FAIG2026', 'FAIG-2026-');
    }
    setLicenseKey(val.toUpperCase());
    setErrorMessage(null);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setErrorMessage('Please enter your 16-character Institutional License Key.');
      return;
    }
    if (!collegeName.trim()) {
      setErrorMessage('Please provide the full Official College / University Name.');
      return;
    }
    if (!adminEmail.trim()) {
      setErrorMessage('Institutional Admin email address is required.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: licenseKey.trim(),
          collegeName: collegeName.trim(),
          aisheCode: aisheCode.trim(),
          pciCode: pciCode.trim(),
          dteCode: dteCode.trim(),
          msbteCode: msbteCode.trim(),
          department: department.trim(),
          adminEmail: adminEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'License activation failed. Please check your credentials.');
      }

      onActivationSuccess(data.tenantId, data.license, data.configured);
    } catch (err: any) {
      setErrorMessage(err.message || 'Validation error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header / Platform Identity */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">
                  FACULTY AI GENIE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  Institutional Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Tenant Academic Operating System • PCI ER-2020 & MSBTE Compliant
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSuperAdmin}
            id="super-admin-login-btn"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg transition shadow-sm cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Platform Owner (Super Admin)</span>
          </button>
        </div>
      </header>

      {/* Main Activation Screen */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full">
          {/* Status Alert Banner */}
          {errorMessage && (
            <div
              id="activation-error-banner"
              className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-sm flex items-start gap-3 shadow-lg shadow-rose-950/30 animate-shake"
            >
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-100">Activation Error</p>
                <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Activation Form Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
            {/* Subtle glow accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Institutional License Activation
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                Enter your 16-character institutional license key to unlock your college's isolated workspace and automated accreditation suite.
              </p>
            </div>

            <form onSubmit={handleActivate} className="space-y-4">
              {/* College Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  id="activation-college-name-input"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. MET Institute of Pharmacy, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-600 font-medium"
                />
              </div>

              {/* Department / Faculty */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Department / Faculty
                </label>
                <input
                  type="text"
                  id="activation-dept-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Dept. of Pharmaceutics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-600 font-medium"
                />
              </div>

              {/* Statutory Approvals & Institutional Registration Codes */}
              <div className="pt-2 pb-1 border-t border-slate-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Statutory & Regulatory Institute Codes
                  </span>
                  <span className="text-[10px] text-slate-400">Individual official codes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. AISHE Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>1. AISHE Code</span>
                      <span className="text-[10px] text-slate-500 font-mono">e.g. C-XXXXX</span>
                    </label>
                    <input
                      type="text"
                      id="activation-aishe-code-input"
                      value={aisheCode}
                      onChange={(e) => setAisheCode(e.target.value)}
                      placeholder="e.g. C-39012"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono placeholder:text-slate-600"
                    />
                  </div>

                  {/* 2. PCI Institute Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>2. PCI Institute Code</span>
                      <span className="text-[10px] text-slate-500 font-mono">e.g. PCI-XXXX</span>
                    </label>
                    <input
                      type="text"
                      id="activation-pci-code-input"
                      value={pciCode}
                      onChange={(e) => setPciCode(e.target.value)}
                      placeholder="e.g. PCI-1823"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono placeholder:text-slate-600"
                    />
                  </div>

                  {/* 3. DTE Institute Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>3. DTE Institute Code</span>
                      <span className="text-[10px] text-slate-500 font-mono">e.g. 52XX / 62XX</span>
                    </label>
                    <input
                      type="text"
                      id="activation-dte-code-input"
                      value={dteCode}
                      onChange={(e) => setDteCode(e.target.value)}
                      placeholder="e.g. 5219 / 6214"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono placeholder:text-slate-600"
                    />
                  </div>

                  {/* 4. MSBTE Institute Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>4. MSBTE Institute Code</span>
                      <span className="text-[10px] text-slate-500 font-mono">e.g. 01XX / 15XX</span>
                    </label>
                    <input
                      type="text"
                      id="activation-msbte-code-input"
                      value={msbteCode}
                      onChange={(e) => setMsbteCode(e.target.value)}
                      placeholder="e.g. 0182 / 0912"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Institutional Admin Official Email *
                </label>
                <input
                  type="email"
                  id="activation-admin-email-input"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. principal@met.edu or hod.pharmacy@met.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-600 font-medium"
                />
              </div>

              {/* 16-Digit Institutional License Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    16-Character Institutional License Key *
                  </label>
                  <span className="text-[11px] text-amber-400 font-mono font-medium">
                    Format: FAIG-2026-XXXX-XXXX
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="activation-license-key-input"
                    required
                    maxLength={24}
                    value={licenseKey}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    placeholder="FAIG-2026-XXXX-XXXX"
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border-2 border-amber-500/40 text-amber-300 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-slate-700 font-mono tracking-wider font-bold shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="validate-license-btn"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Validating Statutory License...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Validate License & Unlock Workspace</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Platform Control & License Help */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Platform Owner: Dr. Hiteshkumar Agrawal</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Need an institutional workspace? Onboard via Super Admin Platform Control.
                  </p>
                </div>
                <button
                  type="button"
                  id="gateway-open-superadmin-btn"
                  onClick={onOpenSuperAdmin}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Open Super Admin Console</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Compliance Assurance Note */}
          <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                Strict Multi-Tenant Database Isolation. Your institution's data, question papers, and marks are private and never shared.
              </span>
            </p>
            <p className="text-[11px] text-slate-600">
              Compliant with Pharmacy Council of India (PCI ER-2020), MSBTE CIAAN-2023, & NBA Tier-II guidelines.
            </p>

          {/* Institutional Pilot & Access Request */}
          <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
            <p className="text-xs text-slate-300 font-medium">
              Want to onboard your pharmacy institute or request a trial license key?
            </p>
            <a
              href="mailto:agrawal.hiteshkumar@gmail.com?subject=Institutional%20Access%20Request%20-%20Faculty%20AI%20Genie&body=College%20Name:%0D%0ACity:%0D%0AContact%20Person:%0D%0ADesignation:%0D%0APCI/MSBTE/DTE%20Code:%0D%0AEstimated%20Faculty%20Count:"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 underline mt-2 transition-colors"
            >
              Request Institutional Access & License Key &rarr;
            </a>
          </div>
        </div>

     {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-3 text-center text-xs text-slate-500">
        Faculty AI Genie Institutional Gateway v2.4 • Platform Super Admin: <code className="text-slate-400 font-mono">agrawal.hiteshkumar@gmail.com</code>
      </footer>
    </div>
  );
};
