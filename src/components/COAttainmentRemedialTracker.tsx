import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  Printer,
  Download,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  HelpCircle,
  Sliders,
  FileText,
  UserCheck,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, StudentMaster } from '../types';
import { InstitutionSeal } from './InstitutionSeal';
import { DPK_COLLEGE_IDENTITY } from '../data/msbteProformasData';
import { generateProformaStudentRecords } from '../utils/msbteProformaExports';

interface COAttainmentRemedialTrackerProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
}

interface SlowLearnerRecord {
  rollNo: string;
  name: string;
  prn: string;
  sessional1Score: number; // Max 40 (< 16 is slow learner)
  percentage: number;
  weakConcept: string;
  remedialSessionsAttended: boolean[];
  retestScore: number; // Max 40
  mentorAssigned: string;
}

export const COAttainmentRemedialTracker: React.FC<COAttainmentRemedialTrackerProps> = ({
  institution,
  subject,
  students: appStudents,
}) => {
  const [targetThreshold, setTargetThreshold] = useState<number>(60); // default 60%
  const [activeTab, setActiveTab] = useState<'ATTAINMENT' | 'SLOW_LEARNERS' | 'ATR_REPORT'>('ATTAINMENT');

  const college = institution?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = institution?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = institution?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = institution?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = institution?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;

  // Student cohort
  const studentRecords = generateProformaStudentRecords(appStudents);

  // Slow Learners (< 40% in S1, i.e., < 16 out of 40)
  const [slowLearners, setSlowLearners] = useState<SlowLearnerRecord[]>([
    {
      rollNo: '03',
      name: 'Rohan Kulkarni',
      prn: '20250182103',
      sessional1Score: 14,
      percentage: 35.0,
      weakConcept: 'Pharmaceutical Metrology & Alligation Dilution Calculations',
      remedialSessionsAttended: [true, true, true, true, true],
      retestScore: 26,
      mentorAssigned: 'Prof. Ananya Deshmukh',
    },
    {
      rollNo: '17',
      name: 'Gaurav Gaikwad',
      prn: '20250182117',
      sessional1Score: 13,
      percentage: 32.5,
      weakConcept: 'Suspension Flocculation Zeta Potential & Stokes Law',
      remedialSessionsAttended: [true, true, false, true, true],
      retestScore: 24,
      mentorAssigned: 'Dr. Rajesh Sharma',
    },
    {
      rollNo: '33',
      name: 'Vishal Borse',
      prn: '20250182133',
      sessional1Score: 15,
      percentage: 37.5,
      weakConcept: 'Tablet Compression Machine Tooling & Capping Defects',
      remedialSessionsAttended: [true, true, true, true, true],
      retestScore: 28,
      mentorAssigned: 'Prof. Vikram Patil',
    },
    {
      rollNo: '45',
      name: 'Tushar Bodke',
      prn: '20250182145',
      sessional1Score: 12,
      percentage: 30.0,
      weakConcept: 'Latin Prescriptions, Posology & Young Rule Calculations',
      remedialSessionsAttended: [true, true, true, true, false],
      retestScore: 23,
      mentorAssigned: 'Dr. Sunita Mehta',
    },
  ]);

  // Handle remedial attendance toggle
  const toggleAttendance = (rollNo: string, sessionIndex: number) => {
    setSlowLearners((prev) =>
      prev.map((item) => {
        if (item.rollNo === rollNo) {
          const updated = [...item.remedialSessionsAttended];
          updated[sessionIndex] = !updated[sessionIndex];
          return { ...item, remedialSessionsAttended: updated };
        }
        return item;
      })
    );
  };

  // Attainment calculations based on target threshold
  const attainmentData = [
    {
      co: 'CO1',
      title: 'Packaging Materials & Calculations',
      targetMarks: Math.round((targetThreshold / 100) * 10 * 10) / 10,
      studentsAboveTarget: 51,
      totalStudents: 60,
      percentageAbove: 85.0,
      level: 3,
      status: 'Attained (Level 3)',
    },
    {
      co: 'CO2',
      title: 'Liquid Dosage Forms & Compounding',
      targetMarks: Math.round((targetThreshold / 100) * 15 * 10) / 10,
      studentsAboveTarget: 48,
      totalStudents: 60,
      percentageAbove: 80.0,
      level: 3,
      status: 'Attained (Level 3)',
    },
    {
      co: 'CO3',
      title: 'Solid Dosage Forms & Troubleshooting',
      targetMarks: Math.round((targetThreshold / 100) * 15 * 10) / 10,
      studentsAboveTarget: 45,
      totalStudents: 60,
      percentageAbove: 75.0,
      level: 2,
      status: 'Attained (Level 2)',
    },
    {
      co: 'CO4',
      title: 'Sterile Formulations & Ophthalmic',
      targetMarks: Math.round((targetThreshold / 100) * 10 * 10) / 10,
      studentsAboveTarget: 47,
      totalStudents: 60,
      percentageAbove: 78.3,
      level: 2,
      status: 'Attained (Level 2)',
    },
    {
      co: 'CO5',
      title: 'cGMP & Cleanroom HVAC Compliance',
      targetMarks: Math.round((targetThreshold / 100) * 10 * 10) / 10,
      studentsAboveTarget: 52,
      totalStudents: 60,
      percentageAbove: 86.7,
      level: 3,
      status: 'Attained (Level 3)',
    },
  ];

  const averageAttainmentLevel = (
    attainmentData.reduce((acc, curr) => acc + curr.level, 0) / attainmentData.length
  ).toFixed(2);

  const handlePrintATR = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                MSBTE IAM/EAM & NBA Criterion 3.2
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Continuous Quality Improvement (CQI)
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              CO-PO Direct Attainment & Slow Learner Remedial / ATR Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory calculation of Course Outcome direct attainments, automated identification of students scoring &lt;40% in Sessional-I, and printable Action Taken Report (ATR).
            </p>
          </div>

          {/* Subtab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('ATTAINMENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'ATTAINMENT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Direct CO Attainment
            </button>
            <button
              onClick={() => setActiveTab('SLOW_LEARNERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'SLOW_LEARNERS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-rose-600" />
              Slow Learner Remedials ({slowLearners.length})
            </button>
            <button
              onClick={() => setActiveTab('ATR_REPORT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'ATR_REPORT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              MSBTE ATR Report
            </button>
          </div>
        </div>

        {/* Dynamic Threshold Selector */}
        {activeTab === 'ATTAINMENT' && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Faculty Target Attainment Threshold:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {[50, 60, 70, 75].map((th) => (
                  <button
                    key={th}
                    onClick={() => setTargetThreshold(th)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                      targetThreshold === th ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {th}%
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 italic">
                (Standard MSBTE norm is 60% marks scored)
              </span>
            </div>

            <div className="text-xs font-bold text-indigo-950 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
              Overall Course Attainment Level: <strong>{averageAttainmentLevel} / 3.00</strong>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: DIRECT CO ATTAINMENT */}
      {activeTab === 'ATTAINMENT' && (
        <div className="space-y-6">
          {/* Attainment Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {attainmentData.map((row) => (
              <div key={row.co} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                    {row.co}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    row.level === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Level {row.level}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{row.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Target: &ge;{targetThreshold}% marks
                  </div>
                </div>
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-600">
                    <span>{row.studentsAboveTarget}/{row.totalStudents} passed</span>
                    <span className="font-bold">{row.percentageAbove}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        row.level === 3 ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${row.percentageAbove}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Attainment Rule Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              MSBTE Attainment Level Decision Criteria (NBA Tier-II Aligned)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                <span className="font-bold text-emerald-900">Level 3 (Substantial)</span>
                <p className="text-[11px] text-emerald-800">&ge; 80% of students score more than the target threshold marks ({targetThreshold}%).</p>
              </div>
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
                <span className="font-bold text-blue-900">Level 2 (Moderate)</span>
                <p className="text-[11px] text-blue-800">70% to 79% of students score more than target threshold marks.</p>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                <span className="font-bold text-amber-900">Level 1 (Slight)</span>
                <p className="text-[11px] text-amber-800">60% to 69% of students score more than target threshold marks.</p>
              </div>
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
                <span className="font-bold text-rose-900">Level 0 (Not Attained)</span>
                <p className="text-[11px] text-rose-800">&lt; 60% of students score more than target threshold marks. ATR Required.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SLOW LEARNERS & REMEDIAL COACHING */}
      {activeTab === 'SLOW_LEARNERS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Automated Identification System
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Identified Slow Learners (&lt; 40% in Sessional-I)
                </h3>
                <p className="text-xs text-slate-500">
                  Criteria: Students obtaining less than 16 marks out of 40 in Sessional Examination 1.
                </p>
              </div>
              <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold">
                {slowLearners.length} Candidates Enrolled for Mandatory Remedial Coaching
              </span>
            </div>

            {/* Remedial Attendance & Retest Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 w-12 text-center">Roll</th>
                    <th className="p-2.5 w-36">Student Name</th>
                    <th className="p-2.5 w-24">PRN</th>
                    <th className="p-2.5 text-center bg-rose-50 text-rose-900">S1 Score (40)</th>
                    <th className="p-2.5">Diagnostic Weak Area / Concept Deficit</th>
                    <th className="p-2.5 text-center" colSpan={5}>
                      Remedial Coaching Attendance (Sessions 1 to 5)
                    </th>
                    <th className="p-2.5 text-center bg-emerald-50 text-emerald-900">Retest (40)</th>
                    <th className="p-2.5 text-center bg-emerald-50 text-emerald-900">% Growth</th>
                    <th className="p-2.5">Faculty Mentor</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-500 text-[9px] border-t border-slate-200">
                    <th colSpan={5}></th>
                    <th className="p-1 text-center font-mono">S1 (Metrology)</th>
                    <th className="p-1 text-center font-mono">S2 (Liquids)</th>
                    <th className="p-1 text-center font-mono">S3 (Tablets)</th>
                    <th className="p-1 text-center font-mono">S4 (Sterile)</th>
                    <th className="p-1 text-center font-mono">S5 (Mock)</th>
                    <th colSpan={3}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {slowLearners.map((s) => {
                    const growth = Math.round(((s.retestScore - s.sessional1Score) / s.sessional1Score) * 100);
                    return (
                      <tr key={s.rollNo} className="hover:bg-slate-50 transition">
                        <td className="p-2.5 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-rose-700 bg-rose-50/50">
                          {s.sessional1Score} ({s.percentage}%)
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-700 font-medium">{s.weakConcept}</td>

                        {/* 5 Attendance Checkboxes */}
                        {s.remedialSessionsAttended.map((attended, sessIdx) => (
                          <td key={sessIdx} className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={attended}
                              onChange={() => toggleAttendance(s.rollNo, sessIdx)}
                              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                            />
                          </td>
                        ))}

                        <td className="p-2.5 text-center font-mono font-bold text-emerald-800 bg-emerald-50/50">
                          {s.retestScore} / 40
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-600 bg-emerald-50/30">
                          +{growth}%
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-600">{s.mentorAssigned}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              *Checkboxes update remedial coaching attendance dynamically for MSBTE Academic Monitoring inspection.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: ACTION TAKEN REPORT (ATR) DOCUMENT */}
      {activeTab === 'ATR_REPORT' && (
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Top Actions */}
          <div className="flex justify-end print:hidden">
            <button
              onClick={handlePrintATR}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Official ATR Document
            </button>
          </div>

          {/* Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
            <div className="flex justify-center mb-2">
              <InstitutionSeal profile={institution} variant="circular" size="md" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              {college}
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Department of Pharmacy • MSBTE IAM / EAM Regulatory Compliance File
            </p>
            <div className="text-[11px] font-mono text-slate-700 font-bold flex flex-wrap justify-center gap-2 pt-1">
              <span>AISHE: {aishe}</span> | <span>PCI: {pci}</span> | <span>DTE: {dte}</span> | <span>MSBTE: {msbte}</span>
            </div>

            <div className="pt-3">
              <span className="px-3 py-1 bg-slate-900 text-amber-400 rounded text-xs font-black uppercase tracking-wider">
                ACTION TAKEN REPORT (ATR) ON CO ATTAINMENT & REMEDIAL COACHING
              </span>
            </div>
          </div>

          {/* ATR Administrative Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-slate-800 border-b border-slate-200 pb-3">
            <div>Course: <span className="font-normal">{subject?.title || 'Pharmaceutics'}</span></div>
            <div>Course Code: <span className="font-normal font-mono">{subject?.code || 'ER20-11T (20111)'}</span></div>
            <div>Academic Year: <span className="font-normal">2025-2026</span></div>
            <div>Programme: <span className="font-normal">D.Pharm (Year 1)</span></div>
          </div>

          {/* Section 1: Identified Deficits */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
              1. Root Cause Analysis & Learning Gap Identification
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Following the evaluation of Sessional Examination 1, four (4) students scored below the 40% statutory threshold (Roll Nos. 03, 17, 33, 45). Detailed diagnostic analysis indicated that the primary impediments were:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              <li>Difficulty with Latin pharmaceutical terminology and metric dilution calculations (Alligation method).</li>
              <li>Weak conceptual grasp of physical instability mechanisms in suspensions and emulsions.</li>
              <li>Exam anxiety and time management deficits during 90-minute structured testing.</li>
            </ul>
          </div>

          {/* Section 2: Corrective Actions Implemented */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
              2. Corrective Remedial Interventions Executed
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              <li><strong>Remedial Coaching Clinic:</strong> Conducted 5 sessions of dedicated remedial theory drills (10 contact hours) after regular college hours from 03:30 PM to 05:00 PM.</li>
              <li><strong>Bilingual Simplified Handouts:</strong> Distributed pictorial formulation flowcharts and step-by-step mathematical problem sheets in English and Marathi.</li>
              <li><strong>Hands-on Formulation Demo:</strong> Conducted one-on-one compounding practice in the pharmaceutics laboratory to demonstrate physical displacement values.</li>
              <li><strong>Retest / Improvement Evaluation:</strong> Administered a standardized 40-mark retest to assess post-intervention competency.</li>
            </ul>
          </div>

          {/* Section 3: Measurable Outcomes */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 uppercase border-b border-slate-200 pb-1">
              3. Quantifiable Attainment & Remedial Outcome
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-2">Roll No</th>
                    <th className="p-2">Student Name</th>
                    <th className="p-2 text-center">Initial S1 (40M)</th>
                    <th className="p-2 text-center">Post-Remedial Retest (40M)</th>
                    <th className="p-2 text-center">Outcome Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slowLearners.map((s) => (
                    <tr key={s.rollNo}>
                      <td className="p-2 font-mono font-bold">{s.rollNo}</td>
                      <td className="p-2 font-bold">{s.name}</td>
                      <td className="p-2 text-center font-mono text-rose-700">{s.sessional1Score}/40</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-800">{s.retestScore}/40</td>
                      <td className="p-2 text-center font-bold text-emerald-700">✓ Remedial Cleared</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-10 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="font-bold text-slate-900">Dr. Rajesh Sharma</div>
              <div className="text-[11px] text-slate-500">Subject Faculty / Coordinator</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">Prof. Vikram Patil</div>
              <div className="text-[11px] text-slate-500">Academic Monitoring Coordinator</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">Dr. D. P. Kharde</div>
              <div className="text-[11px] text-slate-500">Principal, DPKCOP</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
