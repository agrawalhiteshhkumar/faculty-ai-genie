import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  BookOpen,
  ClipboardCheck,
  Search,
  Users,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, StudentMaster } from '../../types';
import { InstitutionSeal } from '../InstitutionSeal';
import {
  OFFICIAL_MSBTE_CURRICULUM_SCHEME,
  DPK_COLLEGE_IDENTITY,
  MSBTE_PROFORMA_LIST,
  SAMPLE_PH1_TEACHING_PLAN,
  SAMPLE_PH2_LAB_PLAN,
  SAMPLE_PH10_FIELD_VISITS,
  SAMPLE_PH11_ASSIGNMENTS,
  ProformaTabDefinition,
} from '../../data/msbteProformasData';
import {
  generateProformaStudentRecords,
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
  exportAllMSBTEProformasExcelBundle,
} from '../../utils/msbteProformaExports';

interface MSBTEProformasViewProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
}

export const MSBTEProformasView: React.FC<MSBTEProformasViewProps> = ({
  institution,
  subject,
  students: appStudents,
}) => {
  const [selectedProformaId, setSelectedProformaId] = useState<string>('PH-1');
  const [filterPattern, setFilterPattern] = useState<'ALL' | 'Year 1' | 'Year 2' | 'Annual Scheme'>('ALL');
  const [filterNature, setFilterNature] = useState<'ALL' | 'Theory' | 'Practical' | 'Field Visit' | 'Result'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportingAll, setIsExportingAll] = useState(false);

  const studentRecords = generateProformaStudentRecords(appStudents);

  const college = institution?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = institution?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = institution?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = institution?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = institution?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;
  const curSubject = subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (Course Code: 20111)';

  const filteredProformas = MSBTE_PROFORMA_LIST.filter((p) => {
    const matchesPattern = filterPattern === 'ALL' || p.patternYear === filterPattern;
    const matchesNature = filterNature === 'ALL' || p.nature === filterNature;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPattern && matchesNature && matchesSearch;
  });

  const currentDef = MSBTE_PROFORMA_LIST.find((p) => p.id === selectedProformaId) || MSBTE_PROFORMA_LIST[0];

  const handleExportCurrent = () => {
    switch (currentDef.id) {
      case 'PH-1':
        exportPH1TeachingPlanExcel(institution, subject);
        break;
      case 'PH-2':
        exportPH2LabPlanExcel(institution, subject);
        break;
      case 'PH-3':
        exportPH3DayToDayExcel(institution, subject);
        break;
      case 'PH-4_I':
        exportPH4TheoryYear1Excel(institution, subject);
        break;
      case 'PH-4_II':
        exportPH4PracticalYear1Excel(institution, subject);
        break;
      case 'PH-5_I':
        exportPH5TheoryYear2Excel(institution);
        break;
      case 'PH-5_II':
        exportPH5PracticalYear2Excel(institution);
        break;
      case 'PH-6':
        exportPH6TheorySessionalExcel(institution, subject);
        break;
      case 'PH-7':
        exportPH7PracticalSessionalExcel(institution, subject);
        break;
      case 'PH-8':
        exportPH8FinalBoardPracticalExcel(institution, subject);
        break;
      case 'PH-9':
        exportPH9ResultAnalysisExcel(institution, subject);
        break;
      case 'PH-10':
        exportPH10FieldVisitExcel(institution, subject);
        break;
      case 'PH-11':
        exportPH11AssignmentMarksheetExcel(institution, subject);
        break;
      default:
        break;
    }
  };

  const handleExportAll = () => {
    setIsExportingAll(true);
    exportAllMSBTEProformasExcelBundle(institution, subject);
    setTimeout(() => {
      setIsExportingAll(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Institutional Statutory Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md print:bg-white print:text-black print:border-slate-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 tracking-wider">
                Official MSBTE Statutory Suite
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {OFFICIAL_MSBTE_CURRICULUM_SCHEME}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <InstitutionSeal profile={institution} variant="circular" size="md" />
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white print:text-black">
                  {college}
                </h1>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  Department of Pharmacy • Affiliated to Maharashtra State Board of Technical Education (MSBTE), Mumbai
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportAll}
              disabled={isExportingAll}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-75"
              title="Download all 11 MSBTE PH Proformas in CSV/Excel formats"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExportingAll ? 'Generating Bundle...' : 'Download All 11 Proformas (.csv)'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-slate-700/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 border border-slate-600"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* 4 Statutory Identifiers Bar */}
        <div className="pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Approved Board & Council Identifiers:
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700 text-slate-200">
                AISHE: <strong>{aishe}</strong>
              </span>
              <span className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700 text-amber-300">
                PCI: <strong>{pci}</strong>
              </span>
              <span className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700 text-indigo-300">
                DTE: <strong>{dte}</strong>
              </span>
              <span className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700 text-emerald-300">
                MSBTE: <strong>{msbte}</strong>
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-300 font-medium">
            Active Academic Year: <strong className="text-white">2025-2026</strong> | Target Subject: <strong className="text-amber-300">{curSubject}</strong>
          </div>
        </div>
      </div>

      {/* Proforma Navigation & Filter Drawer */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Statutory Proforma Selector (PH-1 to PH-11)
            </h2>
            <p className="text-xs text-slate-500">
              Select any proforma below to inspect statutory marks scaling, continuous rubrics, and generate certified exports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Pattern Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              {(['ALL', 'Year 1', 'Year 2', 'Annual Scheme'] as const).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => setFilterPattern(pattern)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterPattern === pattern ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pattern}
                </button>
              ))}
            </div>

            {/* Nature Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              {(['ALL', 'Theory', 'Practical', 'Field Visit', 'Result'] as const).map((nat) => (
                <button
                  key={nat}
                  onClick={() => setFilterNature(nat)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterNature === nat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {nat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Proforma Quick Tabs Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 pt-1">
          {MSBTE_PROFORMA_LIST.map((proforma) => {
            const isSelected = selectedProformaId === proforma.id;
            return (
              <button
                key={proforma.id}
                onClick={() => setSelectedProformaId(proforma.id)}
                className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {proforma.code}
                    </span>
                    <span
                      className={`text-[9px] font-bold ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {proforma.nature}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-bold leading-tight line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {proforma.shortTitle.replace(`${proforma.code}: `, '')}
                  </div>
                </div>
                <div
                  className={`text-[9px] mt-1.5 font-medium ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {proforma.patternYear}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Selected Proforma Display Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* Proforma Action Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-black font-mono">
                {currentDef.code}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {currentDef.patternYear} • {currentDef.nature}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-1">
              {currentDef.title}
            </h2>
            <p className="text-xs text-slate-500 max-w-3xl mt-0.5">
              {currentDef.description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleExportCurrent}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export to Excel (.csv)
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Print Official Form
            </button>
          </div>
        </div>

        {/* Proforma Specific Interactive Tables */}
        <div className="p-6 space-y-6">
          {/* =========================================================================
              PH-1: Teaching Plan (TP)
             ========================================================================= */}
          {currentDef.id === 'PH-1' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <strong className="font-bold">Course:</strong> Pharmaceutics (20111) | <strong className="font-bold">Prescribed Hours:</strong> 75 Theory Hours | <strong className="font-bold">Pattern:</strong> Annual Scheme
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] self-start md:self-auto">
                  ✓ Syllabus Completion: 100% (75/75 Hours Executed)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-12 text-center">Sr.</th>
                      <th className="p-3 w-48">Chapter / Topic</th>
                      <th className="p-3">Detailed Subtopics Coverage</th>
                      <th className="p-3 w-20 text-center">Hours</th>
                      <th className="p-3 w-36">Planned Period</th>
                      <th className="p-3 w-36">Actual Execution</th>
                      <th className="p-3 w-36">Teaching Media</th>
                      <th className="p-3 w-16 text-center">CO</th>
                      <th className="p-3 w-24 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_PH1_TEACHING_PLAN.map((row) => (
                      <tr key={row.srNo} className="hover:bg-slate-50/80">
                        <td className="p-3 text-center font-mono font-bold text-slate-500">{row.srNo}</td>
                        <td className="p-3 font-bold text-slate-900">{row.chapterTopic}</td>
                        <td className="p-3 text-slate-600 leading-relaxed">{row.subtopics}</td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/30">{row.prescribedHours}</td>
                        <td className="p-3 text-[11px] text-slate-600">{row.plannedDateFrom} to {row.plannedDateTo}</td>
                        <td className="p-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50/20">{row.actualDateOfExecution}</td>
                        <td className="p-3 text-[11px] text-slate-600">{row.teachingMethodMedia}</td>
                        <td className="p-3 text-center font-mono font-bold text-amber-700">{row.mappedCO}</td>
                        <td className="p-3 text-center">
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
              PH-2: Lab Activity / Assignment / Field Visit Plan (LP)
             ========================================================================= */}
          {currentDef.id === 'PH-2' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <strong className="font-bold">Course:</strong> Pharmaceutics Practical (20111-P) | <strong className="font-bold">Batches:</strong> B1 (Roll 01-20), B2 (Roll 21-40), B3 (Roll 41-60)
                </div>
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg font-bold text-[11px]">
                  Total: 15 Experiments & Field Visits (75 Hours)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-14 text-center">Expt.</th>
                      <th className="p-3">Title of Experiment / Practical / Field Visit</th>
                      <th className="p-3 w-28 text-center bg-blue-50/50">Batch B1 (Plan / Act)</th>
                      <th className="p-3 w-28 text-center bg-purple-50/50">Batch B2 (Plan / Act)</th>
                      <th className="p-3 w-28 text-center bg-amber-50/50">Batch B3 (Plan / Act)</th>
                      <th className="p-3 w-16 text-center">Hours</th>
                      <th className="p-3 w-16 text-center">Target CO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_PH2_LAB_PLAN.map((row) => (
                      <tr key={row.exptNo} className="hover:bg-slate-50/80">
                        <td className="p-3 text-center font-mono font-bold text-slate-500">{row.exptNo}</td>
                        <td className="p-3 font-semibold text-slate-900">{row.title}</td>
                        <td className="p-3 text-center text-[11px] font-mono bg-blue-50/20">{row.batchB1Dates.actual}</td>
                        <td className="p-3 text-center text-[11px] font-mono bg-purple-50/20">{row.batchB2Dates.actual}</td>
                        <td className="p-3 text-center text-[11px] font-mono bg-amber-50/20">{row.batchB3Dates.actual}</td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-700">{row.hours}h</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-700">{row.targetCO}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              PH-3: Day to Day Assessment of Laboratory Work
             ========================================================================= */}
          {currentDef.id === 'PH-3' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  Statutory 10-Mark Continuous Rubric per Experiment:
                </div>
                <p className="text-[11px] text-purple-800">
                  Performance (4 Marks) + Preparation/Attendance (3 Marks) + Journal & Viva (3 Marks) = 10 Marks.
                  Maintained separately per sessional period to calculate continuous Practical Record Maintenance Marks (Max 10).
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 w-20">Batch</th>
                      <th className="p-2.5 text-center bg-blue-50/60" colSpan={8}>Sessional 1 Practicals (P1 to P8 - 10M each)</th>
                      <th className="p-2.5 text-center bg-blue-100 text-blue-900 font-black">S1 Lab Avg (10M)</th>
                      <th className="p-2.5 text-center bg-emerald-50/60" colSpan={7}>Sessional 2 Practicals (P9 to P15 - 10M each)</th>
                      <th className="p-2.5 text-center bg-emerald-100 text-emerald-900 font-black">S2 Lab Avg (10M)</th>
                      <th className="p-2.5 text-center bg-amber-100 text-amber-950 font-black">Record Maint. (10M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-[11px] text-slate-500">{s.batch}</td>
                        {s.dayToDayP1to8.map((m, idx) => (
                          <td key={idx} className="p-1.5 text-center font-mono text-[11px] text-slate-600 bg-blue-50/10">
                            {m}
                          </td>
                        ))}
                        <td className="p-2 text-center font-mono font-black text-blue-800 bg-blue-50/50">
                          {s.sessional1LabAvg.toFixed(1)}
                        </td>
                        {s.dayToDayP9to15.map((m, idx) => (
                          <td key={idx} className="p-1.5 text-center font-mono text-[11px] text-slate-600 bg-emerald-50/10">
                            {m}
                          </td>
                        ))}
                        <td className="p-2 text-center font-mono font-black text-emerald-800 bg-emerald-50/50">
                          {s.sessional2LabAvg.toFixed(1)}
                        </td>
                        <td className="p-2 text-center font-mono font-black text-amber-900 bg-amber-50">
                          {s.cumulativeLabRecordMark}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              PH-4 (I): Progressive Assessment of Theory – First Year
             ========================================================================= */}
          {currentDef.id === 'PH-4_I' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CalculatorIcon className="w-4 h-4 text-blue-600" />
                  Statutory MSBTE First Year Theory Progressive Assessment Formula:
                </div>
                <p className="text-[11px] text-blue-800">
                  Total Theory PA (Max 20M) = Best of Two Sessional Exams (scaled to 10M) + Continuous Mode Assignments & Field Visits (10M).
                  Minimum Qualifying Passing standard: 8 / 20 Marks (40%).
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 text-center">S1 (40M)</th>
                      <th className="p-2.5 text-center">S2 (40M)</th>
                      <th className="p-2.5 text-center font-black text-blue-900 bg-blue-50">Best (40M)</th>
                      <th className="p-2.5 text-center font-black text-indigo-900 bg-indigo-50">Scaled (10M)</th>
                      <th className="p-2.5 text-center">Assignments (5M)</th>
                      <th className="p-2.5 text-center">Field Visit (5M)</th>
                      <th className="p-2.5 text-center font-bold text-purple-900 bg-purple-50">Continuous (10M)</th>
                      <th className="p-2.5 text-center font-black text-amber-950 bg-amber-100">Total PA (20M)</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono">{s.theoryS1}</td>
                        <td className="p-2 text-center font-mono">{s.theoryS2}</td>
                        <td className="p-2 text-center font-mono font-black text-blue-900 bg-blue-50/50">{s.theoryBest}</td>
                        <td className="p-2 text-center font-mono font-black text-indigo-900 bg-indigo-50/50">{s.theoryScaled}</td>
                        <td className="p-2 text-center font-mono">{s.assignmentsAvg}</td>
                        <td className="p-2 text-center font-mono">{s.fieldVisitTutorial}</td>
                        <td className="p-2 text-center font-mono font-bold text-purple-900 bg-purple-50/50">{s.continuousModeTheory}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.totalTheoryPA}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              s.totalTheoryPA >= 8 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.totalTheoryPA >= 8 ? 'QUALIFIED' : 'REMEDIAL'}
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
              PH-4 (II): Progressive Assessment of Practical – First Year
             ========================================================================= */}
          {currentDef.id === 'PH-4_II' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CalculatorIcon className="w-4 h-4 text-emerald-600" />
                  Statutory MSBTE First Year Practical Progressive Assessment Formula:
                </div>
                <p className="text-[11px] text-emerald-800">
                  Total Practical PA (Max 20M) = Sessional Practical Exam (scaled to 10M) + PH-3 Continuous Practical Record Maintenance (10M).
                  Passing Minimum: 8 / 20 Marks (40%).
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 w-20">Batch</th>
                      <th className="p-2.5 text-center">Prac S1 (40M)</th>
                      <th className="p-2.5 text-center">Prac S2 (40M)</th>
                      <th className="p-2.5 text-center font-black text-emerald-900 bg-emerald-50">Best (40M)</th>
                      <th className="p-2.5 text-center font-black text-indigo-900 bg-indigo-50">Scaled (10M)</th>
                      <th className="p-2.5 text-center font-black text-purple-900 bg-purple-50">PH-3 Lab Record (10M)</th>
                      <th className="p-2.5 text-center font-black text-amber-950 bg-amber-100">Total PA Practical (20M)</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-[11px] text-slate-500">{s.batch}</td>
                        <td className="p-2 text-center font-mono">{s.practicalS1}</td>
                        <td className="p-2 text-center font-mono">{s.practicalS2}</td>
                        <td className="p-2 text-center font-mono font-black text-emerald-900 bg-emerald-50/50">{s.practicalBest}</td>
                        <td className="p-2 text-center font-mono font-black text-indigo-900 bg-indigo-50/50">{s.practicalScaled}</td>
                        <td className="p-2 text-center font-mono font-black text-purple-900 bg-purple-50/50">{s.cumulativeLabRecordMark}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.totalPracticalPA}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              s.totalPracticalPA >= 8 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.totalPracticalPA >= 8 ? 'QUALIFIED' : 'REMEDIAL'}
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
              PH-5 (I): Progressive Assessment of Theory – Second Year
             ========================================================================= */}
          {currentDef.id === 'PH-5_I' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Second Year D.Pharm Statutory Progressive Assessment of Theory:
                </div>
                <p className="text-[11px] text-indigo-800">
                  Course: Pharmacology (20221) | Best of Two Sessional Exams (scaled to 10M) + Continuous Mode Clinical Case Studies / Hospital Seminars (10M) = 20M.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 text-center">Sessional 1 (40M)</th>
                      <th className="p-2.5 text-center">Sessional 2 (40M)</th>
                      <th className="p-2.5 text-center font-black text-indigo-900 bg-indigo-50">Best (40M)</th>
                      <th className="p-2.5 text-center font-black text-indigo-900 bg-indigo-100">Scaled (10M)</th>
                      <th className="p-2.5 text-center font-bold text-purple-900 bg-purple-50">Continuous Mode (10M)</th>
                      <th className="p-2.5 text-center font-black text-amber-950 bg-amber-100">Total PA Y2 (20M)</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono">{s.theoryS1}</td>
                        <td className="p-2 text-center font-mono">{s.theoryS2}</td>
                        <td className="p-2 text-center font-mono font-black text-indigo-900 bg-indigo-50/50">{s.theoryBest}</td>
                        <td className="p-2 text-center font-mono font-black text-indigo-900 bg-indigo-100/50">{s.theoryScaled}</td>
                        <td className="p-2 text-center font-mono font-bold text-purple-900 bg-purple-50/50">{s.continuousModeTheory}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.totalTheoryPA}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              s.totalTheoryPA >= 8 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.totalTheoryPA >= 8 ? 'QUALIFIED' : 'REMEDIAL'}
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
              PH-5 (II): Progressive Assessment of Practical – Second Year
             ========================================================================= */}
          {currentDef.id === 'PH-5_II' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  Second Year D.Pharm Statutory Progressive Assessment of Practical:
                </div>
                <p className="text-[11px] text-teal-800">
                  Course: Pharmacology Practical (20221-P) | Sessional Practical Test (scaled to 10M) + PH-3 Continuous Practical Record Maintenance (10M) = 20M.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 w-20">Batch</th>
                      <th className="p-2.5 text-center">Prac S1 (40M)</th>
                      <th className="p-2.5 text-center">Prac S2 (40M)</th>
                      <th className="p-2.5 text-center font-black text-teal-900 bg-teal-50">Best (40M)</th>
                      <th className="p-2.5 text-center font-black text-indigo-900 bg-indigo-50">Scaled (10M)</th>
                      <th className="p-2.5 text-center font-black text-purple-900 bg-purple-50">PH-3 Lab Record (10M)</th>
                      <th className="p-2.5 text-center font-black text-amber-950 bg-amber-100">Total PA Practical Y2 (20M)</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-[11px] text-slate-500">{s.batch}</td>
                        <td className="p-2 text-center font-mono">{s.practicalS1}</td>
                        <td className="p-2 text-center font-mono">{s.practicalS2}</td>
                        <td className="p-2 text-center font-mono font-black text-teal-900 bg-teal-50/50">{s.practicalBest}</td>
                        <td className="p-2 text-center font-mono font-black text-indigo-900 bg-indigo-50/50">{s.practicalScaled}</td>
                        <td className="p-2 text-center font-mono font-black text-purple-900 bg-purple-50/50">{s.cumulativeLabRecordMark}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.totalPracticalPA}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              s.totalPracticalPA >= 8 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.totalPracticalPA >= 8 ? 'QUALIFIED' : 'REMEDIAL'}
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
              PH-6: Sessional Examination Marksheet – Theory
             ========================================================================= */}
          {currentDef.id === 'PH-6' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <strong className="font-bold">Exam:</strong> First Sessional Theory Exam | <strong className="font-bold">Max Marks:</strong> 40 Marks | <strong className="font-bold">Duration:</strong> 90 Minutes
                </div>
                <span className="text-[11px] font-mono text-slate-600">
                  Section A: MCQs (10M) • Section B: Short (15M) • Section C: Long (15M)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 text-center">Section A: MCQs (10M)</th>
                      <th className="p-2.5 text-center">Section B: Short (15M)</th>
                      <th className="p-2.5 text-center">Section C: Long (15M)</th>
                      <th className="p-2.5 text-center font-black text-slate-950 bg-amber-100">Total Scored (40M)</th>
                      <th className="p-2.5 w-36">Marks in Words</th>
                      <th className="p-2.5 text-center">Scrutiny</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono">{s.q1Objective}</td>
                        <td className="p-2 text-center font-mono">{s.q2Short}</td>
                        <td className="p-2 text-center font-mono">{s.q3Long}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.theoryBest}</td>
                        <td className="p-2 text-[11px] text-slate-500 font-medium italic">{s.theoryBest} out of Forty</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            VERIFIED
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
              PH-7: Sessional Examination Marksheet – Practical
             ========================================================================= */}
          {currentDef.id === 'PH-7' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <strong className="font-bold">Exam:</strong> First Sessional Practical Exam | <strong className="font-bold">Max Marks:</strong> 40 Marks | <strong className="font-bold">Duration:</strong> 3 Hours
                </div>
                <span className="text-[11px] font-mono text-slate-600">
                  Synopsis (10M) + Major (15M) + Minor (5M) + Viva (5M) + Journal (5M)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 w-20">Batch</th>
                      <th className="p-2.5 text-center">Synopsis (10M)</th>
                      <th className="p-2.5 text-center">Major Expt (15M)</th>
                      <th className="p-2.5 text-center">Minor / Spot (5M)</th>
                      <th className="p-2.5 text-center">Viva-Voce (5M)</th>
                      <th className="p-2.5 text-center">Journal (5M)</th>
                      <th className="p-2.5 text-center font-black text-slate-950 bg-amber-100">Total (40M)</th>
                      <th className="p-2.5 text-center font-bold text-indigo-900 bg-indigo-50">Scaled PA (10M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-[11px] text-slate-500">{s.batch}</td>
                        <td className="p-2 text-center font-mono">{s.synopsis}</td>
                        <td className="p-2 text-center font-mono">{s.majorExpt}</td>
                        <td className="p-2 text-center font-mono">{s.minorExpt}</td>
                        <td className="p-2 text-center font-mono">{s.viva}</td>
                        <td className="p-2 text-center font-mono">{s.journal}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.practicalBest}</td>
                        <td className="p-2 text-center font-mono font-bold text-indigo-900 bg-indigo-50/60">{s.practicalScaled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              PH-8: Final Assessment for Practical Examination (Board Exam)
             ========================================================================= */}
          {currentDef.id === 'PH-8' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  Annual MSBTE Board Practical Examination Scheme:
                </div>
                <p className="text-[11px] text-amber-900">
                  Internal Examiner (Max 40M) + External Examiner (Max 40M) = Board Total (80M) + Progressive Assessment (20M) = Grand Total 100 Marks.
                  Minimum Passing standard: 40 / 100 Marks.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-20">Seat No.</th>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Candidate Full Name</th>
                      <th className="p-2.5 text-center">Internal (40M)</th>
                      <th className="p-2.5 text-center">External (40M)</th>
                      <th className="p-2.5 text-center font-bold text-blue-900 bg-blue-50">Board (80M)</th>
                      <th className="p-2.5 text-center font-bold text-purple-900 bg-purple-50">PA (20M)</th>
                      <th className="p-2.5 text-center font-black text-slate-950 bg-amber-100">Grand Total (100M)</th>
                      <th className="p-2.5 text-center">Result</th>
                      <th className="p-2.5 text-center">Class / Division</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 font-mono font-bold text-indigo-700">{s.seatNo}</td>
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono">{s.internalBoard}</td>
                        <td className="p-2 text-center font-mono">{s.externalBoard}</td>
                        <td className="p-2 text-center font-mono font-bold text-blue-900 bg-blue-50/50">{s.boardTotal}</td>
                        <td className="p-2 text-center font-mono font-bold text-purple-900 bg-purple-50/50">{s.totalPracticalPA}</td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">{s.grandTotal}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              s.resultStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.resultStatus}
                          </span>
                        </td>
                        <td className="p-2 text-center text-[11px] font-semibold text-slate-700">{s.divisionClass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              PH-9: Result Analysis
             ========================================================================= */}
          {currentDef.id === 'PH-9' && (
            <div className="space-y-6">
              {/* Statistical Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enrolled</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">60</div>
                  <div className="text-[10px] text-slate-400">Intake Capacity</div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Passing Rate</div>
                  <div className="text-xl font-black text-emerald-800 mt-0.5">98.33%</div>
                  <div className="text-[10px] text-emerald-600">59 Passed / 1 Deficit</div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Distinction</div>
                  <div className="text-xl font-black text-amber-900 mt-0.5">
                    {studentRecords.filter((s) => s.divisionClass === 'Distinction').length}
                  </div>
                  <div className="text-[10px] text-amber-700">Score &ge; 75%</div>
                </div>

                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">First Class</div>
                  <div className="text-xl font-black text-blue-900 mt-0.5">
                    {studentRecords.filter((s) => s.divisionClass === 'First Class').length}
                  </div>
                  <div className="text-[10px] text-blue-700">60% to 74%</div>
                </div>

                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Highest Marks</div>
                  <div className="text-xl font-black text-purple-900 mt-0.5">94 / 100</div>
                  <div className="text-[10px] text-purple-700">Aarav Sharma (Roll 01)</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Class Average</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">68.4%</div>
                  <div className="text-[10px] text-slate-400">First Class Benchmark</div>
                </div>
              </div>

              {/* Remedial Action Plan */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Statutory Remedial Action Plan & Improvement Recommendations (HOD Approved):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-amber-950">
                  <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/60">
                    <strong className="block text-slate-900 mb-0.5">1. Extra Tutorial Coaching:</strong>
                    8 compensatory laboratory tutorial hours allocated for students with scores &lt; 50% in tablet compression techniques.
                  </div>
                  <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/60">
                    <strong className="block text-slate-900 mb-0.5">2. MSBTE Question Drill:</strong>
                    Focused 5-mark and 2-mark solved model question sets provided covering IP Packaging and Unit Operations.
                  </div>
                  <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/60">
                    <strong className="block text-slate-900 mb-0.5">3. Peer Mentoring:</strong>
                    Top distinction students paired with struggling learners during continuous practical sessions.
                  </div>
                </div>
              </div>

              {/* Roster preview */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[400px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-20">Seat No.</th>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5 text-center">Total Marks / 100</th>
                      <th className="p-2.5 text-center">Result</th>
                      <th className="p-2.5 text-center">Division</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 font-mono font-bold text-indigo-700">{s.seatNo}</td>
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono font-black text-slate-950">{s.grandTotal}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              s.resultStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.resultStatus}
                          </span>
                        </td>
                        <td className="p-2 text-center text-[11px] font-semibold text-slate-700">{s.divisionClass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              PH-10: Details of Field Visits
             ========================================================================= */}
          {currentDef.id === 'PH-10' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Mandatory PCI ER-2020 & MSBTE Statutory Field Visit Logs:
                </div>
                <p className="text-[11px] text-emerald-800">
                  Compulsory experiential learning requirements: Industrial plant visit (cGMP & HVAC Cleanrooms) and Multispeciality Hospital Pharmacy visit (UDDS & Cold Chain).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_PH10_FIELD_VISITS.map((visit) => (
                  <div key={visit.visitNo} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          Visit #{visit.visitNo} • {visit.facilityType}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-1">
                          {visit.facilityName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {visit.location}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                        {visit.dateOfVisit}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200/70">
                      <div>
                        <strong className="text-slate-700">Faculty In-Charge:</strong>{' '}
                        <span className="text-slate-600">{visit.facultyInCharge.join(', ')}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Batches Attended:</strong>{' '}
                        <span className="text-slate-600">{visit.participatingBatches} ({visit.totalStudentsAttended} Students)</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Average Rubric Score:</strong>{' '}
                        <span className="text-emerald-700 font-bold">{visit.averageScoreScored} / 10 Marks</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-800 mb-1">Key Learning Objectives Achieved:</div>
                      <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                        {visit.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Student Field Visit Evaluation Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Student Continuous Field Visit Evaluation Marks Ledger
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[400px]">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5 w-12 text-center">Roll</th>
                        <th className="p-2.5 w-32">PRN</th>
                        <th className="p-2.5 w-44">Student Name</th>
                        <th className="p-2.5 w-20">Batch</th>
                        <th className="p-2.5 text-center">Visit 1: Report (4M)</th>
                        <th className="p-2.5 text-center">Visit 1: Viva (3M)</th>
                        <th className="p-2.5 text-center">Visit 1: Conduct (3M)</th>
                        <th className="p-2.5 text-center font-bold text-indigo-900 bg-indigo-50">Visit 1 (10M)</th>
                        <th className="p-2.5 text-center font-bold text-purple-900 bg-purple-50">Visit 2 (10M)</th>
                        <th className="p-2.5 text-center font-black text-amber-950 bg-amber-100">Avg Continuous (10M)</th>
                        <th className="p-2.5 text-center font-bold text-emerald-900 bg-emerald-50">Scaled PA (5M)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentRecords.map((s) => (
                        <tr key={s.rollNo} className="hover:bg-slate-50/80">
                          <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                          <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                          <td className="p-2 font-bold text-slate-900">{s.name}</td>
                          <td className="p-2 text-[11px] text-slate-500">{s.batch}</td>
                          <td className="p-2 text-center font-mono">{Math.min(4, Math.max(2, Math.round(s.fieldVisitTutorial * 0.8)))}</td>
                          <td className="p-2 text-center font-mono">{Math.min(3, Math.max(1, Math.round(s.fieldVisitTutorial * 0.6)))}</td>
                          <td className="p-2 text-center font-mono">{Math.min(3, Math.max(2, Math.round(s.fieldVisitTutorial * 0.6)))}</td>
                          <td className="p-2 text-center font-mono font-bold text-indigo-900 bg-indigo-50/40">
                            {Math.min(10, Math.max(5, s.fieldVisitTutorial * 2))}
                          </td>
                          <td className="p-2 text-center font-mono font-bold text-purple-900 bg-purple-50/40">
                            {Math.min(10, Math.max(6, s.fieldVisitTutorial * 2))}
                          </td>
                          <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">
                            {Math.min(10, Math.max(5, s.fieldVisitTutorial * 2))}
                          </td>
                          <td className="p-2 text-center font-mono font-bold text-emerald-900 bg-emerald-50">
                            {s.fieldVisitTutorial}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PH-11: Assignment Marksheet
             ========================================================================= */}
          {currentDef.id === 'PH-11' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-purple-600" />
                  Continuous Mode Assignment Marksheet & Evaluation Ledger:
                </div>
                <p className="text-[11px] text-purple-800">
                  3 statutory home assignments conducted across the academic year to evaluate cognitive course outcome attainment (CO1, CO3, CO5) and scaled to 5 marks for Theory Progressive Assessment.
                </p>
              </div>

              {/* Assignment Topic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SAMPLE_PH11_ASSIGNMENTS.map((asg) => (
                  <div key={asg.assignmentNo} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                        Assignment #{asg.assignmentNo}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Target: {asg.mappedCO}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {asg.topic}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Issued: {asg.dateOfIssue} | Due: {asg.dateOfSubmission}
                    </div>
                  </div>
                ))}
              </div>

              {/* Assignment Student Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[450px]">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 w-12 text-center">Roll</th>
                      <th className="p-2.5 w-32">PRN</th>
                      <th className="p-2.5 w-44">Student Name</th>
                      <th className="p-2.5 text-center">Asg 1: Packaging (10M)</th>
                      <th className="p-2.5 text-center">Asg 2: Tablets (10M)</th>
                      <th className="p-2.5 text-center">Asg 3: Sterility (10M)</th>
                      <th className="p-2.5 text-center font-bold text-indigo-900 bg-indigo-50">Avg Score (10M)</th>
                      <th className="p-2.5 text-center font-black text-amber-950 bg-amber-100">Scaled PA (5M)</th>
                      <th className="p-2.5 text-center">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRecords.map((s) => (
                      <tr key={s.rollNo} className="hover:bg-slate-50/80">
                        <td className="p-2 text-center font-mono font-bold text-slate-500">{s.rollNo}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-500">{s.prn}</td>
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 text-center font-mono">{s.assignment1}</td>
                        <td className="p-2 text-center font-mono">{s.assignment2}</td>
                        <td className="p-2 text-center font-mono">{s.assignment3}</td>
                        <td className="p-2 text-center font-mono font-bold text-indigo-900 bg-indigo-50/50">
                          {s.assignmentsScoreAvg}
                        </td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50">
                          {s.assignmentsAvg}
                        </td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            100% Submitted
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Statutory Signatures Block */}
          <div className="pt-6 border-t border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="h-10 border-b border-slate-300 mb-2"></div>
              <div className="font-bold text-slate-900">Prof. Ananya Deshmukh</div>
              <div className="text-[11px] text-slate-500">Subject Teacher / Course In-Charge</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="h-10 border-b border-slate-300 mb-2"></div>
              <div className="font-bold text-slate-900">Prof. Vikram Patil</div>
              <div className="text-[11px] text-slate-500">Laboratory & Field In-Charge</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="h-10 border-b border-slate-300 mb-2"></div>
              <div className="font-bold text-slate-900">Dr. Rajesh Sharma</div>
              <div className="text-[11px] text-slate-500">HOD, Department of Pharmacy</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="h-10 border-b border-slate-300 mb-2"></div>
              <div className="font-bold text-slate-900">Principal / Head of Institute</div>
              <div className="text-[11px] text-slate-500">D. P. Kharde Navjeevan COP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple calculator icon helper
function CalculatorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
