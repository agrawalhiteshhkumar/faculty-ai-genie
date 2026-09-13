import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Play,
  FileCheck2,
} from 'lucide-react';
import { TimetableSlot, StudentMaster, COAttainmentSummary, UserRole } from '../../types';
import { NavTab } from '../Sidebar';

interface HomeViewProps {
  activeRole: UserRole;
  timetable: TimetableSlot[];
  students: StudentMaster[];
  coAttainment: COAttainmentSummary[];
  onNavigateTab: (tab: NavTab) => void;
  onOpenQuickAttendance: () => void;
  onOpenDailyDiary: (slot: TimetableSlot) => void;
  onRunSuccessTest: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeRole,
  timetable,
  students,
  coAttainment,
  onNavigateTab,
  onOpenQuickAttendance,
  onOpenDailyDiary,
  onRunSuccessTest,
}) => {
  const defaulterStudents = students.filter((s) => s.isDefaulter);
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendanceTheoryPercentage, 0) / (students.length || 1)
  );
  const lowCOs = coAttainment.filter((c) => !c.isAttained && c.studentsAttempted > 0);

  return (
    <div className="space-y-6">
      {/* Welcome Hero / Core Philosophy Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-indigo-500/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              CONFIGURE ONCE → ENTER DATA ONCE → USE EVERYWHERE
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Faculty Workspace: Teaching, Outcomes & Evidence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Zero raw prompting. Select course context, let verified institutional rules drive AI generation, review drafts, and maintain continuous statutory compliance for NBA, PCI & MSBTE.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
            <button
              id="run-critical-success-test-btn"
              onClick={onRunSuccessTest}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              Run 7-Step End-to-End Walkthrough
            </button>
            <button
              onClick={() => onNavigateTab('CREATE')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Open AI Content Studio
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Health Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Syllabus Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">77.3%</div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <span>✓ On Track (+2% ahead of term plan)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Aggregate Attendance</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{avgAttendance}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            MSBTE Threshold: <span className="font-bold text-slate-700">75%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>At-Risk Defaulters</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {defaulterStudents.length} Students
          </div>
          <button
            onClick={() => onNavigateTab('STUDENTS')}
            className="text-[11px] text-rose-700 font-bold hover:underline mt-0.5 block text-left"
          >
            Review Defaulter Rollcall →
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>NBA OBE Attainment</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {lowCOs.length === 0 ? 'All Attained' : `${lowCOs.length} CO Deficit`}
          </div>
          <button
            onClick={() => onNavigateTab('OUTCOMES')}
            className="text-[11px] text-amber-700 font-bold hover:underline mt-0.5 block text-left"
          >
            Inspect CO3 ATR Action →
          </button>
        </div>
      </div>

      {/* Main Split: Today's Timeline & "What Should I Do Today?" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today at a Glance (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Today at a Glance (Chronological Schedule)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {timetable.length} Academic Slots Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {timetable.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 space-y-3">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">No Timetable Slots Loaded</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Your institutional database is clean. You can onboard your students and faculty using the Excel/CSV importer, or load the sample D.Pharm curriculum to preview all features.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => onNavigateTab('SETUP')}
                    className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition"
                  >
                    Open Setup & Excel Importer →
                  </button>
                </div>
              </div>
            ) : (
              timetable.map((slot) => {
              const isTheory = slot.type === 'THEORY';
              const attPending = !slot.status.attendanceMarked;
              const diaryPending = !slot.status.diaryLogged;

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all ${
                    attPending || diaryPending
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-amber-300">
                        {slot.timeSlot}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isTheory
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {slot.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {slot.classroom}
                      </span>
                    </div>

                    {/* Status Tags */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold border ${
                          slot.status.attendanceMarked
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                        }`}
                      >
                        {slot.status.attendanceMarked ? '✓ Attendance Done' : '⚠ Attendance Pending'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold border ${
                          slot.status.diaryLogged
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {slot.status.diaryLogged ? '✓ Diary Logged' : '✎ Diary Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{slot.subjectTitle}</span>
                      <span className="text-xs font-medium text-slate-500 font-mono">
                        ({slot.subjectCode}) • {slot.division} {slot.batch || ''}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                      <span className="font-bold text-slate-700">Planned Topic:</span> {slot.topicPlanned}
                    </p>
                  </div>

                  {/* Fast Action Buttons for Slot */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500">
                      Faculty: <span className="font-semibold text-slate-700">{slot.facultyName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenQuickAttendance}
                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                      >
                        {slot.status.attendanceMarked ? 'Edit Attendance' : 'Take Attendance'}
                      </button>
                      <button
                        onClick={() => onOpenDailyDiary(slot)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        {slot.status.diaryLogged ? 'View Diary Log' : 'Fill Daily Diary'}
                      </button>
                      <button
                        onClick={() => onNavigateTab('CREATE')}
                        className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generate AI Suite
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>

        {/* "What Should I Do Today?" AI Priorities (1 Column) */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-sm sm:text-base text-white">
                "What Should I Do Today?"
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Proactive institutional task copilot prioritizing compliance deadlines, defaulters, and OBE reviews:
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/90 border border-amber-500/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    Priority 1: Pharmaceutics Attendance
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                    10:00 AM
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Mark Div A attendance for Unit 2 'Tablet Coating Defects'. 2 known at-risk defaulters (Roll 08 & 14) are enrolled.
                </p>
                <button
                  onClick={onOpenQuickAttendance}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
                >
                  Launch 1-Tap Attendance →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    Priority 2: Review Sessional 1 CO3 Deficit
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                    ATR Alert
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  CO3 attainment fell to 2.20 vs 2.50 target. HOD Dr. Rajesh Sharma has requested the corrective Action Taken Report.
                </p>
                <button
                  onClick={() => onNavigateTab('OUTCOMES')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
                >
                  Review AI-Drafted ATR →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    Priority 3: Practical Batch B1 Lab Rubric
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                    11:15 AM
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Conduct Exp 6 (Tablet Disintegration & Friability). Grade performance rubrics in the digital continuous ledger.
                </p>
                <button
                  onClick={() => onNavigateTab('TEACH')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
                >
                  Open Lab Rubrics →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Audit Ready
            </span>
            <button
              onClick={() => onNavigateTab('DOCUMENTS')}
              className="text-amber-400 hover:underline font-semibold"
            >
              1-Click Course File →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
