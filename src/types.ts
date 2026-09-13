export type UserRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'INSTITUTION_ADMIN'
  | 'PRINCIPAL_DEAN'
  | 'HOD'
  | 'FACULTY'
  | 'LAB_ASSISTANT';

export type BloomsLevel = 'L1_REMEMBER' | 'L2_UNDERSTAND' | 'L3_APPLY' | 'L4_ANALYZE' | 'L5_EVALUATE' | 'L6_CREATE';

export type LicenseStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED' | 'PENDING_ACTIVATION';
export type PlanTier = 'PILOT_TRIAL' | 'REGULATORY_STANDARD' | 'INSTITUTIONAL_PLATINUM';

export interface InstitutionalLicense {
  id: string;
  key: string; // 16-character license key (formatted e.g. FAIG-2026-N9XP-7K2M)
  collegeName: string;
  aisheCode?: string;
  pciCode?: string;
  dteCode?: string;
  msbteCode?: string;
  aishePciCode?: string; // Legacy combined fallback
  department?: string;
  adminEmail: string;
  facultySeatLimit: number;
  sanctionedIntake?: number;
  allowedProgrammes: string[];
  planTier: PlanTier;
  status: LicenseStatus;
  createdAt: string;
  activatedAt?: string;
  expiresAt: string;
  lastAccessedAt?: string;
  notes?: string;
  tenantId: string;
  stats?: {
    facultyCount: number;
    studentCount: number;
    subjectCount: number;
  };
}

export interface SuperAdminStats {
  totalTenants: number;
  activeLicenses: number;
  suspendedLicenses: number;
  revokedLicenses: number;
  expiredLicenses: number;
  pendingActivation: number;
  totalAllocatedSeats: number;
  totalEnrolledStudents: number;
}

export interface InstitutionProfile {
  id: string;
  name: string;
  shortName: string;
  aisheCode: string;
  dteCode: string;
  msbteCode: string;
  pciCode: string;
  departmentName?: string;
  affiliatedBoard?: string;
  accreditedBy?: string[]; // NBA, NAAC, PCI
  logoUrl?: string;
  address?: string;
  currentAcademicYear?: string;
  currentTerm?: string;
}

export interface Programme {
  id: string;
  code: string;
  name: string;
  department: string;
  durationYears: number;
  regulatoryBody: 'PCI' | 'AICTE' | 'MSBTE' | 'DTE';
  curriculumScheme: string; // e.g. "MSBTE K-Scheme / CIAAN-2023" or "PCI ER-2020"
}

export interface CourseOutcome {
  id: string;
  code: string; // CO1, CO2, etc.
  statement: string;
  targetBlooms: BloomsLevel;
  targetAttainmentScore: number; // e.g. 2.5 on 3.0 scale
}

export interface ProgramOutcome {
  id?: string;
  code: string; // PO1 - PO12, PSO1 - PSO2
  statement: string;
}

export interface SubjectMaster {
  id: string;
  code: string; // e.g. PH-101
  title: string;
  programmeId: string;
  programmeName: string;
  semester: string;
  prescribedHoursTheory: number;
  prescribedHoursPractical: number;
  courseOutcomes: CourseOutcome[];
  units: SyllabusUnit[];
  coPoMatrix?: Record<string, Record<string, number>>; // { CO1: { PO1: 3, PO2: 2... } } (0 to 3)
  copoMatrix?: any[];
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  hours: number;
  targetCO: string; // CO1, CO2...
  subtopics: string[];
}

export interface StudentMaster {
  id: string;
  uid: string;
  prn: string; // Permanent Registration Number (MSBTE/University Board ID)
  rollNo: string;
  name: string;
  programmeId: string;
  division: string;
  batch: string; // B1, B2
  programYear?: 'FIRST_YEAR' | 'SECOND_YEAR';
  academicYear?: string; // e.g. "FY" | "SY"
  courseCode?: string; // e.g. "ER20-11T" | "ER20-21T"
  mentorName?: string;
  mentorEmpCode?: string;
  mentorNotes?: Array<{
    date: string;
    mentorName: string;
    counselingPoint: string;
    actionAgreed: string;
  }>;
  admissionType?: 'REGULAR' | 'LATERAL_ENTRY_DSE' | 'TRANSFER_IN';
  admissionDate?: string; // e.g. "2025-09-15"
  attendanceTheoryPercentage: number;
  attendancePracticalPercentage: number;
  isDefaulter: boolean; // < 75%
  sessional1Average: number;
  sessional2Average: number;
  sessional3Average?: number; // Re-Sessional / Improvement Exam (Max 30)
  bestOfTwoAverage?: number; // Statutory PCI/MSBTE Best-of-Two Average
  reSessionalReason?: 'MEDICAL_ABSENTEE' | 'SCORE_IMPROVEMENT' | 'NOT_ELIGIBLE';
  continuousAssessmentScore: number;
  atRiskReasons?: string[];
  mentoringNotes?: string[];
  achievements?: Array<{ title: string; category: string; date: string; verified: boolean }>;
}

export interface FacultyMaster {
  id: string;
  empCode: string;
  name: string;
  department: string;
  designation: string;
  role: UserRole;
  employmentType?: 'FULL_TIME' | 'ADJUNCT_VISITING' | 'GUEST_LECTURER';
  assignedSubjects: Array<{ subjectId: string; subjectTitle: string; division: string; type: 'THEORY' | 'PRACTICAL' }>;
  leaveStatus?: {
    onLeave: boolean;
    leaveType?: 'MEDICAL' | 'MATERNITY' | 'DUTY_LEAVE' | 'FDP_TRAINING' | 'OTHER';
    startDate?: string;
    endDate?: string;
    substituteFacultyId?: string;
    substituteFacultyName?: string;
    handoverNotes?: string;
  };
  appraisalMetrics?: {
    contactHoursDelivered: number;
    contactHoursPrescribed: number;
    syllabusCompletionRate: number;
    avgCoAttainment: number;
    fdpAttended: number;
    researchPublications: number;
  };
}

export interface TimetableSlot {
  id: string;
  day: string;
  timeSlot: string;
  subjectCode: string;
  subjectTitle: string;
  programmeName: string;
  division: string;
  batch?: string; // e.g. "Batch B1" or "All"
  type: 'THEORY' | 'PRACTICAL';
  classroom: string;
  facultyId: string;
  facultyName: string;
  coFacultyId?: string;
  coFacultyName?: string;
  coFacultyRole?: string; // e.g. "Lab Instructor" or "Co-Faculty"
  isSubstituted?: boolean;
  substituteFacultyId?: string;
  substituteFacultyName?: string;
  unitTarget: number;
  topicPlanned: string;
  status: {
    attendanceMarked: boolean;
    diaryLogged: boolean;
    marksEntered: boolean;
  };
}

export interface AttendanceRecord {
  id: string;
  slotId: string;
  subjectCode: string;
  date: string;
  division: string;
  batch?: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  absentStudentIds: string[];
  timestamp: string;
}

export interface TeachingDiaryEntry {
  id: string;
  slotId: string;
  subjectCode: string;
  subjectTitle: string;
  date: string;
  plannedTopic: string;
  actualTopicCovered: string;
  completionStatus: 'COMPLETED_AS_PLANNED' | 'PARTIALLY_COVERED' | 'ALTERNATE_TOPIC';
  pedagogicalStrategy: string;
  teachingAidUsed: string;
  remarks: string;
  hodVerification: 'PENDING' | 'VERIFIED' | 'FLAGGED';
}

export interface AssessmentQuestion {
  questionNo: string;
  subPart?: string;
  text: string;
  targetCO: string;
  bloomsLevel: BloomsLevel;
  maxMarks: number;
}

export interface Assessment {
  id: string;
  subjectCode: string;
  title: string; // e.g. "First Sessional Theory Exam (MSBTE Aligned)"
  type: 'SESSIONAL_1' | 'SESSIONAL_2' | 'RE_SESSIONAL_IMPROVEMENT' | 'RETEST' | 'CONTINUOUS_PRACTICAL';
  date: string;
  totalMarks: number;
  questions: AssessmentQuestion[];
  isLocked: boolean;
  scrutinyStatus?: {
    status: 'PASSED' | 'FLAGGED_NEEDS_REVIEW' | 'APPROVED';
    scrutinyReport?: string;
    lotsHotsRatio?: string;
    coCoverageScore?: number;
  };
}

export interface StudentQuestionMark {
  studentId: string;
  studentName: string;
  rollNo: string;
  marks: Record<string, number>; // { "Q1a": 4, "Q1b": 3, "Q2": 5 }
  totalScore: number;
}

export interface COAttainmentSummary {
  coCode: string;
  description: string;
  targetLevel: number; // e.g. 2.5
  questionThresholdPct: number; // 60%
  studentsAttempted: number;
  studentsPassedThreshold: number;
  attainmentPercentage: number;
  internalAttainmentLevel: number; // 0, 1, 2, or 3
  externalBoardAttainmentLevel: number; // typically 3
  compositeAttainment: number; // 80% internal + 20% external or MSBTE weight
  isAttained: boolean;
  gapDeficit: number;
}

export interface ActionTakenReport {
  id: string;
  coCode: string;
  subjectCode: string;
  academicYear: string;
  targetScore: number;
  actualScore: number;
  rootCauseAnalysis: string;
  correctiveActions: string[];
  plannedRemedialHours: number;
  hodStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  hodRemarks?: string;
}

export interface AITeachingPackage {
  topic: string;
  subjectTitle: string;
  unitName: string;
  targetCO: string;
  bloomsLevel: BloomsLevel;
  lessonPlan: {
    learningObjectives: string[];
    prerequisites: string[];
    teachingStrategy: string;
    lectureRoadmapMinutes: Array<{ time: string; stage: string; content: string }>;
    checkQuestions: string[];
    summaryHomework: string;
  };
  academicNotes: {
    facultyReferenceNotes: string;
    studentStudyNotes: string;
    remedialSimplifiedNotes: string;
    onePageRevisionSheet: string;
  };
  mermaidDiagram: string;
  presentationDeck: Array<{
    slideNo: number;
    title: string;
    bullets: string[];
    speakerNotes: string;
    inSlideCheck: string;
  }>;
  activeRecall: {
    flashcards: Array<{ front: string; back: string; mnemonic?: string }>;
    vivaVoceQuestions: Array<{ q: string; a: string; cognitiveLevel: string }>;
  };
  microlearning: {
    videoScript: string;
    durationEstimate: string;
    audioReviewSummary: string;
  };
  generatedAt: string;
  provisionalWatermark: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  details: string;
  sha256Hash: string;
}
