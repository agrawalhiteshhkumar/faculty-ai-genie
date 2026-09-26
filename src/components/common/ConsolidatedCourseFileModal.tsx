'use client';

import React from 'react';
import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { AcademicClassCohort } from '../../cohortTypes';
import { DualDateConductRecord, PracticalAssessmentLog } from '../../dateEngineTypes';
import { SessionalTestMarks } from '../../examTypes';
import { CourseOutcomeItem } from '../../coAttainmentTypes';

interface ConsolidatedCourseFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass?: AcademicClassCohort;
  subjectCode: string;
  subjectTitle: string;
  facultyName: string;
  academicYear: string;
  diaryRecords: DualDateConductRecord[];
  practicalLogs: PracticalAssessmentLog[];
  sessionals: SessionalTestMarks[];
  outcomes: CourseOutcomeItem[];
}

export const ConsolidatedCourseFileModal: React.FC<ConsolidatedCourseFileModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
  subjectCode,
  subjectTitle,
  facultyName,
  academicYear,
  diaryRecords,
  practicalLogs,
  sessionals,
  outcomes,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-sm">
              Statutory Course File Dossier (MSBTE PH-4 / PH-5 / CIAAN-2023)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs">
          {/* Cover & Institutional Header */}
          <div className="text-center border-b border-slate-800 pb-5">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              MSBTE Statutory Curricular Documentation
            </span>
            <h1 className="text-xl font-extrabold text-white mt-2">INSTITUTIONAL COURSE DOSSIER</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Program: {selectedClass?.name || 'Diploma in Pharmacy'} | Academic Year: {academicYear}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-left bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Course Code</span>
                <span className="font-bold text-blue-400">{subjectCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Course Title</span>
                <span className="font-bold text-white truncate block">{subjectTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Faculty In-Charge</span>
                <span className="font-bold text-emerald-400">{facultyName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Audit Compliance</span>
                <span className="font-bold text-amber-400">MSBTE J-Scheme</span>
              </div>
            </div>
          </div>

          {/* Section 1: Course Outcomes (PCI ER-2020) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Section 1: Course Outcomes &amp; Cognitive Mapping</span>
            </h4>
            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-2">CO Code</th>
                    <th className="p-2">Course Outcome Statement</th>
                    <th className="p-2 text-right">Bloom&apos;s Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {outcomes.map((co) => (
                    <tr key={co.id}>
                      <td className="p-2 font-mono font-bold text-indigo-400">{co.code}</td>
                      <td className="p-2 text-slate-300">{co.statement}</td>
                      <td className="p-2 font-mono text-right text-slate-400">
                        {co.bloomsLevel.replace('_', ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Teaching Diary Conduct Log (PH-4) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Section 2: Teaching Diary Summary (Format PH-4)</span>
            </h4>
            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-2">Curricular Unit &amp; Topic</th>
                    <th className="p-2">Planned Date</th>
                    <th className="p-2">Actual Date</th>
                    <th className="p-2 text-right">Conduct Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {diaryRecords.map((r) => (
                    <tr key={r.id}>
                      <td className="p-2">
                        <span className="font-bold text-slate-200">{r.topicOrExperimentTitle}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {r.curriculumReferenceUnit}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-slate-400">{r.plannedDate}</td>
                      <td className="p-2 font-mono text-emerald-400">{r.actualDate}</td>
                      <td className="p-2 text-right font-medium text-slate-300">
                        {r.discrepancyReason || 'Completed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Sessional Examination Progressive Sheet */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Section 3: Progressive Marksheet Summary (CIAAN-2023)</span>
            </h4>
            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-2">Roll</th>
                    <th className="p-2">Student Name</th>
                    <th className="p-2 text-center">Sessional I (40M)</th>
                    <th className="p-2 text-center">Sessional II (40M)</th>
                    <th className="p-2 text-center">Average (40M)</th>
                    <th className="p-2 text-right">Statutory Scaled (20M)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sessionals.map((s) => (
                    <tr key={s.studentId}>
                      <td className="p-2 font-mono text-slate-400">{s.studentRollNo}</td>
                      <td className="p-2 font-bold text-slate-200">{s.studentName}</td>
                      <td className="p-2 text-center font-mono">{s.firstSessionalScore}</td>
                      <td className="p-2 text-center font-mono">{s.secondSessionalScore}</td>
                      <td className="p-2 text-center font-mono text-slate-300">
                        {s.calculatedAverage}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-blue-400">
                        {s.scaledSessionalScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Sign-off Footer */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-3 text-center text-[10px] text-slate-400 font-mono">
            <div>
              <div className="h-10 border-b border-dashed border-slate-700 mx-6 mb-2"></div>
              <span>Subject Teacher Signature</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-700 mx-6 mb-2"></div>
              <span>Academic Coordinator</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-700 mx-6 mb-2"></div>
              <span>Principal / Head of Institution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedCourseFileModal;
