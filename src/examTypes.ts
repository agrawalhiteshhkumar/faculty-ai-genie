export interface SessionalTestMarks {
  studentId: string;
  studentRollNo: string;
  studentName: string;
  firstSessionalScore: number;  // Max 40 (MSBTE Pharmacy Theory standard)
  secondSessionalScore: number; // Max 40
  calculatedAverage: number;    // Average of two sessionals (Max 40)
  scaledSessionalScore: number; // Converted to statutory scale (Max 20)
}

export interface ContinuousInternalAssessmentMarks {
  studentId: string;
  studentRollNo: string;
  studentName: string;
  assignmentScore: number;   // Max 5 (CIAAN-2023 Micro-Assessment)
  attendanceScore: number;   // Max 5 (Statutory 80%+ slab rule)
  practicalConductScore?: number; // Max 10 (Day-to-day practical performance)
  totalInternalScore: number; // Max 10 or 20 depending on Theory/Practical
}

export interface ConsolidatedProgressiveMarksheet {
  studentId: string;
  studentRollNo: string;
  studentName: string;
  classId: string;
  subjectCode: string;
  courseType: 'THEORY' | 'PRACTICAL';
  scaledSessionalScore: number; // Max 20
  continuousAssessmentScore: number; // Max 10 or 20
  grandTotalProgressiveScore: number; // Final Internal Assessment Mark
  lockStatus: 'DRAFT' | 'FROZEN_FOR_AUDIT';
}
