export interface DualDateConductRecord {
  id: string;
  classId: string;
  subjectCode: string;
  batchId?: string; // Optional: empty for theory, batch ID for practical
  topicOrExperimentTitle: string;
  curriculumReferenceUnit: string; // e.g., "Unit 2: Tablets", "Exp 04"
  plannedDate: string; // YYYY-MM-DD (Scheduled date)
  actualDate: string;  // YYYY-MM-DD (Conducted date, past or future)
  discrepancyReason?: string; // Auto-tagged if planned !== actual (e.g., "Extra class", "Holiday shift")
  chalkieDeckGenerated?: boolean;
}

export interface PracticalAssessmentLog {
  id: string;
  batchId: string;
  classId: string;
  subjectCode: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  experimentNumber: number;
  conductDate: string;    // Date experiment was performed
  evaluationDate: string; // Date checked/graded by faculty
  performanceScore: number; // 0-10 Marks (Rubric A)
  vivaVoceScore: number;    // 0-5 Marks (Rubric B)
  journalScore: number;     // 0-5 Marks (Rubric C)
  totalScore: number;       // Max 20 Marks (Auto-summed)
  facultySignatureStatus: 'PENDING' | 'SIGNED';
}

export interface InstitutionalHoliday {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'PUBLIC_HOLIDAY' | 'TERM_BREAK' | 'EXAM_PREP';
}
