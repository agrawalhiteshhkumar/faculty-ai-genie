'use client';

import React, { useState, useEffect } from 'react';

// Statutory Modal & Print Engines with reliable relative paths
import ExamCellModal from '../office/ExamCellModal';
import CadreRosterModal from '../office/CadreRosterModal';
import FRAModal from '../office/FRAModal';
import StoresModal from '../office/StoresModal';
import AdmissionsModal from '../office/AdmissionsModal';

import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  History, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  KeyRound, 
  ArrowRight, 
  PlusCircle, 
  Lock, 
  Users, 
  FileText, 
  Boxes, 
  GraduationCap, 
  IndianRupee, 
  UserCheck, 
  BookOpen, 
  ShieldAlert, 
  Key, 
  BadgeCheck, 
  Building, 
  Printer,
  ChevronLeft
} from 'lucide-react';

// Embedded Multi-Tenant Types & Schemas
export type SystemRole = 
  | 'PLATFORM_SUPER_ADMIN'
  | 'INSTITUTE_ADMIN'
  | 'OFFICER_DESK';

export interface InstituteTenant {
  id: string;
  name: string;
  trustName: string;
  location: string;
  licenseKey: string;
  msbteCode: string;
  dteCode: string;
  pciCode: string;
  aisheCode: string;
  createdAt: string;
  principalName: string;
  principalEmail: string;
}

export interface InstitutionalUser {
  id: string;
  instituteId: string;
  name: string;
  email: string;
  role: SystemRole;
  designationTitle: string;
  accessPin: string;
  allowedDesks: string[];
}

const SUPER_ADMIN_CREDENTIALS = {
  email: 'hiteshhkumar.agrawal@gmail.com',
  masterPin: '9637',
};

const STORAGE_KEYS = {
  TENANTS: 'office_ai_tenants_v1',
  USERS: 'office_ai_users_v1',
  REGISTERS: 'office_ai_registers_v1',
  ACTIVE_SESSION: 'office_ai_session_v1',
};

interface OfficeAIEngineProps {
  onExit?: () => void;
}

export function OfficeAIEngine({ onExit }: OfficeAIEngineProps) {
  const [mounted, setMounted] = useState(false);

  // Persistence State
  const [tenants, setTenants] = useState<InstituteTenant[]>([]);
  const [users, setUsers] = useState<InstitutionalUser[]>([]);
  
  // Auth Session State
  const [sessionUser, setSessionUser] = useState<InstitutionalUser | null>(null);
  const [sessionTenant, setSessionTenant] = useState<InstituteTenant | null>(null);
  const [isSuperAdminSession, setIsSuperAdminSession] = useState(false);

  // 3 Distinct Gateway Tabs
  const [portalTab, setPortalTab] = useState<'OFFICER_LOGIN' | 'PRINCIPAL_LOGIN' | 'SUPER_ADMIN'>('OFFICER_LOGIN');
  
  // Login Form States
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPin, setOfficerPin] = useState('');

  const [principalEmail, setPrincipalEmail] = useState('');
  const [principalLicenseOrPin, setPrincipalLicenseOrPin] = useState('');

  const [superAdminEmail, setSuperAdminEmail] = useState('');
  const [superAdminPin, setSuperAdminPin] = useState('');

  const [authError, setAuthError] = useState('');

  // Super Admin Tenant Creator Form
  const [newInstName, setNewInstName] = useState('');
  const [newTrustName, setNewTrustName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrincipal, setNewPrincipal] = useState('');
  const [newPrincipalEmail, setNewPrincipalEmail] = useState('');
  const [newMsbte, setNewMsbte] = useState('');
  const [newDte, setNewDte] = useState('');
  const [newPci, setNewPci] = useState('');
  const [newAishe, setNewAishe] = useState('');
  const [generatedKeyNotice, setGeneratedKeyNotice] = useState<{ key: string; name: string; email: string } | null>(null);

  // Institute Admin: Role Creator Form State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffDesignation, setNewStaffDesignation] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [selectedDeskScope, setSelectedDeskScope] = useState<string>('EXAM_CELL');

  // Operational desk selected
  const [activeDesk, setActiveDesk] = useState<string>('OVERVIEW');
  const [deskRecords, setDeskRecords] = useState<any[]>([]);
  const [auditLedger, setAuditLedger] = useState<any[]>([]);

  // Modals States for Statutory Print Engines
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isCadreModalOpen, setIsCadreModalOpen] = useState(false);
  const [isFRAModalOpen, setIsFRAModalOpen] = useState(false);
  const [isStoresModalOpen, setIsStoresModalOpen] = useState(false);
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);

  // Custom Record Creator Modal
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [entryField1, setEntryField1] = useState('');
  const [entryField2, setEntryField2] = useState('');
  const [entryField3, setEntryField3] = useState('');

  useEffect(() => {
    setMounted(true);
    try {
      const storedTenants = localStorage.getItem(STORAGE_KEYS.TENANTS);
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedTenants) setTenants(JSON.parse(storedTenants));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveTenants = (newTenants: InstituteTenant[]) => {
    setTenants(newTenants);
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(newTenants));
  };

  const saveUsers = (newUsers: InstitutionalUser[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  };

  const handleCreateTenant = () => {
    if (!newInstName.trim() || !newPrincipalEmail.trim()) {
      alert('College Legal Name and Principal Email are mandatory.');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const licenseKey = `BP-KEY-${newMsbte || 'INST'}-${randomSuffix}`;

    const newTenant: InstituteTenant = {
      id: 'TENANT-' + Date.now(),
      name: newInstName.trim(),
      trustName: newTrustName.trim(),
      location: newLocation.trim(),
      licenseKey: licenseKey,
      msbteCode: newMsbte.trim(),
      dteCode: newDte.trim(),
      pciCode: newPci.trim(),
      aisheCode: newAishe.trim(),
      createdAt: new Date().toLocaleDateString('en-IN'),
      principalName: newPrincipal.trim() || 'Principal',
      principalEmail: newPrincipalEmail.trim(),
    };

    const principalUser: InstitutionalUser = {
      id: 'USR-PRIN-' + Date.now(),
      instituteId: newTenant.id,
      name: newTenant.principalName,
      email: newTenant.principalEmail,
      role: 'INSTITUTE_ADMIN',
      designationTitle: 'Principal & Head of Institute',
      accessPin: '1234',
      allowedDesks: ['ALL'],
    };

    const updatedTenants = [...tenants, newTenant];
    const updatedUsers = [...users, principalUser];

    saveTenants(updatedTenants);
    saveUsers(updatedUsers);

    setGeneratedKeyNotice({
      key: licenseKey,
      name: newTenant.name,
      email: newTenant.principalEmail,
    });

    setNewInstName('');
    setNewTrustName('');
    setNewLocation('');
    setNewPrincipal('');
    setNewPrincipalEmail('');
    setNewMsbte('');
    setNewDte('');
    setNewPci('');
    setNewAishe('');
  };

  const handleCreateRole = () => {
    if (!sessionTenant || !newStaffName.trim() || !newStaffEmail.trim() || !newStaffPin.trim()) {
      alert('Name, email, and access PIN are mandatory.');
      return;
    }

    const newUser: InstitutionalUser = {
      id: 'USR-STAFF-' + Date.now(),
      instituteId: sessionTenant.id,
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: 'OFFICER_DESK',
      designationTitle: newStaffDesignation.trim() || 'Desk Officer',
      accessPin: newStaffPin.trim(),
      allowedDesks: [selectedDeskScope],
    };

    const updated = [...users, newUser];
    saveUsers(updated);

    const log = {
      id: 'LOG-' + Math.random().toString(16).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      actor: `${sessionUser?.name} (Principal)`,
      action: 'ROLE_DELEGATION_ISSUED',
      details: `Created officer account for ${newUser.name} [Scope: ${selectedDeskScope}]`,
      hash: '0x' + Math.random().toString(16).substring(2, 10),
    };
    setAuditLedger((prev) => [log, ...prev]);

    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffDesignation('');
    setNewStaffPin('');
    alert(`Desk Officer created! Email: ${newUser.email}, PIN: ${newUser.accessPin}`);
  };

  const handleOfficerLogin = () => {
    setAuthError('');
    const matchedUser = users.find(
      (u) => 
        u.role === 'OFFICER_DESK' &&
        u.email.toLowerCase().trim() === officerEmail.toLowerCase().trim() && 
        u.accessPin === officerPin.trim()
    );

    if (!matchedUser) {
      setAuthError('Invalid Officer credentials. Make sure your role has been created by the Principal.');
      return;
    }

    const tenant = tenants.find((t) => t.id === matchedUser.instituteId);
    if (!tenant) {
      setAuthError('Parent institute tenant not found.');
      return;
    }

    setSessionUser(matchedUser);
    setSessionTenant(tenant);
    setIsSuperAdminSession(false);
    setActiveDesk(matchedUser.allowedDesks[0] || 'OVERVIEW');
  };

  const handlePrincipalLogin = () => {
    setAuthError('');
    const cleanEmail = principalEmail.toLowerCase().trim();
    const cleanSecret = principalLicenseOrPin.trim();

    const matchedPrincipal = users.find(
      (u) => 
        u.role === 'INSTITUTE_ADMIN' &&
        u.email.toLowerCase().trim() === cleanEmail
    );

    if (!matchedPrincipal) {
      setAuthError('No Institute Admin account found for this email.');
      return;
    }

    const tenant = tenants.find((t) => t.id === matchedPrincipal.instituteId);
    if (!tenant) {
      setAuthError('Institute tenant not found.');
      return;
    }

    if (matchedPrincipal.accessPin === cleanSecret || tenant.licenseKey === cleanSecret) {
      setSessionUser(matchedPrincipal);
      setSessionTenant(tenant);
      setIsSuperAdminSession(false);
      setActiveDesk('OVERVIEW');
    } else {
      setAuthError('Invalid PIN or License Key for this Principal account.');
    }
  };

  const handleSuperAdminLogin = () => {
    setAuthError('');
    if (
      superAdminEmail.trim().toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase() &&
      superAdminPin.trim() === SUPER_ADMIN_CREDENTIALS.masterPin
    ) {
      setIsSuperAdminSession(true);
      setSessionUser({
        id: 'ROOT',
        instituteId: 'ROOT',
        name: 'Dr. Hiteshkumar Agrawal',
        email: SUPER_ADMIN_CREDENTIALS.email,
        role: 'PLATFORM_SUPER_ADMIN',
        designationTitle: 'Platform Owner & Chief Architect',
        accessPin: SUPER_ADMIN_CREDENTIALS.masterPin,
        allowedDesks: ['ALL'],
      });
    } else {
      setAuthError('Invalid Platform Owner credentials.');
    }
  };

  const handleLogout = () => {
    setSessionUser(null);
    setSessionTenant(null);
    setIsSuperAdminSession(false);
    setOfficerEmail('');
    setOfficerPin('');
    setPrincipalEmail('');
    setPrincipalLicenseOrPin('');
    setSuperAdminEmail('');
    setSuperAdminPin('');
    setAuthError('');
  };

  const handleLogAudit = (action: string, details: string) => {
    const log = {
      id: 'LOG-' + Math.random().toString(16).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      actor: `${sessionUser?.name} (${sessionUser?.designationTitle})`,
      action: action,
      details: details,
      hash: '0x' + Math.random().toString(16).substring(2, 10),
    };
    setAuditLedger((prev) => [log, ...prev]);
  };

  const handleAddBlankRecord = () => {
    if (!entryField1) return;
    const newRecord = {
      id: 'REC-' + Date.now().toString().slice(-4),
      desk: activeDesk,
      field1: entryField1,
      field2: entryField2,
      field3: entryField3,
      createdAt: new Date().toLocaleTimeString(),
      officer: sessionUser?.name || 'Officer',
    };
    setDeskRecords([newRecord, ...deskRecords]);
    handleLogAudit('STATUTORY_ENTRY_SAVED', `Added ${entryField1} in ${activeDesk}`);

    setEntryField1('');
    setEntryField2('');
    setEntryField3('');
    setShowAddEntryModal(false);
  };

  if (!mounted) return null;

  // VIEW 1: AUTHENTICATION GATEWAY
  if (!sessionUser) {
    return (
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 font-sans shadow-xl border border-slate-800">
        <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                onClick={onExit}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white mr-2 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Exit to Academic Home
              </button>
            )}
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white uppercase">INSTITUTIONAL OFFICE DESKS</div>
              <div className="text-[9px] font-black tracking-widest text-amber-400 uppercase">STATUTORY COMPLIANCE SUITE</div>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">MSBTE • PCI • DTE • FFC</span>
        </header>

        <main className="max-w-lg w-full mx-auto my-6 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-3 border-b border-slate-200 mb-6 text-xs font-bold text-center">
            <button
              onClick={() => { setPortalTab('OFFICER_LOGIN'); setAuthError(''); }}
              className={`pb-3 border-b-2 transition cursor-pointer ${portalTab === 'OFFICER_LOGIN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Desk Officer
            </button>
            <button
              onClick={() => { setPortalTab('PRINCIPAL_LOGIN'); setAuthError(''); }}
              className={`pb-3 border-b-2 transition cursor-pointer ${portalTab === 'PRINCIPAL_LOGIN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Principal Admin
            </button>
            <button
              onClick={() => { setPortalTab('SUPER_ADMIN'); setAuthError(''); }}
              className={`pb-3 border-b-2 transition cursor-pointer ${portalTab === 'SUPER_ADMIN' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              SuperAdmin
            </button>
          </div>

          {portalTab === 'OFFICER_LOGIN' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">DELEGATED OFFICER DESK</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Staff & Faculty Desk Login</h2>
                <p className="text-xs text-slate-500">Sign in with credentials assigned by your Principal.</p>
              </div>

              {users.filter(u => u.role === 'OFFICER_DESK').length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-blue-600" /> No Staff Accounts Yet</div>
                  <div className="text-[11px] mt-1 text-slate-500">The <strong>Principal</strong> must log in first under the <strong>Principal Admin</strong> tab to delegate officer roles.</div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Official Email</label>
                    <input
                      type="email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      placeholder="e.g. exam@college.edu"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Officer PIN</label>
                    <input
                      type="password"
                      value={officerPin}
                      onChange={(e) => setOfficerPin(e.target.value)}
                      placeholder="Enter assigned PIN"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {authError && <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">{authError}</div>}
                  <button onClick={handleOfficerLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
                    Enter Delegated Desk <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {portalTab === 'PRINCIPAL_LOGIN' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">EXECUTIVE HEAD</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Principal / Institute Admin</h2>
                <p className="text-xs text-slate-500">Access college administration and delegate officer roles.</p>
              </div>

              {tenants.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <div className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-amber-600" /> Institute Unprovisioned</div>
                  <div className="text-[11px] mt-1">The <strong>SuperAdmin</strong> must issue the initial license key in the SuperAdmin tab.</div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Principal Official Email</label>
                    <input
                      type="email"
                      value={principalEmail}
                      onChange={(e) => setPrincipalEmail(e.target.value)}
                      placeholder="e.g. principal@dpkcop.org.in"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">License Key OR PIN</label>
                    <input
                      type="password"
                      value={principalLicenseOrPin}
                      onChange={(e) => setPrincipalLicenseOrPin(e.target.value)}
                      placeholder="Enter License Key (BP-KEY-...) or default PIN: 1234"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {authError && <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">{authError}</div>}
                  <button onClick={handlePrincipalLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
                    Authenticate Principal Desk <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {portalTab === 'SUPER_ADMIN' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">PLATFORM OWNER</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">SuperAdmin Console</h2>
                <p className="text-xs text-slate-500">Create institutes and issue cryptographic keys.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Master Email</label>
                <input
                  type="email"
                  value={superAdminEmail}
                  onChange={(e) => setSuperAdminEmail(e.target.value)}
                  placeholder="hiteshhkumar.agrawal@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Master PIN</label>
                <input
                  type="password"
                  value={superAdminPin}
                  onChange={(e) => setSuperAdminPin(e.target.value)}
                  placeholder="Master PIN: 9637"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>
              {authError && <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">{authError}</div>}
              <button onClick={handleSuperAdminLogin} className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
                Access Master Provisioner <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        <footer className="text-center text-xs text-slate-500">
          Faculty AI Genie™ • Unified Statutory Architecture
        </footer>
      </div>
    );
  }

  // VIEW 2: SUPER ADMIN WORKSPACE
  if (isSuperAdminSession) {
    return (
      <div className="bg-slate-100 text-slate-900 rounded-3xl p-6 font-sans space-y-6">
        <header className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">PLATFORM OWNER</span>
            <h1 className="font-extrabold text-sm uppercase">Global Tenant & License Key Generator</h1>
          </div>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </header>

        <main className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">Provision New College & Generate License Key</h2>
            <p className="text-xs text-slate-500 mb-4">Registers the institute, issues cryptographic key, and creates Principal account.</p>

            {generatedKeyNotice && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800"><BadgeCheck className="w-4 h-4 text-emerald-600" /> College Provisioned & License Issued!</div>
                <div className="mt-2 font-mono font-bold text-sm bg-white px-3 py-2 rounded-lg border border-emerald-300 inline-block text-slate-900">{generatedKeyNotice.key}</div>
                <div className="mt-2 text-[11px] text-emerald-800">Principal Account: <strong>{generatedKeyNotice.email}</strong> (PIN: <code>1234</code>)</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">College Legal Name *</label>
                <input type="text" value={newInstName} onChange={(e) => setNewInstName(e.target.value)} placeholder="e.g. D. P. Kharde Navjeevan College of Pharmacy" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Governing Society / Trust</label>
                <input type="text" value={newTrustName} onChange={(e) => setNewTrustName(e.target.value)} placeholder="e.g. Navjeevan Education Society" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / District</label>
                <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g. Sinnar, Nashik" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Principal Name</label>
                <input type="text" value={newPrincipal} onChange={(e) => setNewPrincipal(e.target.value)} placeholder="e.g. Dr. Hiteshkumar Agrawal" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Principal Official Email *</label>
                <input type="email" value={newPrincipalEmail} onChange={(e) => setNewPrincipalEmail(e.target.value)} placeholder="e.g. principal@dpkcop.org.in" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">MSBTE Code</label>
                <input type="text" value={newMsbte} onChange={(e) => setNewMsbte(e.target.value)} placeholder="62386" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">DTE Code</label>
                <input type="text" value={newDte} onChange={(e) => setNewDte(e.target.value)} placeholder="5539" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">PCI Code</label>
                <input type="text" value={newPci} onChange={(e) => setNewPci(e.target.value)} placeholder="9178" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">AISHE Code</label>
                <input type="text" value={newAishe} onChange={(e) => setNewAishe(e.target.value)} placeholder="S-22693" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono" />
              </div>
            </div>

            <button onClick={handleCreateTenant} className="mt-4 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
              <Key className="w-4 h-4" /> Issue Cryptographic Key & Provision Tenant
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">Provisioned Colleges ({tenants.length})</h2>
            {tenants.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">Zero colleges provisioned. Use the form above.</div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {tenants.map((t) => (
                  <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-slate-500">{t.location} • Principal: {t.principalName} ({t.principalEmail})</div>
                    </div>
                    <code className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-mono">{t.licenseKey}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // VIEW 3: DESK WORKSPACE
  const isPrincipal = sessionUser.role === 'INSTITUTE_ADMIN';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 font-sans space-y-6 shadow-xs">
      <header className="border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-black text-base text-slate-900">{sessionTenant?.name}</div>
              <div className="text-xs font-mono text-slate-500">
                MSBTE: {sessionTenant?.msbteCode || '62386'} • DTE: {sessionTenant?.dteCode || '5539'} • PCI: {sessionTenant?.pciCode || '9178'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block text-xs">
              <div className="font-bold text-slate-900">{sessionUser.name}</div>
              <div className="text-[10px] text-blue-600 font-semibold">{sessionUser.designationTitle}</div>
            </div>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition border border-red-200 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs">
          <button onClick={() => setActiveDesk('OVERVIEW')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeDesk === 'OVERVIEW' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Overview
          </button>

          {isPrincipal && (
            <button onClick={() => setActiveDesk('ROLE_MANAGEMENT')} className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${activeDesk === 'ROLE_MANAGEMENT' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Users className="w-3.5 h-3.5" /> Delegate Roles
            </button>
          )}

          {(sessionUser.allowedDesks.includes('ALL') || sessionUser.allowedDesks.includes('ESTABLISHMENT')) && (
            <button onClick={() => setActiveDesk('ESTABLISHMENT')} className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${activeDesk === 'ESTABLISHMENT' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Users className="w-3.5 h-3.5 text-indigo-600" /> PCI Cadre Roster
            </button>
          )}

          {(sessionUser.allowedDesks.includes('ALL') || sessionUser.allowedDesks.includes('EXAM_CELL')) && (
            <button onClick={() => setActiveDesk('EXAM_CELL')} className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${activeDesk === 'EXAM_CELL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <GraduationCap className="w-3.5 h-3.5" /> MSBTE Exam Cell
            </button>
          )}

          {(sessionUser.allowedDesks.includes('ALL') || sessionUser.allowedDesks.includes('ACCOUNTS')) && (
            <button onClick={() => setActiveDesk('ACCOUNTS')} className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${activeDesk === 'ACCOUNTS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <IndianRupee className="w-3.5 h-3.5" /> FFC & FRA Accounts
            </button>
          )}

          {(sessionUser.allowedDesks.includes('ALL') || sessionUser.allowedDesks.includes('PHARMACY_STORES')) && (
            <button onClick={() => setActiveDesk('PHARMACY_STORES')} className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${activeDesk === 'PHARMACY_STORES' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Boxes className="w-3.5 h-3.5" /> Stores & Equipment
            </button>
          )}

          {(sessionUser.allowedDesks.includes('ALL') || sessionUser.allowedDesks.includes('STUDENT_ADMISSIONS')) && (
            <button onClick={() => setActiveDesk('STUDENT_ADMISSIONS')} className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${activeDesk === 'STUDENT_ADMISSIONS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <UserCheck className="w-3.5 h-3.5" /> Admissions & MahaDBT
            </button>
          )}
        </div>
      </header>

      <main className="space-y-6">
        {activeDesk === 'ROLE_MANAGEMENT' && isPrincipal && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-base font-extrabold text-slate-900 mb-1">Create Staff / Desk Officer Account</h2>
              <p className="text-xs text-slate-500 mb-4">Assign specific departmental roles to your faculty and staff.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Officer Name *</label>
                  <input type="text" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="Prof. S. R. Deshmukh" className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email *</label>
                  <input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="exam@college.edu" className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation Title</label>
                  <input type="text" value={newStaffDesignation} onChange={(e) => setNewStaffDesignation(e.target.value)} placeholder="MSBTE Exam Officer" className="w-full bg-white border border-slate-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delegated Desk</label>
                  <select value={selectedDeskScope} onChange={(e) => setSelectedDeskScope(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold">
                    <option value="EXAM_CELL">MSBTE Exam Cell</option>
                    <option value="ESTABLISHMENT">PCI Cadre Roster</option>
                    <option value="ACCOUNTS">FFC/FRA Accounts</option>
                    <option value="PHARMACY_STORES">Stores & Solvents</option>
                    <option value="STUDENT_ADMISSIONS">Admissions & MahaDBT</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign PIN *</label>
                  <input type="password" value={newStaffPin} onChange={(e) => setNewStaffPin(e.target.value)} placeholder="5678" className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold" />
                </div>
              </div>

              <button onClick={handleCreateRole} className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
                <PlusCircle className="w-4 h-4" /> Issue Officer Account
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-slate-900 mb-3">Active Staff for {sessionTenant?.name}</h3>
              {users.filter((u) => u.instituteId === sessionTenant?.id && u.role === 'OFFICER_DESK').length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">Zero officer accounts created yet.</div>
              ) : (
                <div className="divide-y divide-slate-200 text-xs">
                  {users.filter((u) => u.instituteId === sessionTenant?.id && u.role === 'OFFICER_DESK').map((u) => (
                    <div key={u.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                        <span className="text-slate-400 ml-2">({u.email})</span>
                        <div className="text-[11px] text-blue-600 font-medium">{u.designationTitle}</div>
                      </div>
                      <span className="font-mono text-[10px] bg-white px-2.5 py-0.5 rounded border border-slate-200 font-bold">Scope: {u.allowedDesks.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeDesk !== 'OVERVIEW' && activeDesk !== 'ROLE_MANAGEMENT' && (
          <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">LIVE STATUTORY DESK</span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {activeDesk === 'EXAM_CELL' && 'MSBTE Examination Cell'}
                  {activeDesk === 'ESTABLISHMENT' && 'PCI Teaching Cadre & Approvals'}
                  {activeDesk === 'ACCOUNTS' && 'Fees Regulating Committee (FFC / FRA) Accounts'}
                  {activeDesk === 'PHARMACY_STORES' && 'Pharmacy Stores & Hazardous Solvents'}
                  {activeDesk === 'STUDENT_ADMISSIONS' && 'DTE CAP Admissions & MahaDBT'}
                </h2>
                <p className="text-xs text-slate-500">Official live statutory register and verified PDF report generation engine.</p>
              </div>

              <div className="flex items-center gap-2">
                {activeDesk === 'EXAM_CELL' && (
                  <button onClick={() => setIsExamModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Launch MSBTE Exam & Print Engine
                  </button>
                )}

                {activeDesk === 'ESTABLISHMENT' && (
                  <button onClick={() => setIsCadreModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Launch PCI Cadre Matrix & PDF
                  </button>
                )}

                {activeDesk === 'ACCOUNTS' && (
                  <button onClick={() => setIsFRAModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Launch FFC/FRA Fee Proposal Engine
                  </button>
                )}

                {activeDesk === 'PHARMACY_STORES' && (
                  <button onClick={() => setIsStoresModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Launch SIF-E Stores & Solvents Matrix
                  </button>
                )}

                {activeDesk === 'STUDENT_ADMISSIONS' && (
                  <button onClick={() => setIsAdmissionsModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Launch DTE CAP & MahaDBT Matrix
                  </button>
                )}

                <button onClick={() => setShowAddEntryModal(true)} className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
                  <PlusCircle className="w-3.5 h-3.5" /> Add Manual Entry
                </button>
              </div>
            </div>

            {deskRecords.filter(r => r.desk === activeDesk).length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">No Records Found in {activeDesk}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Launch the official print engine above or add a manual entry.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-2">Record ID</th>
                      <th className="pb-2">Title / Item</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Reference / Amount</th>
                      <th className="pb-2">Logged By</th>
                      <th className="pb-2 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deskRecords.filter(r => r.desk === activeDesk).map((r) => (
                      <tr key={r.id} className="text-slate-700">
                        <td className="py-2.5 font-mono font-bold text-slate-900">{r.id}</td>
                        <td className="py-2.5 font-semibold text-slate-900">{r.field1}</td>
                        <td className="py-2.5 text-slate-600">{r.field2 || '-'}</td>
                        <td className="py-2.5 text-slate-600 font-mono">{r.field3 || '-'}</td>
                        <td className="py-2.5 text-blue-600 font-medium">{r.officer}</td>
                        <td className="py-2.5 text-slate-400 text-right">{r.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeDesk === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Institutional Summary</span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">{sessionTenant?.name}</h2>
                <div className="text-xs text-slate-500 mt-1">Trust: {sessionTenant?.trustName} • Location: {sessionTenant?.location}</div>
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs font-mono">
                <div className="text-[10px] text-slate-400 font-sans font-bold uppercase">License Key</div>
                <div className="font-bold text-slate-800">{sessionTenant?.licenseKey}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-600" /> Tamper-Evident Ledger
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">Append-Only Chained</span>
              </div>
              {auditLedger.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">Ledger active. Any report printouts or entries will appear here.</div>
              ) : (
                <div className="divide-y divide-slate-200 text-xs">
                  {auditLedger.map((l) => (
                    <div key={l.id} className="py-2 flex items-center justify-between text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800">{l.actor}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span>{l.details}</span>
                      </div>
                      <code className="text-[10px] text-emerald-600 font-mono font-bold">{l.hash}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showAddEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 mb-1">Add Entry to {activeDesk}</h3>
            <p className="text-xs text-slate-500 mb-4">Logged under {sessionUser.name}</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Title / Name *</label>
                <input type="text" value={entryField1} onChange={(e) => setEntryField1(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Classification / Spec</label>
                <input type="text" value={entryField2} onChange={(e) => setEntryField2(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reference / Amount</label>
                <input type="text" value={entryField3} onChange={(e) => setEntryField3(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono" />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddEntryModal(false)} className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddBlankRecord} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Modals */}
      <ExamCellModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} onLogAudit={handleLogAudit} />
      <CadreRosterModal isOpen={isCadreModalOpen} onClose={() => setIsCadreModalOpen(false)} onLogAudit={handleLogAudit} />
      <FRAModal isOpen={isFRAModalOpen} onClose={() => setIsFRAModalOpen(false)} onLogAudit={handleLogAudit} />
      <StoresModal isOpen={isStoresModalOpen} onClose={() => setIsStoresModalOpen(false)} onLogAudit={handleLogAudit} />
      <AdmissionsModal isOpen={isAdmissionsModalOpen} onClose={() => setIsAdmissionsModalOpen(false)} onLogAudit={handleLogAudit} />
    </div>
  );
}

export default OfficeAIEngine;
