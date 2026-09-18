import React from 'react';
import { 
  Building2, 
  Settings, 
  Zap, 
  ShieldCheck, 
  LogOut, 
  Search, 
  UserCheck,
  BookOpen
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
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Branding & Institution Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-black tracking-tight text-slate-900 text-sm sm:text-base">
            <div className="p-1.5 bg-blue-700 rounded-lg text-white font-mono text-xs shadow-sm flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>FACULTY AI GENIE™</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold uppercase tracking-wide">
              Academic OS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
            <button
              onClick={onOpenSetup}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-800 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition font-medium cursor-pointer"
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Ask Genie...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-500 font-mono shadow-2xs">⌘K</kbd>
          </button>

          {/* Quick Attendance */}
          <button
            onClick={onOpenQuickAttendance}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">1-Tap Attendance</span>
          </button>

          {/* Super Admin Access Button */}
          {onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Super Admin</span>
            </button>
          )}

          {/* Faculty Member Selector */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-500 mr-1.5 hidden sm:inline" />
            <select
              value={currentFaculty?.id || ''}
              onChange={(e) => onSelectFaculty(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer pr-4"
            >
              {facultyList.length > 0 ? (
                facultyList.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white text-slate-800">
                    {f.name} ({f.designation})
                  </option>
                ))
              ) : (
                <option value="" className="bg-white text-slate-800">
                  Faculty Member
                </option>
              )}
            </select>
          </div>

          {/* Exit / Switch License */}
          <button
            onClick={onExitWorkspace}
            className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-700 rounded-xl transition cursor-pointer"
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
