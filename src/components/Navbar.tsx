import React from 'react';
import { 
  Building2, 
  Settings, 
  Zap, 
  ShieldCheck, 
  LogOut, 
  Search, 
  UserCheck,
  BookOpen,
  Menu
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
  onOpenMobileMenu?: () => void;
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
  onOpenMobileMenu,
}: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger (mobile only) & Branding */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 font-black tracking-tight text-slate-900 text-sm sm:text-base shrink-0">
            <div className="p-1.5 bg-blue-700 rounded-lg text-white font-mono text-xs shadow-sm flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="truncate max-w-[120px] sm:max-w-none">FACULTY AI GENIE™</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold uppercase tracking-wide">
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
              <span className="truncate max-w-[180px]">
                {institution?.name ? institution.shortName || institution.name : 'Institution Setup'}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Actions, SuperAdmin, Faculty Switcher, Exit */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Ask Genie Search */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Ask Genie...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-500 font-mono shadow-2xs">⌘K</kbd>
          </button>

          {/* Quick Attendance */}
          <button
            onClick={onOpenQuickAttendance}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">1-Tap Attendance</span>
            <span className="sm:hidden text-[11px]">1-Tap</span>
          </button>

          {/* Super Admin Access Button */}
          {onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Super Admin</span>
            </button>
          )}

          {/* Faculty Member Selector */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs max-w-[130px] sm:max-w-[200px]">
            <UserCheck className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:inline shrink-0" />
            <select
              value={currentFaculty?.id || ''}
              onChange={(e) => onSelectFaculty(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer truncate w-full"
            >
              {facultyList.length > 0 ? (
                facultyList.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white text-slate-800">
                    {f.name}
                  </option>
                ))
              ) : (
                <option value="" className="bg-white text-slate-800">
                  Faculty
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
