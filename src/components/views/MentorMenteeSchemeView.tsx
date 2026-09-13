import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Phone,
  BookOpen,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Award,
} from 'lucide-react';
import {
  DPK_MENTOR_MENTEE_GROUPS,
  MentorMenteeGroup,
  MentorMenteeRecord,
} from '../../data/pciStaffAndLabsData';

interface MentorMenteeSchemeViewProps {
  collegeName?: string;
}

export const MentorMenteeSchemeView: React.FC<MentorMenteeSchemeViewProps> = ({
  collegeName = 'D. P. Kharde Navjeevan College of Pharmacy',
}) => {
  const [groups, setGroups] = useState<MentorMenteeGroup[]>(DPK_MENTOR_MENTEE_GROUPS);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('staff-005');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New counseling log form
  const [newLog, setNewLog] = useState<{
    studentRoll: string;
    studentName: string;
    attendancePct: number;
    sessionalAvg: number;
    counselingRemarks: string;
    academicImprovementPlan: string;
    parentContactLog: string;
    status: 'Satisfactory' | 'Needs Improvement' | 'Critical Followup';
  }>({
    studentRoll: 'FY-12',
    studentName: 'Saurabh K. Pawar',
    attendancePct: 78.5,
    sessionalAvg: 19.0,
    counselingRemarks: 'Discussed pharmacology mechanism of action diagrams and mnemonics.',
    academicImprovementPlan: 'Advised daily flashcards and group revision with peer mentor.',
    parentContactLog: `Phone call on ${new Date().toISOString().split('T')[0]}: Parent notified of progress.`,
    status: 'Satisfactory',
  });

  const activeGroup = groups.find((g) => g.mentorId === selectedMentorId) || groups[0];

  const filteredRecords = activeGroup.records.filter((rec) => {
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rec.studentName.toLowerCase().includes(q) ||
      rec.studentRoll.toLowerCase().includes(q) ||
      rec.counselingRemarks.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const totalMentees = groups.reduce((acc, g) => acc + g.allottedStudentCount, 0);
  const totalRemedials = groups.reduce((acc, g) => acc + g.remedialCasesCount, 0);

  const handleExportCSV = () => {
    const headers = [
      'Mentor Name',
      'Mentor PCI Reg No',
      'Student Roll',
      'Student Name',
      'Academic Year',
      'Attendance (%)',
      'Sessional Avg (/30)',
      'Status',
      'Counseling Remarks',
      'Academic Improvement Plan',
      'Parent Contact Log',
    ];

    const rows: string[][] = [];
    groups.forEach((g) => {
      g.records.forEach((r) => {
        rows.push([
          g.mentorName,
          g.mentorPciRegNo,
          r.studentRoll,
          r.studentName,
          r.academicYear,
          `${r.attendancePct}%`,
          `${r.sessionalAvg}`,
          r.status,
          r.counselingRemarks,
          r.academicImprovementPlan,
          r.parentContactLog,
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DPKCOP_Mentor_Mentee_Register_1to20Ratio.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.studentName || !newLog.studentRoll) return;

    const createdRecord: MentorMenteeRecord = {
      studentRoll: newLog.studentRoll,
      studentName: newLog.studentName,
      academicYear: 'FY',
      attendancePct: Number(newLog.attendancePct),
      sessionalAvg: Number(newLog.sessionalAvg),
      counselingRemarks: newLog.counselingRemarks,
      academicImprovementPlan: newLog.academicImprovementPlan,
      parentContactLog: newLog.parentContactLog,
      status: newLog.status,
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.mentorId === activeGroup.mentorId) {
          return {
            ...g,
            records: [createdRecord, ...g.records],
            counselingMeetingsCount: g.counselingMeetingsCount + 1,
            remedialCasesCount:
              newLog.status !== 'Satisfactory' ? g.remedialCasesCount + 1 : g.remedialCasesCount,
          };
        }
        return g;
      })
    );

    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
              Statutory 1:20 Mentor-Mentee Scheme
            </span>
            <span className="text-xs text-slate-500 font-medium">PCI ER-2020 & MSBTE CIAAN Mandate</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Institutional Mentor-Mentee Counseling & Academic Mentoring Register
          </h2>
          <p className="text-xs text-slate-500">
            Mandatory faculty counseling logs, parent communication records, academic remedial tracking, and student welfare dossiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Mentoring Register
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Log Mentoring Session
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Statutory Ratio
          </span>
          <span className="text-xl font-black text-indigo-600 mt-0.5 block font-mono">1 : 20 Ratio</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Strict PCI Compliance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Assigned Mentees
          </span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">
            {totalMentees} Students
          </span>
          <span className="text-[10px] text-slate-500 font-medium">100% Student Body Allotted</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Mentor Faculty
          </span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">
            3 Faculty Mentors
          </span>
          <span className="text-[10px] text-slate-500 font-medium">FY Pharmacy Cohort</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Remedial Intervention Cases
          </span>
          <span className="text-xl font-black text-amber-600 mt-0.5 block font-mono">
            {totalRemedials} Under Coaching
          </span>
          <span className="text-[10px] text-amber-700 font-semibold">Weekly Parent Updates</span>
        </div>
      </div>

      {/* Mentor Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {groups.map((grp) => (
          <button
            key={grp.mentorId}
            onClick={() => setSelectedMentorId(grp.mentorId)}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              selectedMentorId === grp.mentorId
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-amber-400'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedMentorId === grp.mentorId
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {grp.allottedRollRange}
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  {grp.allottedStudentCount} Mentees (1:20)
                </span>
              </div>
              <h3 className="text-sm font-bold mt-2 text-white line-clamp-1">{grp.mentorName}</h3>
              <p className="text-xs text-slate-400">{grp.mentorDesignation}</p>
              <div className="text-[10px] font-mono text-amber-400/90 mt-0.5">
                PCI Reg No: {grp.mentorPciRegNo}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
              <span>{grp.counselingMeetingsCount} Sessions Logged</span>
              <span className="text-amber-300 font-bold">{grp.remedialCasesCount} Remedials</span>
            </div>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or counseling remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Satisfactory', 'Needs Improvement', 'Critical Followup'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Mentee Records' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Mentees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3 text-center">Attendance %</th>
                <th className="p-3 text-center">Sessional Avg</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Counseling Discussion Points</th>
                <th className="p-3">Remedial Improvement Plan</th>
                <th className="p-3">Parent Contact Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                    No mentoring records found matching your search or status filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{rec.studentRoll}</td>
                    <td className="p-3 font-bold text-slate-900">{rec.studentName}</td>
                    <td className="p-3 text-center font-mono font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          rec.attendancePct >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.attendancePct}%
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">
                      {rec.sessionalAvg} / 30
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'Satisfactory'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : rec.status === 'Needs Improvement'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 max-w-xs">{rec.counselingRemarks}</td>
                    <td className="p-3 text-indigo-900 font-medium max-w-xs bg-indigo-50/40">
                      {rec.academicImprovementPlan}
                    </td>
                    <td className="p-3 text-slate-600 font-mono text-[11px] max-w-xs">
                      {rec.parentContactLog}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG COUNSELING SESSION MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Log Mentoring & Counseling Session
                </h3>
                <p className="text-xs text-slate-500">
                  Mentor: <strong>{activeGroup.mentorName}</strong> ({activeGroup.mentorDesignation})
                </p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FY-15"
                    value={newLog.studentRoll}
                    onChange={(e) => setNewLog({ ...newLog, studentRoll: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvi N. Shinde"
                    value={newLog.studentName}
                    onChange={(e) => setNewLog({ ...newLog, studentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attendance %</label>
                  <input
                    type="number"
                    value={newLog.attendancePct}
                    onChange={(e) => setNewLog({ ...newLog, attendancePct: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sessional (/30)</label>
                  <input
                    type="number"
                    value={newLog.sessionalAvg}
                    onChange={(e) => setNewLog({ ...newLog, sessionalAvg: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newLog.status}
                    onChange={(e) => setNewLog({ ...newLog, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="Critical Followup">Critical Followup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Counseling Discussion Points & Root Cause *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newLog.counselingRemarks}
                  onChange={(e) => setNewLog({ ...newLog, counselingRemarks: e.target.value })}
                  placeholder="e.g. Student experienced difficulty in chemical balancing and requested extra tutorial problems..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remedial Action Agreed / Improvement Plan
                </label>
                <textarea
                  rows={2}
                  value={newLog.academicImprovementPlan}
                  onChange={(e) => setNewLog({ ...newLog, academicImprovementPlan: e.target.value })}
                  placeholder="e.g. Assigned 4 hours remedial coaching with course faculty; peer study buddy paired..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Communication Log</label>
                <input
                  type="text"
                  value={newLog.parentContactLog}
                  onChange={(e) => setNewLog({ ...newLog, parentContactLog: e.target.value })}
                  placeholder="e.g. Phone call on 14-Feb: Spoke with Father, undertaking recorded"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl shadow-sm"
                >
                  Save Mentoring Interaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
