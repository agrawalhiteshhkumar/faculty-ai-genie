import React, { useState, useEffect, useCallback } from 'react';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
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

  // Multi-Tenant Session State
  const [tenantId, setTenantId] = useState<string | null>(() => {
    return localStorage.getItem('faculty_genie_tenant_id') || null;
  });
  const [licenseKey, setLicenseKey] = useState<string | null>(() => {
    return localStorage.getItem('faculty_genie_license_key') || null;
  });
  const [license, setLicense] = useState<InstitutionalLicense | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);

  // Super Admin Control Plane State
  const [isSuperAdminViewOpen, setIsSuperAdminViewOpen] = useState(false);
  const [isSuperAdminLoginModalOpen, setIsSuperAdminLoginModalOpen] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState<boolean>(() => {
    return localStorage.getItem('faculty_genie_superadmin_auth') === 'true';
  });

  // Core Institutional State
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<InstitutionProfile | null>(null);
  const [subject, setSubject] = useState<SubjectMaster | null>(null);
  const [facultyList, setFacultyList] = useState<FacultyMaster[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('fac-001');
  const [students, setStudents] = useState<StudentMaster[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
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

  // Tenant-Scoped API Request Wrapper
  const fetchTenant = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
      };
      if (tenantId) headers['x-tenant-id'] = tenantId;
      if (licenseKey) headers['x-license-key'] = licenseKey;

      return fetch(url, { ...options, headers });
    },
    [tenantId, licenseKey]
  );

  // Initial Data Bootstrap for Active Tenant
  const fetchBootstrapData = useCallback(async () => {
    if (!tenantId && !licenseKey) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetchTenant('/api/bootstrap');
      const data = await res.json();

      if (data.licenseRequired || !res.ok) {
        // License invalid, suspended, or expired
        setActivationError(data.message || data.error || 'Institutional License validation required.');
        setTenantId(null);
        setLicenseKey(null);
        setLicense(null);
        localStorage.removeItem('faculty_genie_tenant_id');
        localStorage.removeItem('faculty_genie_license_key');
        setLoading(false);
        return;
      }

      setLicense(data.license || null);
      setInstitution(data.institution || null);
      setSubject(data.subject || null);
      setFacultyList(data.faculty || []);
      setStudents(data.students || []);
      setTimetable(data.timetable || []);
      setAssessment(data.assessment || null);
      setStudentMarks(data.studentMarks || []);
      setCoAttainment(data.coAttainment || []);
      setPoAttainments(data.poAttainments || {});
      setProgramOutcomes(data.programOutcomes || []);
      setActionTakenReports(data.actionTakenReports || []);
      setTeachingDiaryEntries(data.teachingDiaryEntries || []);
      setAuditLogs(data.auditLogs || []);
      setActivationError(null);
    } catch (err) {
      console.error('Failed to load bootstrap data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchTenant, tenantId, licenseKey]);

  useEffect(() => {
    fetchBootstrapData();
  }, [fetchBootstrapData]);

  // Handle License Activation Success from Gateway
  const handleActivationSuccess = (
    newTenantId: string,
    newLicense: InstitutionalLicense,
    configured: boolean
  ) => {
    localStorage.setItem('faculty_genie_tenant_id', newTenantId);
    localStorage.setItem('faculty_genie_license_key', newLicense.key);
    setTenantId(newTenantId);
    setLicenseKey(newLicense.key);
    setLicense(newLicense);
    setActivationError(null);
    setLoading(true);

    if (configured) {
      setCurrentTab('HOME');
    } else {
      setCurrentTab('SETUP');
    }

    setTimeout(() => {
      fetchBootstrapData();
    }, 100);
  };

  // Exit Workspace / Switch Institutional License Key
  const handleExitWorkspace = () => {
    if (window.confirm('Do you want to exit this college workspace and switch license key?')) {
      localStorage.removeItem('faculty_genie_tenant_id');
      localStorage.removeItem('faculty_genie_license_key');
      setTenantId(null);
      setLicenseKey(null);
      setLicense(null);
      setInstitution(null);
      setSubject(null);
      setFacultyList([]);
      setStudents([]);
      setTimetable([]);
      setAssessment(null);
      setStudentMarks([]);
      setCoAttainment([]);
      setPoAttainments({});
      setActionTakenReports([]);
      setTeachingDiaryEntries([]);
      setAuditLogs([]);
      setCurrentTab('HOME');
    }
  };

  // Super Admin Action Handlers
  const handleOpenSuperAdmin = () => {
    if (isSuperAdminUser) {
      setIsSuperAdminViewOpen(true);
    } else {
      setIsSuperAdminLoginModalOpen(true);
    }
  };

  const handleSuperAdminLoginSuccess = () => {
    setIsSuperAdminUser(true);
    setIsSuperAdminLoginModalOpen(false);
    setIsSuperAdminViewOpen(true);
  };

  const handleSuperAdminEnterTenant = (targetTenantId: string, targetLicense: InstitutionalLicense) => {
    localStorage.setItem('faculty_genie_tenant_id', targetTenantId);
    localStorage.setItem('faculty_genie_license_key', targetLicense.key);
    setTenantId(targetTenantId);
    setLicenseKey(targetLicense.key);
    setLicense(targetLicense);
    setIsSuperAdminViewOpen(false);
    setLoading(true);
    fetchBootstrapData();
  };

  // Institution Profile Save Handler
  const handleSaveInstitution = async (profile: InstitutionProfile) => {
    const res = await fetchTenant('/api/institution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (data.success) {
      setInstitution(data.institution);
      await fetchBootstrapData();
    }
  };

  // Reset Database to Blank Handler
  const handleResetDatabase = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all institution data and masters to a completely clean blank database? This cannot be undone.'
      )
    ) {
      return;
    }
    const res = await fetchTenant('/api/institution/reset', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setInstitution(null);
      setSubject(null);
      setFacultyList([]);
      setStudents([]);
      setTimetable([]);
      setAssessment(null);
      setStudentMarks([]);
      setCoAttainment([]);
      setPoAttainments({});
      setActionTakenReports([]);
      setTeachingDiaryEntries([]);
      await fetchBootstrapData();
    }
  };

  // Load Sample Regulatory Dataset (PCI & MSBTE K-Scheme)
  const handleLoadSampleDataset = async () => {
    const res = await fetchTenant('/api/masters/sample', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      await fetchBootstrapData();
    }
  };

  // Quick attendance save handler
  const handleSaveAttendance = async (slotId: string, absentIds: string[]) => {
    const res = await fetchTenant('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId, absentStudentIds: absentIds }),
    });
    const data = await res.json();
    if (data.success) {
      setTimetable((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, status: { ...s.status, attendanceMarked: true } } : s))
      );
      setStudents(data.students);
      fetchBootstrapData();
    }
  };

  // Daily diary commit handler
  const handleSaveDiary = async (entryData: any) => {
    const res = await fetchTenant('/api/diary/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    const data = await res.json();
    if (data.success) {
      setTeachingDiaryEntries((prev) => [data.entry, ...prev]);
      setTimetable((prev) =>
        prev.map((s) => (s.id === entryData.slotId ? { ...s, status: { ...s.status, diaryLogged: true } } : s))
      );
      fetchBootstrapData();
    }
  };

  // Assessment question marks commit & instant OBE recalculation handler
  const handleSaveMarks = async (marks: StudentQuestionMark[], thresholdRatio?: number) => {
    const res = await fetchTenant('/api/marks/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marks, questionThresholdRatio: thresholdRatio || 0.60 }),
    });
    const data = await res.json();
    if (data.success) {
      setStudentMarks(marks);
      setCoAttainment(data.coAttainment);
      setPoAttainments(data.poAttainments);
      setActionTakenReports(data.actionTakenReports);
      setStudents(data.students);
      fetchBootstrapData();
    }
  };

  // Action Taken Report (ATR) AI Drafting handler
  const handleDraftNewATR = async (coCode: string) => {
    const res = await fetchTenant('/api/ai/draft-atr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coCode }),
    });
    const data = await res.json();
    if (data.success) {
      setActionTakenReports(data.actionTakenReports);
      fetchBootstrapData();
    }
  };

  // HOD Sign-Off on ATR
  const handleSignOffATR = async (atrId: string) => {
    const res = await fetchTenant('/api/audit/sign-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType: 'ACTION_TAKEN_REPORT',
        documentId: atrId,
        actor: 'Dr. Rajesh Sharma (HOD)',
        role: 'HOD',
        remarks: 'Action plan reviewed and approved for semester timetable integration.',
      }),
    });
    const data = await res.json();
    if (data.success) {
      setActionTakenReports(data.actionTakenReports);
      fetchBootstrapData();
    }
  };

  // HOD Sign-off on Teaching Diary
  const handleHODSignOffDiary = async (diaryId: string) => {
    const res = await fetchTenant('/api/audit/sign-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType: 'TEACHING_DIARY',
        documentId: diaryId,
        actor: 'Dr. Rajesh Sharma (HOD)',
        role: 'HOD',
        remarks: 'Syllabus delivery verified against academic calendar.',
      }),
    });
    const data = await res.json();
    if (data.success) {
      setTeachingDiaryEntries((prev) =>
        prev.map((d) => (d.id === diaryId ? { ...d, hodVerification: 'VERIFIED' } : d))
      );
      fetchBootstrapData();
    }
  };

  // Trigger test action 2 (generate package)
  const handleTriggerGeneratePackage = async () => {
    await fetchTenant('/api/ai/generate-package', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Tablet Coating Defects: Mottling, Orange Peel, Capping, Sticking, Blistering',
      }),
    });
    fetchBootstrapData();
  };

  // Trigger test action 3 (save marks)
  const handleTriggerSaveMarks = async () => {
    await handleSaveMarks(studentMarks);
  };

  // ---------------------------------------------------------------------------
  // VIEW ROUTING
  // ---------------------------------------------------------------------------

  // 1. Super Admin Full Dashboard View
  if (isSuperAdminViewOpen) {
    return (
      <SuperAdminDashboard
        onExitToGateway={() => setIsSuperAdminViewOpen(false)}
        onEnterTenantWorkspace={handleSuperAdminEnterTenant}
        activeTenantId={tenantId}
      />
    );
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-sm font-semibold tracking-wide">
            Initializing Faculty AI Genie Academic OS...
          </p>
          <p className="text-slate-400 text-xs">
            Connecting institutional master databases & statutory license rules
          </p>
        </div>
      </div>
    );
  }

  // 3. Activation Gateway (When no tenant session is active or access is locked)
  if (!tenantId || !licenseKey) {
    return (
      <>
        <ActivationGateway
          onActivationSuccess={handleActivationSuccess}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          initialError={activationError}
        />
        <SuperAdminLoginModal
          isOpen={isSuperAdminLoginModalOpen}
          onClose={() => setIsSuperAdminLoginModalOpen(false)}
          onLoginSuccess={handleSuperAdminLoginSuccess}
        />
      </>
    );
  }

  const currentFaculty =
    facultyList.find((f) => f.id === selectedFacultyId) ||
    facultyList[0] || {
      id: 'fac-1',
      name: 'Academic Coordinator / Admin',
      designation: 'Department Coordinator',
      department: institution?.departmentName || 'Academic Department',
      role: 'FACULTY' as UserRole,
      employmentType: 'FULL_TIME',
      prescribedWeeklyHours: 16,
      conductedWeeklyHours: 0,
      assignedSubjects: [],
    };

  const isAdjunctFaculty =
    currentFaculty.employmentType === 'ADJUNCT_VISITING' ||
    currentFaculty.employmentType === 'GUEST_LECTURER';

  // 4. Initial Institution Setup Screen (After activation, when database is completely blank)
  if (!institution || !institution.name) {
    return (
      <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
        <Navbar
          institution={null}
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
        />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <InstitutionSetupView
            institution={null}
            onSaveInstitution={handleSaveInstitution}
            onResetDatabase={handleResetDatabase}
            onLoadSampleDataset={handleLoadSampleDataset}
            studentCount={students.length}
            facultyCount={facultyList.length}
            hasSubject={!!subject}
            subjectTitle={subject?.title}
            onImportComplete={fetchBootstrapData}
            isInitialOnboarding={true}
          />
        </main>
        <SuperAdminLoginModal
          isOpen={isSuperAdminLoginModalOpen}
          onClose={() => setIsSuperAdminLoginModalOpen(false)}
          onLoginSuccess={handleSuperAdminLoginSuccess}
        />
      </div>
    );
  }

  // 5. Full Working Application Dashboard
  const pendingAttendanceCount = timetable.filter((s) => !s.status.attendanceMarked).length;
  const defaultersCount = students.filter((s) => s.isDefaulter).length;
  const lowAttainmentCount = coAttainment.filter((c) => !c.isAttained && c.studentsAttempted > 0).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Universal Navbar */}
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
      />

      {/* Main Workspace Layout (Sidebar + View Canvas) */}
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
              onHODSignOff={handleHODSignOffDiary}
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

          {/* RBAC Gatekeeper for Adjunct / Visiting Faculty on Institutional Dossier & Master Setup Tabs */}
          {isAdjunctFaculty && (currentTab === 'OUTCOMES' || currentTab === 'DOCUMENTS' || currentTab === 'SETUP') ? (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-amber-200 shadow-sm max-w-2xl mx-auto my-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Regulatory RBAC Restriction
                </span>
                <h2 className="text-xl font-black text-slate-900 pt-1">Visiting & Adjunct Faculty Access Scope</h2>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
                  Under MSBTE & PCI academic regulatory governance, Visiting, Adjunct, and Guest Faculty accounts are strictly restricted to teaching plans, continuous lab assessment rubrics, and marks entry for their explicitly assigned subjects.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Your Current Scope:</span>
                </div>
                <div className="text-xs text-slate-600 pl-5">
                  • <strong>Faculty:</strong> {currentFaculty.name} ({currentFaculty.designation})<br />
                  • <strong>Assigned Subject:</strong> {currentFaculty.assignedSubjects?.[0]?.subjectTitle || 'Pharmaceutics-I Practical'}<br />
                  • <strong>Assigned Batch:</strong> {currentFaculty.assignedSubjects?.[0]?.division || 'Div A - Batch B2'}<br />
                  • <strong>Restricted Module:</strong> {currentTab} (Requires Full-Time Faculty / HOD credentials)
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setCurrentTab('TEACH')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Assigned Teaching & Lab Rubric</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => setSelectedFacultyId('fac-001')}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Switch to Full-Time Faculty (Prof. Ananya)
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'OUTCOMES' && (
                <OutcomesView
                  subject={subject}
                  coAttainment={coAttainment}
                  poAttainments={poAttainments}
                  programOutcomes={programOutcomes}
                  actionTakenReports={actionTakenReports}
                  activeRole={activeRole}
                  onSignOffATR={handleSignOffATR}
                  onDraftNewATR={handleDraftNewATR}
                  onRecalculateWithThreshold={(ratio) => handleSaveMarks(studentMarks, ratio)}
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

              {currentTab === 'SETUP' && (
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
                  isInitialOnboarding={false}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
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
        onTriggerGeneratePackage={handleTriggerGeneratePackage}
        onTriggerSaveMarks={handleTriggerSaveMarks}
      />

      <SuperAdminLoginModal
        isOpen={isSuperAdminLoginModalOpen}
        onClose={() => setIsSuperAdminLoginModalOpen(false)}
        onLoginSuccess={handleSuperAdminLoginSuccess}
      />
    </div>
  );
}
