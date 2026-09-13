import React from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Building2,
  Sparkles,
  Crown,
  LogOut,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { UserRole, InstitutionProfile, FacultyMaster, InstitutionalLicense } from '../types';
import { InstitutionSeal } from './InstitutionSeal';

interface NavbarProps {
  institution: InstitutionProfile | null;
  license?: InstitutionalLicense | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  facultyList: FacultyMaster[];
  currentFaculty: FacultyMaster;
  onSelectFaculty?: (facultyId: string) => void;
  onOpenSearch: () => void;
  onOpenQuickAttendance: () => void;
  onOpenSetup?: () => void;
  onOpenSuperAdmin?: () => void;
  onExitWorkspace?: () => void;
  isSuperAdminUser?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  institution,
  license,
  activeRole,
  setActiveRole,
  facultyList,
  currentFaculty,
  onSelectFaculty,
  onOpenSearch,
  onOpenQuickAttendance,
  onOpenSetup,
  onOpenSuperAdmin,
  onExitWorkspace,
  isSuperAdminUser,
}) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Super Admin Top Context Bar if in Super Admin inspection mode */}
      {isSuperAdminUser && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-bold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Super Admin Active • Inspecting Tenant Workspace: <strong>{license?.collegeName || institution?.name || 'Isolated Tenant'}</strong></span>
            {license?.key && <span className="font-mono bg-amber-600/30 px-1.5 py-0.2 rounded border border-amber-600/40">{license.key}</span>}
          </div>
          {onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="bg-slate-950 text-amber-300 hover:bg-slate-900 px-2.5 py-0.5 rounded text-[11px] font-extrabold transition cursor-pointer"
            >
              Return to Super Admin Dashboard →
            </button>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Institution & App Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onOpenSetup}
              title="Click to Configure Institution & Masters"
              className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-inner flex-shrink-0 ring-2 ring-amber-400/20 hover:ring-amber-400/60 transition overflow-hidden cursor-pointer"
            >
              <InstitutionSeal
                logoUrl={institution?.logoUrl}
                size="sm"
                shortName={institution?.shortName || 'DPK'}
                institutionName={institution?.name}
              />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  FACULTY AI GENIE
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Academic OS
                  </span>
                </span>
                {license?.key && (
                  <span
                    className="hidden xl:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30"
                    title={`Institutional License Key: ${license.key}`}
                  >
                    <KeyRound className="w-2.5 h-2.5" />
                    {license.key}
                  </span>
                )}
                {onOpenSetup && (
                  <button
                    onClick={onOpenSetup}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1"
                    title="Institution Settings & Masters"
                  >
                    <Building2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Settings</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 font-medium">
                <span className="text-slate-300 font-semibold">
                  {institution?.shortName || institution?.name || license?.collegeName || 'Institution Awaiting Setup'}
                </span>
                {institution?.departmentName && (
                  <>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span className="hidden sm:inline text-slate-400 text-[11px] font-normal">
                      {institution.departmentName}
                    </span>
                  </>
                )}
                {((institution?.aisheCode || license?.aisheCode) ||
                  (institution?.pciCode || license?.pciCode) ||
                  (institution?.dteCode || license?.dteCode) ||
                  (institution?.msbteCode || license?.msbteCode)) && (
                  <>
                    <span className="hidden md:inline text-slate-600">|</span>
                    <span className="hidden md:inline text-slate-300 text-[11px] font-mono">
                      {[
                        (institution?.aisheCode || license?.aisheCode)
                          ? `AISHE: ${institution?.aisheCode || license?.aisheCode}`
                          : '',
                        (institution?.pciCode || license?.pciCode)
                          ? `PCI: ${institution?.pciCode || license?.pciCode}`
                          : '',
                        (institution?.dteCode || license?.dteCode)
                          ? `DTE: ${institution?.dteCode || license?.dteCode}`
                          : '',
                        (institution?.msbteCode || license?.msbteCode)
                          ? `MSBTE: ${institution?.msbteCode || license?.msbteCode}`
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Search Bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="global-academic-search-btn"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-800 rounded-lg border border-slate-700 transition shadow-sm hover:text-white"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Ask Genie...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            <button
              id="quick-attendance-header-btn"
              onClick={onOpenQuickAttendance}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/90 rounded-lg border border-emerald-700/60 transition shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">1-Tap Attendance</span>
            </button>

            {/* Platform Super Admin Quick Button */}
            {onOpenSuperAdmin && (
              <button
                onClick={onOpenSuperAdmin}
                id="navbar-super-admin-btn"
                title="Open Platform Owner Super Admin Dashboard"
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/40 rounded-lg transition"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin</span>
              </button>
            )}

            {/* Role & Faculty Switcher */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {/* Adjunct / Visiting Faculty Scoping Badge */}
              {(currentFaculty.employmentType === 'ADJUNCT_VISITING' || currentFaculty.employmentType === 'GUEST_LECTURER') && (
                <div
                  title="Visiting / Adjunct Faculty: Scope restricted to assigned subjects only"
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Adjunct Scope Active</span>
                </div>
              )}

              {/* Faculty Selector (Allows testing Full-Time vs Adjunct scopes) */}
              {facultyList.length > 0 && onSelectFaculty && (
                <div className="relative hidden md:block">
                  <label htmlFor="faculty-select-dropdown" className="sr-only">Select Faculty</label>
                  <select
                    id="faculty-select-dropdown"
                    value={currentFaculty.id}
                    onChange={(e) => onSelectFaculty(e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold cursor-pointer max-w-[170px] truncate"
                    title="Switch active faculty persona / appointment type"
                  >
                    {facultyList.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} {fac.employmentType === 'ADJUNCT_VISITING' ? '(Adjunct)' : fac.role === 'HOD' ? '(HOD)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative">
                <label htmlFor="role-select-dropdown" className="sr-only">Select Role</label>
                <select
                  id="role-select-dropdown"
                  value={activeRole}
                  onChange={(e) => {
                    const newRole = e.target.value as UserRole;
                    setActiveRole(newRole);
                    if (newRole === 'PLATFORM_SUPER_ADMIN' && onOpenSuperAdmin) {
                      onOpenSuperAdmin();
                    }
                  }}
                  className="bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold cursor-pointer"
                >
                  <option value="FACULTY">Faculty Member</option>
                  <option value="LAB_ASSISTANT">Lab Assistant</option>
                  <option value="HOD">Head of Dept (HOD)</option>
                  <option value="PRINCIPAL_DEAN">Principal / Dean</option>
                  <option value="INSTITUTION_ADMIN">Institution Admin</option>
                  <option value="PLATFORM_SUPER_ADMIN">Platform Super Admin</option>
                </select>
              </div>

              {/* Exit Workspace / Switch College */}
              {onExitWorkspace && (
                <button
                  onClick={onExitWorkspace}
                  title="Exit Workspace & Switch Institutional Key"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700 hover:border-rose-700/50 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
