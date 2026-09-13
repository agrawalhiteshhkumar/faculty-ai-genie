import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Download,
  X,
  FileCheck2,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  ChevronRight,
  Calculator,
  UserCheck,
  FileText,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, StudentMaster } from '../types';
import { InstitutionSeal } from './InstitutionSeal';
import {
  DPK_COLLEGE_IDENTITY,
  OFFICIAL_MSBTE_CURRICULUM_SCHEME,
  SAMPLE_PH1_TEACHING_PLAN,
  SAMPLE_PH2_LAB_PLAN,
  SAMPLE_PH10_FIELD_VISITS,
  SAMPLE_PH11_ASSIGNMENTS,
} from '../data/msbteProformasData';
import { generateProformaStudentRecords } from '../utils/msbteProformaExports';

interface ConsolidatedCourseFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
}

export const ConsolidatedCourseFileModal: React.FC<ConsolidatedCourseFileModalProps> = ({
  isOpen,
  onClose,
  institution,
  subject,
  students: appStudents,
}) => {
  const [activeSection, setActiveSection] = useState<string>('ALL');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  const college = institution?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = institution?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = institution?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = institution?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = institution?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;
  const dept = institution?.departmentName || DPK_COLLEGE_IDENTITY.departmentName;
  const academicYear = institution?.currentAcademicYear || '2025-2026';

  const courseTitle = subject?.title || 'Pharmaceutics';
  const courseCode = subject?.code || 'ER20-11T (20111)';

  const studentRecords = generateProformaStudentRecords(appStudents);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  const sectionsList = [
    { id: 'COVER', label: '1. Cover & Index', ref: 'Statutory Identity' },
    { id: 'SYLLABUS', label: '2. PCI Syllabus & CEOs', ref: 'ER-2020 Scheme' },
    { id: 'CO_PO', label: '3. CO-PO Direct Matrix', ref: 'NBA Criterion 3' },
    { id: 'PH1', label: '4. Teaching Plan (PH-1)', ref: '75 Hours Plan' },
    { id: 'PH2', label: '5. Lab Plan (PH-2)', ref: 'Batches B1-B3' },
    { id: 'PH3', label: '6. Continuous Rubric (PH-3)', ref: '10M Rubric' },
    { id: 'QP_MA', label: '7. Sessional QPs & Model Answers', ref: 'S1, S2, S3 (40M)' },
    { id: 'PH4', label: '8. Progressive Assessment (PH-4/5)', ref: 'Best-of-Two Logic' },
    { id: 'PH9', label: '9. MSBTE Result Analysis (PH-9)', ref: 'Quality Audits' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                  Consolidated Statutory Course File Portfolio
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  MSBTE J-Scheme Bound Dossier
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {courseTitle} ({courseCode}) • Academic Year {academicYear} • Ready for NBA, MSBTE IAM/EAM & PCI SIF Inspection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="print-course-file-btn"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save Bound PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs (Hidden on print) */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto print:hidden">
          <button
            onClick={() => setActiveSection('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white/70'
            }`}
          >
            All Sections (Complete Bound Book)
          </button>
          {sectionsList.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white/70'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Main Document Body (Printable Paper View) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-12 bg-slate-50 text-slate-900 print:bg-white print:p-0 print:overflow-visible">
          
          {/* =========================================================================
              SECTION 1: INSTITUTIONAL COVER PAGE & STATUTORY INDEX
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'COVER') && (
            <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-slate-900 shadow-sm space-y-8 print:border-none print:shadow-none print:p-8 print:page-break-after-always">
              {/* Top Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
                <div className="flex justify-center mb-3">
                  <InstitutionSeal profile={institution} variant="circular" size="lg" />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Affiliated to Maharashtra State Board of Technical Education (MSBTE), Mumbai
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {college}
                </h1>
                <p className="text-xs font-medium text-slate-600">
                  {dept} • Approved by Pharmacy Council of India (PCI), New Delhi & DTE Maharashtra
                </p>
                
                {/* 4 Statutory Accreditation Codes */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-slate-700">
                  <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 rounded">AISHE: {aishe}</span>
                  <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-300 rounded text-amber-900">PCI: {pci}</span>
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-300 rounded text-indigo-900">DTE: {dte}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900">MSBTE: {msbte}</span>
                </div>
              </div>

              {/* Course Title Banner */}
              <div className="p-8 bg-slate-900 text-white rounded-xl text-center space-y-3 print:bg-white print:text-black print:border-2 print:border-slate-900">
                <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 print:text-slate-800">
                  MSBTE J-Scheme / PCI ER-2020 Statutory Course File
                </span>
                <h2 className="text-3xl font-black tracking-tight">
                  {courseTitle}
                </h2>
                <p className="text-sm font-mono text-amber-300 print:text-slate-700 font-bold">
                  Course Code: {courseCode} • First Year D.Pharm
                </p>
                <div className="pt-2 text-xs text-slate-300 print:text-slate-600">
                  Academic Year: <strong>{academicYear}</strong> • Pattern: <strong>Annual Scheme</strong>
                </div>
              </div>

              {/* Faculty & Administrative Accountability Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Course Coordinator / Faculty</span>
                  <div className="text-sm font-bold text-slate-900">Dr. Rajesh Sharma</div>
                  <div className="text-xs text-slate-600">Professor & Head, Pharmaceutics</div>
                  <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 font-mono">Sign & Date</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Academic Coordinator</span>
                  <div className="text-sm font-bold text-slate-900">Prof. Ananya Deshmukh</div>
                  <div className="text-xs text-slate-600">Associate Professor</div>
                  <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 font-mono">Verified Sign & Date</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Principal / Head of Institute</span>
                  <div className="text-sm font-bold text-slate-900">Dr. D. P. Kharde</div>
                  <div className="text-xs text-slate-600">Principal, DPKCOP</div>
                  <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 font-mono">Institutional Seal & Sign</div>
                </div>
              </div>

              {/* Comprehensive Statutory Table of Contents */}
              <div className="pt-6 space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
                  Statutory Portfolio Index & Quality Control Checklist
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5 w-12 text-center">Sr.</th>
                        <th className="p-2.5">Course Portfolio Document Component</th>
                        <th className="p-2.5 w-32 text-center">Statutory Code</th>
                        <th className="p-2.5 w-24 text-center">Page Ref</th>
                        <th className="p-2.5 w-24 text-center">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">1</td>
                        <td className="p-2.5 font-semibold">Institutional Letterhead, Codes & Approvals</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PCI/MSBTE</td>
                        <td className="p-2.5 text-center font-mono">Page 01</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">2</td>
                        <td className="p-2.5 font-semibold">PCI ER-2020 Prescribed Syllabus & Course Educational Objectives</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PCI Syllabus</td>
                        <td className="p-2.5 text-center font-mono">Page 02-04</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">3</td>
                        <td className="p-2.5 font-semibold">Course Outcomes (CO1 to CO5) & Direct CO-PO Articulation Matrix</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">NBA SAR C3</td>
                        <td className="p-2.5 text-center font-mono">Page 05</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">4</td>
                        <td className="p-2.5 font-semibold">Approved Teaching Plan (75 Theory Hours Execution Plan)</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PH-1</td>
                        <td className="p-2.5 text-center font-mono">Page 06-08</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">5</td>
                        <td className="p-2.5 font-semibold">Laboratory Activity / Assignment / Field Visit Plan (Batches B1-B3)</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PH-2</td>
                        <td className="p-2.5 text-center font-mono">Page 09-11</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">6</td>
                        <td className="p-2.5 font-semibold">Continuous Day-to-Day Assessment of Practical Work (10M Rubrics)</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PH-3</td>
                        <td className="p-2.5 text-center font-mono">Page 12-14</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">7</td>
                        <td className="p-2.5 font-semibold">Sessional Examinations (S1, S2, S3) Question Papers & Model Answer Schemes</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">QP / MA</td>
                        <td className="p-2.5 text-center font-mono">Page 15-20</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">8</td>
                        <td className="p-2.5 font-semibold">Progressive Assessment Marksheets (Theory & Practical Best-of-Two)</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PH-4(I)/(II)</td>
                        <td className="p-2.5 text-center font-mono">Page 21-24</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-center font-mono font-bold">9</td>
                        <td className="p-2.5 font-semibold">MSBTE Board Examination Result Analysis & Action Taken Report</td>
                        <td className="p-2.5 text-center font-mono text-slate-600">PH-9 / ATR</td>
                        <td className="p-2.5 text-center font-mono">Page 25</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Verified</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 2: PCI SYLLABUS & COURSE OBJECTIVES
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'SYLLABUS') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-amber-600">Syllabus Architecture</span>
                  <h3 className="text-lg font-black text-slate-900">
                    2. Pharmacy Council of India (PCI) ER-2020 Prescribed Syllabus
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 rounded border border-slate-300">
                  Course: ER20-11T • 75 Theory Hours
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-2">
                <h4 className="font-bold text-slate-900 uppercase">Course Scope & Objectives:</h4>
                <p className="text-slate-700">
                  This course is designed to impart fundamental knowledge on the formulation, development, packaging, and quality evaluation of various conventional and modern pharmaceutical dosage forms. It enables diploma pharmacy candidates to understand the physicochemical principles of compounding, current Good Manufacturing Practices (cGMP), and pharmaceutical unit operations.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Unit-wise Content & Allocation:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subject?.units?.map((u) => (
                    <div key={u.unitNumber} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-slate-900">Unit {u.unitNumber}: {u.title}</span>
                        <span className="text-[11px] font-bold text-indigo-700">{u.hoursAllocated} Hours</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>Target: <strong>{u.targetCO}</strong></span>
                        <span>•</span>
                        <span>Cognitive Level: <strong>{u.bloomsLevel}</strong></span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-xs text-slate-500">Standard ER-2020 6 units active.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 3: CO-PO DIRECT ARTICULATION MATRIX
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'CO_PO') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-indigo-600">NBA Criterion 3 Compliance</span>
                  <h3 className="text-lg font-black text-slate-900">
                    3. Course Outcomes (CO) & CO-PO Direct Correlation Matrix
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded border border-indigo-200">
                  Scale: 3=Substantial, 2=Moderate, 1=Slight
                </span>
              </div>

              {/* Course Outcomes Definitions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-800">Defined Course Outcomes (PCI ER-2020):</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
                    <span className="font-bold font-mono text-indigo-700">CO1:</span>
                    <span>Explain the fundamental concepts of packaging materials, pharmaceutical calculations, and metric systems.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
                    <span className="font-bold font-mono text-indigo-700">CO2:</span>
                    <span>Formulate and compound various liquid and semi-solid dosage forms adhering to official pharmacopoeial monographs.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
                    <span className="font-bold font-mono text-indigo-700">CO3:</span>
                    <span>Describe industrial manufacturing processes, defects, and troubleshooting of tablets, capsules, and unit operations.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
                    <span className="font-bold font-mono text-indigo-700">CO4:</span>
                    <span>Demonstrate aseptic techniques and quality evaluation of sterile injectable preparations and ophthalmic products.</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
                    <span className="font-bold font-mono text-indigo-700">CO5:</span>
                    <span>Apply pharmaceutical ethics, cGMP guidelines, and cleanroom air handling standards in industrial and hospital environments.</span>
                  </div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 text-left">Course Outcome</th>
                      <th className="p-2.5 w-12">PO1</th>
                      <th className="p-2.5 w-12">PO2</th>
                      <th className="p-2.5 w-12">PO3</th>
                      <th className="p-2.5 w-12">PO4</th>
                      <th className="p-2.5 w-12">PO5</th>
                      <th className="p-2.5 w-12">PO6</th>
                      <th className="p-2.5 w-12">PO7</th>
                      <th className="p-2.5 w-16 bg-amber-50 text-amber-900">Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold font-mono">
                    <tr>
                      <td className="p-2.5 text-left font-bold font-sans">CO1: Packaging & Calculations</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-amber-50 text-amber-950 font-bold font-mono">2.50</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold font-sans">CO2: Formulations & Compounding</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 bg-amber-50 text-amber-950 font-bold font-mono">2.60</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold font-sans">CO3: Solid Dosage & Troubleshooting</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-amber-50 text-amber-950 font-bold font-mono">2.80</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold font-sans">CO4: Sterile & Ophthalmic Prep</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">1</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-amber-50 text-amber-950 font-bold font-mono">2.67</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-left font-bold font-sans">CO5: cGMP & Ethical Compliance</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 text-slate-400">-</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">2</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-blue-50/50 text-blue-800">3</td>
                      <td className="p-2.5 bg-amber-50 text-amber-950 font-bold font-mono">2.60</td>
                    </tr>
                    <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-300">
                      <td className="p-2.5 text-left font-sans">Overall Course Articulation Level</td>
                      <td className="p-2.5">2.8</td>
                      <td className="p-2.5">2.75</td>
                      <td className="p-2.5">2.67</td>
                      <td className="p-2.5">2.4</td>
                      <td className="p-2.5">2.0</td>
                      <td className="p-2.5">3.0</td>
                      <td className="p-2.5">2.8</td>
                      <td className="p-2.5 bg-amber-100 text-amber-950 font-bold">2.63</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 4: APPROVED TEACHING PLAN (PH-1)
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'PH1') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-amber-600">MSBTE Proforma PH-1</span>
                  <h3 className="text-lg font-black text-slate-900">
                    4. Approved Statutory Teaching Plan (75 Hours Execution Log)
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                  ✓ 100% Executed (75/75 Hours)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 w-10 text-center">Sr.</th>
                      <th className="p-2.5 w-44">Chapter / Topic</th>
                      <th className="p-2.5">Coverage Subtopics</th>
                      <th className="p-2.5 w-16 text-center">Hours</th>
                      <th className="p-2.5 w-32">Planned Dates</th>
                      <th className="p-2.5 w-32">Actual Executed</th>
                      <th className="p-2.5 w-14 text-center">CO</th>
                      <th className="p-2.5 w-20 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_PH1_TEACHING_PLAN.map((row) => (
                      <tr key={row.srNo}>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-500">{row.srNo}</td>
                        <td className="p-2.5 font-bold text-slate-900">{row.chapterTopic}</td>
                        <td className="p-2.5 text-slate-600 leading-relaxed text-[11px]">{row.subtopics}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-indigo-700 bg-indigo-50/30">{row.prescribedHours}</td>
                        <td className="p-2.5 text-[11px] text-slate-600">{row.plannedDateFrom} to {row.plannedDateTo}</td>
                        <td className="p-2.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/20">{row.actualDateOfExecution}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-700">{row.mappedCO}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 5: APPROVED LAB ACTIVITY PLAN (PH-2)
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'PH2') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-purple-600">MSBTE Proforma PH-2</span>
                  <h3 className="text-lg font-black text-slate-900">
                    5. Approved Laboratory Activity Plan & Batch Schedule
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-800 rounded border border-purple-200">
                  Batches B1, B2 & B3 (60 Students)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Expt.</th>
                      <th className="p-2.5">Practical Title & Experiment Scope</th>
                      <th className="p-2.5 w-28 text-center bg-blue-50/50">Batch B1 (Act)</th>
                      <th className="p-2.5 w-28 text-center bg-purple-50/50">Batch B2 (Act)</th>
                      <th className="p-2.5 w-28 text-center bg-amber-50/50">Batch B3 (Act)</th>
                      <th className="p-2.5 w-16 text-center">Hours</th>
                      <th className="p-2.5 w-14 text-center">CO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_PH2_LAB_PLAN.map((row) => (
                      <tr key={row.exptNo}>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-500">{row.exptNo}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{row.title}</td>
                        <td className="p-2.5 text-center text-[11px] font-mono bg-blue-50/20">{row.batchB1Dates.actual}</td>
                        <td className="p-2.5 text-center text-[11px] font-mono bg-purple-50/20">{row.batchB2Dates.actual}</td>
                        <td className="p-2.5 text-center text-[11px] font-mono bg-amber-50/20">{row.batchB3Dates.actual}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-indigo-700">{row.hours}h</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{row.targetCO}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 6: DAY-TO-DAY ASSESSMENT CONTINUOUS RUBRIC (PH-3)
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'PH3') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-purple-600">MSBTE Proforma PH-3</span>
                  <h3 className="text-lg font-black text-slate-900">
                    6. Continuous Day-to-Day Laboratory Evaluation Register
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-800 rounded border border-purple-200">
                  Continuous 10-Mark Rubric
                </span>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-purple-900">
                <strong>Rubric Matrix:</strong> Punctuality & Prep (3M) + Manual Handling & Performance (4M) + Journal & Viva-Voce (3M) = 10 Marks. Average converted into 10-mark Continuous Lab Record Mark.
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[350px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2 w-12 text-center">Roll</th>
                      <th className="p-2 w-28">PRN</th>
                      <th className="p-2 w-40">Student Name</th>
                      <th className="p-2 text-center">P1</th>
                      <th className="p-2 text-center">P2</th>
                      <th className="p-2 text-center">P3</th>
                      <th className="p-2 text-center">P4</th>
                      <th className="p-2 text-center">P5</th>
                      <th className="p-2 text-center">P6</th>
                      <th className="p-2 text-center">P7</th>
                      <th className="p-2 text-center">P8</th>
                      <th className="p-2 text-center bg-blue-50 text-blue-900 font-black">S1 Avg</th>
                      <th className="p-2 text-center bg-emerald-50 text-emerald-900 font-black">S2 Avg</th>
                      <th className="p-2 text-center bg-amber-100 text-amber-950 font-black">Record (10M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.slice(0, 15).map((s) => (
                      <tr key={s.rollNo}>
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        {s.dayToDayP1to8.map((m, idx) => (
                          <td key={idx} className="p-2 text-center font-mono text-slate-600">{m}</td>
                        ))}
                        <td className="p-2 text-center font-mono font-bold text-blue-800 bg-blue-50/40">{s.sessional1LabAvg.toFixed(1)}</td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40">{s.sessional2LabAvg.toFixed(1)}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-900 bg-amber-50">{s.cumulativeLabRecordMark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 italic">*Showing first 15 of {studentRecords.length} student records for print brevity.</p>
            </div>
          )}

          {/* =========================================================================
              SECTION 7: SESSIONAL QUESTION PAPERS & MODEL ANSWERS
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'QP_MA') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-amber-600">Examinations Quality Audit</span>
                  <h3 className="text-lg font-black text-slate-900">
                    7. Sessional Question Papers & Faculty Model Answer Schemes
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-900 text-amber-400 rounded">
                  Format: 40 Marks Scaled to 20 • 90 Mins
                </span>
              </div>

              {/* Sample QP 1 */}
              <div className="p-6 rounded-xl border border-slate-300 bg-slate-50/50 space-y-4">
                <div className="text-center border-b border-slate-300 pb-3">
                  <div className="text-xs font-bold uppercase text-slate-800">{college}</div>
                  <div className="text-sm font-black text-slate-900">FIRST SESSIONAL EXAMINATION — ACADEMIC YEAR {academicYear}</div>
                  <div className="text-xs text-slate-600 font-medium">Course: {courseTitle} ({courseCode}) • Max Marks: 40 • Time: 90 Minutes</div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Section A */}
                  <div className="space-y-1">
                    <div className="font-black text-slate-900 bg-slate-200/80 px-2 py-1 rounded">
                      SECTION A: Objective / Multiple Choice Questions (10 Marks — All Compulsory, 1 Mark Each)
                    </div>
                    <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700">
                      <li>Which type of glass container is tested using the Powdered Glass Test as per Indian Pharmacopoeia? <span className="font-mono text-indigo-600 font-bold">[CO1 - K1 Remembering]</span></li>
                      <li>Define pharmaceutical displacement value as applied to suppository formulation. <span className="font-mono text-indigo-600 font-bold">[CO2 - K2 Understanding]</span></li>
                      <li>State the primary difference between flocculated and deflocculated suspensions. <span className="font-mono text-indigo-600 font-bold">[CO2 - K2 Understanding]</span></li>
                      <li>Identify the role of methylcellulose in suspension formulation. <span className="font-mono text-indigo-600 font-bold">[CO2 - K1 Remembering]</span></li>
                    </ol>
                  </div>

                  {/* Section B */}
                  <div className="space-y-1">
                    <div className="font-black text-slate-900 bg-slate-200/80 px-2 py-1 rounded">
                      SECTION B: Short Answer Questions (Attempt Any 5 out of 6 Questions — 3 Marks Each = 15 Marks)
                    </div>
                    <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700" start={5}>
                      <li>Describe the preparation and packaging of Simple Syrup IP with statutory storage conditions. <span className="font-mono text-indigo-600 font-bold">[CO2 - K3 Applying]</span></li>
                      <li>Explain the principle and working of the Ball Mill with a neat labeled schematic diagram. <span className="font-mono text-indigo-600 font-bold">[CO3 - K2 Understanding]</span></li>
                      <li>Differentiate between water-in-oil (W/O) and oil-in-water (O/W) emulsions with identification tests. <span className="font-mono text-indigo-600 font-bold">[CO2 - K4 Analyzing]</span></li>
                    </ol>
                  </div>

                  {/* Section C */}
                  <div className="space-y-1">
                    <div className="font-black text-slate-900 bg-slate-200/80 px-2 py-1 rounded">
                      SECTION C: Long Answer Questions (Attempt Any 3 out of 4 Questions — 5 Marks Each = 15 Marks)
                    </div>
                    <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700" start={8}>
                      <li>Explain the step-by-step granulation and compression process for tablets. Discuss common compression defects (capping, lamination) and their preventive measures. <span className="font-mono text-indigo-600 font-bold">[CO3 - K3 Applying]</span></li>
                      <li>Discuss the design, pressure differentials, and Grade A to D cleanroom classifications per Schedule M. <span className="font-mono text-indigo-600 font-bold">[CO4/CO5 - K3 Applying]</span></li>
                    </ol>
                  </div>
                </div>

                {/* Model Answer Scheme Preview */}
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Faculty Model Answer & Point-by-Point Marking Scheme Attached:
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    <strong>Q8 Tablet Granulation & Defects (5 Marks Rubric):</strong> Granulation flowchart (1.5M) + Tooling & compression mechanism (1.5M) + Explanation of Capping & Lamination causes (1M) + Remedial machine tooling and formulation adjustments (1M).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 8: PROGRESSIVE ASSESSMENT LEDGER (PH-4 / PH-5)
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'PH4') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-blue-600">MSBTE Proforma PH-4 (I) & (II)</span>
                  <h3 className="text-lg font-black text-slate-900">
                    8. Progressive Assessment (PA) Ledgers — Best-of-Two Engine
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200">
                  Best-of-Two Sessional Average + Continuous Mode = 20M
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[350px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2 w-12 text-center">Roll</th>
                      <th className="p-2 w-36">Student Name</th>
                      <th className="p-2 text-center">Theory S1 (40M)</th>
                      <th className="p-2 text-center">Theory S2 (40M)</th>
                      <th className="p-2 text-center font-bold text-blue-800 bg-blue-50">Best (40M)</th>
                      <th className="p-2 text-center">Scaled (10M)</th>
                      <th className="p-2 text-center">Continuous (10M)</th>
                      <th className="p-2 text-center font-black text-amber-950 bg-amber-100">Theory PA (20M)</th>
                      <th className="p-2 text-center">Prac Best (40M)</th>
                      <th className="p-2 text-center">Prac Scaled (10M)</th>
                      <th className="p-2 text-center">Lab Record (10M)</th>
                      <th className="p-2 text-center font-black text-emerald-950 bg-emerald-100">Prac PA (20M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.slice(0, 15).map((s) => (
                      <tr key={s.rollNo}>
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono">{s.theoryS1}</td>
                        <td className="p-2 text-center font-mono">{s.theoryS2}</td>
                        <td className="p-2 text-center font-mono font-bold text-blue-800 bg-blue-50/40">{s.theoryBest}</td>
                        <td className="p-2 text-center font-mono">{s.theoryScaled}</td>
                        <td className="p-2 text-center font-mono">{s.continuousModeTheory}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.totalTheoryPA}</td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-800">{s.practicalBest}</td>
                        <td className="p-2 text-center font-mono">{s.practicalScaled}</td>
                        <td className="p-2 text-center font-mono">{s.cumulativeLabRecordMark}</td>
                        <td className="p-2 text-center font-mono font-black text-emerald-950 bg-emerald-50">{s.totalPracticalPA}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 italic">*Showing first 15 records. Complete cohort ledger bound in final master export.</p>
            </div>
          )}

          {/* =========================================================================
              SECTION 9: MSBTE RESULT ANALYSIS (PH-9)
             ========================================================================= */}
          {(activeSection === 'ALL' || activeSection === 'PH9') && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:border-none print:shadow-none print:p-6 print:page-break-after-always">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-indigo-600">MSBTE Proforma PH-9</span>
                  <h3 className="text-lg font-black text-slate-900">
                    9. Institutional Result Analysis & Academic Performance Index
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                  Pass Rate: 96.6% (58 / 60 Appeared)
                </span>
              </div>

              {/* Performance Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Total Appeared</div>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">60</div>
                  <div className="text-[10px] text-slate-500">100% Enrollment</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-purple-700">Distinction (&ge;75%)</div>
                  <div className="text-xl font-black text-purple-900 font-mono mt-1">28</div>
                  <div className="text-[10px] text-purple-600">46.7% of Cohort</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-blue-700">First Class (60-74%)</div>
                  <div className="text-xl font-black text-blue-900 font-mono mt-1">24</div>
                  <div className="text-[10px] text-blue-600">40.0% of Cohort</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-amber-700">Second Class (50-59%)</div>
                  <div className="text-xl font-black text-amber-900 font-mono mt-1">6</div>
                  <div className="text-[10px] text-amber-600">10.0% of Cohort</div>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-rose-700">Remedial Backlog (&lt;50%)</div>
                  <div className="text-xl font-black text-rose-900 font-mono mt-1">2</div>
                  <div className="text-[10px] text-rose-600">ATR Initiated</div>
                </div>
              </div>

              {/* Statutory Audit Signatures */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <div className="font-bold text-slate-900">Dr. Rajesh Sharma</div>
                  <div className="text-slate-500">Course Coordinator</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <div className="font-bold text-slate-900">Prof. Vikram Patil</div>
                  <div className="text-slate-500">Academic Monitoring In-Charge</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <div className="font-bold text-slate-900">Dr. D. P. Kharde</div>
                  <div className="text-slate-500">Principal & Official Seal</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
