export interface AcademicClassCohort {
  id: string;
  name: string;
  code: string;
  program: 'D_PHARM' | 'B_PHARM';
  academicYear: string;
  termPattern: 'ANNUAL' | 'SEMESTER';
  intakeCapacity: number;
}

export interface PracticalBatchDivision {
  id: string;
  classId: string;
  batchName: string;
  rollNumberRange: string;
  assignedLabTeacherId: string;
  assignedLabTeacherName: string;
}

export interface FacultyWorkloadAllocation {
  id: string;
  facultyId: string;
  facultyName: string;
  designation: string;
  classId: string;
  subjectCode: string;
  subjectTitle: string;
  weeklyTheoryHours: number;
  weeklyPracticalHours: number;
  totalWorkloadQuota: number;
}

export interface CohortCurricularMatrix {
  classes: AcademicClassCohort[];
  batches: PracticalBatchDivision[];
  workloadAllocations: FacultyWorkloadAllocation[];
}
