'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Crown, 
  UserCheck, 
  KeyRound, 
  CheckCircle2, 
  GraduationCap 
} from 'lucide-react';

interface ActivationGatewayProps {
  onActivated: (tenantId?: string, license?: any) => void;
  onOpenSuperAdmin: () => void;
}

export function ActivationGateway({
  onActivated,
  onOpenSuperAdmin,
}: ActivationGatewayProps) {
  const [activeTab, setActiveTab] = useState<'INSTITUTE' | 'FACULTY'>('INSTITUTE');
  const [licenseKeyInput, setLicenseKeyInput] = useState('GENIE-INST-2026-ACTIVE');
  const [facultyPin, setFacultyPin] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('Dr. Hiteshkumar Agrawal (Principal)');

  const handleInstantLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    onActivated('tenant_dpkcop', {
      key: licenseKeyInput || 'GENIE-INST-2026-ACTIVE',
      type: 'ENTERPRISE',
      seats: 35,
    });
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
              onClick={onOpenSuperAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>SuperAdmin Access</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Login Gateway Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Executive Signatory Badge */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  Dr. Hiteshkumar Agrawal
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-normal">
                    Signatory Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Principal &amp; Chief Academic Architect • +91 9637521852
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">
              Academic OS Gateway
            </h2>
            <p className="text-xs text-slate-400">
              MSBTE CIAAN-2023, PCI ER-2020 &amp; NBA Tier-II Direct Assessment
            </p>
          </div>

          {/* 3-Tier Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('INSTITUTE')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
              onClick={() => setActiveTab('FACULTY')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'FACULTY'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Faculty / HOD</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleInstantLaunch} className="space-y-4 text-xs">
            {activeTab === 'INSTITUTE' ? (
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Institutional License Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="e.g. GENIE-INST-2026-ACTIVE"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Full administrative authority: Student/Faculty CSV imports, NBA Attainment, and statutory registers.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Select Faculty Profile
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Dr. Hiteshkumar Agrawal (Principal)">
                      Dr. Hiteshkumar Agrawal (Principal &amp; Professor - 16h)
                    </option>
                    <option value="Prof. Snehal Deshmukh (Lecturer)">
                      Prof. Snehal Deshmukh (Lecturer - 18h)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Faculty Access PIN (Optional)
                  </label>
                  <input
                    type="password"
                    value={facultyPin}
                    onChange={(e) => setFacultyPin(e.target.value)}
                    placeholder="Enter assigned PIN or press Enter"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'INSTITUTE'
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <span>Enter Workspace ({activeTab === 'INSTITUTE' ? 'Executive Admin' : 'Teaching Faculty'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Launch Pre-configured Profile */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>D. P. Kharde Navjeevan COP</span>
            <button
              type="button"
              onClick={() => onActivated('tenant_dpkcop', { key: 'GENIE-INST-5539-ACTIVE', type: 'ENTERPRISE', seats: 35 })}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              1-Click Fast Launch →
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ActivationGateway;
