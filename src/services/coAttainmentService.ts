import {
  CourseOutcomeItem,
  StudentCOAttainmentScore,
  SummaryCOAttainmentReport,
} from '../coAttainmentTypes';

export const INITIAL_COURSE_OUTCOMES: CourseOutcomeItem[] = [
  {
    id: 'CO_11T_1',
    subjectCode: 'ER20-11T',
    code: 'CO1',
    statement: 'Explain the professional pharmacy landscape, codes of ethics, and national pharmacopoeias.',
    bloomsLevel: 'K2_UNDERSTAND',
    statutoryThresholdPercentage: 60,
  },
  {
    id: 'CO_11T_2',
    subjectCode: 'ER20-11T',
    code: 'CO2',
    statement: 'Formulate, compound, and package conventional solid and liquid dosage forms.',
    bloomsLevel: 'K3_APPLY',
    statutoryThresholdPercentage: 60,
  },
  {
    id: 'CO_11T_3',
    subjectCode: 'ER20-11T',
    code: 'CO3',
    statement: 'Analyze pharmaceutical unit operations including filtration, mixing, and drying processes.',
    bloomsLevel: 'K4_ANALYZE',
    statutoryThresholdPercentage: 60,
  },
  {
    id: 'CO_21T_1',
    subjectCode: 'ER20-21T',
    code: 'CO1',
    statement: 'Describe the pharmacokinetic and pharmacodynamic profiles of essential drug classes.',
    bloomsLevel: 'K2_UNDERSTAND',
    statutoryThresholdPercentage: 60,
  },
  {
    id: 'CO_21T_2',
    subjectCode: 'ER20-21T',
    code: 'CO2',
    statement: 'Correlate therapeutic applications and adverse reactions in clinical disease management.',
    bloomsLevel: 'K4_ANALYZE',
    statutoryThresholdPercentage: 60,
  },
];

export const INITIAL_STUDENT_CO_SCORES: StudentCOAttainmentScore[] = [
  {
    studentId: 'STD_001',
    studentRollNo: '01',
    studentName: 'Aarav Patil',
    attainmentPercentageByCO: {
      CO1: 78,
      CO2: 82,
      CO3: 71,
    },
    remedialRecommended: false,
  },
  {
    studentId: 'STD_002',
    studentRollNo: '02',
    studentName: 'Ananya Sharma',
    attainmentPercentageByCO: {
      CO1: 52,
      CO2: 58,
      CO3: 64,
    },
    remedialRecommended: true,
  },
  {
    studentId: 'STD_003',
    studentRollNo: '03',
    studentName: 'Rohan Kulkarni',
    attainmentPercentageByCO: {
      CO1: 85,
      CO2: 80,
      CO3: 76,
    },
    remedialRecommended: false,
  },
];

/**
 * Computes MSBTE Attainment Level:
 * Level 3: >= 70% students achieved target threshold
 * Level 2: >= 60% students achieved target threshold
 * Level 1: >= 50% students achieved target threshold
 */
export const calculateMSBTEAttainmentLevel = (percentage: number): 1 | 2 | 3 => {
  if (percentage >= 70) return 3;
  if (percentage >= 60) return 2;
  return 1;
};

/**
 * Generates an aggregated summary attainment report for a cohort subject
 */
export const generateSummaryAttainment = (
  subjectCode: string,
  academicYear: string,
  outcomes: CourseOutcomeItem[],
  scores: StudentCOAttainmentScore[]
): SummaryCOAttainmentReport => {
  const filteredCOs = outcomes.filter((c) => c.subjectCode === subjectCode);
  const total = scores.length;

  const outcomeReports = filteredCOs.map((co) => {
    const passingStudents = scores.filter((s) => {
      const mark = s.attainmentPercentageByCO[co.code] ?? 0;
      return mark >= co.statutoryThresholdPercentage;
    }).length;

    const cohortPercentage = total > 0 ? Number(((passingStudents / total) * 100).toFixed(1)) : 0;
    const level = calculateMSBTEAttainmentLevel(cohortPercentage);

    return {
      coId: co.id,
      coCode: co.code,
      statement: co.statement,
      bloomsLevel: co.bloomsLevel,
      studentsMeetingThreshold: passingStudents,
      cohortAttainmentPercentage: cohortPercentage,
      attainmentLevelAchieved: level,
    };
  });

  return {
    subjectCode,
    academicYear,
    totalCandidatesEvaluated: total,
    outcomes: outcomeReports,
  };
};
