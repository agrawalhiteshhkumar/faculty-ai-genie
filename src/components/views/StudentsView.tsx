import React, { useState } from 'react';
import {
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  TrendingDown,
  TrendingUp,
  FileText,
  UserCheck,
  Send,
  ShieldAlert,
  ArrowUpDown,
  Hash,
  ShieldCheck,
  Calendar,
  Layers,
  X,
  GraduationCap,
  Filter,
  BookOpen,
} from 'lucide-react';
import { StudentMaster, InstitutionProfile } from '../../types';
import { MentorMenteeSchemeView } from './MentorMenteeSchemeView';
import { DefaulterNoticeDispatcher } from '../DefaulterNoticeDispatcher';

interface StudentsViewProps {
  students: StudentMaster[];
  institution?: InstitutionProfile | null;
  onNavigateTab?: (tab: any) => void;
  onRefreshData?: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ students, institution, onNavigateTab, onRefreshData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'STUDENTS_LEDGER' | 'MENTOR_MENTEE' | 'DEFAULTER_NOTICES'>('STUDENTS_LEDGER');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'DEFAULTERS' | 'DSE' | 'ACHIEVERS'>('ALL');
  
  // Strict Cohort Isolation State
  const [selectedProgramYear, setSelectedProgramYear] = useState<'ALL' | 'FIRST_YEAR' | 'SECOND_YEAR'>('FIRST_YEAR');
  const [selectedBatch, setSelectedBatch] = useState<'ALL' | 'A1' | 'A2' | 'A3' | 'B1' | 'B2'>('ALL');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('ALL');

  const [selectedStudent, setSelectedStudent] = useState<StudentMaster | null>(
    students.find((s) => s.isDefaulter) || students[0] || null
  );
  const [mentorNote, setMentorNote] = useState('');
  const [parentAlertSent, setParentAlertSent] = useState<string | null>(null);

  // Roll Reshuffle Modal State
  const [isReshuffleModalOpen, setIsReshuffleModalOpen] = useState(false);
  const [reshuffleMode, setReshuffleMode] = useState<'ALPHABETICAL' | 'DSE_APPEND'>('ALPHABETICAL');
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [reshuffleSuccess, setReshuffleSuccess] = useState<string | null>(null);

  const filteredStudents = students.filter((st) => {
    const regNo = (st as any).enrollmentNo || st.prn || st.uid || '';
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.includes(searchQuery) ||
      regNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'DEFAULTERS') return st.isDefaulter;
    if (filterMode === 'DSE') return st.admissionType === 'LATERAL_ENTRY_DSE' || st.admissionType === 'TRANSFER_IN';
    if (filterMode === 'ACHIEVERS') return st.sessional1Average >= 24;

    // Strict Cohort Isolation: Program Year (FY vs SY/DSE)
    const isSy = st.programYear === 'SECOND_YEAR' || st.academicYear === 'SY' || st.rollNo.startsWith('SY-') || st.admissionType === 'LATERAL_ENTRY_DSE';
    if (selectedProgramYear === 'FIRST_YEAR' && isSy) return false;
    if (selectedProgramYear === 'SECOND_YEAR' && !isSy) return false;

    // Strict Cohort Isolation: Batch (A1, A2, A3, B1, etc.)
    if (selectedBatch !== 'ALL') {
      const batchNormalized = (st.batch || '').toUpperCase();
      if (batchNormalized && batchNormalized === selectedBatch) {
        // match
      } else {
        const rollNum = parseInt(st.rollNo.replace(/\D/g, ''), 10);
        if (selectedBatch === 'A1' && (rollNum < 1 || rollNum > 20)) return false;
        if (selectedBatch === 'A2' && (rollNum < 21 || rollNum > 40)) return false;
        if (selectedBatch === 'A3' && (rollNum < 41 || rollNum > 60)) return false;
      }
    }

    // Strict Cohort Isolation: Course Code
    if (selectedCourseCode !== 'ALL') {
      const isFyCourse = selectedCourseCode.startsWith('ER20-1');
      const isSyCourse = selectedCourseCode.startsWith('ER20-2');
      if (isFyCourse && isSy) return false;
      if (isSyCourse && !isSy) return false;
    }

    return true;
  });

  const handleSendParentNotice = (student: StudentMaster) => {
    setParentAlertSent(student.id);
    setTimeout(() => setParentAlertSent(null), 3000);
  };

  const handleSaveMentorNote = () => {
    if (!mentorNote || !selectedStudent) return;
    selectedStudent.mentorNotes = selectedStudent.mentorNotes || [];
    selectedStudent.mentorNotes.push({
      date: new Date().toISOString().split('T')[0],
      mentorName: 'Prof. Ananya Deshmukh',
      counselingPoint: mentorNote,
      actionAgreed: 'Student agreed to attend 6 hours of remedial tutorial coaching.',
    });
    setMentorNote('');
    alert('Mentor interaction logged into student official dossier.');
  };

  const handleExecuteReshuffle = async () => {
    setIsReshuffling(true);
    try {
      const tenantId = localStorage.getItem('faculty_genie_tenant_id') || '';
      const licenseKey = localStorage.getItem('faculty_genie_license_key') || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (tenantId) headers['x-tenant-id'] = tenantId;
      if (licenseKey) headers['x-license-key'] = licenseKey;

      const res = await fetch('/api/students/reshuffle-rolls', {
        method: 'POST',
        headers,
        body: JSON.stringify({ mode: reshuffleMode }),
      });
      const data = await res.json();
      if (data.success) {
        setReshuffleSuccess(`Roll numbers re-shuffled successfully via ${reshuffleMode === 'ALPHABETICAL' ? 'Alphabetical sequence' : 'DSE append sequence'}! Permanent PRNs and all CIAAN marks remain untouched.`);
        if (onRefreshData) {
          onRefreshData();
        }
        setTimeout(() => {
          setReshuffleSuccess(null);
          setIsReshuffleModalOpen(false);
        }, 2200);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to re-shuffle rolls.');
    } finally {
      setIsReshuffling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('STUDENTS_LEDGER')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'STUDENTS_LEDGER'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          1. Student 360° Master Ledger & Early Warning
        </button>
        <button
          onClick={() => setActiveSubTab('MENTOR_MENTEE')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'MENTOR_MENTEE'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          2. Statutory 1:20 Mentor-Mentee Scheme Register
        </button>
        <button
          onClick={() => setActiveSubTab('DEFAULTER_NOTICES')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'DEFAULTER_NOTICES'
              ? 'border-rose-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          3. 75% Defaulter Warning Notices & Parent Dispatcher
        </button>
      </div>

      {activeSubTab === 'MENTOR_MENTEE' ? (
        <MentorMenteeSchemeView />
      ) : activeSubTab === 'DEFAULTER_NOTICES' ? (
        <DefaulterNoticeDispatcher institution={institution || null} students={students} />
      ) : (
        <>
          {/* View Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 mb-1">
                <ShieldAlert className="w-3 h-3" />
                MSBTE 75% Statutory Attendance Enforcement & DSE Regulatory Engine
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Student 360° Institutional Profiles & Early Warning Engine
              </h1>
              <p className="text-xs text-slate-500">
                D.Pharm 1st Year (Division A) • Enrolled: {students.length} Students • Permanent PRN Decoupled Architecture
              </p>
            </div>

            {/* Action & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsReshuffleModalOpen(true)}
                id="open-reshuffle-rolls-btn"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                Re-shuffle Roll Numbers
              </button>

              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Students ({students.length})
              </button>

              <button
                onClick={() => setFilterMode('DEFAULTERS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  filterMode === 'DEFAULTERS'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Defaulters &lt;75% ({students.filter((s) => s.isDefaulter).length})
              </button>

              <button
                onClick={() => setFilterMode('DSE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  filterMode === 'DSE'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <Layers className="w-3 h-3 text-indigo-500" />
                DSE Lateral ({students.filter((s) => s.admissionType === 'LATERAL_ENTRY_DSE' || s.admissionType === 'TRANSFER_IN').length})
              </button>

              <button
                onClick={() => setFilterMode('ACHIEVERS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterMode === 'ACHIEVERS'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Top Achievers ({students.filter((s) => s.sessional1Average >= 24).length})
              </button>
            </div>
          </div>

          {/* Strict Cohort Isolation Control Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Strict Cohort Isolation Active
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Zero Cross-Contamination
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Scope student records, batch registers, and academic marksheets strictly by Program Year & Course Code.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Program Year Filter */}
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Program Year:</span>
                  <select
                    value={selectedProgramYear}
                    onChange={(e) => setSelectedProgramYear(e.target.value as any)}
                    className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-slate-900 text-white">All Program Years</option>
                    <option value="FIRST_YEAR" className="bg-slate-900 text-white">First Year (FY Pharmacy)</option>
                    <option value="SECOND_YEAR" className="bg-slate-900 text-white">Second Year / DSE (SY Pharmacy)</option>
                  </select>
                </div>

                {/* Batch Distribution Filter */}
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Batch Register:</span>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value as any)}
                    className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-slate-900 text-white">All Batches</option>
                    <option value="A1" className="bg-slate-900 text-white">Batch A1 (Roll 01-20)</option>
                    <option value="A2" className="bg-slate-900 text-white">Batch A2 (Roll 21-40)</option>
                    <option value="A3" className="bg-slate-900 text-white">Batch A3 (Roll 41-60)</option>
                    <option value="B1" className="bg-slate-900 text-white">Batch B1 (Roll 01-20)</option>
                    <option value="B2" className="bg-slate-900 text-white">Batch B2 (Roll 21-40)</option>
                  </select>
                </div>

                {/* Course Code Filter */}
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Course Scope:</span>
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer max-w-[180px] truncate"
                  >
                    <option value="ALL" className="bg-slate-900 text-white">All Courses</option>
                    <optgroup label="First Year (ER-2020)" className="bg-slate-900 text-amber-400 font-bold">
                      <option value="ER20-11T" className="bg-slate-900 text-white">ER20-11T: Pharmaceutics</option>
                      <option value="ER20-12T" className="bg-slate-900 text-white">ER20-12T: Pharmaceutical Chemistry</option>
                      <option value="ER20-13T" className="bg-slate-900 text-white">ER20-13T: Pharmacognosy</option>
                      <option value="ER20-14T" className="bg-slate-900 text-white">ER20-14T: Human Anatomy & Physiology</option>
                      <option value="ER20-15T" className="bg-slate-900 text-white">ER20-15T: Social Pharmacy</option>
                    </optgroup>
                    <optgroup label="Second Year (ER-2020)" className="bg-slate-900 text-amber-400 font-bold">
                      <option value="ER20-21T" className="bg-slate-900 text-white">ER20-21T: Pharmacology</option>
                      <option value="ER20-22T" className="bg-slate-900 text-white">ER20-22T: Community Pharmacy</option>
                      <option value="ER20-23T" className="bg-slate-900 text-white">ER20-23T: Biochemistry & Clinical Pathology</option>
                      <option value="ER20-24T" className="bg-slate-900 text-white">ER20-24T: Pharmacotherapeutics</option>
                      <option value="ER20-25T" className="bg-slate-900 text-white">ER20-25T: Hospital & Clinical Pharmacy</option>
                      <option value="ER20-26T" className="bg-slate-900 text-white">ER20-26T: Pharmacy Law & Ethics</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Isolation Status Tag */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>
                Active Scope:{' '}
                <strong className="text-white">
                  {selectedProgramYear === 'FIRST_YEAR' ? 'FY Pharmacy' : selectedProgramYear === 'SECOND_YEAR' ? 'SY / DSE Pharmacy' : 'All Cohorts'}
                </strong>{' '}
                • Batch:{' '}
                <strong className="text-white">{selectedBatch === 'ALL' ? 'All Batches' : `Batch ${selectedBatch}`}</strong>{' '}
                • Course:{' '}
                <strong className="text-white">{selectedCourseCode === 'ALL' ? 'All Courses' : selectedCourseCode}</strong>
              </span>
              <span className="text-amber-400 font-mono font-bold">
                {filteredStudents.length} Students in Scope
              </span>
            </div>
          </div>

      {/* Main Grid or Empty State */}
      {students.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">Student Master Ledger is Blank</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No students are currently enrolled in this institution's database. Download the sample Excel template and bulk-import your student ledger, or load the sample cohort.
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('SETUP')}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs"
            >
              Open Bulk Excel / CSV Importer →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student Directory Column (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll no, enrollment..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Student List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredStudents.map((st) => {
              const isSelected = selectedStudent?.id === st.id;

              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{st.rollNo}
                      </span>
                      <span className="text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]">
                        {st.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {st.admissionType === 'LATERAL_ENTRY_DSE' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                          DSE
                        </span>
                      )}
                      {st.admissionType === 'TRANSFER_IN' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                          Transfer
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {st.batch}
                      </span>
                      {st.isDefaulter && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                          Defaulter
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                      Att: {st.attendanceTheoryPercentage}% Th / {st.attendancePracticalPercentage}% Pr
                    </span>
                    <span
                      className={`font-bold font-mono ${
                        isSelected ? 'text-amber-300' : 'text-slate-700'
                      }`}
                    >
                      {st.admissionType === 'LATERAL_ENTRY_DSE' && st.sessional1Average === 0
                        ? `Best-2: ${st.bestOfTwoAverage || st.sessional2Average} / 30`
                        : `Sess 1: ${st.sessional1Average} / 30`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Student 360° Profile Column (7 cols) */}
        {selectedStudent && (
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            {/* Student Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono font-bold text-xs">
                    Roll #{selectedStudent.rollNo}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-semibold border border-slate-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    PRN: {selectedStudent.prn || selectedStudent.uid}
                  </span>
                  {selectedStudent.admissionType === 'LATERAL_ENTRY_DSE' && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                      Direct Second Year (DSE / Lateral Entry)
                    </span>
                  )}
                  {selectedStudent.admissionType === 'TRANSFER_IN' && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      Transfer-In Student
                    </span>
                  )}
                  <h2 className="text-lg font-black text-slate-900 w-full mt-1">
                    {selectedStudent.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Admission: {selectedStudent.admissionDate || '2025-08-01'} • D.Pharm Year 1 ({selectedStudent.batch}) • Division A
                </p>
              </div>

              {selectedStudent.isDefaulter && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendParentNotice(selectedStudent)}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {parentAlertSent === selectedStudent.id
                      ? 'Alert Sent!'
                      : 'Send Parent Notice'}
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Attendance Denominator Regulatory Callout for Late Joiners */}
            {(selectedStudent.admissionType === 'LATERAL_ENTRY_DSE' || selectedStudent.admissionType === 'TRANSFER_IN') && (
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Dynamic Attendance Denominator Engine Active (MSBTE Lateral Admissions)
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Student admitted on <strong>{selectedStudent.admissionDate || '15-Sep-2025'}</strong>. Attendance percentages ({selectedStudent.attendanceTheoryPercentage}% Theory / {selectedStudent.attendancePracticalPercentage}% Practical) are computed strictly from their official admission date rather than Day 1 of the institutional academic calendar. August sessions are flagged as <strong>EXEMPT / N/A</strong>, preventing an artificial 0% defaulter classification.
                </p>
              </div>
            )}

            {/* Attendance & Academics KPI Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div
                className={`p-3 rounded-xl border ${
                  selectedStudent.attendanceTheoryPercentage < 75
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Theory Attendance
                </div>
                <div
                  className={`text-lg font-black mt-0.5 ${
                    selectedStudent.attendanceTheoryPercentage < 75
                      ? 'text-rose-600'
                      : 'text-slate-900'
                  }`}
                >
                  {selectedStudent.attendanceTheoryPercentage}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Statutory Min: 75%
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  selectedStudent.attendancePracticalPercentage < 75
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Practical Attendance
                </div>
                <div
                  className={`text-lg font-black mt-0.5 ${
                    selectedStudent.attendancePracticalPercentage < 75
                      ? 'text-rose-600'
                      : 'text-slate-900'
                  }`}
                >
                  {selectedStudent.attendancePracticalPercentage}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Statutory Min: 75%
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Sessional 1
                </div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedStudent.admissionType === 'LATERAL_ENTRY_DSE' && selectedStudent.sessional1Average === 0 ? (
                    <span className="text-xs font-semibold text-amber-700">EXEMPT / N/A</span>
                  ) : (
                    `${selectedStudent.sessional1Average} / 30`
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {selectedStudent.admissionType === 'LATERAL_ENTRY_DSE' && selectedStudent.sessional1Average === 0 ? 'Joined post S1' : 'Conducted Aug'}
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-slate-50 border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Best of 2 CIAAN
                </div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {selectedStudent.bestOfTwoAverage || selectedStudent.sessional2Average || selectedStudent.sessional1Average} / 30
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {selectedStudent.sessional3Average ? `Incl Re-Sess (${selectedStudent.sessional3Average}m)` : 'Automated Top 2'}
                </div>
              </div>
            </div>

            {/* At-Risk Warning Box */}
            {selectedStudent.isDefaulter && (
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <AlertTriangle className="w-4 h-4" />
                  Statutory Defaulter Notice (MSBTE Examination Regulations 2023)
                </div>
                <p className="text-[11px] text-rose-900 leading-relaxed">
                  Student is currently below the mandatory 75% attendance threshold. Mandatory parental counseling and 6 hours of makeup tutorial lectures are required prior to final exam hall-ticket release.
                </p>
              </div>
            )}

            {/* Mentoring Copilot & Interaction Ledger */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Mentoring Copilot & Interaction Ledger
                </div>
                <span className="text-[11px] text-slate-500">
                  Mentor: Prof. Ananya Deshmukh
                </span>
              </div>

              {/* Past Notes */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(selectedStudent.mentorNotes || [
                  {
                    date: '2025-08-20',
                    mentorName: 'Prof. Ananya Deshmukh',
                    counselingPoint: 'Discussed irregular attendance in morning 10 AM theory lectures due to suburban train delays.',
                    actionAgreed: 'Advised student on alternate commuter timetable and assigned peer study partner for missed notes.',
                  },
                ]).map((note: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{note.date}</span>
                      <span>By: {note.mentorName}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{note.counselingPoint}</p>
                    <p className="text-emerald-700 text-[11px]">
                      <strong>Agreed Action:</strong> {note.actionAgreed}
                    </p>
                  </div>
                ))}
              </div>

              {/* New Interaction Note Input */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={mentorNote}
                  onChange={(e) => setMentorNote(e.target.value)}
                  placeholder="Record mentor counseling note or remedial agreement..."
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                />
                <button
                  onClick={handleSaveMentorNote}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Log Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
      </>
      )}

      {/* ROLL NUMBER RE-SHUFFLING & PERMANENT PRN DECOUPLING MODAL */}
      {isReshuffleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <ArrowUpDown className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Roll Number Re-shuffling Engine</h3>
                  <p className="text-xs text-slate-500">Permanent PRN Decoupled Architecture</p>
                </div>
              </div>
              <button
                onClick={() => setIsReshuffleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Statutory Regulatory Integrity Guarantee
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                In this institutional OS, a student's permanent statutory identity is locked to their immutable <strong>PRN / System UUID</strong>. Re-shuffling roll numbers (e.g. following late DSE admissions or alphabetical roster updates) safely updates classroom roll numbers without breaking historic Sessional marks, continuous rubrics, or attendance records.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Re-shuffling Strategy:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setReshuffleMode('ALPHABETICAL')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    reshuffleMode === 'ALPHABETICAL'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">1. Alphabetical Sequence (By Student Name)</div>
                  <p className={`text-[11px] mt-1 ${reshuffleMode === 'ALPHABETICAL' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Re-orders all enrolled students alphabetically by name (Roll 01..{students.length}). DSE students interleave alphabetically into the roster while preserving all marks.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setReshuffleMode('DSE_APPEND')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    reshuffleMode === 'DSE_APPEND'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">2. DSE / Lateral Entry Tail Append</div>
                  <p className={`text-[11px] mt-1 ${reshuffleMode === 'DSE_APPEND' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Keeps existing regular admission roll numbers (01..N) untouched, and sequentially sequences incoming DSE students at the end of the batch (N+1..).
                  </p>
                </button>
              </div>
            </div>

            {reshuffleSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-900 font-medium text-xs rounded-xl border border-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{reshuffleSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsReshuffleModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReshuffle}
                disabled={isReshuffling}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {isReshuffling ? 'Re-shuffling...' : 'Execute Roster Re-shuffle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
