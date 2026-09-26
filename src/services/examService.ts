import {
  SessionalTestMarks,
  ContinuousInternalAssessmentMarks,
  ConsolidatedProgressiveMarksheet,
} from '../examTypes';

export const INITIAL_SESSIONAL_MARKS: SessionalTestMarks[] = [
  {
    studentId: 'STD_001',
    studentRollNo: '01',
    studentName: 'Aarav Patil',
    firstSessionalScore: 34,
    secondSessionalScore: 36,
    calculatedAverage: 35,
    scaledSessionalScore: 18, // 35 / 40 * 20 rounded
  },
  {
    studentId: 'STD_002',
    studentRollNo: '02',
    studentName: 'Ananya Sharma',
    firstSessionalScore: 28,
    secondSessionalScore: 32,
    calculatedAverage: 30,
    scaledSessionalScore: 15, // 30 / 40 * 20
  },
  {
    studentId: 'STD_003',
    studentRollNo: '03',
    studentName: 'Rohan Kulkarni',
    firstSessionalScore: 38,
    secondSessionalScore: 38,
    calculatedAverage: 38,
    scaledSessionalScore: 19, // 38 / 40 * 20 rounded
  },
];

export const INITIAL_INTERNAL_ASSESSMENT: ContinuousInternalAssessmentMarks[] = [
  {
    studentId: 'STD_001',
    studentRollNo: '01',
    studentName: 'Aarav Patil',
    assignmentScore: 5,
    attendanceScore: 5,
    practicalConductScore: 9,
    totalInternalScore: 19,
  },
  {
    studentId: 'STD_002',
    studentRollNo: '02',
    studentName: 'Ananya Sharma',
    assignmentScore: 4,
    attendanceScore: 4,
    practicalConductScore: 8,
    totalInternalScore: 16,
  },
  {
    studentId: 'STD_003',
    studentRollNo: '03',
    studentName: 'Rohan Kulkarni',
    assignmentScore: 5,
    attendanceScore: 5,
    practicalConductScore: 9,
    totalInternalScore: 19,
  },
];

export const calculateSessionalScales = (
  s1: number,
  s2: number
): { average: number; scaled: number } => {
  const avg = Number(((s1 + s2) / 2).toFixed(1));
  const scaled = Math.round((avg / 40) * 20);
  return { average: avg, scaled };
};

export const computeAttendanceBonusMarks = (attendancePercentage: number): number => {
  if (attendancePercentage >= 80) return 5;
  if (attendancePercentage >= 75) return 4;
  if (attendancePercentage >= 70) return 3;
  return 0;
};

export const buildConsolidatedMarksheets = (
  classId: string,
  subjectCode: string,
  sessionals: SessionalTestMarks[],
  internals: ContinuousInternalAssessmentMarks[],
  courseType: 'THEORY' | 'PRACTICAL' = 'THEORY'
): ConsolidatedProgressiveMarksheet[] => {
  return sessionals.map((s) => {
    const internalRecord = internals.find((i) => i.studentId === s.studentId);
    const continuousAssessmentScore = internalRecord ? internalRecord.totalInternalScore : 0;
    return {
      studentId: s.studentId,
      studentRollNo: s.studentRollNo,
      studentName: s.studentName,
      classId,
      subjectCode,
      courseType,
      scaledSessionalScore: s.scaledSessionalScore,
      continuousAssessmentScore,
      grandTotalProgressiveScore: s.scaledSessionalScore + continuousAssessmentScore,
      lockStatus: 'DRAFT',
    };
  });
};
