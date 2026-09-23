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
import { InstitutionSetupView } from './components/views/InstitutionSetupView';
import { SuperAdminDashboard } from './components/views/SuperAdminDashboard';
import { ActivationGateway } from './components/ActivationGateway';
import { SuperAdminLoginModal } from './components/SuperAdminLoginModal';
import { QuickAttendanceModal } from './components/QuickAttendanceModal';
import { DailyDiaryModal } from './components/DailyDiaryModal';
import { SearchAssistantModal } from './components/SearchAssistantModal';
import { CriticalSuccessTestModal } from './components/CriticalSuccessTestModal';

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

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('FACULTY');
  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Multi-Tenant Session State
  const [tenantId, setTenantId] = useState<string | null>(() => {
    return localStorage.getItem('faculty_genie_tenant_id') || null;
  });
  const [licenseKey, setLicenseKey] = useState<string | null>(() => {
    return localStorage.getItem('faculty_genie_license_key') || null;
  });
  const [license, setLicense] = useState<InstitutionalLicense | null>(null);

  // Super Admin Priority State
  const [isSuperAdminViewOpen, setIsSuperAdminViewOpen] = useState(false);
  const [isSuperAdminLoginModalOpen, setIsSuperAdminLoginModalOpen] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

  // Core Institutional State
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState<InstitutionProfile | null>(() => {
    const saved = localStorage.getItem('faculty_genie_institution');
    return saved ? JSON.parse(saved) : null;
  });
  const [subject, setSubject] = useState<SubjectMaster | null>(() => {
    const saved = localStorage.getItem('faculty_genie_subject');
    return saved ? JSON.parse(saved) : null;
  });
  const [facultyList, setFacultyList] = useState<FacultyMaster[]>(() => {
    const saved = localStorage.getItem('faculty_genie_faculty');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('fac-001');
  const [students, setStudents] = useState<StudentMaster[]>(() => {
    const saved = localStorage.getItem('faculty_genie_students');
    return saved ? JSON.parse(saved) : [];
  });
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('faculty_genie_timetable');
    return saved ? JSON.parse(saved) : [];
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

  // Persona Sync Handler between ExecutiveHeader & App UserRole
  const handleRoleSwitch = (persona: 'ADMIN' | 'FACULTY') => {
    if (persona === 'ADMIN') {
      setActiveRole('ADMIN');
    } else {
      setActiveRole('FACULTY');
    }
  };

  // Bootstrap Loader with Client-First Resilience
  const fetchBootstrapData = useCallback(async () => {
    const localInst = localStorage.getItem('faculty_genie_institution');
    if (localInst) {
      setInstitution(JSON.parse(localInst));
    }
    const localFaculty = localStorage.getItem('faculty_genie_faculty');
    if (localFaculty) {
      setFacultyList(JSON.parse(localFaculty));
    }
    const localStudents = localStorage.getItem('faculty_genie_students');
    if (localStudents) {
      setStudents(JSON.parse(localStudents));
    }

    if (!tenantId && !licenseKey) return;

    try {
      const res = await fetch('/api/bootstrap', {
        headers: {
          'x-tenant-id': tenantId || '',
          'x-license-key': licenseKey || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.institution) setInstitution(data.institution);
        if (data.subject) setSubject(data.subject);
        if (data.faculty?.length) setFacultyList(data.faculty);
        if (data.students?.length) setStudents(data.students);
        if (data.timetable?.length) setTimetable(data.timetable);
        if (data.assessment) setAssessment(data.assessment);
        if (data.studentMarks?.length) setStudentMarks(data.studentMarks);
        if (data.coAttainment?.length) setCoAttainment(data.coAttainment);
        if (data.poAttainments) setPoAttainments(data.poAttainments);
        if (data.programOutcomes?.length) setProgramOutcomes(data.programOutcomes);
        if (data.actionTakenReports?.length) setActionTakenReports(data.actionTakenReports);
      }
    } catch {
      // Offline fallback preserves local storage state
    }
  }, [tenantId, licenseKey]);

  useEffect(() => {
    fetchBootstrapData();
  }, [fetchBootstrapData]);

  // Handle License Activation Success
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
    setCurrentTab('SETUP');
  };

  // Exit / Logout of Workspace
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

  // Super Admin Handlers
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

  // Save Institution Profile directly to persistent storage
  const handleSaveInstitution = async (profile: InstitutionProfile) => {
    localStorage.setItem('faculty_genie_institution', JSON.stringify(profile));
    setInstitution(profile);
    setCurrentTab('HOME');
  };

  // Reset to Blank
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

  // Load Complete Sample PCI ER-2020 / MSBTE J-Scheme Dataset
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

    const sampleFaculty: FacultyMaster[] = [
      {
        id: 'fac-001',
        name: 'Dr. Hiteshkumar Agrawal',
        designation: 'Principal & Professor',
        department: 'Pharmacy',
        role: 'HOD',
        employmentType: 'FULL_TIME',
        prescribedWeeklyHours: 16,
        conductedWeeklyHours: 14,
        assignedSubjects: [{ subjectId: 'sub-1', subjectTitle: 'Pharmaceutics', division: 'Div A' }]
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
        assignedSubjects: [{ subjectId: 'sub-2', subjectTitle: 'Pharmacology', division: 'Div A' }]
      }
    ];

    const sampleStudents: StudentMaster[] = Array.from({ length: 24 }).map((_, i) => ({
      id: `stu-${i + 1}`,
      enrollmentNumber: `2206238600${i + 1}`,
      rollNumber: `${i + 1}`,
      name: `Pharmacy Scholar ${i + 1}`,
      batch: i < 12 ? 'Batch A' : 'Batch B',
      attendancePercentage: 85 + (i % 12),
      isDefaulter: false,
      totalClasses: 40,
      attendedClasses: 35
    }));

    const sampleSubject: SubjectMaster = {
      id: 'sub-1',
      code: 'ER20-11T',
      title: 'Pharmaceutics - Theory',
      department: 'Pharmacy',
      semester: 'Year 1',
      curriculumScheme: 'PCI ER-2020 / MSBTE J-Scheme',
      courseOutcomes: [
        { id: 'co-1', code: 'CO1', statement: 'Understand fundamentals of dosage form design', bloomLevel: 'Understand' },
        { id: 'co-2', code: 'CO2', statement: 'Evaluate formulation parameters of tablets and capsules', bloomLevel: 'Evaluate' }
      ]
    };

    localStorage.setItem('faculty_genie_institution', JSON.stringify(sampleProfile));
    localStorage.setItem('faculty_genie_faculty', JSON.stringify(sampleFaculty));
    localStorage.setItem('faculty_genie_students', JSON.stringify(sampleStudents));
    localStorage.setItem('faculty_genie_subject', JSON.stringify(sampleSubject));

    setInstitution(sampleProfile);
    setFacultyList(sampleFaculty);
    setStudents(sampleStudents);
    setSubject(sampleSubject);
    setCurrentTab('HOME');
  };

  // Attendance, Diary & Assessment Handlers
  const handleSaveAttendance = async (slotId: string, absentIds: string[]) => {
    setTimetable((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status: { ...s.status, attendanceMarked: true } } : s))
    );
  };

  const handleSaveDiary = async (entryData: any) => {
    setTeachingDiaryEntries((prev) => [entryData, ...prev]);
  };

  const handleSaveMarks = async (marks: StudentQuestionMark[]) => {
    setStudentMarks(marks);
  };

  // ---------------------------------------------------------------------------
  // VIEW ROUTING
  // ---------------------------------------------------------------------------

  // 1. Super Admin Full Workspace
  if (isSuperAdminViewOpen) {
    return <SuperAdminDashboard onExit={handleExitSuperAdmin} />;
  }

  // 2. Multi-Tier Activation Gateway (Direct SuperAdmin bypass wired)
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

  const currentFaculty =
    facultyList.find((f) => f.id === selectedFacultyId) ||
    facultyList[0] || {
      id: 'fac-001',
      name: 'Dr. Hiteshkumar Agrawal',
      designation: 'Principal & Professor',
      department: institution?.departmentName || 'Department of Pharmacy',
      role: 'HOD' as UserRole,
      employmentType: 'FULL_TIME',
      prescribedWeeklyHours: 16,
      conductedWeeklyHours: 14,
      assignedSubjects: [],
    };

  // 3. Institution Setup Screen
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
          facultyList={facultyList}
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
            studentCount={students.length}
            facultyCount={facultyList.length}
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

  // 4. Full Operational Academic OS Workspace
  const pendingAttendanceCount = timetable.filter((s) => !s.status?.attendanceMarked).length;
  const defaultersCount = students.filter((s) => s.isDefaulter).length;
  const lowAttainmentCount = coAttainment.filter((c) => !c.isAttained && c.studentsAttempted > 0).length;

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
        facultyList={facultyList}
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {currentTab === 'HOME' && (
            <HomeView
              activeRole={activeRole}
              timetable={timetable}
              students={students}
              coAttainment={coAttainment}
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
              timetable={timetable}
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
              students={students}
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
              students={students}
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
              students={students}
              institution={institution}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'OUTCOMES' && (
            <OutcomesView
              subject={subject}
              coAttainment={coAttainment}
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
              students={students}
              auditLogs={auditLogs}
              actionTakenReports={actionTakenReports}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}
        </main>
      </div>

      <QuickAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        slots={timetable}
        students={students}
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
