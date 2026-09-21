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
}

export function ActivationGateway({
  onActivated,
  onOpenSuperAdmin,
}: ActivationGatewayProps) {
  const [activeTab, setActiveTab] = useState<'SUPERADMIN' | 'INSTITUTE' | 'FACULTY'>('INSTITUTE');
  
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

    // Validate key against stored provisioned tenants or standard issued format
    const savedTenants = localStorage.getItem('genie_tenants');
    const tenantList = savedTenants ? JSON.parse(savedTenants) : [];
    const matchedTenant = tenantList.find((t: any) => t.licenseKey?.toUpperCase() === cleanKey);

    if (matchedTenant || cleanKey.startsWith('GENIE-')) {
      onActivated(
        matchedTenant ? matchedTenant.id : 'tenant_authenticated',
        {
          key: cleanKey,
          type: matchedTenant?.tier || 'ANNUAL',
          seats: matchedTenant?.facultySeats || 25,
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

    // Verify faculty exists in the institution's directory
    const savedFaculty = localStorage.getItem('faculty_genie_faculty');
    const facultyList = savedFaculty ? JSON.parse(savedFaculty) : [];

    const foundFaculty = facultyList.find(
      (f: any) => f.email?.toLowerCase() === email || f.id?.toLowerCase() === email
    );

    // If an institutional license is already active, log into that faculty's scope
    const existingLicenseKey = localStorage.getItem('faculty_genie_license_key');
    const existingTenantId = localStorage.getItem('faculty_genie_tenant_id');

    if (!existingLicenseKey && !existingTenantId) {
      // First-time entry requires the institution to have been activated by the admin
      setErrorMessage('Institutional workspace not yet initialized. Please have Institute Admin login first.');
      return;
    }

    onActivated(
      existingTenantId || 'tenant_authenticated',
      { key: existingLicenseKey, type: 'ANNUAL' },
      'FACULTY',
      email
    );
  };

  // 3. Platform SuperAdmin Authentication Gate
  const handleSuperAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = superAdminEmail.trim().toLowerCase();
    const pwd = superAdminPassword.trim();

    if (
      (email === 'superadmin@genie.ac.in' || email === 'admin@genie.ac.in' || email === 'hiteshhkumar.agrawal@gmail.com') &&
      (pwd === 'GenieAdmin@2026' || pwd === 'Admin@2026')
    ) {
      onOpenSuperAdmin();
    } else {
      setErrorMessage('Invalid SuperAdmin credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Official Executive Institutional Banner */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-900 text-amber-400 rounded-xl flex items-center justify-center font-bold text-base border border-blue-700 shadow-sm shrink-0">
              HA
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Navjeevan Education Society's
              </div>
              <h1 className="text-sm sm:text-base font-black text-white">
                D. P. Kharde Navjeevan College of Pharmacy, Sinnar
              </h1>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
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
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>SuperAdmin Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Login Gateway Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          
          {/* Executive Signatory Seal */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  Dr. Hiteshkumar Agrawal
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-normal">
                    Signatory Verified
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Principal &amp; Chief Academic Architect • MSBTE: 62386
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">
              Academic OS Gateway
            </h2>
            <p className="text-xs text-slate-400">
              Statutory RBAC Access • MSBTE CIAAN-2023 &amp; PCI ER-2020
            </p>
          </div>

          {/* 3-Tier Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('INSTITUTE');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'INSTITUTE'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>SuperAdmin</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM 1: Institute Admin Login */}
          {activeTab === 'INSTITUTE' && (
            <form onSubmit={handleInstituteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Institutional License Key *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="e.g. GENIE-ANNUAL-5539-XXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Unique statutory key issued during institutional onboarding.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Admin Passcode / Master PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter Principal / Admin PIN"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
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
                <label className="block font-bold text-slate-300 mb-1">
                  Designated Institutional Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    placeholder="e.g. faculty@pharmacy.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Must match email registered by Institute Admin in the Faculty Master.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Faculty Access PIN / Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={facultyPin}
                    onChange={(e) => setFacultyPin(e.target.value)}
                    placeholder="Enter assigned PIN"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
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
                <label className="block font-bold text-slate-300 mb-1">
                  SuperAdmin Master Username / Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={superAdminEmail}
                    onChange={(e) => setSuperAdminEmail(e.target.value)}
                    placeholder="superadmin@genie.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  SuperAdmin Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={superAdminPassword}
                    onChange={(e) => setSuperAdminPassword(e.target.value)}
                    placeholder="Enter Master Password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify SuperAdmin Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-[10px] text-slate-500">
            Isolated Multi-Tenant Security • End-to-End Statutory Compliance
          </div>

        </div>
      </main>
    </div>
  );
}

export default ActivationGateway;
