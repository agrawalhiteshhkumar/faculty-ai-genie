'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  ShieldCheck,
  Key,
  Copy,
  ExternalLink
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onExit: () => void;
}

interface Tenant {
  id: string;
  name: string;
  code: string;
  coordinatorEmail: string;
  licenseKey: string;
  facultySeats: number;
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
  const [instCode, setInstCode] = useState('');
  const [instEmail, setInstEmail] = useState('');
  const [seats, setSeats] = useState(25);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim() || !instCode.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanCode = instCode.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const newKey = `GENIE-INST-${cleanCode}-${randomSuffix}`;

    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: instName.trim(),
      code: cleanCode,
      coordinatorEmail: instEmail.trim(),
      licenseKey: newKey,
      facultySeats: Number(seats) || 25,
      status: 'Active',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    const updated = [newTenant, ...tenants];
    setTenants(updated);
    localStorage.setItem('genie_tenants', JSON.stringify(updated));

    setInstName('');
    setInstCode('');
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
      
      {/* Top Professional App Bar (Crisp Navy & White) */}
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
                <p className="text-xs text-slate-500">Global Tenant Provisioning &amp; Statutory Compliance Control</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowProvisionModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Provision &amp; Onboard Institution</span>
            </button>
            <button
              onClick={onExit}
              className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Gateway</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6 flex-1">
        
        {/* KPI Metric Cards (Blue / White Scaffolding) */}
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
            <p className="text-[11px] text-slate-500 mt-0.5">Operating under Isolated RLS</p>
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
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NBA / PCI Audits</span>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">100%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">CIAAN-2023 Compliant</p>
          </div>
        </div>

        {/* Tenant Directory Table / List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Provisioned Institutions &amp; Active Licenses</h2>
              <p className="text-xs text-slate-500 mt-0.5">Share the generated license keys with college coordinators to grant them entry.</p>
            </div>
            {tenants.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold transition-colors"
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
                Click "Provision &amp; Onboard Institution" to generate your first collegiate license key and activate an isolated tenant workspace.
              </p>
              <button
                onClick={() => setShowProvisionModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
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
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Coordinator Email</th>
                    <th className="py-3 px-4">Institutional License Key</th>
                    <th className="py-3 px-4">Seats</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{t.code}</td>
                      <td className="py-3 px-4 text-slate-600">{t.coordinatorEmail || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg">
                          <code className="font-mono text-blue-900 font-bold">{t.licenseKey}</code>
                          <button
                            onClick={() => copyToClipboard(t.licenseKey)}
                            title="Copy License Key"
                            className="text-slate-400 hover:text-blue-700 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedKey === t.licenseKey && (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{t.facultySeats}</td>
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

      {/* Provisioning Modal Popup */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>Onboard New Institution</span>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
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
                  placeholder="e.g. Samarth Institute of Pharmacy"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code (DTE/MSBTE/PCI) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5225"
                    value={instCode}
                    onChange={(e) => setInstCode(e.target.value)}
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Coordinator Email</label>
                <input
                  type="email"
                  placeholder="principal@institution.edu.in"
                  value={instEmail}
                  onChange={(e) => setInstEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md"
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
