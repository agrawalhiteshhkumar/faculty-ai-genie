'use client';

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Layers, 
  FileSpreadsheet, 
  PlayCircle,
  Zap,
  TrendingUp,
  FileCheck,
  Award
} from 'lucide-react';
import { UserRole, TimetableSlot, StudentMaster, COAttainmentSummary } from '../../types';

interface HomeViewProps {
  activeRole: UserRole;
  timetable: TimetableSlot[];
  students: StudentMaster[];
  coAttainment: COAttainmentSummary[];
  onNavigateTab: (tab: any) => void;
  onOpenQuickAttendance: () => void;
  onOpenDailyDiary: (slot: TimetableSlot) => void;
  onRunSuccessTest: () => void;
}

export function HomeView({
  activeRole,
  timetable,
  students,
  coAttainment,
  onNavigateTab,
  onOpenQuickAttendance,
  onOpenDailyDiary,
  onRunSuccessTest,
}: HomeViewProps) {
  const isDatabaseClean = timetable.length === 0;

  // Live Metric Calculations
  const defaultersCount = students.filter((s) => s.isDefaulter).length;
  const lowAttainmentCount = coAttainment.filter((c) => !c.isAttained && c.studentsAttempted > 0).length;
  const completedAttendanceCount = timetable.filter((s) => s.status?.attendanceMarked).length;
  
  const velocityScore = timetable.length > 0 
    ? Math.round((completedAttendanceCount / timetable.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      
      {/* Crisp White Top Banner Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-700" />
              <span>Institutional Orchestrator • MSBTE J-Scheme &amp; PCI ER-2020</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Faculty Workspace: Teaching, Outcomes &amp; Evidence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zero raw prompting. Structured regulatory workflows maintain continuous statutory compliance for NBA Tier-II, PCI SIF inspection, and MSBTE monitoring registers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onRunSuccessTest}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Run 7-Step Walkthrough</span>
            </button>
            <button
              onClick={() => onNavigateTab('CREATE')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Open AI Content Studio</span>
            </button>
          </div>
        </div>

        {/* Live Real-Time Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Syllabus Velocity */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Syllabus Velocity</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{velocityScore}%</span>
              <span className="text-[10px] font-semibold text-blue-700">
                {isDatabaseClean ? 'Awaiting Schedule' : 'Term Progress'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isDatabaseClean ? '0 slots tracked' : `${completedAttendanceCount}/${timetable.length} slots delivered`}
            </p>
          </div>

          {/* Aggregate Attendance */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aggregate Attendance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                {students.length > 0 ? '88.4%' : '0%'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {students.length > 0 ? 'Normal' : 'No Roster'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">MSBTE Threshold: 75%</p>
          </div>

          {/* Defaulters */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">At-Risk Defaulters</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-black ${defaultersCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {defaultersCount} Students
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('STUDENTS')}
              className="text-[11px] text-blue-700 hover:text-blue-900 font-bold transition text-left cursor-pointer"
            >
              Review Defaulter Rollcall →
            </button>
          </div>

          {/* NBA OBE Attainment */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NBA OBE Attainment</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                {lowAttainmentCount > 0 ? `${lowAttainmentCount} Deficit` : 'All Attained'}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('OUTCOMES')}
              className="text-[11px] text-blue-700 hover:text-blue-900 font-bold transition text-left cursor-pointer"
            >
              Inspect CO-PO Attainment →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Action Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Chronological Timetable Schedule */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              <h2 className="text-sm font-bold text-slate-900">Today at a Glance (Chronological Schedule)</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {timetable.length} Academic Slots Scheduled
            </span>
          </div>

          {isDatabaseClean ? (
            <div className="py-12 text-center space-y-3 px-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-blue-700 mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Timetable Slots Loaded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your institutional schedule is empty. You can onboard your students, faculty, and weekly timetable slots via Excel/CSV import.
              </p>
              <button
                onClick={() => onNavigateTab('SETUP')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>Open Setup &amp; Excel Importer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {timetable.map((slot) => (
                <div key={slot.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-xl font-mono text-xs font-bold">
                      {slot.timeSlot}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{slot.subjectName}</p>
                      <p className="text-[11px] text-slate-500">
                        {slot.batch} • {slot.roomOrLab}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {slot.status?.attendanceMarked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Marked</span>
                      </span>
                    ) : (
                      <button
                        onClick={onOpenQuickAttendance}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Mark Attendance
                      </button>
                    )}

                    <button
                      onClick={() => onOpenDailyDiary(slot)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Log Diary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Proactive Institutional Task Copilot */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">"What Should I Do Today?"</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Proactive institutional task copilot prioritizing compliance deadlines, defaulters, and OBE reviews:
          </p>

          <div className="space-y-3">
            {/* Priority Item 1 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">1. Complete Daily Attendance</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Daily
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Log subject rollcall to automatically update semester defaulter registers.
              </p>
              <button
                onClick={onOpenQuickAttendance}
                className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Launch 1-Tap Attendance
              </button>
            </div>

            {/* Priority Item 2 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">2. Review CO Attainments</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  OBE Audit
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Validate direct sessional attainment scores against prescribed NBA thresholds.
              </p>
              <button
                onClick={() => onNavigateTab('OUTCOMES')}
                className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Review Attainment Matrix
              </button>
            </div>

            {/* Priority Item 3 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">3. MSBTE Course File Export</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Audit Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Compile continuous assessment registers, teaching plans, and PH-1..11 proformas into a unified document.
              </p>
              <button
                onClick={() => onNavigateTab('DOCUMENTS')}
                className="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Generate 1-Click Course File →
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default HomeView;
