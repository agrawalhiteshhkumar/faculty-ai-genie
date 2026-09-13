import { Assessment, StudentQuestionMark, COAttainmentSummary, SubjectMaster } from '../src/types';

/**
 * NBA OBE Direct CO Attainment Computation
 * Formulates question-level performance against 60% standard score threshold,
 * applies NBA 3-tier attainment rubrics (Level 0 to 3), and computes PO rollups.
 */
export function calculateDirectCOAttainment(
  assessment: Assessment | null,
  marks: StudentQuestionMark[],
  subject: SubjectMaster | null,
  questionThresholdRatio: number = 0.60
): {
  coSummaries: COAttainmentSummary[];
  poAttainments: Record<string, number>;
  lowAttainmentCOs: COAttainmentSummary[];
} {
  if (!assessment || !subject || !marks || marks.length === 0) {
    return { coSummaries: [], poAttainments: {}, lowAttainmentCOs: [] };
  }

  // Group questions by targetCO
  const coQuestionsMap: Record<string, Array<{ qNo: string; maxMarks: number }>> = {};
  assessment.questions.forEach((q) => {
    if (!coQuestionsMap[q.targetCO]) {
      coQuestionsMap[q.targetCO] = [];
    }
    coQuestionsMap[q.targetCO].push({ qNo: q.questionNo, maxMarks: q.maxMarks });
  });

  const coSummaries: COAttainmentSummary[] = [];

  subject.courseOutcomes.forEach((co) => {
    const questions = coQuestionsMap[co.code] || [];
    if (questions.length === 0) {
      // If CO wasn't tested in this specific paper, use established baseline
      coSummaries.push({
        coCode: co.code,
        description: co.statement,
        targetLevel: co.targetAttainmentScore,
        questionThresholdPct: questionThresholdRatio * 100,
        studentsAttempted: 0,
        studentsPassedThreshold: 0,
        attainmentPercentage: 0,
        internalAttainmentLevel: 0,
        externalBoardAttainmentLevel: 3,
        compositeAttainment: 0,
        isAttained: false,
        gapDeficit: co.targetAttainmentScore,
      });
      return;
    }

    // Evaluate each student: Did student get >= 60% in questions mapped to this CO?
    const totalStudents = marks.length;
    let studentsPassed = 0;

    marks.forEach((sm) => {
      let earnedForCO = 0;
      let maxForCO = 0;

      questions.forEach((q) => {
        earnedForCO += sm.marks[q.qNo] || 0;
        maxForCO += q.maxMarks;
      });

      const percentage = maxForCO > 0 ? (earnedForCO / maxForCO) : 0;
      if (percentage >= questionThresholdRatio) {
        studentsPassed++;
      }
    });

    const pctStudentsAchieving = totalStudents > 0 ? Math.round((studentsPassed / totalStudents) * 100) : 0;

    // NBA 3-tier rubric:
    // Level 3: >= 70% of students meet threshold
    // Level 2: 60 - 69% of students meet threshold
    // Level 1: 50 - 59% of students meet threshold
    // Level 0: < 50%
    let internalLevel = 0;
    if (pctStudentsAchieving >= 70) {
      internalLevel = 3;
    } else if (pctStudentsAchieving >= 60) {
      internalLevel = 2;
    } else if (pctStudentsAchieving >= 50) {
      internalLevel = 1;
    } else {
      internalLevel = 0;
    }

    const externalLevel = 3.0; // Benchmark board exam expectation
    // Composite: 80% internal + 20% external
    const compositeAttainment = Number(((0.8 * internalLevel) + (0.2 * externalLevel)).toFixed(2));
    const isAttained = compositeAttainment >= co.targetAttainmentScore;
    const gapDeficit = Number(Math.max(0, co.targetAttainmentScore - compositeAttainment).toFixed(2));

    coSummaries.push({
      coCode: co.code,
      description: co.statement,
      targetLevel: co.targetAttainmentScore,
      questionThresholdPct: questionThresholdRatio * 100,
      studentsAttempted: totalStudents,
      studentsPassedThreshold: studentsPassed,
      attainmentPercentage: pctStudentsAchieving,
      internalAttainmentLevel: internalLevel,
      externalBoardAttainmentLevel: externalLevel,
      compositeAttainment,
      isAttained,
      gapDeficit,
    });
  });

  // Calculate PO Rollup:
  // PO_Attainment = Sum(CO_Attainment * CO_PO_weight) / Sum(CO_PO_weight)
  const poAttainments: Record<string, number> = {};
  const coPoMatrix = subject.coPoMatrix;

  // Gather all unique PO codes from matrix
  const allPOCodes = new Set<string>();
  Object.values(coPoMatrix).forEach((coMap) => {
    Object.keys(coMap).forEach((po) => allPOCodes.add(po));
  });

  allPOCodes.forEach((poCode) => {
    let weightedSum = 0;
    let weightTotal = 0;

    coSummaries.forEach((co) => {
      const weight = coPoMatrix[co.coCode]?.[poCode] || 0;
      if (weight > 0) {
        weightedSum += co.compositeAttainment * weight;
        weightTotal += weight;
      }
    });

    poAttainments[poCode] = weightTotal > 0 ? Number((weightedSum / weightTotal).toFixed(2)) : 0;
  });

  const lowAttainmentCOs = coSummaries.filter((co) => !co.isAttained && co.studentsAttempted > 0);

  return {
    coSummaries,
    poAttainments,
    lowAttainmentCOs,
  };
}
