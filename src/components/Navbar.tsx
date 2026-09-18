import React from 'react';
import { 
  Building2, 
  Settings, 
  Zap, 
  ShieldCheck, 
  LogOut, 
  Search, 
  UserCheck 
} from 'lucide-react';
import { InstitutionProfile, InstitutionalLicense, FacultyMaster, UserRole } from '../types';

interface NavbarProps {
  institution: InstitutionProfile | null;
  license: InstitutionalLicense | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  facultyList: FacultyMaster[];
  currentFaculty: FacultyMaster;
  onSelectFaculty: (id: string) => void;
  onOpenSearch: () => void;
  onOpenQuickAttendance: () => void;
  onOpenSetup: () => void;
  onOpenSuperAdmin?: () => void;
  onExitWorkspace: () => void;
  isSuperAdminUser?: boolean;
}

export function Navbar({
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
}: NavbarProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Branding & Institution Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-black tracking-tight text-white text-sm sm:text-base">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white font-mono text-xs">AI</span>
            <span>FACULTY AI GENIE</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-semibold uppercase">
              Academic OS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-700">
            <button
              onClick={onOpenSetup}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition"
              title="Configure Institution"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>{institution?.name ? institution.shortName || institution.name : 'Institution Awaiting Setup'}</span>
            </button>
          </div>
        </div>

        {/* Right: Actions, SuperAdmin, Faculty Switcher, Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask Genie Search */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Ask Genie...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-500 font-mono">⌘K</kbd>
          </button>

          {/* Quick Attendance */}
          <button
            onClick={onOpenQuickAttendance}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-semibold transition"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">1-Tap Attendance</span>
          </button>

          {/* Super Admin Access Button -> Must strictly call onOpenSuperAdmin */}
          {onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin</span>
            </button>
          )}

          {/* Faculty Member Selector */}
          <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 mr-1.5 hidden sm:inline" />
            <select
              value={currentFaculty?.id || ''}
              onChange={(e) => onSelectFaculty(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-4"
            >
              {facultyList.length > 0 ? (
                facultyList.map((f) => (
                  <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                    {f.name} ({f.designation})
                  </option>
                ))
              ) : (
                <option value="" className="bg-slate-900 text-white">
                  Faculty Member
                </option>
              )}
            </select>
          </div>

          {/* Exit / Switch License */}
          <button
            onClick={onExitWorkspace}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 rounded-xl transition cursor-pointer"
            title="Exit Institutional Workspace & Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
