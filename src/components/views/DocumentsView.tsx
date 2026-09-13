import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  Share2,
  ShieldCheck,
  Printer,
  Copy,
  MessageSquare,
  Sparkles,
  Lock,
  ExternalLink,
  BookOpen,
  Award,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, AuditLogEntry, ActionTakenReport, StudentMaster } from '../../types';
import { MSBTEProformasView } from './MSBTEProformasView';
import {
  MSBTE_PROFORMA_LIST,
  OFFICIAL_MSBTE_CURRICULUM_SCHEME,
  DPK_COLLEGE_IDENTITY,
} from '../../data/msbteProformasData';
import { ConsolidatedCourseFileModal } from '../ConsolidatedCourseFileModal';
import {
  exportAllMSBTEProformasExcelBundle,
  exportPH1TeachingPlanExcel,
  exportPH2LabPlanExcel,
  exportPH3DayToDayExcel,
  exportPH4TheoryYear1Excel,
  exportPH4PracticalYear1Excel,
  exportPH5TheoryYear2Excel,
  exportPH5PracticalYear2Excel,
  exportPH6TheorySessionalExcel,
  exportPH7PracticalSessionalExcel,
  exportPH8FinalBoardPracticalExcel,
  exportPH9ResultAnalysisExcel,
  exportPH10FieldVisitExcel,
  exportPH11AssignmentMarksheetExcel,
} from '../../utils/msbteProformaExports';

interface DocumentsViewProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
  auditLogs: AuditLogEntry[];
  actionTakenReports: ActionTakenReport[];
  onNavigateTab?: (tab: any) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  institution,
  subject,
  students,
  auditLogs,
  actionTakenReports,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'COURSE_FILE' | 'MSBTE_PROFORMAS' | 'PACKS' | 'COMMUNICATION' | 'AUDIT'>('COURSE_FILE');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [isExportingAllBundle, setIsExportingAllBundle] = useState(false);
  const [isConsolidatedModalOpen, setIsConsolidatedModalOpen] = useState(false);

  // Communication Copilot State
  const [commTopic, setCommTopic] = useState('Remedial Formulation & Hands-On Coaching Clinic');
  const [commAudience, setCommAudience] = useState('D.Pharm 1st Year (Div A)');
  const [commDate, setCommDate] = useState('Monday, 15-September-2025 at 03:30 PM');
  const [commDetails, setCommDetails] = useState('Mandatory coaching for students scoring below 60% in Sessional Exam 1. Covers tablet manufacturing troubleshooting and IP quality standards.');
  const [commResult, setCommResult] = useState<any>(null);
  const [isGeneratingComm, setIsGeneratingComm] = useState(false);

  const handleGenerateComm = async () => {
    setIsGeneratingComm(true);
    try {
      const tenantId = localStorage.getItem('faculty_genie_tenant_id') || '';
      const licenseKey = localStorage.getItem('faculty_genie_license_key') || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (tenantId) headers['x-tenant-id'] = tenantId;
      if (licenseKey) headers['x-license-key'] = licenseKey;

      const res = await fetch('/api/ai/communication', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic: commTopic,
          targetAudience: commAudience,
          date: commDate,
          details: commDetails,
          institution: institution || undefined,
        }),
      });
      const data = await res.json();
      setCommResult(data.communication);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingComm(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(`Copied ${label}!`);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  const handleExportSingleProforma = (id: string) => {
    switch (id) {
      case 'PH-1': exportPH1TeachingPlanExcel(institution, subject); break;
      case 'PH-2': exportPH2LabPlanExcel(institution, subject); break;
      case 'PH-3': exportPH3DayToDayExcel(institution, subject); break;
      case 'PH-4_I': exportPH4TheoryYear1Excel(institution, subject); break;
      case 'PH-4_II': exportPH4PracticalYear1Excel(institution, subject); break;
      case 'PH-5_I': exportPH5TheoryYear2Excel(institution); break;
      case 'PH-5_II': exportPH5PracticalYear2Excel(institution); break;
      case 'PH-6': exportPH6TheorySessionalExcel(institution, subject); break;
      case 'PH-7': exportPH7PracticalSessionalExcel(institution, subject); break;
      case 'PH-8': exportPH8FinalBoardPracticalExcel(institution, subject); break;
      case 'PH-9': exportPH9ResultAnalysisExcel(institution, subject); break;
      case 'PH-10': exportPH10FieldVisitExcel(institution, subject); break;
      case 'PH-11': exportPH11AssignmentMarksheetExcel(institution, subject); break;
      default: break;
    }
  };

  const handleDownloadAllBundle = () => {
    setIsExportingAllBundle(true);
    exportAllMSBTEProformasExcelBundle(institution, subject);
    setTimeout(() => {
      setIsExportingAllBundle(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-amber-400 border border-slate-700 mb-1">
            <FileCheck2 className="w-3 h-3" />
            Accreditation Evidence & Compliance Center
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            1-Click Course File, Compliance Packs & Audit Trails
          </h1>
          <p className="text-xs text-slate-500">
            Self-contained statutory documentation for NBA SAR, MSBTE CIAAN-2023 & PCI SIF
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('COURSE_FILE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'COURSE_FILE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            1-Click Course File
          </button>
          <button
            onClick={() => setActiveSubTab('MSBTE_PROFORMAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'MSBTE_PROFORMAS'
                ? 'bg-slate-900 text-amber-400 shadow-xs ring-1 ring-amber-400/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
            MSBTE Proformas (PH-1 to PH-11)
            <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded">ER-2020</span>
          </button>
          <button
            onClick={() => setActiveSubTab('PACKS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'PACKS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Statutory Packs (NBA/PCI)
          </button>
          <button
            onClick={() => setActiveSubTab('COMMUNICATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'COMMUNICATION'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            Communication Copilot
          </button>
          <button
            onClick={() => setActiveSubTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'AUDIT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            Cryptographic Audit Ledger
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 1-CLICK ACCREDITATION COURSE FILE */}
      {activeSubTab === 'COURSE_FILE' && (
        !subject ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-slate-800">No Course File Available</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Course files require a curriculum course master to be loaded. Go to Setup & Masters to import subjects or load the sample course.
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
        ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Official Institutional Dossier Header with 4 Statutory Codes */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl border border-slate-800 shadow-sm print:border print:border-slate-400 print:text-black print:bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                    Official Course Dossier
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {institution?.currentAcademicYear || '2025-2026'} • {institution?.currentTerm || 'Odd Semester / Year 1'}
                  </span>
                </div>
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white print:text-black">
                  {institution?.name || 'Metropolitan Institute of Pharmacy & Technology'}
                </h1>
                <p className="text-xs text-slate-300 print:text-slate-700 mt-0.5 font-medium">
                  {institution?.departmentName || 'Department of Pharmacy'} • {institution?.affiliatedBoard || 'MSBTE Mumbai / PCI New Delhi'}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  Course File Identifier
                </div>
                <div className="text-base font-black text-amber-400 font-mono">
                  {subject.code}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {subject.title}
                </div>
              </div>
            </div>

            {/* Statutory Identifiers Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Statutory Accreditation Codes:
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-700 text-slate-200">
                  AISHE: <strong>{institution?.aisheCode || 'C-45892'}</strong>
                </span>
                <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-700 text-amber-300">
                  PCI: <strong>{institution?.pciCode || 'PCI-1823'}</strong>
                </span>
                <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-700 text-indigo-300">
                  DTE: <strong>{institution?.dteCode || '5219'}</strong>
                </span>
                <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-700 text-emerald-300">
                  MSBTE: <strong>{institution?.msbteCode || '0182'}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                NBA Tier-II Criterion 3 Master Dossier
              </span>
              <h2 className="text-base font-black text-slate-900">
                Official Course File: {subject.title} ({subject.code})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compiled dynamically from institutional databases. Zero manual paper assembling.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsConsolidatedModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                Generate Complete Course File (PDF)
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                onClick={() => copyToClipboard('Full Course Dossier Content', 'Course File Dossier')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                Export Indexed ZIP
              </button>
            </div>
          </div>

          {/* Statutory MSBTE Pharmacy Proforma Suite (PH-1 to PH-11) Drawer */}
          <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/60 pb-3.5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    MSBTE Statutory Proforma Suite
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {OFFICIAL_MSBTE_CURRICULUM_SCHEME}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">
                  Prescribed Proformas PH-1 through PH-11 (D. P. Kharde Navjeevan College of Pharmacy)
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Direct statutory Excel (.csv) and print-ready PDF generation for all continuous assessment, teaching plans, progressive marks scaling, and examination returns.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadAllBundle}
                  disabled={isExportingAllBundle}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-75"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  {isExportingAllBundle ? 'Generating...' : 'Download All 11 Bundle (.csv)'}
                </button>
                <button
                  onClick={() => setActiveSubTab('MSBTE_PROFORMAS')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  Open Interactive Viewer →
                </button>
              </div>
            </div>

            {/* Grid of 11 Proformas with direct PDF and Excel buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {MSBTE_PROFORMA_LIST.map((proforma) => (
                <div
                  key={proforma.id}
                  className="p-3 bg-slate-950/70 hover:bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-black font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        {proforma.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {proforma.patternYear} • {proforma.nature}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 truncate" title={proforma.title}>
                      {proforma.shortTitle.replace(`${proforma.code}: `, '')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleExportSingleProforma(proforma.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg border border-slate-700 transition"
                      title={`Export ${proforma.code} to Excel (.csv)`}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveSubTab('MSBTE_PROFORMAS');
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
                      title={`View / Print ${proforma.code} PDF`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8-Section Master Index */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Statutory 8-Section Master Dossier Table of Contents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Course Identity & Regulatory Syllabus Copy</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PCI ER-2020 Gazette Notification & MSBTE K-Scheme Curriculum Guidelines.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Approved CO Definitions & CO-PO/PSO Matrix</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Revised Bloom's action verbs tied to syllabus units with justification statements.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Teaching Plan vs Daily Diary Execution Ledger</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Chronological milestone ledger with HOD scrutiny stamps and syllabus velocity index.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Student Attendance Registers (Theory & Practical)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Continuous roll-call register with marked defaulters and parental warning letters.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  5
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Question Papers, Bloom's Mapping & Model Answers</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sessional 1 blueprint, scrutiny committee sign-off, and question-level marking schemes.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  6
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">High / Medium / Low Student Answer Script Samples</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sample graded papers showing marks breakdown across three cognitive attainment tiers.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  7
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Mathematical CO Attainment & PO Rollup Calculation Sheets</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Question-level threshold computation table, NBA Level 0-3 rubrics, and PO rollup values.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                  8
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Approved Action Taken Reports (ATRs) for Deficits</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Continuous improvement records with root cause analysis and HOD endorsed remedial hours.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                    ✓ Verified & Attached
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* SUB-TAB: MSBTE STATUTORY PROFORMAS (PH-1 to PH-11) */}
      {activeSubTab === 'MSBTE_PROFORMAS' && (
        <MSBTEProformasView
          institution={institution}
          subject={subject}
          students={students}
        />
      )}

      {/* SUB-TAB 2: STATUTORY PACKS (NBA / PCI / MSBTE) */}
      {activeSubTab === 'PACKS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                NBA Tier-II
              </span>
              <h3 className="text-sm font-black text-slate-900">Self Assessment Report (SAR) Criterion 3</h3>
              <p className="text-xs text-slate-500">
                Course Outcomes, CO-PO Matrices, Question-level Direct Attainment and Continuous Improvement ATR tables pre-formatted for e-NBA upload.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard('NBA SAR Criterion 3 Table Data', 'NBA SAR Pack')}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Download SAR Tables (Excel)
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                MSBTE CIAAN-2023
              </span>
              <h3 className="text-sm font-black text-slate-900">Academic Monitoring Formats (Form A & B)</h3>
              <p className="text-xs text-slate-500">
                Faculty teaching workload, syllabus velocity vs academic calendar, student defaulter rollcall, and continuous practical assessment records.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard('MSBTE Formats A & B Data', 'MSBTE Monitoring Pack')}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Download MSBTE Formats
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                PCI ER-2020
              </span>
              <h3 className="text-sm font-black text-slate-900">Standard Inspection Form (SIF) Tables</h3>
              <p className="text-xs text-slate-500">
                Departmental contact hours, student-faculty ratio (1:20), laboratory equipment logbooks (Schedule M), and examination records.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard('PCI SIF Data Tables', 'PCI SIF Pack')}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Download SIF Annexures
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MULTI-CHANNEL COMMUNICATION COPILOT */}
      {activeSubTab === 'COMMUNICATION' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                Multi-Channel Institutional Communication Copilot
              </h2>
              <p className="text-xs text-slate-500">
                Draft notice once → AI Genie produces official letterhead circular, Parent SMS/WhatsApp, student portal notice, and Marathi regional translation.
              </p>
            </div>
            <button
              id="generate-communication-btn"
              onClick={handleGenerateComm}
              disabled={isGeneratingComm}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isGeneratingComm ? 'Generating Multi-Channel Pack...' : '1-Click Dispatch Multi-Channel'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="comm-topic-input" className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notice Title / Subject
              </label>
              <input
                id="comm-topic-input"
                type="text"
                value={commTopic}
                onChange={(e) => setCommTopic(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>
            <div>
              <label htmlFor="comm-audience-input" className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <input
                id="comm-audience-input"
                type="text"
                value={commAudience}
                onChange={(e) => setCommAudience(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>
          </div>

          {commResult && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Letterhead Circular */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase">
                    <span>1. Official Letterhead Circular</span>
                    <button
                      onClick={() => copyToClipboard(commResult.letterheadCircular, 'Circular')}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-slate-200 max-h-52 overflow-y-auto">
                    {commResult.letterheadCircular}
                  </pre>
                </div>

                {/* Parent WhatsApp / SMS */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase">
                    <span>2. Parent WhatsApp / SMS Alert</span>
                    <button
                      onClick={() => copyToClipboard(commResult.parentWhatsappSms, 'WhatsApp Message')}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-sans leading-relaxed">
                    {commResult.parentWhatsappSms}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase mb-1">
                      <span>3. Regional Language Translation (मराठी)</span>
                    </div>
                    <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-sans leading-relaxed max-h-36 overflow-y-auto">
                      {commResult.regionalTranslationMarathi}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: CRYPTOGRAPHIC AUDIT LEDGER */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-500" />
                Immutable Cryptographic Audit Trail (SHA-256 Ledger)
              </h2>
              <p className="text-xs text-slate-500">
                Every attendance change, marks submission, syllabus diary entry, and HOD sign-off is hashed and permanently recorded.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200">
              {auditLogs.length} Cryptographic Events Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Timestamp (IST)</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Transaction Details</th>
                  <th className="py-2.5 px-3 font-mono">SHA-256 Fingerprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.actor}
                      <span className="ml-1 text-[10px] font-mono text-slate-400">({log.role})</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-sm">{log.details}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={log.sha256Hash}>
                      {log.sha256Hash.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {copiedNotification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in">
          ✓ {copiedNotification}
        </div>
      )}

      {isConsolidatedModalOpen && (
        <ConsolidatedCourseFileModal
          isOpen={isConsolidatedModalOpen}
          onClose={() => setIsConsolidatedModalOpen(false)}
          institution={institution}
          subject={subject}
          students={students}
        />
      )}
    </div>
  );
};
