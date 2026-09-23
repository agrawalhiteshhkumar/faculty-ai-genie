import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  FileCheck2,
  Scale,
  HeartHandshake,
  UserCheck,
  Activity,
  Copy,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, StudentMaster } from '../../types';
import { InstitutionSeal } from '../InstitutionSeal';
import { getAsset } from '../../utils/assetStorage';
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

// 6 Mandatory Statutory Regulatory Committees Data Definition
interface CommitteeDef {
  id: string;
  name: string;
  shortName: string;
  frequency: string;
  tenure: string;
  regulatoryBody: string;
  mandate: string;
  chairman: string;
  coordinator: string;
  members: { role: string; name: string; designation: string }[];
  agendaTopics: string[];
}

const STATUTORY_COMMITTEES: CommitteeDef[] = [
  {
    id: 'IQAC',
    name: 'Internal Quality Assurance Cell (IQAC)',
    shortName: 'IQAC',
    frequency: 'Quarterly (Minimum 4 Meetings/Year)',
    tenure: '2 Years',
    regulatoryBody: 'NAAC / NBA Tier-II Accreditation Guidelines',
    mandate: 'Develop quality benchmarks for academic and administrative activities, CO-PO attainment review, and faculty appraisal systems.',
    chairman: 'Dr. Hiteshkumar Agrawal (Principal)',
    coordinator: 'Prof. Snehal Deshmukh (Lecturer & Quality Lead)',
    members: [
      { role: 'Chairperson', name: 'Dr. Hiteshkumar Agrawal', designation: 'Principal & Professor' },
      { role: 'IQAC Coordinator', name: 'Prof. Snehal Deshmukh', designation: 'Assistant Professor' },
      { role: 'Senior Faculty Member', name: 'Prof. Vikram Patil', designation: 'Lecturer in Pharmaceutics' },
      { role: 'Management Representative', name: 'Hon. Trustee / Secretary', designation: 'Navjeevan Education Society' },
      { role: 'Industry Expert', name: 'Dr. R. K. Bhalerao', designation: 'VP - Quality, Nashik Pharma Hub' },
      { role: 'Student Representative', name: 'Aarav Sharma', designation: 'Final Year D.Pharm' },
    ],
    agendaTopics: [
      'Review of CO-PO direct attainment metrics for MSBTE Odd Semester',
      'Continuous Assessment (PA) normalization and PH-1 to PH-11 verification',
      'PCI Schedule M GLP instrument calibration and lab modernizations',
      'Remedial coaching schedule for students scoring below 50% in Sessional Exam 1',
    ],
  },
  {
    id: 'ARC',
    name: 'Anti-Ragging Committee & Flying Squad',
    shortName: 'ARC & Squad',
    frequency: 'Biannual + Surprise Inspections',
    tenure: 'Annual Reconstitution',
    regulatoryBody: 'PCI / AICTE / MSBTE Anti-Ragging Regulations & Apex Court Directives',
    mandate: 'Strict zero-tolerance enforcement against ragging in campus, corridors, and college transport. Maintain active 24x7 helpline.',
    chairman: 'Dr. Hiteshkumar Agrawal (Principal)',
    coordinator: 'Prof. Vikram Patil (Student Welfare Officer)',
    members: [
      { role: 'Chairman', name: 'Dr. Hiteshkumar Agrawal', designation: 'Principal' },
      { role: 'Faculty Member', name: 'Prof. Ananya Deshmukh', designation: 'Lecturer' },
      { role: 'Local Police Officer', name: 'Police Sub-Inspector', designation: 'Sinnar Police Station' },
      { role: 'Local NGO Representative', name: 'Adv. S. K. Shinde', designation: 'Social Activist' },
      { role: 'Parent Representative', name: 'Mr. Ramesh Joshi', designation: 'Parent (First Year Scholar)' },
      { role: 'Fresher Student', name: 'Priya Kulkarni', designation: 'First Year D.Pharm' },
    ],
    agendaTopics: [
      'Installation of emergency CCTV monitoring and anti-ragging warning boards',
      'Collection and 100% online submission of Anti-Ragging Affidavits (antiragging.in)',
      'Formation of Flying Squad daily roster for unannounced campus scrutiny',
      'Verification of emergency helpline connectivity and suggestion box logs',
    ],
  },
  {
    id: 'ICC',
    name: 'Internal Complaints Committee (ICC) / Prevention of Sexual Harassment',
    shortName: 'ICC / POSH',
    frequency: 'Quarterly & Immediate Incident Inquiries',
    tenure: '3 Years',
    regulatoryBody: 'PoSH Act 2013 & AICTE/PCI Gender Sensitization Mandate',
    mandate: 'Provide a safe, confidential grievance redressing mechanism for women employees and girl students. Organize gender sensitization seminars.',
    chairman: 'Prof. Snehal Deshmukh (Presiding Officer)',
    coordinator: 'Prof. Ananya Deshmukh (Member Secretary)',
    members: [
      { role: 'Presiding Officer', name: 'Prof. Snehal Deshmukh', designation: 'Senior Woman Faculty' },
      { role: 'Faculty Member', name: 'Prof. Vikram Patil', designation: 'Lecturer' },
      { role: 'Non-Teaching Staff', name: 'Mrs. Rekha Jadhav', designation: 'Head Clerk' },
      { role: 'External Legal / NGO Member', name: 'Adv. Meenakshi Pawar', designation: 'Women Rights Counsel' },
      { role: 'Student Member', name: 'Neha Gaikwad', designation: 'S.Y. D.Pharm' },
    ],
    agendaTopics: [
      'Zero-complaint quarterly verification report formulation',
      'Display of Women Helpline Contact Numbers across common areas and girls common room',
      'Planning gender sensitization workshop during orientation week',
      'Submission of Annual ICC Report to MSBTE and District Women Welfare Officer',
    ],
  },
  {
    id: 'GRC',
    name: 'Grievance Redressal Committee (GRC) for Students & Staff',
    shortName: 'GRC',
    frequency: 'Bi-Monthly / On-Demand',
    tenure: '2 Years',
    regulatoryBody: 'AICTE / PCI Regulations for Establishment of Mechanism for Grievance Redressal',
    mandate: 'Examine student and faculty complaints regarding academic schedules, evaluation transparency, amenities, or library resources without bias.',
    chairman: 'Dr. Hiteshkumar Agrawal (Principal)',
    coordinator: 'Prof. Vikram Patil (Ombudsman Liaison)',
    members: [
      { role: 'Chairman', name: 'Dr. Hiteshkumar Agrawal', designation: 'Principal' },
      { role: 'Senior Professor', name: 'Prof. Snehal Deshmukh', designation: 'Academic In-Charge' },
      { role: 'Faculty Member', name: 'Prof. R. M. Wagh', designation: 'Lecturer' },
      { role: 'Administrative Officer', name: 'Mr. S. T. Kharde', designation: 'Office Superintendent' },
      { role: 'Special Invitee (Student)', name: 'Council General Secretary', designation: 'Student Council' },
    ],
    agendaTopics: [
      'Opening and scrutiny of physical and digital grievance portal submissions',
      'Review of laboratory ventilation and water purification station maintenance',
      'Book bank request processing for economically disadvantaged scholars',
      'Disposal report compilation for submission to MSBTE academic monitoring',
    ],
  },
  {
    id: 'SC_ST',
    name: 'Committee for SC/ST (Prevention of Caste Discrimination)',
    shortName: 'SC/ST Cell',
    frequency: 'Biannual (Minimum 2 Meetings/Year)',
    tenure: '3 Years',
    regulatoryBody: 'Scheduled Castes & Scheduled Tribes (Prevention of Atrocities) Act & UGC Mandate',
    mandate: 'Safeguard constitutional rights of SC/ST students and staff, oversee government scholarship disbursements, and provide remedial mentoring.',
    chairman: 'Dr. Hiteshkumar Agrawal (Principal)',
    coordinator: 'Prof. Rajesh M. Shinde (Liaison Officer)',
    members: [
      { role: 'Chairman', name: 'Dr. Hiteshkumar Agrawal', designation: 'Principal' },
      { role: 'Liaison Officer', name: 'Prof. Rajesh M. Shinde', designation: 'Assistant Professor' },
      { role: 'Faculty Member', name: 'Prof. Kavita Sonawane', designation: 'Lecturer' },
      { role: 'Staff Representative', name: 'Mr. Dilip Bhalerao', designation: 'Lab Technician' },
      { role: 'Student Member', name: 'Rohan Kamble', designation: 'First Year D.Pharm' },
    ],
    agendaTopics: [
      'Verification of MahaDBT social welfare scholarship disbursement status',
      'Conducting special tutorial sessions for chemistry formulation concepts',
      'Review of library reservation book bank quota utilization',
      'Declaration of zero-discrimination status for institutional compliance portal',
    ],
  },
  {
    id: 'AMC',
    name: 'Academic Monitoring Committee (AMC - MSBTE CIAAN-2023)',
    shortName: 'AMC Cell',
    frequency: 'Monthly (Minimum 8 Meetings/Year)',
    tenure: 'Annual Reconstitution',
    regulatoryBody: 'MSBTE CIAAN-2023 Continuous Assessment Scheme',
    mandate: 'Audit syllabus completion velocity vs academic calendar, student attendance (<75% defaulters), laboratory continuous rubric maintenance (PH-3), and question paper scrutiny.',
    chairman: 'Dr. Hiteshkumar Agrawal (Principal)',
    coordinator: 'Prof. Snehal Deshmukh (Academic Coordinator)',
    members: [
      { role: 'Chairman', name: 'Dr. Hiteshkumar Agrawal', designation: 'Principal' },
      { role: 'Academic Coordinator', name: 'Prof. Snehal Deshmukh', designation: 'Lecturer' },
      { role: 'Pharmaceutics In-Charge', name: 'Prof. Vikram Patil', designation: 'Lecturer' },
      { role: 'Pharmacology In-Charge', name: 'Prof. Ananya Deshmukh', designation: 'Lecturer' },
      { role: 'Class Teacher Year 1', name: 'Prof. P. R. Kharde', designation: 'Lecturer' },
      { role: 'Class Teacher Year 2', name: 'Prof. S. N. Wagh', designation: 'Lecturer' },
    ],
    agendaTopics: [
      'Monthly syllabus velocity index scrutiny against MSBTE academic calendar',
      'Identification of student defaulters (<75% attendance) and issue of parental intimation notices',
      'Scrutiny of Sessional Exam question papers for revised Bloom’s taxonomy compliance',
      'Cross-verification of PH-4 & PH-5 scaled progressive marks prior to board submission',
    ],
  },
];

export const MSBTEProformasView: React.FC<MSBTEProformasViewProps> = ({
  institution,
  subject,
  students: appStudents,
}) => {
  // Top-level switch: MSBTE Proformas (PH-1..11) vs Statutory Committees Workstation
  const [activeMainModule, setActiveMainModule] = useState<'PROFORMAS' | 'COMMITTEES'>('PROFORMAS');
  
  // Proformas State
  const [selectedProformaId, setSelectedProformaId] = useState<string>('PH-1');
  const [filterPattern, setFilterPattern] = useState<'ALL' | 'Year 1' | 'Year 2' | 'Annual Scheme'>('ALL');
  const [filterNature, setFilterNature] = useState<'ALL' | 'Theory' | 'Practical' | 'Field Visit' | 'Result'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportingAll, setIsExportingAll] = useState(false);

  // Statutory Committees State
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>('IQAC');
  const [selectedMeetingDate, setSelectedMeetingDate] = useState<string>('18-August-2025');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // IndexedDB Stored Logo
  const [persistedLogo, setPersistedLogo] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogo() {
      try {
        const logo = await getAsset('college_logo');
        if (logo) setPersistedLogo(logo);
      } catch (err) {
        console.error('Failed to load logo from assetStorage:', err);
      }
    }
    loadLogo();
  }, []);

  const studentRecords = generateProformaStudentRecords(appStudents);

  const college = institution?.name || 'Navjeevan Education Society\'s D. P. Kharde Navjeevan College of Pharmacy, Sinnar';
  const aishe = institution?.aisheCode || 'S-22693';
  const pci = institution?.pciCode || '9178';
  const dte = institution?.dteCode || '5539';
  const msbte = institution?.msbteCode || '62386';
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
  const currentCommittee = STATUTORY_COMMITTEES.find((c) => c.id === selectedCommitteeId) || STATUTORY_COMMITTEES[0];

  const handleExportCurrent = () => {
    switch (currentDef.id) {
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

  const handleExportAll = () => {
    setIsExportingAll(true);
    exportAllMSBTEProformasExcelBundle(institution, subject);
    setTimeout(() => {
      setIsExportingAll(false);
    }, 3500);
  };

  const copyCommitteeMeetingNotice = () => {
    const text = `NAVJEEVAN EDUCATION SOCIETY'S
D. P. KHARDE NAVJEEVAN COLLEGE OF PHARMACY, SINNAR
Statutory Codes: MSBTE: ${msbte} | DTE: ${dte} | PCI: ${pci} | AISHE: ${aishe}
--------------------------------------------------------------------------------
MEETING NOTICE & AGENDA: ${currentCommittee.name.toUpperCase()}

Reference No: DPKCOP/${currentCommittee.id}/2025-26/M-01
Date of Issuance: ${selectedMeetingDate}

Notice is hereby given that an official statutory meeting of the ${currentCommittee.name} will be convened under the chairmanship of Dr. Hiteshkumar Agrawal (Principal & Authorizing Signatory) in the Conference Room.

AGENDA OF THE MEETING:
${currentCommittee.agendaTopics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

All designated committee members are requested to attend promptly with relevant documentation and action-taken portfolios.

By Order of the Principal,
Dr. Hiteshkumar Agrawal
Principal, Professor & Authorized Signatory
D. P. Kharde Navjeevan College of Pharmacy, Sinnar`;

    navigator.clipboard.writeText(text);
    setCopiedNotice(`Copied ${currentCommittee.shortName} Official Notice!`);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Master Top Header: Institutional Identity with Persisted Logo */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md print:bg-white print:text-black print:border-slate-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 tracking-wider">
                MSBTE CIAAN-2023 &amp; Statutory Suite
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {OFFICIAL_MSBTE_CURRICULUM_SCHEME}
              </span>
            </div>
            
            <div className="flex items-center gap-3.5 pt-1">
              {persistedLogo ? (
                <div className="w-14 h-14 bg-white/10 rounded-xl p-1 border border-slate-700 flex items-center justify-center shrink-0 print:border-slate-400">
                  <img src={persistedLogo} alt="College Crest" className="w-full h-full object-contain" />
                </div>
              ) : (
                <InstitutionSeal profile={institution} variant="circular" size="md" />
              )}
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                  Navjeevan Education Society's
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white print:text-black">
                  {college}
                </h1>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  Department of Pharmacy • Affiliated to MSBTE Mumbai &amp; Approved by PCI New Delhi
                </p>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportAll}
              disabled={isExportingAll}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-75 cursor-pointer"
              title="Download all 11 MSBTE PH Proformas in CSV/Excel formats"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExportingAll ? 'Generating Bundle...' : 'Download All 11 Proformas (.csv)'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-slate-700/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Statutory Identifiers Bar */}
        <div className="pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Statutory Board &amp; Council Identifiers:
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
            Principal Signatory: <strong className="text-amber-300 font-bold">Dr. Hiteshkumar Agrawal</strong>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Switch: Proformas PH-1..11 vs Statutory Committees */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200 rounded-2xl border border-slate-300 max-w-fit">
        <button
          onClick={() => setActiveMainModule('PROFORMAS')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeMainModule === 'PROFORMAS'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          <span>MSBTE Proformas (PH-1 to PH-11)</span>
        </button>

        <button
          onClick={() => setActiveMainModule('COMMITTEES')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeMainModule === 'COMMITTEES'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Statutory Committees Module (6 Mandatory Cells)</span>
        </button>
      </div>

      {/* =========================================================================
          MODULE A: STATUTORY COMMITTEES WORKSTATION
         ========================================================================= */}
      {activeMainModule === 'COMMITTEES' && (
        <div className="space-y-6">
          {/* Committee Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {STATUTORY_COMMITTEES.map((comm) => {
              const isSelected = selectedCommitteeId === comm.id;
              return (
                <button
                  key={comm.id}
                  onClick={() => setSelectedCommitteeId(comm.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {comm.id}
                    </span>
                    <div className="text-xs font-black mt-2 leading-tight line-clamp-2">
                      {comm.shortName}
                    </div>
                  </div>
                  <div className={`text-[10px] mt-2 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {comm.frequency.split('(')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Committee Detailed View */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-xs font-black font-mono">
                    {currentCommittee.id}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Mandate: {currentCommittee.regulatoryBody}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  {currentCommittee.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {currentCommittee.mandate}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={copyCommitteeMeetingNotice}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Official Notice
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  Print Committee Minutes (PDF)
                </button>
              </div>
            </div>

            {/* Committee Details Canvas */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Chairman / Principal</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentCommittee.chairman}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Member Secretary / Coordinator</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentCommittee.coordinator}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Meeting Frequency</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentCommittee.frequency}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Current Tenure</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentCommittee.tenure} (Active)</div>
                </div>
              </div>

              {/* Members Portfolio Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Gazetted Committee Composition &amp; Portfolio Allocation
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-14 text-center">Sr.</th>
                        <th className="p-3 w-48">Designated Role</th>
                        <th className="p-3">Member Name</th>
                        <th className="p-3">Institutional / External Designation</th>
                        <th className="p-3 w-28 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentCommittee.members.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-bold text-slate-900 font-mono text-[11px]">{m.role}</td>
                          <td className="p-3 font-semibold text-indigo-900">{m.name}</td>
                          <td className="p-3 text-slate-600">{m.designation}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Appointed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Standard Statutory Agenda & Minutes Template */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Standing Meeting Agenda Items &amp; Action Taken Resolutions
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    Ref: DPKCOP/{currentCommittee.id}/2025-26/M-01
                  </span>
                </div>

                <div className="space-y-2">
                  {currentCommittee.agendaTopics.map((topic, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-800">{topic}</div>
                        <p className="text-[11px] text-slate-500">
                          Resolution: Discussed and approved by consensus. Forwarded to Academic Monitoring Committee and Principal for statutory implementation.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Signatory Box */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="h-8 border-b border-slate-300 mb-2"></div>
                  <div className="font-bold text-slate-900">{currentCommittee.coordinator}</div>
                  <div className="text-[10px] text-slate-500">Member Secretary / Coordinator</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="h-8 border-b border-slate-300 mb-2"></div>
                  <div className="font-bold text-indigo-900">Dr. Hiteshkumar Agrawal</div>
                  <div className="text-[10px] text-slate-500">Principal &amp; Chairman (MSBTE: 62386)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE B: MSBTE STATUTORY PROFORMAS (PH-1 to PH-11)
         ========================================================================= */}
      {activeMainModule === 'PROFORMAS' && (
        <div className="space-y-6">
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
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
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
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
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
                    className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
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
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Export to Excel (.csv)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  Print Official Form
                </button>
              </div>
            </div>

            {/* Proforma Interactive Tables */}
            <div className="p-6 space-y-6">
              
              {/* PH-1: Teaching Plan */}
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

              {/* PH-2: Lab Plan */}
              {currentDef.id === 'PH-2' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <strong className="font-bold">Course:</strong> Pharmaceutics Practical (20111-P) | <strong className="font-bold">Batches:</strong> B1 (Roll 01-20), B2 (Roll 21-40), B3 (Roll 41-60)
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg font-bold text-[11px]">
                      Total: 15 Experiments &amp; Field Visits (75 Hours)
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

              {/* PH-3: Day to Day Assessment */}
              {currentDef.id === 'PH-3' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-600" />
                      Statutory 10-Mark Continuous Rubric per Experiment:
                    </div>
                    <p className="text-[11px] text-purple-800">
                      Performance (4 Marks) + Preparation/Attendance (3 Marks) + Journal &amp; Viva (3 Marks) = 10 Marks.
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

              {/* PH-4_I: Theory PA Y1 */}
              {currentDef.id === 'PH-4_I' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CalculatorIcon className="w-4 h-4 text-blue-600" />
                      Statutory MSBTE First Year Theory Progressive Assessment Formula:
                    </div>
                    <p className="text-[11px] text-blue-800">
                      Total Theory PA (Max 20M) = Best of Two Sessional Exams (scaled to 10M) + Continuous Mode Assignments &amp; Field Visits (10M).
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

              {/* PH-4_II: Practical PA Y1 */}
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

              {/* Statutory Signatures Block */}
              <div className="pt-6 border-t border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="h-8 border-b border-slate-300 mb-1.5"></div>
                  <div className="font-bold text-slate-900">Prof. Ananya Deshmukh</div>
                  <div className="text-[10px] text-slate-500">Subject Teacher / Course In-Charge</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="h-8 border-b border-slate-300 mb-1.5"></div>
                  <div className="font-bold text-slate-900">Prof. Vikram Patil</div>
                  <div className="text-[10px] text-slate-500">Laboratory &amp; Field In-Charge</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="h-8 border-b border-slate-300 mb-1.5"></div>
                  <div className="font-bold text-slate-900">Prof. Snehal Deshmukh</div>
                  <div className="text-[10px] text-slate-500">Academic Coordinator</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 shadow-xs">
                  <div className="h-8 border-b border-indigo-200 mb-1.5 flex items-end justify-center">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                      ✓ Digitally Authorized
                    </span>
                  </div>
                  <div className="font-bold text-indigo-900">Dr. Hiteshkumar Agrawal</div>
                  <div className="text-[10px] text-slate-500">Principal &amp; Head of Institute (MSBTE: 62386)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {copiedNotice && (
        <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in flex items-center gap-2 z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotice}</span>
        </div>
      )}
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
