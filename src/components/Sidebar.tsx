'use client';

import React from 'react';
import {
  Home,
  Briefcase,
  BookOpen,
  PlusCircle,
  ClipboardCheck,
  Users,
  Award,
  FileText,
  ShieldCheck,
  Building,
  Crown,
  X
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
  | 'QCI_ACCREDITATION'
  | 'OFFICE_DESKS'
  | 'SETUP';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  activeRole: UserRole;
  pendingAttendanceCount: number;
  defaultersCount: number;
  lowAttainmentCount: number;
  onOpenSuperAdmin: () => void;
  license: InstitutionalLicense | null;
  currentFaculty: FacultyMaster;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  currentTab,
  setCurrentTab,
  activeRole,
  pendingAttendanceCount,
  defaultersCount,
  lowAttainmentCount,
  onOpenSuperAdmin,
  license,
  currentFaculty,
  isOpen,
  onClose,
}: SidebarProps) {
  const navItems = [
    { id: 'HOME' as NavTab, label: 'Dashboard Home', icon: Home },
    { id: 'MY_WORK' as NavTab, label: 'My Academic Work', icon: Briefcase },
    { id: 'TEACH' as NavTab, label: 'Lesson Planner & Syllabus', icon: BookOpen },
    { id: 'CREATE' as NavTab, label: 'Assessment Creator', icon: PlusCircle },
    { id: 'ASSESS' as NavTab, label: 'Marks & Internal Tests', icon: ClipboardCheck },
    { id: 'STUDENTS' as NavTab, label: 'Student Cohorts', icon: Users, badge: defaultersCount > 0 ? `${defaultersCount} Def` : undefined },
    { id: 'OUTCOMES' as NavTab, label: 'CO-PO Attainment', icon: Award, badge: lowAttainmentCount > 0 ? `${lowAttainmentCount} Low` : undefined },
    { id: 'DOCUMENTS' as NavTab, label: 'Course Dossiers & Files', icon: FileText },
    { id: 'OFFICE_DESKS' as NavTab, label: 'Institutional Office Desks', icon: Building, highlight: true },
    { id: 'QCI_ACCREDITATION' as NavTab, label: 'QCI / NBA Standards', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Mobile Header Close */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100">
            <span className="font-black text-xs uppercase tracking-wider text-slate-800">Navigation</span>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Faculty Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[10px] uppercase font-bold text-slate-400">Authenticated Faculty</div>
            <div className="font-extrabold text-xs text-slate-900 truncate mt-0.5">{currentFaculty?.name}</div>
            <div className="text-[10px] text-blue-700 font-semibold">{currentFaculty?.designation}</div>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-blue-50/70 text-blue-900 hover:bg-blue-100/80 border border-blue-200/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-blue-700' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isActive ? 'bg-white text-blue-700' : 'bg-rose-100 text-rose-800'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50">
          <button
            onClick={onOpenSuperAdmin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Platform Governance</span>
          </button>
          <div className="text-[10px] text-center text-slate-400 font-mono">
            PCI • MSBTE • DTE • AISHE
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
