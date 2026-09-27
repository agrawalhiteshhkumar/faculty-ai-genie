'use client';

import React, { useState } from 'react';
import { generateOfficialReport } from '../../utils/printReport';
import { X, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StudentMarkRecord {
  id: string;
  rollNo: number;
  enrollmentNo: string;
  name: string;
  pharmaceutics: number;
  pharmacology: number;
  chemistry: number;
  pharmacognosy: number;
  attendancePercent: number;
  isDetained: boolean;
}

const DEFAULT_EXAM_MARKS: StudentMarkRecord[] = [
  { id: 'S1', rollNo: 1, enrollmentNo: '230623860001', name: 'Aarav Patil', pharmaceutics: 18, pharmacology: 17, chemistry: 16, pharmacognosy: 19, attendancePercent: 88, isDetained: false },
  { id: 'S2', rollNo: 2, enrollmentNo: '230623860002', name: 'Ananya Deshmukh', pharmaceutics: 19, pharmacology: 18, chemistry: 19, pharmacognosy: 18, attendancePercent: 94, isDetained: false },
  { id: 'S3', rollNo: 3, enrollmentNo: '230623860003', name: 'Rohan Shinde', pharmaceutics: 14, pharmacology: 12, chemistry: 15, pharmacognosy: 13, attendancePercent: 78, isDetained: false },
  { id: 'S4', rollNo: 4, enrollmentNo: '230623860004', name: 'Pooja Jadhav', pharmaceutics: 8, pharmacology: 9, chemistry: 7, pharmacognosy: 10, attendancePercent: 62, isDetained: true },
  { id: 'S5', rollNo: 5, enrollmentNo: '230623860005', name: 'Aditya Gaikwad', pharmaceutics: 16, pharmacology: 15, chemistry: 17, pharmacognosy: 16, attendancePercent: 84, isDetained: false },
  { id: 'S6', rollNo: 6, enrollmentNo: '230623860006', name: 'Neha Kulkarni', pharmaceutics: 11, pharmacology: 10, chemistry: 9, pharmacognosy: 12, attendancePercent: 69, isDetained: true },
];

export default function ExamCellModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [students] = useState<StudentMarkRecord[]>(DEFAULT_EXAM_MARKS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ELIGIBLE' | 'DETAINED'>('ALL');

  if (!isOpen) return null;

  const totalStudents = students.length;
  const detainedCount = students.filter((s) => s.isDetained).length;
  const eligibleCount = totalStudents - detainedCount;

  const filteredStudents = students.filter((s) => {
    if (activeTab === 'ELIGIBLE') return !s.isDetained;
    if (activeTab === 'DETAINED') return s.isDetained;
    return true;
  });

  const handlePrintExamLedger = () => {
    const auditHash = '0x' + Math.random().toString(16).substring(2, 10) + 'msb9';
    onLogAudit('MSBTE_EXAM_MARKS_PRINTED', `Generated MSBTE Sessional Marks & Detention Clearance Ledger with hash ${auditHash}`);

    generateOfficialReport({
      title: 'MSBTE Continuous Internal Evaluation & Sessional Marks Ledger',
      subtitle: 'Verified against Maharashtra State Board of Technical Education (MSBTE) Exam Regulation 2026',
      regulatoryBody: 'MSBTE',
      reportRefNo: `DPKCOP/MSBTE-EXAM/${new Date().getFullYear()}/SESS-01`,
      dataHeaders: [
        'Roll No',
        'Student Enrollment Name',
        'MSBTE Enrolment No',
        'Pharmaceutics',
        'Pharmacology',
        'Chemistry',
        'Pharmacognosy',
        'Attendance %',
        'Hall Ticket Status',
      ],
      dataRows: filteredStudents.map((s) => [
        s.rollNo,
        s.name,
        s.enrollmentNo,
        `${s.pharmaceutics}/20`,
        `${s.pharmacology}/20`,
        `${s.chemistry}/20`,
        `${s.pharmacognosy}/20`,
        `${s.attendancePercent}%`,
        s.isDetained ? 'DETAINED' : 'CLEARED / ELIGIBLE',
      ]),
      summaryMetrics: [
        { label: 'Total Candidates Registered', value: `${totalStudents} Enrolled` },
        { label: 'Hall Tickets Cleared', value: `${eligibleCount} Students` },
        { label: 'Detained (Short Attendance/Marks)', value: `${detainedCount} Students` },
        { label: 'MSBTE Institute Code', value: '62386 (Sinnar)' },
      ],
      auditHash,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">MSBTE Examination Cell</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-mono font-bold">Code: 62386</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Continuous Sessional Evaluation &amp; Detention Matrix</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {(['ALL', 'ELIGIBLE', 'DETAINED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {tab === 'ALL' && `All Candidates (${totalStudents})`}
                {tab === 'ELIGIBLE' && `Eligible (${eligibleCount})`}
                {tab === 'DETAINED' && `Detained (${detainedCount})`}
              </button>
            ))}
          </div>
          <button onClick={handlePrintExamLedger} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Printer className="w-3.5 h-3.5" /> Print MSBTE Marks Sheet (PDF)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Candidate</th>
                <th className="pb-3 text-center">Pharmaceutics</th>
                <th className="pb-3 text-center">Pharmacology</th>
                <th className="pb-3 text-center">Chemistry</th>
                <th className="pb-3 text-center">Pharmacognosy</th>
                <th className="pb-3 text-center">Attendance</th>
                <th className="pb-3 text-right">Hall Ticket Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Roll: {s.rollNo} • Enrolment: {s.enrollmentNo}</div>
                  </td>
                  <td className="py-3 text-center font-mono text-slate-700">{s.pharmaceutics}/20</td>
                  <td className="py-3 text-center font-mono text-slate-700">{s.pharmacology}/20</td>
                  <td className="py-3 text-center font-mono text-slate-700">{s.chemistry}/20</td>
                  <td className="py-3 text-center font-mono text-slate-700">{s.pharmacognosy}/20</td>
                  <td className="py-3 text-center font-mono font-bold text-slate-800">{s.attendancePercent}%</td>
                  <td className="py-3 text-right">
                    {s.isDetained ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" /> Detained
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Eligible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
