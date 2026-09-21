import React from 'react';
import {
  Home,
  Briefcase,
  BookOpen,
  Sparkles,
  ClipboardCheck,
  Users,
  Award,
  FileCheck2,
  AlertTriangle,
  FileText,
  Clock,
  Building2,
  Crown,
  KeyRound,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { UserRole, InstitutionalLicense, FacultyMaster } from '../types';

export type NavTab =
  | 'HOME'
  | 'MY_WORK'
  | 'TEACH'
  | 'CREATE'
  | 'ASSESS'
  | 'STUDENTS'
  | 'OUTCOMES'
  | 'DOCUMENTS'
  | 'SETUP';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  activeRole: UserRole;
  pendingAttendanceCount: number;
  defaultersCount: number;
  lowAttainmentCount: number;
  onOpenSuperAdmin?: () => void;
  license?: InstitutionalLicense | null;
  currentFaculty?: FacultyMaster;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  pendingAttendanceCount,
  defaultersCount,
  lowAttainmentCount,
  onOpenSuperAdmin,
  license,
  currentFaculty,
  isOpen = false,
  onClose,
}) => {
  const isAdjunct =
    currentFaculty?.employmentType === 'ADJUNCT_VISITING' ||
    currentFaculty?.employmentType === 'GUEST_LECTURER';

  const assignedSubjectLabel =
    currentFaculty?.assignedSubjects?.[0]?.subjectTitle || 'Pharmaceutics-I Practical';

  const navItems: Array<{
    id: NavTab;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
    restrictedForAdjunct?: boolean;
  }> = [
    {
      id: 'HOME',
      label: 'HOME',
      description: 'Today & Priorities',
      icon: Home,
    },
    {
      id: 'MY_WORK',
      label: 'MY WORK',
      description: 'Timetable & PBAS',
      icon: Briefcase,
      badge: pendingAttendanceCount > 0 ? `${pendingAttendanceCount} Slot` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'TEACH',
      label: 'TEACH',
      description: isAdjunct ? 'Assigned Lab Rubrics' : 'Plans & Lab Rubrics',
      icon: BookOpen,
    },
    {
      id: 'CREATE',
      label: 'CREATE',
      description: 'AI Content Studio',
      icon: Sparkles,
      badge: 'AI Suite',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      id: 'ASSESS',
      label: 'ASSESS',
      description: 'Marks & Scrutiny',
      icon: ClipboardCheck,
    },
    {
      id: 'STUDENTS',
      label: 'STUDENTS',
      description: '360° & Mentoring',
      icon: Users,
      badge: defaultersCount > 0 ? `${defaultersCount} At-Risk` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'OUTCOMES',
      label: 'OUTCOMES',
      description: isAdjunct ? 'Restricted to Full-Time' : 'NBA OBE & ATRs',
      icon: isAdjunct ? Lock : Award,
      badge: isAdjunct ? 'Locked' : lowAttainmentCount > 0 ? 'ATR Alert' : undefined,
      badgeColor: isAdjunct
        ? 'bg-slate-100 text-slate-500 border-slate-300'
        : 'bg-amber-100 text-amber-800 border-amber-300',
      restrictedForAdjunct: true,
    },
    {
      id: 'DOCUMENTS',
      label: 'DOCUMENTS',
      description: isAdjunct ? 'Restricted to Full-Time' : 'Course Files & MSBTE PH-1..11',
      icon: isAdjunct ? Lock : FileCheck2,
      badge: isAdjunct ? 'Locked' : 'PH-1 to 11',
      badgeColor: isAdjunct
        ? 'bg-slate-100 text-slate-500 border-slate-300'
        : 'bg-amber-100 text-amber-800 border-amber-300',
      restrictedForAdjunct: true,
    },
    {
      id: 'SETUP',
      label: 'SETUP & MASTERS',
      description: isAdjunct ? 'Restricted to Admin/HOD' : 'Institution & Excel Import',
      icon: isAdjunct ? Lock : Building2,
      badge: isAdjunct ? 'Restricted' : 'Admin',
      badgeColor: isAdjunct
        ? 'bg-slate-100 text-slate-500 border-slate-300'
        : 'bg-emerald-100 text-emerald-800 border-emerald-300',
      restrictedForAdjunct: true,
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    setCurrentTab(tab);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-4">
      <div className="px-3 space-y-1">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between px-3 pb-3 lg:hidden border-b border-slate-100 mb-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Navigation</span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Adjunct / Visiting Faculty Scope Banner */}
        {isAdjunct && (
          <div className="mb-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-950">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Adjunct Scope: Subject-Restricted</span>
            </div>
            <p className="text-[10px] text-amber-800 leading-tight">
              Access scoped strictly to <strong>{assignedSubjectLabel}</strong>. Administrative setups and institutional dossiers are locked.
            </p>
          </div>
        )}

        <div className="hidden lg:block px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Primary Navigation
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id.toLowerCase()}`}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-sm ring-1 ring-slate-900'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs tracking-tight">{item.label}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Regulatory Badge & Tenant Context in Sidebar footer */}
      <div className="px-4 mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-700">
          <span>Active Regulation</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
            MSBTE CIAAN-23
          </span>
        </div>
        <p className="text-[10px] text-slate-600 leading-relaxed">
          PCI ER-2020 & NBA Tier-II Direct CO-PO Calculations Enforced.
        </p>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Zero-Redundancy Active
          </div>
          <p className="text-[10px] text-slate-600 mt-0.5">
            Marks entered once update ledger, attainment, defaulters & SAR tables.
          </p>
          {license?.key && (
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">License:</span>
              <span className="font-mono font-bold text-slate-800">{license.key}</span>
            </div>
          )}
        </div>

        {onOpenSuperAdmin && (
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenSuperAdmin();
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Platform Super Admin</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-shrink-0 min-h-[calc(100vh-4rem)] flex-col shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay & Sliding Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white shadow-2xl flex flex-col z-10 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
