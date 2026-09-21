'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Copy, 
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onExit: () => void;
}

export type LicenseTierType = 'TRIAL' | 'ANNUAL' | 'ENTERPRISE';

interface Tenant {
  id: string;
  name: string;
  aisheCode: string;
  dteCode: string;
  msbteCode: string;
  pciCode: string;
  coordinatorEmail: string;
  licenseKey: string;
  tier: LicenseTierType;
  facultySeats: number;
  validUntil: string;
  status: 'Active' | 'Pending';
  createdAt: string;
}

export function SuperAdminDashboard({ onExit }: SuperAdminDashboardProps) {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('genie_tenants');
    return saved ? JSON.parse(saved) : [];
  });

  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [instName, setInstName] = useState('');
  const [aisheCode, setAisheCode] = useState('');
  const [dteCode, setDteCode] = useState('');
  const [msbteCode, setMsbteCode] = useState('');
  const [pciCode, setPciCode] = useState('');
  const [instEmail, setInstEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState<LicenseTierType>('ANNUAL');
  const [seats, setSeats] = useState(25);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleTierChange = (tier: LicenseTierType) => {
    setSelectedTier(tier);
    if (tier === 'TRIAL') setSeats(10);
    else if (tier === 'ANNUAL') setSeats(25);
    else if (tier === 'ENTERPRISE') setSeats(60);
  };

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim()) return;

    const keySeed = (dteCode.trim() || msbteCode.trim() || 'INST').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const tierPrefix = selectedTier === 'TRIAL' ? 'TRIAL' : selectedTier === 'ENTERPRISE' ? 'ENT' : 'ANNUAL';
    const newKey = `GENIE-${tierPrefix}-${keySeed}-${randomSuffix}`;

    const expDate = new Date();
    if (selectedTier === 'TRIAL') {
      expDate.setDate(expDate.getDate() + 30);
    } else if (selectedTier === 'ANNUAL') {
      expDate.setFullYear(expDate.getFullYear() + 1);
    } else {
      expDate.setFullYear(expDate.getFullYear() + 3);
    }

    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: instName.trim(),
      aisheCode: aisheCode.trim().toUpperCase(),
      dteCode: dteCode.trim().toUpperCase(),
      msbteCode: msbteCode.trim().toUpperCase(),
      pciCode: pciCode.trim().toUpperCase(),
      coordinatorEmail: instEmail.trim(),
      licenseKey: newKey,
      tier: selectedTier,
      facultySeats: Number(seats) || 25,
      validUntil: expDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    const updated = [newTenant, ...tenants];
    setTenants(updated);
    localStorage.setItem('genie_tenants', JSON.stringify(updated));

    setInstName('');
    setAisheCode('');
    setDteCode('');
    setMsbteCode('');
    setPciCode('');
    setInstEmail('');
    setShowProvisionModal(false);
  };

  const copyToClipboard = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all provisioned tenants?')) {
      setTenants([]);
      localStorage.removeItem('genie_tenants');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top App Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-900 text-white rounded-xl shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 leading-tight">Faculty AI Genie™</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    SUPERADMIN PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-500">Statutory Multi-Tenant Provisioning (AISHE • DTE • MSBTE • PCI)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowProvisionModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision &amp; Onboard Institution</span>
            </button>
            <button
              onClick={onExit}
              className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Gateway</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6 flex-1">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tenants</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{tenants.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Institutions Registered</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Workspaces</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{tenants.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Isolated Multi-Tenant RLS</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Seats</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {tenants.reduce((acc, curr) => acc + (curr.facultySeats || 0), 0)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Allocated Capacity</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Statutory Verification</span>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">100%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">MSBTE J-Scheme &amp; PCI ER-2020</p>
          </div>
        </div>

        {/* Tenant Directory Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Provisioned Institutions &amp; Active Licenses</h2>
              <p className="text-xs text-slate-500 mt-0.5">All 4 statutory credentials (AISHE, DTE, MSBTE, PCI) mapped to isolated tenant workspaces.</p>
            </div>
            {tenants.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Slate</span>
              </button>
            )}
          </div>

          {tenants.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-700 mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Institutional Tenants Provisioned Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "Provision &amp; Onboard Institution" to register an institute with its AISHE, DTE, MSBTE, and PCI codes.
              </p>
              <button
                onClick={() => setShowProvisionModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard First Institution</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">College / Institute Name</th>
                    <th className="py-3 px-4">Statutory Codes</th>
                    <th className="py-3 px-4">Tier &amp; Validity</th>
                    <th className="py-3 px-4">Institutional License Key</th>
                    <th className="py-3 px-4">Seats</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{t.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{t.coordinatorEmail || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        <div className="space-y-0.5">
                          {t.aisheCode && <div><span className="text-slate-400 font-sans">AISHE:</span> {t.aisheCode}</div>}
                          {t.dteCode && <div><span className="text-slate-400 font-sans">DTE:</span> {t.dteCode}</div>}
                          {t.msbteCode && <div><span className="text-slate-400 font-sans">MSBTE:</span> {t.msbteCode}</div>}
                          {t.pciCode && <div><span className="text-slate-400 font-sans">PCI:</span> {t.pciCode}</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          t.tier === 'ENTERPRISE'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : t.tier === 'ANNUAL'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {t.tier || 'ANNUAL'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{t.validUntil || '1 Year'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg">
                          <code className="font-mono text-blue-900 font-bold">{t.licenseKey}</code>
                          <button
                            onClick={() => copyToClipboard(t.licenseKey)}
                            title="Copy License Key"
                            className="text-slate-400 hover:text-blue-700 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedKey === t.licenseKey && (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-bold">{t.facultySeats}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Provisioning Modal with Interactive Tier Selector */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-lg w-full space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>Onboard New Institution</span>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProvision} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. D. P. Kharde Navjeevan College of Pharmacy, Sinnar"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* License Tier Selection Cards */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Accreditation &amp; License Tier *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTierChange('TRIAL')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTier === 'TRIAL'
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] text-slate-900">Demo Trial</span>
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <p className="text-[10px] text-slate-500">30-Day Evaluation (10 Seats)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTierChange('ANNUAL')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTier === 'ANNUAL'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] text-slate-900">Standard</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <p className="text-[10px] text-slate-500">1-Year Academic (25 Seats)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTierChange('ENTERPRISE')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTier === 'ENTERPRISE'
                        ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] text-slate-900">Enterprise</span>
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <p className="text-[10px] text-slate-500">3-Year Multi-Accreditation</p>
                  </button>
                </div>
              </div>

              {/* 4 Statutory Codes Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">AISHE Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S-22693"
                    value={aisheCode}
                    onChange={(e) => setAisheCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">DTE Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5539"
                    value={dteCode}
                    onChange={(e) => setDteCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MSBTE Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 62386"
                    value={msbteCode}
                    onChange={(e) => setMsbteCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PCI Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9178"
                    value={pciCode}
                    onChange={(e) => setPciCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Coordinator Email & Seats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Official Coordinator Email</label>
                  <input
                    type="email"
                    placeholder="62386principal@msbte.ac.in"
                    value={instEmail}
                    onChange={(e) => setInstEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Generate Key &amp; Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SuperAdminDashboard;
