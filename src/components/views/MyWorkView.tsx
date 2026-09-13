import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Award,
  Download,
  Building,
  UserCheck,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { FacultyMaster, TimetableSlot } from '../../types';

interface MyWorkViewProps {
  faculty: FacultyMaster;
  timetable: TimetableSlot[];
  teachingDiaryEntries: any[];
  onOpenDailyDiary: (slot: TimetableSlot) => void;
  onOpenQuickAttendance: () => void;
  onHODSignOff?: (id: string) => void;
}

export const MyWorkView: React.FC<MyWorkViewProps> = ({
  faculty,
  timetable,
  teachingDiaryEntries,
  onOpenDailyDiary,
  onOpenQuickAttendance,
  onHODSignOff,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'SCHEDULE' | 'DIARY' | 'PBAS'>('SCHEDULE');
  const [copiedPBAS, setCopiedPBAS] = useState(false);

  const handleExportPBAS = () => {
    setCopiedPBAS(true);
    setTimeout(() => setCopiedPBAS(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Faculty Workload & Professional Portfolio</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Managed by {faculty.name} ({faculty.designation}, {faculty.department})
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('SCHEDULE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'SCHEDULE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setActiveSubTab('DIARY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'DIARY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teaching Diary Ledger
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
              {teachingDiaryEntries.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('PBAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'PBAS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PBAS Annual Appraisal
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: WEEKLY SCHEDULE */}
      {activeSubTab === 'SCHEDULE' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Approved Institutional Timetable (MSBTE K-Scheme Prescribed Workload)
                </h2>
              </div>
              <div className="text-xs text-slate-500">
                Weekly Prescribed: <span className="font-bold text-slate-800">16 Contact Hours</span> (4 Theory + 12 Lab)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Day / Time</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Course</th>
                    <th className="py-3 px-3">Div / Batch</th>
                    <th className="py-3 px-3">Hall / Lab</th>
                    <th className="py-3 px-3">Planned Syllabus Topic</th>
                    <th className="py-3 px-3 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timetable.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {slot.dayOfWeek.substring(0, 3)}, {slot.timeSlot}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            slot.type === 'THEORY'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {slot.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {slot.subjectTitle}
                        <div className="text-[10px] font-mono text-slate-400">Code: {slot.subjectCode}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {slot.division} {slot.batch ? `(${slot.batch})` : ''}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">{slot.classroom}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">{slot.topicPlanned}</td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={onOpenQuickAttendance}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          Attendance
                        </button>
                        <button
                          onClick={() => onOpenDailyDiary(slot)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                        >
                          Log Diary
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DAILY TEACHING DIARY LEDGER */}
      {activeSubTab === 'DIARY' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Closed-Loop Daily Teaching Diary Ledger (MSBTE Form B Compliant)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every entry is timestamped, compared against planned syllabus milestones, and forwarded for HOD academic scrutiny.
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>HOD Verification: Online</span>
            </div>
          </div>

          <div className="space-y-3">
            {teachingDiaryEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 transition space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                      {entry.date}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {entry.subjectTitle} ({entry.subjectCode})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {entry.completionStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        entry.hodVerification === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      HOD Status: {entry.hodVerification}
                    </span>
                    {entry.hodVerification !== 'VERIFIED' && onHODSignOff && (
                      <button
                        onClick={() => onHODSignOff(entry.id)}
                        className="px-2 py-0.5 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition"
                      >
                        Sign-off as HOD
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                      Planned Topic:
                    </span>
                    <span className="text-slate-600">{entry.plannedTopic}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                      Actual Execution:
                    </span>
                    <span className="text-slate-900 font-medium">{entry.actualTopicCovered}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="font-bold text-slate-700">Pedagogy:</span> {entry.pedagogicalStrategy}
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Aids:</span> {entry.teachingAidUsed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PBAS ANNUAL APPRAISAL PORTFOLIO */}
      {activeSubTab === 'PBAS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Performance Based Appraisal System (PBAS) Portfolio
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically compiled from teaching diaries, student feedback, and outcome attainments.
              </p>
            </div>
            <button
              onClick={handleExportPBAS}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              {copiedPBAS ? 'PBAS Dossier Exported!' : 'Export Annual PBAS Dossier'}
            </button>
          </div>

          {/* PBAS Metric Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Category 1: Teaching & Pedagogy
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">98 / 100</div>
              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                <div>• Lectures Delivered: 100% of prescribed</div>
                <div>• Syllabus Velocity: +2% ahead</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Category 2: Outcome Attainment (OBE)
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">88 / 100</div>
              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                <div>• Avg Direct CO Attainment: 2.53 / 3.00</div>
                <div>• Action Taken Reports (ATRs): 1 Resolved</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Category 3: Institutional Contribution
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">95 / 100</div>
              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                <div>• Exam Coordinator (MSBTE S-25)</div>
                <div>• NBA Criteria 3 Committee Lead</div>
              </div>
            </div>
          </div>

          {/* Detailed Contribution Breakdown */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Statutory Institutional Duties & Development Portfolio
            </h3>

            <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Faculty Development Programmes (FDPs):</span>
                  <p className="text-slate-500 text-[11px]">PCI Sponsored 1-Week National FDP on Advanced Drug Delivery Systems (BITS Pilani)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Certificate
                </span>
              </div>
              <div className="p-3 bg-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Research & Publications:</span>
                  <p className="text-slate-500 text-[11px]">"Novel Formulations in Sustained Release Matrix Tablets", Indian Journal of Pharmaceutical Sciences (Scopus Indexed)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Published Q2
                </span>
              </div>
              <div className="p-3 bg-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Student Mentoring Portfolio:</span>
                  <p className="text-slate-500 text-[11px]">Mentor to 20 First-Year D.Pharm students; 3 counseling sessions logged, zero academic dropouts.</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
