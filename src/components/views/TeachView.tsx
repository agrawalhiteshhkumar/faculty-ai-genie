import React, { useState } from 'react';
import {
  BookOpen,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  Users,
  ShieldCheck,
  PenTool,
  Clock,
  Lock,
} from 'lucide-react';
import { SubjectMaster, StudentMaster, FacultyMaster, InstitutionProfile } from '../../types';
import { LabBreakageApparatusLog } from '../LabBreakageApparatusLog';

interface TeachViewProps {
  subject: SubjectMaster | null;
  students: StudentMaster[];
  currentFaculty?: FacultyMaster;
  institution?: InstitutionProfile | null;
  onOpenQuickAttendance: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const TeachView: React.FC<TeachViewProps> = ({
  subject,
  students,
  currentFaculty,
  institution,
  onOpenQuickAttendance,
  onNavigateTab,
}) => {
  const isAdjunct =
    currentFaculty?.employmentType === 'ADJUNCT_VISITING' ||
    currentFaculty?.employmentType === 'GUEST_LECTURER';

  const defaultBatch =
    isAdjunct && currentFaculty?.assignedSubjects?.[0]?.division?.includes('B2') ? 'B2' : 'B1';

  const [activeTab, setActiveTab] = useState<'LESSON_PLAN' | 'LAB_RUBRIC' | 'LAB_MAINTENANCE'>('LAB_RUBRIC');
  const [selectedUnit, setSelectedUnit] = useState<string>('Unit 2');
  const [selectedBatch, setSelectedBatch] = useState<'B1' | 'B2'>(defaultBatch);
  const [primarySigned, setPrimarySigned] = useState<boolean>(true);
  const [coFacultySigned, setCoFacultySigned] = useState<boolean>(true);
  const [signMessage, setSignMessage] = useState<string | null>(null);

  if (!subject || !subject.units || subject.units.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-4 max-w-4xl mx-auto my-8">
        <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
        <div>
          <h3 className="text-base font-bold text-slate-800">No Subject Curriculum Loaded</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Subject syllabus and lesson plans are currently empty. You can import curriculum subjects via the Excel/CSV master importer or load the pre-configured regulatory dataset.
          </p>
        </div>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('SETUP')}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs"
          >
            Open Setup & Excel Importer →
          </button>
        )}
      </div>
    );
  }

  // Lab continuous assessment rubric state for Batch B1/B2
  const [labGrades, setLabGrades] = useState<Record<string, {
    performance: number; // max 5
    accuracy: number;    // max 5
    journal: number;     // max 5
    viva: number;        // max 5
  }>>({
    's-01': { performance: 5, accuracy: 4, journal: 5, viva: 4 },
    's-02': { performance: 4, accuracy: 4, journal: 4, viva: 3 },
    's-03': { performance: 5, accuracy: 5, journal: 4, viva: 5 },
    's-04': { performance: 4, accuracy: 4, journal: 5, viva: 4 },
    's-05': { performance: 4, accuracy: 3, journal: 4, viva: 3 },
    's-06': { performance: 5, accuracy: 5, journal: 5, viva: 4 },
    's-07': { performance: 4, accuracy: 4, journal: 4, viva: 4 },
    's-08': { performance: 3, accuracy: 3, journal: 3, viva: 2 },
    's-09': { performance: 4, accuracy: 4, journal: 4, viva: 4 },
    's-10': { performance: 5, accuracy: 4, journal: 5, viva: 4 },
  });

  const handleRubricChange = (studentId: string, criterion: 'performance' | 'accuracy' | 'journal' | 'viva', value: number) => {
    setLabGrades(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { performance: 4, accuracy: 4, journal: 4, viva: 4 }),
        [criterion]: Math.max(0, Math.min(5, value))
      }
    }));
  };

  const batchStudents = students.filter(s => s.batch === selectedBatch);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Pedagogical Planning & Laboratory Conduction</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            PCI Education Regulations 2020 & MSBTE Continuous Lab Evaluation Framework
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('LESSON_PLAN')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'LESSON_PLAN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unit Lesson Roadmap
          </button>
          <button
            onClick={() => setActiveTab('LAB_RUBRIC')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'LAB_RUBRIC'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
            Practical Continuous Rubric
          </button>
          <button
            onClick={() => setActiveTab('LAB_MAINTENANCE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'LAB_MAINTENANCE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Glassware Breakage & Lab Log
          </button>
        </div>
      </div>

      {/* Visiting / Adjunct Scope Banner */}
      {isAdjunct && (
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600 text-white rounded-xl">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-2">
                Visiting / Adjunct Faculty Scope Active
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                  RBAC Restricted
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                Logged in as <strong>{currentFaculty?.name}</strong>. Access is scoped strictly to teaching deliveries and lab continuous evaluation for assigned subject: <strong>{subject.title} ({currentFaculty?.assignedSubjects?.[0]?.division || 'Batch B2'})</strong>.
              </p>
            </div>
          </div>
          <div className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-lg border border-amber-300 whitespace-nowrap self-start sm:self-center">
            Assigned Batch: {defaultBatch}
          </div>
        </div>
      )}

      {/* TAB 1: UNIT LESSON ROADMAP */}
      {activeTab === 'LESSON_PLAN' && (
        <div className="space-y-6">
          {/* Unit selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subject.units.map((unit) => (
              <button
                key={unit.unitNumber}
                onClick={() => setSelectedUnit(`Unit ${unit.unitNumber}`)}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedUnit === `Unit ${unit.unitNumber}`
                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                    Unit {unit.unitNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {unit.hoursAllocated} Prescribed Hours
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{unit.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                  <span>Target: <span className="font-bold text-slate-700">{unit.targetCO}</span></span>
                  <span>•</span>
                  <span>Cognitive: <span className="font-bold text-slate-700">{unit.bloomsLevel}</span></span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Lesson Roadmap */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Academic Delivery Architecture
                </span>
                <h2 className="text-base font-black text-slate-900">
                  Unit 2: Solid Dosage Forms — Tablet Coating Defects & Troubleshooting
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Mapped to CO3 (Bloom Level: L4 Analyze)
              </span>
            </div>

            {/* 60-Minute Conduction Roadmap */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Standard 60-Minute Pedagogical Conduction Roadmap
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    00-10 min
                  </span>
                  <div className="text-xs font-bold text-slate-800">Hook & Industrial Recall</div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Present commercial batch recall case due to tablet surface mottling. Trigger curiosity.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                    10-30 min
                  </span>
                  <div className="text-xs font-bold text-slate-800">Defect Mechanisms</div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Analyze Orange Peel (premature drying) vs Mottling (dye migration) vs Sticking/Picking.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    30-45 min
                  </span>
                  <div className="text-xs font-bold text-slate-800">Parameters & Machine Calibration</div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Nozzle atomization air, gun distance (15-20cm), inlet temperature (60°C) and polymer viscosity.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    45-60 min
                  </span>
                  <div className="text-xs font-bold text-slate-800">Viva & Check-for-Understanding</div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Formative viva-voce check and homework SOP drafting assignment.
                  </p>
                </div>
              </div>
            </div>

            {/* Check-for-Understanding Question Bank */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Formative Classroom Check-for-Understanding Questions
              </div>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li>Why does increasing the spray rate without increasing drying air cause tablet sticking?</li>
                <li>How do aluminum lake pigments eliminate mottling compared to water-soluble dyes?</li>
                <li>What role does triethyl citrate play in preventing intagliation bridging?</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICAL CONTINUOUS RUBRIC & LAB CONDUCTION */}
      {activeTab === 'LAB_RUBRIC' && (
        <div className="space-y-5">
          {/* Lab Setup & Safety Checklist Banner */}
          <div className="bg-purple-900 text-white p-5 rounded-2xl border border-purple-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-300" />
                <h2 className="text-base font-black">
                  Practical Conduction: Exp 6 — Evaluation of Tablets (Friability & Disintegration)
                </h2>
              </div>
              <p className="text-xs text-purple-200">
                Equipment: Roche Friabilator (25 RPM, 100 drops), IP Disintegration Apparatus, Analytical Balance (±0.1mg).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-700 text-xs font-bold">
                <label htmlFor="teach-batch-select" className="sr-only">Batch</label>
                <span className="text-purple-300">Active Batch:</span>
                <select
                  id="teach-batch-select"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value as any)}
                  className="bg-purple-900 text-white rounded border border-purple-600 px-2 py-0.5 text-xs font-bold"
                >
                  <option value="B1">Batch B1 (Roll 01-10)</option>
                  <option value="B2">Batch B2 (Roll 11-20)</option>
                </select>
              </div>
              <button
                onClick={onOpenQuickAttendance}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
              >
                Mark Batch Attendance
              </button>
            </div>
          </div>

          {/* Co-Teaching & Dual Faculty Allocation Card */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-indigo-950 flex items-center gap-2">
                    Co-Teaching & Dual Faculty Lab Allocation
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-800">
                      MSBTE / NBA Criterion 3 Compliant
                    </span>
                  </h3>
                  <p className="text-[11px] text-indigo-700">
                    Dual instructors allocated for Laboratory Batch {selectedBatch} with verified co-signatures on journal continuous rubrics.
                  </p>
                </div>
              </div>

              {signMessage && (
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {signMessage}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Primary Faculty */}
              <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Primary Faculty (Lead Instructor)
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    primarySigned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {primarySigned ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {primarySigned ? 'Signed & Locked' : 'Pending Signoff'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Prof. Ananya Deshmukh</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Assistant Professor & NBA Coordinator • EMP-PH-104
                </div>
                <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {primarySigned ? 'OTP Signoff: 11:45 AM' : 'Awaiting instructor OTP'}
                  </span>
                  <button
                    onClick={() => {
                      setPrimarySigned(!primarySigned);
                      setSignMessage(!primarySigned ? 'Primary faculty co-signature recorded!' : 'Primary signature reset');
                      setTimeout(() => setSignMessage(null), 2500);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <PenTool className="w-3 h-3" />
                    {primarySigned ? 'Revoke Signoff' : 'Sign as Lead Faculty'}
                  </button>
                </div>
              </div>

              {/* Co-Faculty / Lab Instructor */}
              <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Co-Faculty / Lab Instructor {isAdjunct ? '(Visiting / Adjunct)' : ''}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    coFacultySigned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {coFacultySigned ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {coFacultySigned ? 'Signed & Locked' : 'Pending Signoff'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {isAdjunct ? (currentFaculty?.name || 'Prof. Meera Kulkarni') : 'Prof. Sandeep Shinde'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {isAdjunct
                    ? `${currentFaculty?.designation || 'Visiting Industry Expert & Adjunct Faculty'} • ${currentFaculty?.empCode || 'EMP-ADJ-003'}`
                    : 'Lab Instructor & Co-Faculty • EMP-PH-112'}
                </div>
                <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {coFacultySigned ? 'OTP Signoff: 11:50 AM' : 'Awaiting co-instructor OTP'}
                  </span>
                  <button
                    onClick={() => {
                      setCoFacultySigned(!coFacultySigned);
                      setSignMessage(!coFacultySigned ? 'Co-faculty co-signature recorded!' : 'Co-faculty signature reset');
                      setTimeout(() => setSignMessage(null), 2500);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <PenTool className="w-3 h-3" />
                    {coFacultySigned ? 'Revoke Signoff' : 'Sign as Co-Faculty'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Continuous Assessment Rubric Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Continuous Assessment Rubric Ledger (MSBTE Norm: Max 20 Marks per Turn)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Performance/Technique (5) + Observation & Accuracy (5) + Journal Write-up (5) + Viva-Voce (5)
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Saves directly into Student 360° Record
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Roll</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3 text-center">Performance (5)</th>
                    <th className="py-2.5 px-3 text-center">Accuracy (5)</th>
                    <th className="py-2.5 px-3 text-center">Journal (5)</th>
                    <th className="py-2.5 px-3 text-center">Viva (5)</th>
                    <th className="py-2.5 px-3 text-center font-bold">Total (20)</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchStudents.map((st) => {
                    const grade = labGrades[st.id] || { performance: 4, accuracy: 4, journal: 4, viva: 4 };
                    const total = grade.performance + grade.accuracy + grade.journal + grade.viva;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">#{st.rollNo}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{st.name}</td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={grade.performance}
                            onChange={(e) => handleRubricChange(st.id, 'performance', Number(e.target.value))}
                            className="w-12 text-center p-1 border rounded font-semibold text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={grade.accuracy}
                            onChange={(e) => handleRubricChange(st.id, 'accuracy', Number(e.target.value))}
                            className="w-12 text-center p-1 border rounded font-semibold text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={grade.journal}
                            onChange={(e) => handleRubricChange(st.id, 'journal', Number(e.target.value))}
                            className="w-12 text-center p-1 border rounded font-semibold text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={grade.viva}
                            onChange={(e) => handleRubricChange(st.id, 'viva', Number(e.target.value))}
                            className="w-12 text-center p-1 border rounded font-semibold text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono text-sm">
                          {total} / 20
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              total >= 16
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : total >= 12
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {total >= 16 ? 'Distinction' : total >= 12 ? 'Satisfactory' : 'Needs Review'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">
                    NBA Criterion 3 & MSBTE Continuous Evaluation Co-Signatures:
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                  <span>
                    Lead Instructor: <strong className="text-slate-700">Dr. Sarah Jenkins</strong> ({primarySigned ? 'Signed' : 'Pending'})
                  </span>
                  <span>•</span>
                  <span>
                    Co-Faculty: <strong className="text-slate-700">Prof. Vikram Deshmukh</strong> ({coFacultySigned ? 'Signed' : 'Pending'})
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">Batch Journal Hash: #SHA256-PHARM-B{selectedBatch}</span>
                </div>
              </div>
              <button
                onClick={() => alert(`Continuous practical marks for Batch ${selectedBatch} committed with dual faculty signatures.`)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition whitespace-nowrap shadow-xs"
              >
                Commit Batch {selectedBatch} Marks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GLASSWARE BREAKAGE, FINE RECEIPTS & LAB CHEMICAL LOG */}
      {activeTab === 'LAB_MAINTENANCE' && (
        <LabBreakageApparatusLog
          institution={institution || null}
          subject={subject}
        />
      )}
    </div>
  );
};
