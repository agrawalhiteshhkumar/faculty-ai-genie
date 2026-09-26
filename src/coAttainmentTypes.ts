export type BloomsTaxonomyLevel =
  | 'K1_REMEMBER'
  | 'K2_UNDERSTAND'
  | 'K3_APPLY'
  | 'K4_ANALYZE'
  | 'K5_EVALUATE'
  | 'K6_CREATE';

export interface CourseOutcomeItem {
  id: string; // e.g., "CO1", "CO2"
  subjectCode: string;
  code: string;
  statement: string;
  bloomsLevel: BloomsTaxonomyLevel;
  statutoryThresholdPercentage: number; // MSBTE default is typically 60%
}

export interface StudentCOAttainmentScore {
  studentId: string;
  studentRollNo: string;
  studentName: string;
  attainmentPercentageByCO: Record<string, number>; // e.g., { CO1: 75, CO2: 52 }
  remedialRecommended: boolean;
}

export interface SummaryCOAttainmentReport {
  subjectCode: string;
  academicYear: string;
  totalCandidatesEvaluated: number;
  outcomes: {
    coId: string;
    coCode: string;
    statement: string;
    bloomsLevel: BloomsTaxonomyLevel;
    studentsMeetingThreshold: number;
    cohortAttainmentPercentage: number;
    attainmentLevelAchieved: 1 | 2 | 3; // MSBTE Rubric Level: 3 (>=70%), 2 (>=60%), 1 (>=50%)
  }[];
}
