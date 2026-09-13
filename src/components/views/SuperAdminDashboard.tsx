import React, { useState, useEffect } from 'react';
import {
  Crown,
  KeyRound,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  Plus,
  Search,
  Filter,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Trash2,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  GraduationCap,
  FileCheck2,
  Database,
  ArrowUpRight,
  LayoutGrid,
  List,
  Layers,
} from 'lucide-react';
import { InstitutionalLicense, SuperAdminStats, LicenseStatus, PlanTier } from '../../types';

interface SuperAdminDashboardProps {
  onExitToGateway: () => void;
  onEnterTenantWorkspace: (tenantId: string, license: InstitutionalLicense) => void;
  activeTenantId?: string | null;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onExitToGateway,
  onEnterTenantWorkspace,
  activeTenantId,
}) => {
  const [licenses, setLicenses] = useState<InstitutionalLicense[]>([]);
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // New License Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAisheCode, setNewAisheCode] = useState('');
  const [newPciCode, setNewPciCode] = useState('');
  const [newDteCode, setNewDteCode] = useState('');
  const [newMsbteCode, setNewMsbteCode] = useState('');
  const [newDepartment, setNewDepartment] = useState('Department of Pharmacy');
  const [newSanctionedIntake, setNewSanctionedIntake] = useState(60);
  const [newSeatLimit, setNewSeatLimit] = useState(10);
  const [newPlanTier, setNewPlanTier] = useState<PlanTier>('REGULATORY_STANDARD');
  const [newValidityMonths, setNewValidityMonths] = useState(12);
  const [newAllowedProgrammes, setNewAllowedProgrammes] = useState<string[]>([
    'PCI ER-2020',
    'MSBTE K-Scheme',
  ]);
  const [newNotes, setNewNotes] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Success Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Tenant Deep Inspection Modal
  const [inspectTenantData, setInspectTenantData] = useState<any | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, licsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/licenses'),
      ]);
      const statsData = await statsRes.json();
      const licsData = await licsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (licsData.success) setLicenses(licsData.licenses || []);
    } catch (err) {
      console.error('Failed to load Super Admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim() || !newAdminEmail.trim()) return;

    setCreateSubmitting(true);
    try {
      const res = await fetch('/api/admin/licenses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeName: newCollegeName.trim(),
          adminEmail: newAdminEmail.trim(),
          aisheCode: newAisheCode.trim(),
          pciCode: newPciCode.trim(),
          dteCode: newDteCode.trim(),
          msbteCode: newMsbteCode.trim(),
          department: newDepartment.trim(),
          facultySeatLimit: newSeatLimit,
          sanctionedIntake: newSanctionedIntake,
          planTier: newPlanTier,
          validityMonths: newValidityMonths,
          allowedProgrammes: newAllowedProgrammes,
          notes: newNotes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(
          `Successfully provisioned institutional license '${data.license.key}' for ${data.license.collegeName}`
        );
        setIsCreateModalOpen(false);
        // Reset form fields
        setNewCollegeName('');
        setNewAdminEmail('');
        setNewAisheCode('');
        setNewPciCode('');
        setNewDteCode('');
        setNewMsbteCode('');
        setNewDepartment('Department of Pharmacy');
        setNewSanctionedIntake(60);
        setNewSeatLimit(10);
        setNewAllowedProgrammes(['PCI ER-2020', 'MSBTE K-Scheme']);
        setNewNotes('');
        await fetchDashboardData();
      } else {
        alert(data.error || 'Failed to provision institutional license.');
      }
    } catch (err) {
      console.error('Failed to create license:', err);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleResetAllToBlank = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all institutional tenants to a completely blank slate? This will purge all demo and provisioned colleges.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/admin/tenants/reset-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage('All institutional tenants and licenses reset to a completely blank slate.');
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to reset tenants:', err);
    }
  };

  const handleUpdateStatus = async (licenseKey: string, newStatus: LicenseStatus) => {
    try {
      const res = await fetch('/api/admin/licenses/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`License ${licenseKey} status changed to ${newStatus}`);
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update license status:', err);
    }
  };

  const handleExtendExpiry = async (licenseKey: string, months = 12) => {
    try {
      const res = await fetch('/api/admin/licenses/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey, months }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`License ${licenseKey} extended by ${months} months!`);
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to extend license:', err);
    }
  };

  const handleDeleteLicense = async (licenseKey: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete license ${licenseKey} and purge its isolated tenant database? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/licenses/${encodeURIComponent(licenseKey)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`License ${licenseKey} permanently deleted.`);
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete license:', err);
    }
  };

  const handleInspectTenant = async (tenantId: string) => {
    setInspectLoading(true);
    try {
      const res = await fetch(`/api/admin/tenant/${encodeURIComponent(tenantId)}`);
      const data = await res.json();
      if (data.success) {
        setInspectTenantData(data);
      }
    } catch (err) {
      console.error('Failed to inspect tenant:', err);
    } finally {
      setInspectLoading(false);
    }
  };

  const toggleProgramme = (prog: string) => {
    setNewAllowedProgrammes((prev) =>
      prev.includes(prog) ? prev.filter((p) => p !== prog) : [...prev, prog]
    );
  };

  // Filtered list based on search and status
  const filteredLicenses = licenses.filter((lic) => {
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'PENDING'
        ? lic.status === 'PENDING_ACTIVATION'
        : lic.status === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lic.collegeName.toLowerCase().includes(q) ||
      lic.key.toLowerCase().includes(q) ||
      lic.adminEmail.toLowerCase().includes(q) ||
      (lic.aisheCode && lic.aisheCode.toLowerCase().includes(q)) ||
      (lic.pciCode && lic.pciCode.toLowerCase().includes(q)) ||
      (lic.dteCode && lic.dteCode.toLowerCase().includes(q)) ||
      (lic.msbteCode && lic.msbteCode.toLowerCase().includes(q)) ||
      (lic.aishePciCode && lic.aishePciCode.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar Header */}
      <header className="border-b border-amber-500/30 bg-slate-900/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  SUPER ADMIN PLATFORM CONTROL
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Super Admin / Platform Owner
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="text-slate-200 font-semibold">Dr. Hiteshkumar Agrawal</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">agrawal.hiteshkumar@gmail.com</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                  <ShieldCheck className="w-3 h-3" /> Multi-Tenant Orchestrator Active
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchDashboardData()}
              title="Refresh Telemetry"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              id="generate-license-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Provision & Onboard Institution</span>
            </button>

            <button
              onClick={onExitToGateway}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Gateway</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Platform Owner Profile Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/30 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/25 flex-shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Dr. Hiteshkumar Agrawal
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Super Admin / Platform Owner
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2.5 mt-1 flex-wrap">
                <span className="text-slate-300 font-mono flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  agrawal.hiteshkumar@gmail.com
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400/90 flex items-center gap-1 font-medium text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Statutory Root Orchestrator (AISHE • PCI • DTE • MSBTE)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              id="provision-top-action-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Provision & Onboard Institution</span>
            </button>
            <button
              onClick={handleResetAllToBlank}
              id="reset-tenants-blank-btn"
              title="Purge all tenants to start completely blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-500/40 text-slate-400 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All to Blank Slate</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs font-bold px-2 py-0.5 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Fleet Telemetry Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Tenants</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.totalTenants ?? licenses.length}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Institutions Registered</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Workspaces</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats?.activeLicenses ?? 0}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats?.pendingActivation ?? 0} pending activation
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Faculty Seats</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-400">{stats?.totalAllocatedSeats ?? 0}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Allocated Capacity</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats?.totalEnrolledStudents ?? 0}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Across All Isolated Tenants</p>
          </div>
        </section>

        {/* EMPTY-STATE CARD WHEN NO INSTITUTIONS EXIST */}
        {licenses.length === 0 ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 sm:p-14 text-center shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                No Institutional Tenants Provisioned
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Generate an institutional license to onboard your first college workspace.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                id="provision-onboard-institution-btn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Provision & Onboard Institution</span>
              </button>
            </div>
          </div>
        ) : (
          /* Master Registry & College Cards View */
          <div className="space-y-4">
            {/* Toolbar Header */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Provisioned Institutional Tenants & Workspaces</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect workspace metrics, launch isolated tenant sessions, or update statutory compliance.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search college, key, AISHE..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="REVOKED">Revoked</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode('CARDS')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      viewMode === 'CARDS'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode('TABLE')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      viewMode === 'TABLE'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filtered Results Empty State */}
            {filteredLicenses.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No institutional tenants match your search filter "{searchQuery}".
              </div>
            ) : viewMode === 'CARDS' ? (
              /* Institutional College Cards Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredLicenses.map((lic) => {
                  const isExpired = new Date(lic.expiresAt) < new Date();
                  const daysLeft = Math.ceil(
                    (new Date(lic.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={lic.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl transition space-y-4 relative flex flex-col justify-between"
                    >
                      <div className="space-y-3.5">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                                {lic.collegeName}
                              </h3>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="flex items-center gap-1 font-mono text-slate-300">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  {lic.adminEmail}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span>{lic.department || 'Department of Pharmacy'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {lic.status === 'ACTIVE' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                              </span>
                            )}
                            {lic.status === 'PENDING_ACTIVATION' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                            {lic.status === 'SUSPENDED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                                <XCircle className="w-3 h-3" />
                                Suspended
                              </span>
                            )}
                            {lic.status === 'REVOKED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold uppercase tracking-wider">
                                <AlertOctagon className="w-3 h-3" />
                                Revoked
                              </span>
                            )}
                          </div>
                        </div>

                        {/* License Key Box */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/90">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              16-Digit License:
                            </span>
                            <span className="font-mono font-bold text-xs text-amber-300 tracking-wider">
                              {lic.key}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyKey(lic.key)}
                            title="Copy 16-character license key"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            {copiedKey === lic.key ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Statutory Compliance Codes (AISHE, PCI, DTE, MSBTE) */}
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Statutory Compliance Codes
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[11px]">
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col">
                              <span className="text-[9px] text-slate-500 uppercase font-sans font-bold">AISHE</span>
                              <span className="text-slate-200 font-bold truncate">{lic.aisheCode || 'N/A'}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col">
                              <span className="text-[9px] text-amber-400/90 uppercase font-sans font-bold">PCI</span>
                              <span className="text-amber-300 font-bold truncate">{lic.pciCode || 'N/A'}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col">
                              <span className="text-[9px] text-indigo-400/90 uppercase font-sans font-bold">DTE</span>
                              <span className="text-indigo-300 font-bold truncate">{lic.dteCode || 'N/A'}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col">
                              <span className="text-[9px] text-emerald-400/90 uppercase font-sans font-bold">MSBTE</span>
                              <span className="text-emerald-300 font-bold truncate">{lic.msbteCode || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Sanctioned Intake & Academic Schemes */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] text-slate-400 font-medium">Sanctioned Intake:</span>
                            <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                              {lic.sanctionedIntake || 60} Seats
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({lic.facultySeatLimit} Faculty Capacity)
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {lic.allowedProgrammes?.map((prog) => (
                              <span
                                key={prog}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              >
                                {prog}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Plan & Expiry */}
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                              {lic.planTier.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              Expires {new Date(lic.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-semibold ${
                              daysLeft > 30 ? 'text-emerald-400' : daysLeft > 0 ? 'text-amber-400' : 'text-rose-400'
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
                          </span>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        {/* Action Button: Inspect / Launch Tenant Workspace */}
                        <button
                          onClick={() => onEnterTenantWorkspace(lic.tenantId, lic)}
                          id="launch-tenant-workspace-btn"
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Inspect / Launch Tenant Workspace</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        {/* Secondary Lifecycle Actions */}
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleInspectTenant(lic.tenantId)}
                            title="Inspect Workspace Telemetry"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                          >
                            <Database className="w-3.5 h-3.5" />
                          </button>
                          {lic.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleUpdateStatus(lic.key, 'SUSPENDED')}
                              title="Suspend License"
                              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 transition cursor-pointer text-xs"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(lic.key, 'ACTIVE')}
                              title="Activate License"
                              className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 border border-slate-700 transition cursor-pointer text-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleExtendExpiry(lic.key, 12)}
                            title="Extend +1 Year"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition cursor-pointer text-[10px] font-bold"
                          >
                            +1Y
                          </button>
                          <button
                            onClick={() => handleDeleteLicense(lic.key)}
                            title="Purge & Delete Workspace"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-rose-200 border border-slate-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Institution & Designated Admin</th>
                        <th className="py-3 px-4">16-Digit License Key</th>
                        <th className="py-3 px-4">Intake & Schemes</th>
                        <th className="py-3 px-4">Plan & Expiry</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLicenses.map((lic) => {
                        const daysLeft = Math.ceil(
                          (new Date(lic.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );

                        return (
                          <tr key={lic.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4 min-w-[220px]">
                              <div className="font-bold text-white text-sm">{lic.collegeName}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{lic.adminEmail}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-1 flex flex-wrap gap-1 items-center">
                                {lic.aisheCode && (
                                  <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                                    AISHE: {lic.aisheCode}
                                  </span>
                                )}
                                {lic.pciCode && (
                                  <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-amber-300/90">
                                    PCI: {lic.pciCode}
                                  </span>
                                )}
                                {lic.dteCode && (
                                  <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-indigo-300/90">
                                    DTE: {lic.dteCode}
                                  </span>
                                )}
                                {lic.msbteCode && (
                                  <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-emerald-300/90">
                                    MSBTE: {lic.msbteCode}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-300 bg-slate-950 px-2 py-1 rounded border border-amber-500/30 tracking-wider">
                                  {lic.key}
                                </span>
                                <button
                                  onClick={() => handleCopyKey(lic.key)}
                                  title="Copy key"
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                                >
                                  {copiedKey === lic.key ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 min-w-[180px]">
                              <div className="font-semibold text-slate-200">
                                {lic.sanctionedIntake || 60} Intake ({lic.facultySeatLimit} Seats)
                              </div>
                              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                {lic.allowedProgrammes.join(' • ')}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                                {lic.planTier.replace('_', ' ')}
                              </div>
                              <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{new Date(lic.expiresAt).toLocaleDateString()}</span>
                              </div>
                              <div
                                className={`text-[10px] font-medium mt-0.5 ${
                                  daysLeft > 30 ? 'text-emerald-400' : daysLeft > 0 ? 'text-amber-400' : 'text-rose-400'
                                }`}
                              >
                                {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {lic.status === 'ACTIVE' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Active
                                </span>
                              )}
                              {lic.status === 'PENDING_ACTIVATION' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                              {lic.status === 'SUSPENDED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                                  <XCircle className="w-3 h-3" />
                                  Suspended
                                </span>
                              )}
                              {lic.status === 'REVOKED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold uppercase tracking-wider">
                                  <AlertOctagon className="w-3 h-3" />
                                  Revoked
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onEnterTenantWorkspace(lic.tenantId, lic)}
                                  title="Inspect / Launch Tenant Workspace"
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition flex items-center gap-1 shadow-sm cursor-pointer"
                                >
                                  <span>Inspect / Launch</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleInspectTenant(lic.tenantId)}
                                  title="Telemetry"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                                >
                                  <Database className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLicense(lic.key)}
                                  title="Delete"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* PROVISION & ONBOARD INSTITUTION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    + Provision & Onboard Institution
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generates valid 16-character license key and configures isolated workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLicense} className="space-y-4">
              {/* Quick Template Autofill */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-amber-500/30">
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Template:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNewCollegeName('D. P. Kharde Navjeevan College of Pharmacy');
                    setNewAdminEmail('admin@dpkpharmacy.edu.in');
                    setNewDepartment('Department of Pharmacy');
                    setNewAisheCode('S-22693');
                    setNewDteCode('5539');
                    setNewMsbteCode('0182');
                    setNewPciCode('PCI-2041');
                    setNewSanctionedIntake(60);
                    setNewSeatLimit(10);
                    setNewAllowedProgrammes(['PCI ER-2020', 'MSBTE J-Scheme']);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 transition flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3 h-3" />
                  Load D. P. Kharde Navjeevan COP
                </button>
              </div>

              {/* Institution Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g., D. P. Kharde Navjeevan College of Pharmacy"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Designated Admin Email & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Designated Admin Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="e.g., admin@dpkpharmacy.edu.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department / Academic Unit
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g., Department of Pharmacy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Statutory Compliance Codes: AISHE, PCI, DTE, MSBTE */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Statutory Compliance Codes
                  </span>
                  <span className="text-[10px] text-slate-500">Government & Board Accreditations</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      1. AISHE Code
                    </label>
                    <input
                      type="text"
                      value={newAisheCode}
                      onChange={(e) => setNewAisheCode(e.target.value)}
                      placeholder="e.g., C-54201"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      2. PCI Institute Code
                    </label>
                    <input
                      type="text"
                      value={newPciCode}
                      onChange={(e) => setNewPciCode(e.target.value)}
                      placeholder="e.g., PCI-2041"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      3. DTE Institute Code
                    </label>
                    <input
                      type="text"
                      value={newDteCode}
                      onChange={(e) => setNewDteCode(e.target.value)}
                      placeholder="e.g., DTE-6214"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      4. MSBTE Institute Code
                    </label>
                    <input
                      type="text"
                      value={newMsbteCode}
                      onChange={(e) => setNewMsbteCode(e.target.value)}
                      placeholder="e.g., MSBTE-0182"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sanctioned Intake & Academic Schemes */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    Sanctioned Intake & Academic Schemes
                  </span>
                  <span className="text-[10px] text-slate-500">PCI ER-2020 & MSBTE K-Scheme</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Sanctioned Student Intake
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={newSanctionedIntake}
                      onChange={(e) => setNewSanctionedIntake(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Approved intake seats (e.g., 60 seats)
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Faculty Seat Capacity (Max 10)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newSeatLimit}
                      onChange={(e) => setNewSeatLimit(Math.min(10, Math.max(1, Number(e.target.value))))}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Hard-locked strictly to 10 faculty seats for compliance
                    </span>
                  </div>
                </div>

                {/* Academic Schemes Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Academic Schemes & Curriculum Standards
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'PCI ER-2020',
                      'MSBTE K-Scheme',
                      'B.Pharm (PCI)',
                      'M.Pharm (PCI)',
                      'Polytechnic / D.Voc',
                    ].map((scheme) => {
                      const isSelected = newAllowedProgrammes.includes(scheme);
                      return (
                        <button
                          type="button"
                          key={scheme}
                          onClick={() => toggleProgramme(scheme)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>{isSelected ? '✓' : '+'}</span>
                          <span>{scheme}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Plan Tier & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Validity Period
                  </label>
                  <select
                    value={newValidityMonths}
                    onChange={(e) => setNewValidityMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value={6}>6 Months (Pilot Trial)</option>
                    <option value={12}>1 Year (Standard Annual)</option>
                    <option value={24}>2 Years (Bi-Annual)</option>
                    <option value={36}>3 Years (Full Regulatory Cycle)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Plan Tier
                  </label>
                  <select
                    value={newPlanTier}
                    onChange={(e) => setNewPlanTier(e.target.value as PlanTier)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="REGULATORY_STANDARD">Regulatory Standard</option>
                    <option value="INSTITUTIONAL_PLATINUM">Platinum (NBA+NAAC Candidate)</option>
                    <option value="PILOT_TRIAL">Pilot Trial</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Internal Administrative Notes (Optional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g., Approved by Board of Governors meeting #18"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {createSubmitting ? 'Provisioning...' : '+ Provision & Generate 16-Character License Key'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT TENANT MODAL */}
      {inspectTenantData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Tenant Telemetry: {inspectTenantData.institution?.name || inspectTenantData.tenantId}
                  </h3>
                  <p className="text-xs text-slate-400">
                    License: <span className="font-mono text-amber-300">{inspectTenantData.license?.key}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectTenantData(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Counts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Faculty Users</span>
                <div className="text-xl font-black text-white mt-0.5">
                  {inspectTenantData.counts?.faculty ?? 0} / {inspectTenantData.license?.facultySeatLimit ?? 0}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Enrolled Students</span>
                <div className="text-xl font-black text-amber-400 mt-0.5">
                  {inspectTenantData.counts?.students ?? 0}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Teaching Diaries</span>
                <div className="text-xl font-black text-indigo-400 mt-0.5">
                  {inspectTenantData.counts?.teachingDiaries ?? 0}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Records</span>
                <div className="text-xl font-black text-emerald-400 mt-0.5">
                  {inspectTenantData.counts?.auditLogs ?? 0}
                </div>
              </div>
            </div>

            {/* Statutory Compliance Codes */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="font-bold text-slate-300 mb-1">Statutory Compliance Status:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>AISHE: <span className="text-slate-300">{inspectTenantData.license?.aisheCode || 'Not Set'}</span></div>
                <div>PCI: <span className="text-amber-300">{inspectTenantData.license?.pciCode || 'Not Set'}</span></div>
                <div>DTE: <span className="text-indigo-300">{inspectTenantData.license?.dteCode || 'Not Set'}</span></div>
                <div>MSBTE: <span className="text-emerald-300">{inspectTenantData.license?.msbteCode || 'Not Set'}</span></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectTenantData(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const lic = inspectTenantData.license;
                  const tid = inspectTenantData.tenantId;
                  setInspectTenantData(null);
                  onEnterTenantWorkspace(tid, lic);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>Launch Tenant Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
