import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Sparkles,
  ClipboardList,
  GraduationCap,
  TrendingUp,
  FileText,
  Award,
  Settings,
  ShieldCheck,
  ChevronRight,
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
  | 'QCI_ACCREDITATION'
  | 'SETUP';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  activeRole: UserRole;
  pendingAttendanceCount?: number;
  defaultersCount?: number;
  lowAttainmentCount?: number;
  onOpenSuperAdmin?: () => void;
  license?: InstitutionalLicense | null;
  currentFaculty?: FacultyMaster | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  pendingAttendanceCount = 0,
  defaultersCount = 0,
  lowAttainmentCount = 0,
  onOpenSuperAdmin,
  license,
  currentFaculty,
  isOpen = false,
  onClose,
}) => {
  const navItems = [
    {
      id: 'HOME' as NavTab,
      label: 'Cockpit & Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'MY_WORK' as NavTab,
      label: 'My Teaching Diary',
      icon: CalendarCheck,
      badge: pendingAttendanceCount > 0 ? `${pendingAttendanceCount} Pending` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'TEACH' as NavTab,
      label: 'Daily Class Delivery',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'CREATE' as NavTab,
      label: 'Genie Curriculum Copilot',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      id: 'ASSESS' as NavTab,
      label: 'Assessments & Marks',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'STUDENTS' as NavTab,
      label: 'Students & Attendance',
      icon: GraduationCap,
      badge: defaultersCount > 0 ? `${defaultersCount} Defaulters` : null,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'OUTCOMES' as NavTab,
      label: 'CO-PO & NBA Intelligence',
      icon: TrendingUp,
      badge: lowAttainmentCount > 0 ? `${lowAttainmentCount} Under-Attained` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'DOCUMENTS' as NavTab,
      label: 'Course File & MSBTE Proformas',
      icon: FileText,
      badge: 'PH-1..11',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'QCI_ACCREDITATION' as NavTab,
      label: 'PCI-QCI Accreditation',
      icon: Award,
      badge: '11-Crit',
      badgeColor: 'bg-amber-100 text-slate-950 font-black border-amber-300',
    },
    {
      id: 'SETUP' as NavTab,
      label: 'Institutional Master Control',
      icon: Settings,
      badge: null,
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto z-50 lg:z-0 w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Mobile Close Button & Header */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100">
            <div className="text-xs font-black uppercase tracking-wider text-slate-900">
              Academic OS Navigation
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Persona Badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-400">Active Authority Persona</div>
            <div className="text-xs font-black text-slate-900 mt-0.5 flex items-center justify-between">
              <span>{activeRole === 'ADMIN' ? 'Executive Oversight (Admin)' : 'Teaching Faculty Mode'}</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  activeRole === 'ADMIN'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {activeRole}
              </span>
            </div>
            {currentFaculty && (
              <div className="text-[11px] text-slate-600 mt-1 truncate">
                {currentFaculty.name}
              </div>
            )}
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isSelected = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold ${
                        isSelected
                          ? 'bg-white/10 text-white border-white/20'
                          : item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Statutory Compliance Badge */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="p-3 bg-slate-900 text-white rounded-xl text-center space-y-1">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              MSBTE: 62386 • PCI: 9178
            </div>
            <div className="text-xs font-extrabold text-slate-100">
              Dr. Hiteshkumar Agrawal
            </div>
            <div className="text-[10px] text-slate-400">
              Principal &amp; Authorized Signatory
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
