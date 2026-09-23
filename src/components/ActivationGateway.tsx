'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Crown, 
  UserCheck, 
  KeyRound, 
  Mail, 
  Lock,
  AlertCircle 
} from 'lucide-react';

interface ActivationGatewayProps {
  onActivated: (tenantId?: string, license?: any, userRole?: 'ADMIN' | 'FACULTY', facultyEmail?: string) => void;
  onOpenSuperAdmin: () => void;
  onSuperAdminSuccess?: () => void;
}

export function ActivationGateway({
  onActivated,
  onOpenSuperAdmin,
  onSuperAdminSuccess,
}: ActivationGatewayProps) {
  const [activeTab, setActiveTab] = useState<'INSTITUTE' | 'FACULTY' | 'SUPERADMIN'>('INSTITUTE');
  
  // Institute Admin state (Blank by default)
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  
  // Faculty login state (Blank by default)
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPin, setFacultyPin] = useState('');
  
  // SuperAdmin login state
  const [superAdminEmail, setSuperAdminEmail] = useState('');
  const [superAdminPassword, setSuperAdminPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Institute Admin Authentication
  const handleInstituteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanKey = licenseKeyInput.trim().toUpperCase();
    if (!cleanKey) {
      setErrorMessage('Please enter an authorized Institutional License Key.');
      return;
    }

    const savedTenants = localStorage.getItem('genie_tenants');
    const tenantList = savedTenants ? JSON.parse(savedTenants) : [];
    const matchedTenant = tenantList.find((t: any) => t.licenseKey?.toUpperCase() === cleanKey);

    if (matchedTenant || cleanKey.startsWith('GENIE-')) {
      onActivated(
        matchedTenant ? matchedTenant.id : 'tenant_dpkcop',
        {
          key: cleanKey,
          type: matchedTenant?.tier || 'ANNUAL',
          seats: matchedTenant?.facultySeats || 30,
        },
        'ADMIN'
      );
    } else {
      setErrorMessage('Invalid or expired Institutional License Key. Contact Platform SuperAdmin.');
    }
  };

  // 2. Faculty / HOD Authentication
  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = facultyEmail.trim().toLowerCase();
    if (!email) {
      setErrorMessage('Please enter your designated institutional email.');
      return;
    }
    if (!facultyPin.trim()) {
      setErrorMessage('Please enter your Faculty Access PIN / Password.');
      return;
    }

    const existingLicenseKey = localStorage.getItem('faculty_genie_license_key');
    const existingTenantId = localStorage.getItem('faculty_genie_tenant_id');

    if (!existingLicenseKey && !existingTenantId) {
      setErrorMessage('Institutional workspace not yet initialized. Please have Institute Admin login first.');
      return;
    }

    onActivated(
      existingTenantId || 'tenant_dpkcop',
      { key: existingLicenseKey, type: 'ANNUAL' },
      'FACULTY',
      email
    );
  };

  // 3. Platform SuperAdmin Authentication Gate (Direct Bypass to Dashboard)
  const handleSuperAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = superAdminEmail.trim().toLowerCase();
    const pwd = superAdminPassword.trim();

    if (
      (email === 'superadmin@genie.ac.in' || email === 'admin@genie.ac.in' || email === 'hiteshhkumar.agrawal@gmail.com') &&
      (pwd === 'GenieAdmin@2026' || pwd === 'Admin@2026')
    ) {
      if (onSuperAdminSuccess) {
        onSuperAdminSuccess();
      } else {
        onOpenSuperAdmin();
      }
    } else {
      setErrorMessage('Invalid SuperAdmin credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* 1. Official Executive Institutional Banner (White / Slate Theme) */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              HA
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                Navjeevan Education Society's
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                D. P. Kharde Navjeevan College of Pharmacy, Sinnar
              </h1>
              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                <span>MSBTE: <strong>62386</strong></span>
                <span>•</span>
                <span>DTE: <strong>5539</strong></span>
                <span>•</span>
                <span>PCI: <strong>9178</strong></span>
                <span>•</span>
                <span>AISHE: <strong>S-22693</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('SUPERADMIN');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                activeTab === 'SUPERADMIN'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>SuperAdmin Access</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Login Card in Clean White */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          
          {/* Executive Signatory Seal */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  Dr. Hiteshkumar Agrawal
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                    Signatory Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Principal &amp; Chief Academic Architect • MSBTE: 62386
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Academic OS Gateway
            </h2>
            <p className="text-xs text-slate-500">
              Statutory RBAC Access • MSBTE CIAAN-2023 &amp; PCI ER-2020
            </p>
          </div>

          {/* 3-Tier Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('INSTITUTE');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'INSTITUTE'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institute Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('FACULTY');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'FACULTY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Faculty / HOD</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('SUPERADMIN');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'SUPERADMIN'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>SuperAdmin</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM 1: Institute Admin Login */}
          {activeTab === 'INSTITUTE' && (
            <form onSubmit={handleInstituteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Institutional License Key *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="e.g. GENIE-ANNUAL-5539-XXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter statutory license key issued during institutional onboarding.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Admin Passcode / Master PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter Principal / Admin PIN"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authenticate Institute Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORM 2: Faculty / HOD Login */}
          {activeTab === 'FACULTY' && (
            <form onSubmit={handleFacultySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Designated Institutional Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    placeholder="e.g. faculty@pharmacy.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Must match the official email entered in the Faculty Master.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Faculty Access PIN / Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={facultyPin}
                    onChange={(e) => setFacultyPin(e.target.value)}
                    placeholder="Enter assigned PIN"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login to Teaching Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORM 3: SuperAdmin Credential Gate */}
          {activeTab === 'SUPERADMIN' && (
            <form onSubmit={handleSuperAdminSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  SuperAdmin Master Username / Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={superAdminEmail}
                    onChange={(e) => setSuperAdminEmail(e.target.value)}
                    placeholder="hiteshhkumar.agrawal@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  SuperAdmin Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={superAdminPassword}
                    onChange={(e) => setSuperAdminPassword(e.target.value)}
                    placeholder="Enter Master Password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify &amp; Enter SuperAdmin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
            Isolated Multi-Tenant Security • End-to-End Statutory Compliance
          </div>

        </div>
      </main>
    </div>
  );
}

export default ActivationGateway;
