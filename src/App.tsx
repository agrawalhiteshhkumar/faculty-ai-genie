import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { Sidebar, NavTab } from './components/Sidebar';
import { HomeView } from './components/views/HomeView';
import { MyWorkView } from './components/views/MyWorkView';
import { TeachView } from './components/views/TeachView';
import { CreateView } from './components/views/CreateView';
import { AssessView } from './components/views/AssessView';
import { StudentsView } from './components/views/StudentsView';
import { OutcomesView } from './components/views/OutcomesView';
import { DocumentsView } from './components/views/DocumentsView';
import { QCIAccreditationView } from './components/views/QCIAccreditationView';
import { InstitutionSetupView } from './components/views/InstitutionSetupView';
import { SuperAdminDashboard } from './components/views/SuperAdminDashboard';
import { ActivationGateway } from './components/ActivationGateway';
import { SuperAdminLoginModal } from './components/SuperAdminLoginModal';
import { QuickAttendanceModal } from './components/QuickAttendanceModal';
import { DailyDiaryModal } from './components/DailyDiaryModal';
import { SearchAssistantModal } from './components/SearchAssistantModal';
import { CriticalSuccessTestModal } from './components/CriticalSuccessTestModal';

// Statutory Modules (Phases 1-5)
import CohortSelector from './components/common/CohortSelector';
import TeachingDiaryView from './components/common/TeachingDiaryView';
import PracticalAssessmentView from './components/common/PracticalAssessmentView';
import SessionalMarksheetView from './components/common/SessionalMarksheetView';
import COAttainmentRemedialTracker from './components/common/COAttainmentRemedialTracker';
import ConsolidatedCourseFileModal from './components/common/ConsolidatedCourseFileModal';

// Phase 6 & Phase 7 Statutory Additions
import RosterWorkloadManager from './components/admin/RosterWorkloadManager';
import StatutoryInspectionDashboard from './components/common/StatutoryInspectionDashboard';

import { AcademicClassCohort, FacultyWorkloadAllocation } from './cohortTypes';

import {
  INITIAL_TEACHING_DIARY_RECORDS,
  INITIAL_PRACTICAL_LOGS,
} from './services/dateEngineService';
import {
  INITIAL_SESSIONAL_MARKS,
  INITIAL_INTERNAL_ASSESSMENT,
} from './services/examService';
import {
  INITIAL_COURSE_OUTCOMES,
  INITIAL_STUDENT_CO_SCORES,
} from './services/coAttainmentService';

import {
  UserRole,
  InstitutionalLicense,
  InstitutionProfile,
  SubjectMaster,
  FacultyMaster,
  StudentMaster,
  TimetableSlot,
  Assessment,
  StudentQuestionMark,
  COAttainmentSummary,
  ProgramOutcome,
  ActionTakenReport,
  AuditLogEntry,
} from './types';

const LOCAL_COHORTS: AcademicClassCohort[] = [
  {
    id: 'FY_DPHARM',
    name: 'First Year D. Pharmacy',
    academicYear: '2026-2027',
    semesterOrYear: 'First Year (Annual)',
    totalIntake: 60,
    batches: [
      { id: 'FY_BATCH_A1', name: 'Batch A1', rollNumberRange: '01 - 20', studentCount: 20 },
      { id: 'FY_BATCH_A2', name: 'Batch A2', rollNumberRange: '21 - 40', studentCount: 20 },
      { id: 'FY_BATCH_A3', name: 'Batch A3', rollNumberRange: '41 - 60', studentCount: 20 },
    ],
  },
  {
    id: 'SY_DPHARM',
    name: 'Second Year D. Pharmacy',
    academicYear: '2026-2027',
    semesterOrYear: 'Second Year (Annual)',
    totalIntake: 60,
    batches: [
      { id: 'SY_BATCH_B1', name: 'Batch B1', rollNumberRange: '01 - 20', studentCount: 20 },
      { id: 'SY_BATCH_B2', name: 'Batch B2', rollNumberRange: '21 - 40', studentCount: 20 },
      { id: 'SY_BATCH_B3', name: 'Batch B3', rollNumberRange: '41 - 60', studentCount: 20 },
    ],
  },
];

const LOCAL_WORKLOADS: FacultyWorkloadAllocation[] = [
  {
    facultyId: 'fac-001',
    facultyName: 'Dr. Hiteshkumar Agrawal',
    subjectCode: 'ER20-11T',
    subjectTitle: 'Pharmaceutics - Theory',
    classId: 'FY_DPHARM',
    componentType: 'THEORY',
    weeklyHours: 3,
  },
  {
    facultyId: 'fac-001',
    facultyName: 'Dr. Hiteshkumar Agrawal',
    subjectCode: 'ER20-11P',
    subjectTitle: 'Pharmaceutics - Practical',
    classId: 'FY_DPHARM',
    batchId: 'FY_BATCH_A1',
    componentType: 'PRACTICAL',
    weeklyHours: 3,
  },
  {
    facultyId: 'fac-002',
    facultyName: 'Prof. Snehal Deshmukh',
    subjectCode: 'ER20-21T',
    subjectTitle: 'Pharmacology - Theory',
    classId: 'SY_DPHARM',
    componentType: 'THEORY',
    weeklyHours: 3,
  },
];

const DEFAULT_SAMPLE_FACULTY: FacultyMaster[] = [
  {
    id: 'fac-001',
    name: 'Dr. Hiteshkumar Agrawal',
    designation: 'Principal & Professor',
    department: 'Pharmacy',
    role: 'HOD',
    employmentType: 'FULL_TIME',
    prescribedWeeklyHours: 16,
    conductedWeeklyHours: 14,
    assignedSubjects: [{ subjectId: 'sub-1', subjectTitle: 'Pharmaceutics', division: 'Div A' }],
  },
  {
    id: 'fac-002',
    name: 'Prof. Snehal Deshmukh',
    designation: 'Lecturer',
    department: 'Pharmacy',
    role: 'FACULTY',
    employmentType: 'FULL_TIME',
    prescribedWeeklyHours: 18,
    conductedWeeklyHours: 16,
    assignedSubjects: [{ subjectId: 'sub-2', subjectTitle: 'Pharmacology', division: 'Div A' }],
  },
];

const DEFAULT_SAMPLE_STUDENTS: StudentMaster[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `stu-${i + 1}`,
  enrollmentNumber: `2206238600${i + 1}`,
  rollNumber: `${i + 1}`,
  name: `Pharmacy Scholar ${i + 1}`,
  batch: i < 12 ? 'Batch A' : 'Batch B',
  attendancePercentage: 85 + (i % 12),
  isDefaulter: false,
  totalClasses: 40,
  attendedClasses: 35,
}));

const DEFAULT_SAMPLE_SUBJECT: SubjectMaster = {
  id: 'sub-1',
  code: 'ER20-11T',
  title: 'Pharmaceutics - Theory',
  department: 'Pharmacy',
  semester: 'Year 1',
  curriculumScheme: 'PCI ER-2020 / MSBTE J-Scheme',
  courseOutcomes: [
    { id: 'co-1', code: 'CO1', statement: 'Understand fundamentals of dosage form design', bloomLevel: 'Understand' },
    { id: 'co-2', code: 'CO2', statement: 'Evaluate formulation parameters of tablets and capsules', bloomLevel: 'Evaluate' },
  ],
};

const DEFAULT_SAMPLE_TIMETABLE: TimetableSlot[] = [
  {
    id: 'slot-1',
    dayOfWeek: 'Monday',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    subjectId: 'sub-1',
    facultyId: 'fac-001',
    roomNumber: 'LH-1',
    batchName: 'All',
    status: { attendanceMarked: false },
  },
  {
    id: 'slot-2',
    dayOfWeek: 'Tuesday',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    subjectId: 'sub-1',
    facultyId: 'fac-001',
    roomNumber: 'LH-1',
    batchName: 'All',
    status: { attendanceMarked: false },
  },
];

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('FACULTY');
  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Statutory Module State (Phases 1-7)
  const [activeStatutoryTab, setActiveStatutoryTab] = useState<
    'OVERVIEW' | 'PH4_DIARY' | 'PH5_PRACTICAL' | 'SESSIONAL_CIA' | 'CO_BLOOMS' | 'WORKLOAD_ROSTER' | 'INSPECTION_AUDIT'
  >('OVERVIEW');
  const [selectedCohortId, setSelectedCohortId] = useState<string>('FY_DPHARM');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('ER20-11T');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('FY_BATCH_A1');
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [workloads, setWorkloads] = useState<FacultyWorkloadAllocation[]>(LOCAL_WORKLOADS);

  // Multi-Tenant Session State
  const [tenantId, setTenantId] = useState<string | null>(() => {
    return localStorage.getItem('faculty_genie_tenant_id') || 'tenant_dpkcop';
  });
  const [licenseKey, setLicenseKey] = useState<string | null>(() => {
    return localStorage.getItem('faculty_genie_license_key') || 'GENIE-INST-2026-ACTIVE';
  });
  const [license, setLicense] = useState<InstitutionalLicense | null>(null);

  // Super Admin Priority State
  const [isSuperAdminViewOpen, setIsSuperAdminViewOpen] = useState(false);
  const [isSuperAdminLoginModalOpen, setIsSuperAdminLoginModalOpen] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

  // Core Institutional State
  const [institution, setInstitution] = useState<InstitutionProfile | null>(() => {
    try {
      const saved = localStorage.getItem('faculty_genie_institution');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'inst-dpkcop',
            name: 'D. P. Kharde Navjeevan College of Pharmacy, Sinnar',
            shortName: 'DPKCOP',
            departmentName: 'Diploma in Pharmacy',
            aisheCode: 'S-22693',
            dteCode: '5539',
            msbteCode: '62386',
            pciCode: '9178',
            affiliatedBoard: 'Maharashtra State Board of Technical Education (MSBTE)',
            logoUrl: '',
            academicYear: '2026-2027',
            currentTerm: 'S. Y. D. Pharm (Final)',
            curriculumScheme: 'MSBTE J-Scheme / PCI ER-2020',
          };
    } catch {
      return null;
    }
  });

  const [subject, setSubject] = useState<SubjectMaster | null>(() => {
    try {
      const saved = localStorage.getItem('faculty_genie_subject');
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_SUBJECT;
    } catch {
      return DEFAULT_SAMPLE_SUBJECT;
    }
  });

  const [facultyList, setFacultyList] = useState<FacultyMaster[]>(() => {
    try {
      const saved = localStorage.getItem('faculty_genie_faculty');
      const parsed = saved ? JSON.parse(saved) : DEFAULT_SAMPLE_FACULTY;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAMPLE_FACULTY;
    } catch {
      return DEFAULT_SAMPLE_FACULTY;
    }
  });

  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('fac-001');

  const [students, setStudents] = useState<StudentMaster[]>(() => {
    try {
      const saved = localStorage.getItem('faculty_genie_students');
      const parsed = saved ? JSON.parse(saved) : DEFAULT_SAMPLE_STUDENTS;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAMPLE_STUDENTS;
    } catch {
      return DEFAULT_SAMPLE_STUDENTS;
    }
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem('faculty_genie_timetable');
      const parsed = saved ? JSON.parse(saved) : DEFAULT_SAMPLE_TIMETABLE;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAMPLE_TIMETABLE;
    } catch {
      return DEFAULT_SAMPLE_TIMETABLE;
    }
  });

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [studentMarks, setStudentMarks] = useState<StudentQuestionMark[]>([]);
  const [coAttainment, setCoAttainment] = useState<COAttainmentSummary[]>([]);
  const [poAttainments, setPoAttainments] = useState<Record<string, number>>({});
  const [programOutcomes, setProgramOutcomes] = useState<ProgramOutcome[]>([]);
  const [actionTakenReports, setActionTakenReports] = useState<ActionTakenReport[]>([]);
  const [teachingDiaryEntries, setTeachingDiaryEntries] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Modals state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [activeDiarySlot, setActiveDiarySlot] = useState<TimetableSlot | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSuccessTestModalOpen, setIsSuccessTestModalOpen] = useState(false);

  const handleRoleSwitch = (persona: 'ADMIN' | 'FACULTY') => {
    setActiveRole(persona);
  };

  const fetchBootstrapData = useCallback(async () => {
    if (!tenantId && !licenseKey) return;
    try {
      const res = await fetch('/api/bootstrap', {
        headers: {
          'x-tenant-id': tenantId || '',
          'x-license-key': licenseKey || '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.institution) setInstitution(data.institution);
        if (data.subject) setSubject(data.subject);
        if (Array.isArray(data.faculty) && data.faculty.length) setFacultyList(data.faculty);
        if (Array.isArray(data.students) && data.students.length) setStudents(data.students);
        if (Array.isArray(data.timetable) && data.timetable.length) setTimetable(data.timetable);
        if (data.assessment) setAssessment(data.assessment);
        if (Array.isArray(data.studentMarks)) setStudentMarks(data.studentMarks);
        if (Array.isArray(data.coAttainment)) setCoAttainment(data.coAttainment);
        if (data.poAttainments) setPoAttainments(data.poAttainments);
        if (Array.isArray(data.programOutcomes)) setProgramOutcomes(data.programOutcomes);
        if (Array.isArray(data.actionTakenReports)) setActionTakenReports(data.actionTakenReports);
      }
    } catch {
      // offline fallback
    }
  }, [tenantId, licenseKey]);

  useEffect(() => {
    fetchBootstrapData();
  }, [fetchBootstrapData]);

  const handleActivationSuccess = (
    newTenantId?: string,
    newLicense?: InstitutionalLicense
  ) => {
    const tid = newTenantId || 'tenant_dpkcop';
    const key = newLicense?.key || 'GENIE-INST-2026-ACTIVE';

    localStorage.setItem('faculty_genie_tenant_id', tid);
    localStorage.setItem('faculty_genie_license_key', key);
    setTenantId(tid);
    setLicenseKey(key);
    if (newLicense) setLicense(newLicense);
    setCurrentTab('HOME');
  };

  const handleExitWorkspace = () => {
    if (window.confirm('Do you want to exit this institutional workspace?')) {
      localStorage.removeItem('faculty_genie_tenant_id');
      localStorage.removeItem('faculty_genie_license_key');
      localStorage.removeItem('faculty_genie_institution');
      setTenantId(null);
      setLicenseKey(null);
      setLicense(null);
      setInstitution(null);
      setIsSuperAdminViewOpen(false);
      setIsSuperAdminUser(false);
      setCurrentTab('HOME');
    }
  };

  const handleOpenSuperAdmin = () => {
    setIsSuperAdminLoginModalOpen(true);
  };

  const handleSuperAdminLoginSuccess = () => {
    setIsSuperAdminUser(true);
    setIsSuperAdminLoginModalOpen(false);
    setIsSuperAdminViewOpen(true);
  };

  const handleExitSuperAdmin = () => {
    setIsSuperAdminViewOpen(false);
    setIsSuperAdminUser(false);
  };

  const handleSaveInstitution = async (profile: InstitutionProfile) => {
    localStorage.setItem('faculty_genie_institution', JSON.stringify(profile));
    setInstitution(profile);

    if (!students || students.length === 0) {
      localStorage.setItem('faculty_genie_students', JSON.stringify(DEFAULT_SAMPLE_STUDENTS));
      setStudents(DEFAULT_SAMPLE_STUDENTS);
    }
    if (!facultyList || facultyList.length === 0) {
      localStorage.setItem('faculty_genie_faculty', JSON.stringify(DEFAULT_SAMPLE_FACULTY));
      setFacultyList(DEFAULT_SAMPLE_FACULTY);
    }
    if (!timetable || timetable.length === 0) {
      localStorage.setItem('faculty_genie_timetable', JSON.stringify(DEFAULT_SAMPLE_TIMETABLE));
      setTimetable(DEFAULT_SAMPLE_TIMETABLE);
    }
    if (!subject) {
      localStorage.setItem('faculty_genie_subject', JSON.stringify(DEFAULT_SAMPLE_SUBJECT));
      setSubject(DEFAULT_SAMPLE_SUBJECT);
    }
    setCurrentTab('HOME');
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Clear all local data and reset institution setup?')) {
      localStorage.removeItem('faculty_genie_institution');
      localStorage.removeItem('faculty_genie_faculty');
      localStorage.removeItem('faculty_genie_students');
      localStorage.removeItem('faculty_genie_timetable');
      setInstitution(null);
      setSubject(null);
      setFacultyList([]);
      setStudents([]);
      setTimetable([]);
      setCurrentTab('SETUP');
    }
  };

  const handleLoadSampleDataset = async () => {
    const sampleProfile: InstitutionProfile = {
      id: 'inst-dpkcop',
      name: 'D. P. Kharde Navjeevan College of Pharmacy, Sinnar',
      shortName: 'DPKCOP',
      departmentName: 'Diploma in Pharmacy',
      aisheCode: 'S-22693',
      dteCode: '5539',
      msbteCode: '62386',
      pciCode: '9178',
      affiliatedBoard: 'Maharashtra State Board of Technical Education (MSBTE)',
      logoUrl: '',
      academicYear: '2026-2027',
      currentTerm: 'S. Y. D. Pharm (Final)',
      curriculumScheme: 'MSBTE J-Scheme / PCI ER-2020',
    };

    localStorage.setItem('faculty_genie_institution', JSON.stringify(sampleProfile));
    localStorage.setItem('faculty_genie_faculty', JSON.stringify(DEFAULT_SAMPLE_FACULTY));
    localStorage.setItem('faculty_genie_students', JSON.stringify(DEFAULT_SAMPLE_STUDENTS));
    localStorage.setItem('faculty_genie_subject', JSON.stringify(DEFAULT_SAMPLE_SUBJECT));
    localStorage.setItem('faculty_genie_timetable', JSON.stringify(DEFAULT_SAMPLE_TIMETABLE));

    setInstitution(sampleProfile);
    setFacultyList(DEFAULT_SAMPLE_FACULTY);
    setStudents(DEFAULT_SAMPLE_STUDENTS);
    setSubject(DEFAULT_SAMPLE_SUBJECT);
    setTimetable(DEFAULT_SAMPLE_TIMETABLE);
    setCurrentTab('HOME');
  };

  const handleSaveAttendance = async (slotId: string, _absentIds: string[]) => {
    setTimetable((prev) =>
      (prev || []).map((s) => (s.id === slotId ? { ...s, status: { ...s.status, attendanceMarked: true } } : s))
    );
  };

  const handleSaveDiary = async (entryData: any) => {
    setTeachingDiaryEntries((prev) => [entryData, ...(prev || [])]);
  };

  const handleSaveMarks = async (marks: StudentQuestionMark[]) => {
    setStudentMarks(marks);
  };

  if (isSuperAdminViewOpen) {
    return <SuperAdminDashboard onExit={handleExitSuperAdmin} />;
  }

  if (!tenantId || !licenseKey) {
    return (
      <>
        <ActivationGateway
          onActivated={(tid, lic, role) => {
            if (role) setActiveRole(role);
            handleActivationSuccess(tid, lic);
          }}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          onSuperAdminSuccess={handleSuperAdminLoginSuccess}
        />
        <SuperAdminLoginModal
          isOpen={isSuperAdminLoginModalOpen}
          onClose={() => setIsSuperAdminLoginModalOpen(false)}
          onSuccess={handleSuperAdminLoginSuccess}
        />
      </>
    );
  }

  const safeFacultyList = Array.isArray(facultyList) && facultyList.length ? facultyList : DEFAULT_SAMPLE_FACULTY;
  const safeStudents = Array.isArray(students) && students.length ? students : DEFAULT_SAMPLE_STUDENTS;
  const safeTimetable = Array.isArray(timetable) && timetable.length ? timetable : DEFAULT_SAMPLE_TIMETABLE;
  const safeCoAttainment = Array.isArray(coAttainment) ? coAttainment : [];

  const currentFaculty =
    safeFacultyList.find((f) => f.id === selectedFacultyId) ||
    safeFacultyList[0] ||
    DEFAULT_SAMPLE_FACULTY[0];

  if (!institution || !institution.name || currentTab === 'SETUP') {
    return (
      <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
        <ExecutiveHeader
          userRole={activeRole === 'ADMIN' ? 'ADMIN' : 'FACULTY'}
          onRoleSwitch={handleRoleSwitch}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          teachingHours={currentFaculty?.prescribedWeeklyHours || 16}
          currentFacultyName={currentFaculty?.name}
          isSuperAdminUser={isSuperAdminUser}
        />
        <Navbar
          institution={institution}
          license={license}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          facultyList={safeFacultyList}
          currentFaculty={currentFaculty}
          onSelectFaculty={setSelectedFacultyId}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenQuickAttendance={() => setIsAttendanceModalOpen(true)}
          onOpenSetup={() => setCurrentTab('SETUP')}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          onExitWorkspace={handleExitWorkspace}
          isSuperAdminUser={isSuperAdminUser}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <InstitutionSetupView
            institution={institution}
            onSaveInstitution={handleSaveInstitution}
            onResetDatabase={handleResetDatabase}
            onLoadSampleDataset={handleLoadSampleDataset}
            studentCount={safeStudents.length}
            facultyCount={safeFacultyList.length}
            hasSubject={!!subject}
            subjectTitle={subject?.title}
            onImportComplete={fetchBootstrapData}
            isInitialOnboarding={!institution}
          />
        </main>
        <SuperAdminLoginModal
          isOpen={isSuperAdminLoginModalOpen}
          onClose={() => setIsSuperAdminLoginModalOpen(false)}
          onSuccess={handleSuperAdminLoginSuccess}
        />
      </div>
    );
  }

  const pendingAttendanceCount = safeTimetable.filter((s) => !s?.status?.attendanceMarked).length;
  const defaultersCount = safeStudents.filter((s) => s?.isDefaulter).length;
  const lowAttainmentCount = safeCoAttainment.filter((c) => !c?.isAttained && (c?.studentsAttempted || 0) > 0).length;

  const currentSelectedCohort = LOCAL_COHORTS.find((c) => c.id === selectedCohortId) || LOCAL_COHORTS[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <ExecutiveHeader
        userRole={activeRole === 'ADMIN' ? 'ADMIN' : 'FACULTY'}
        onRoleSwitch={handleRoleSwitch}
        onOpenSuperAdmin={handleOpenSuperAdmin}
        teachingHours={currentFaculty?.prescribedWeeklyHours || 16}
        currentFacultyName={currentFaculty?.name}
        isSuperAdminUser={isSuperAdminUser}
      />
      <Navbar
        institution={institution}
        license={license}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        facultyList={safeFacultyList}
        currentFaculty={currentFaculty}
        onSelectFaculty={setSelectedFacultyId}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenQuickAttendance={() => setIsAttendanceModalOpen(true)}
        onOpenSetup={() => setCurrentTab('SETUP')}
        onOpenSuperAdmin={handleOpenSuperAdmin}
        onExitWorkspace={handleExitWorkspace}
        isSuperAdminUser={isSuperAdminUser}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeRole={activeRole}
          pendingAttendanceCount={pendingAttendanceCount}
          defaultersCount={defaultersCount}
          lowAttainmentCount={lowAttainmentCount}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          license={license}
          currentFaculty={currentFaculty}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden space-y-6">
          {/* Statutory Command Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  MSBTE / PCI ER-2020 OS
                </span>
                <span className="text-xs text-slate-400">Statutory Pharmacy Academic Controls</span>
              </div>
              <button
                onClick={() => setIsDossierModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors shadow-md self-start md:self-auto cursor-pointer"
              >
                Generate Institutional Dossier (PDF)
              </button>
            </div>

            <div className="mt-3">
              <CohortSelector
                cohorts={LOCAL_COHORTS}
                workloads={workloads}
                selectedClassId={selectedCohortId}
                selectedSubjectCode={selectedSubjectCode}
                selectedBatchId={selectedBatchId}
                onClassChange={setSelectedCohortId}
                onSubjectChange={setSelectedSubjectCode}
                onBatchChange={setSelectedBatchId}
              />
            </div>

            {/* Sub-Tabs for Phases 1-7 */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setActiveStatutoryTab('OVERVIEW')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'OVERVIEW'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveStatutoryTab('PH4_DIARY')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'PH4_DIARY'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Teaching Diary (PH-4)
              </button>
              <button
                onClick={() => setActiveStatutoryTab('PH5_PRACTICAL')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'PH5_PRACTICAL'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Practical Continuous Log (PH-5)
              </button>
              <button
                onClick={() => setActiveStatutoryTab('SESSIONAL_CIA')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'SESSIONAL_CIA'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Sessionals &amp; CIAAN-2023
              </button>
              <button
                onClick={() => setActiveStatutoryTab('CO_BLOOMS')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'CO_BLOOMS'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                CO Attainment &amp; Remedial
              </button>
              <button
                onClick={() => setActiveStatutoryTab('WORKLOAD_ROSTER')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'WORKLOAD_ROSTER'
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Workload &amp; Roster (PH-6)
              </button>
              <button
                onClick={() => setActiveStatutoryTab('INSPECTION_AUDIT')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeStatutoryTab === 'INSPECTION_AUDIT'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Inspection &amp; SIF (PH-7)
              </button>
            </div>
          </div>

          {/* Phase 6 & 7 Module Displays */}
          {activeStatutoryTab === 'WORKLOAD_ROSTER' && (
            <RosterWorkloadManager
              cohorts={LOCAL_COHORTS}
              facultyList={safeFacultyList}
              workloads={workloads}
              onUpdateWorkloads={setWorkloads}
            />
          )}

          {activeStatutoryTab === 'INSPECTION_AUDIT' && (
            <StatutoryInspectionDashboard
              institution={institution}
              cohorts={LOCAL_COHORTS}
              facultyList={safeFacultyList}
              workloads={workloads}
              students={safeStudents}
            />
          )}

          {/* Phases 2-5 Displays */}
          {activeStatutoryTab === 'PH4_DIARY' && (
            <TeachingDiaryView
              classId={selectedCohortId}
              subjectCode={selectedSubjectCode}
              initialRecords={INITIAL_TEACHING_DIARY_RECORDS}
              onGenerateChalkieDeck={(_r) => {
                alert(`Chalkie AI Lesson Deck generated for: ${_r.topicOrExperimentTitle}`);
              }}
            />
          )}

          {activeStatutoryTab === 'PH5_PRACTICAL' && (
            <PracticalAssessmentView
              classId={selectedCohortId}
              subjectCode={selectedSubjectCode}
              batchId={selectedBatchId}
              initialLogs={INITIAL_PRACTICAL_LOGS}
            />
          )}

          {activeStatutoryTab === 'SESSIONAL_CIA' && (
            <SessionalMarksheetView
              classId={selectedCohortId}
              subjectCode={selectedSubjectCode}
              initialSessionals={INITIAL_SESSIONAL_MARKS}
              initialInternals={INITIAL_INTERNAL_ASSESSMENT}
            />
          )}

          {activeStatutoryTab === 'CO_BLOOMS' && (
            <COAttainmentRemedialTracker
              subjectCode={selectedSubjectCode}
              academicYear="2026-2027"
              courseOutcomes={INITIAL_COURSE_OUTCOMES}
              studentScores={INITIAL_STUDENT_CO_SCORES}
              onTriggerRemedialModule={(_stdId, co) => {
                alert(`Remedial action plan initialized for student ${_stdId} targeting ${co}`);
              }}
            />
          )}

          {activeStatutoryTab === 'OVERVIEW' && (
            <>
              {currentTab === 'HOME' && (
                <HomeView
                  activeRole={activeRole}
                  timetable={safeTimetable}
                  students={safeStudents}
                  coAttainment={safeCoAttainment}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenQuickAttendance={() => setIsAttendanceModalOpen(true)}
                  onOpenDailyDiary={(slot) => {
                    setActiveDiarySlot(slot);
                    setIsDiaryModalOpen(true);
                  }}
                  onRunSuccessTest={() => setIsSuccessTestModalOpen(true)}
                />
              )}

              {currentTab === 'MY_WORK' && (
                <MyWorkView
                  faculty={currentFaculty}
                  timetable={safeTimetable}
                  teachingDiaryEntries={teachingDiaryEntries}
                  onOpenDailyDiary={(slot) => {
                    setActiveDiarySlot(slot);
                    setIsDiaryModalOpen(true);
                  }}
                  onOpenQuickAttendance={() => setIsAttendanceModalOpen(true)}
                  onHODSignOff={() => {}}
                />
              )}

              {currentTab === 'TEACH' && (
                <TeachView
                  subject={subject}
                  students={safeStudents}
                  currentFaculty={currentFaculty}
                  institution={institution}
                  onOpenQuickAttendance={() => setIsAttendanceModalOpen(true)}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'CREATE' && (
                <CreateView
                  subject={subject}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'ASSESS' && (
                <AssessView
                  assessment={assessment}
                  students={safeStudents}
                  studentMarks={studentMarks}
                  subject={subject}
                  activeRole={activeRole}
                  institution={institution}
                  onSaveMarks={handleSaveMarks}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'STUDENTS' && (
                <StudentsView
                  students={safeStudents}
                  institution={institution}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'OUTCOMES' && (
                <OutcomesView
                  subject={subject}
                  coAttainment={safeCoAttainment}
                  poAttainments={poAttainments}
                  programOutcomes={programOutcomes}
                  actionTakenReports={actionTakenReports}
                  activeRole={activeRole}
                  onSignOffATR={() => {}}
                  onDraftNewATR={() => {}}
                  onRecalculateWithThreshold={() => {}}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'DOCUMENTS' && (
                <DocumentsView
                  institution={institution}
                  subject={subject}
                  students={safeStudents}
                  auditLogs={auditLogs}
                  actionTakenReports={actionTakenReports}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'QCI_ACCREDITATION' && (
                <QCIAccreditationView
                  institution={institution}
                  subject={subject}
                  students={safeStudents}
                  actionTakenReports={actionTakenReports}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Statutory Course File Dossier Modal */}
      <ConsolidatedCourseFileModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        selectedClass={currentSelectedCohort}
        subjectCode={selectedSubjectCode}
        subjectTitle="Pharmaceutics - Theory & Practical"
        facultyName={currentFaculty?.name || 'Dr. Hiteshkumar Agrawal'}
        academicYear={institution?.academicYear || '2026-2027'}
        diaryRecords={INITIAL_TEACHING_DIARY_RECORDS}
        practicalLogs={INITIAL_PRACTICAL_LOGS}
        sessionals={INITIAL_SESSIONAL_MARKS}
        outcomes={INITIAL_COURSE_OUTCOMES}
      />

      <QuickAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        slots={safeTimetable}
        students={safeStudents}
        onSaveAttendance={handleSaveAttendance}
      />

      <DailyDiaryModal
        isOpen={isDiaryModalOpen}
        onClose={() => {
          setIsDiaryModalOpen(false);
          setActiveDiarySlot(null);
        }}
        slot={activeDiarySlot}
        onSaveDiary={handleSaveDiary}
      />

      <SearchAssistantModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      <CriticalSuccessTestModal
        isOpen={isSuccessTestModalOpen}
        onClose={() => setIsSuccessTestModalOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onTriggerGeneratePackage={() => {}}
        onTriggerSaveMarks={() => {}}
      />

      <SuperAdminLoginModal
        isOpen={isSuperAdminLoginModalOpen}
        onClose={() => setIsSuperAdminLoginModalOpen(false)}
        onSuccess={handleSuperAdminLoginSuccess}
      />
    </div>
  );
}
