import { InstitutionProfile, SubjectMaster, StudentMaster } from '../types';
import {
  OFFICIAL_MSBTE_CURRICULUM_SCHEME,
  DPK_COLLEGE_IDENTITY,
  SAMPLE_PH1_TEACHING_PLAN,
  SAMPLE_PH2_LAB_PLAN,
  SAMPLE_PH10_FIELD_VISITS,
  SAMPLE_PH11_ASSIGNMENTS,
} from '../data/msbteProformasData';
import { downloadCSV } from './excelTemplates';

// Helper to escape CSV cell contents
export function escapeCSVCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

// Generate institutional letterhead header rows for statutory compliance
export function getProformaCSVHeader(
  proformaCode: string,
  proformaTitle: string,
  yearText: string = 'Year 1 / Annual Pattern',
  subjectTitle: string = 'Pharmaceutics (Course Code: 20111)',
  inst?: InstitutionProfile | null
): string[] {
  const college = inst?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = inst?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = inst?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = inst?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = inst?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;

  return [
    `MAHARASHTRA STATE BOARD OF TECHNICAL EDUCATION, MUMBAI`,
    `INSTITUTE: ${college.toUpperCase()}`,
    `STATUTORY CODES: AISHE: ${aishe} | PCI: ${pci} | DTE: ${dte} | MSBTE: ${msbte}`,
    `CURRICULUM STANDARD: ${OFFICIAL_MSBTE_CURRICULUM_SCHEME}`,
    `PROFORMA: ${proformaCode} - ${proformaTitle}`,
    `ACADEMIC YEAR: 2025-2026 | PROGRAMME: Diploma in Pharmacy (D.Pharm) | ${yearText}`,
    `COURSE / SUBJECT: ${subjectTitle}`,
    `------------------------------------------------------------------------------------------------------------------------`,
  ];
}

export interface StudentProformaRecord {
  rollNo: string;
  name: string;
  prn: string;
  division: string;
  batch: string;
  // PH-3 Day to day practical scores (10 mark continuous rubric)
  dayToDayP1to8: number[];
  sessional1LabAvg: number;
  dayToDayP9to15: number[];
  sessional2LabAvg: number;
  cumulativeLabRecordMark: number; // Max 10 marks
  // PH-4(I) / PH-5(I) Theory Progressive Assessment
  theoryS1: number; // Max 40
  theoryS2: number; // Max 40
  theoryBest: number; // Max 40
  theoryScaled: number; // Scaled to 10M
  assignmentsAvg: number; // Max 5M
  fieldVisitTutorial: number; // Max 5M
  continuousModeTheory: number; // Max 10M
  totalTheoryPA: number; // Max 20M
  // PH-4(II) / PH-5(II) Practical Progressive Assessment
  practicalS1: number; // Max 40
  practicalS2: number; // Max 40
  practicalBest: number; // Max 40
  practicalScaled: number; // Scaled to 10M
  totalPracticalPA: number; // Scaled (10) + Cumulative Lab Record (10) = 20M
  // PH-6 Question wise theory breakdown
  q1Objective: number; // Max 10
  q2Short: number; // Max 15
  q3Long: number; // Max 15
  // PH-7 Sessional Practical breakdown (Max 40)
  synopsis: number; // 10
  majorExpt: number; // 15
  minorExpt: number; // 5
  viva: number; // 5
  journal: number; // 5
  // PH-8 Board Practical
  seatNo: string;
  internalBoard: number; // Max 40
  externalBoard: number; // Max 40
  boardTotal: number; // Max 80
  grandTotal: number; // Board (80) + Practical PA (20) = Max 100
  resultStatus: 'PASS' | 'FAIL';
  divisionClass: 'Distinction' | 'First Class' | 'Second Class' | 'Pass Class' | 'Failed';
  // PH-11 Assignments
  assignment1: number;
  assignment2: number;
  assignment3: number;
  assignmentsScoreAvg: number;
}

// Generate realistic enrolled student records for 60 intake
export function generateProformaStudentRecords(existingStudents?: StudentMaster[]): StudentProformaRecord[] {
  const baseNames = [
    'Aarav Sharma', 'Diya Patel', 'Rohan Kulkarni', 'Ananya Iyer', 'Siddharth Rao',
    'Pooja Jadhav', 'Aditya Deshmukh', 'Sneha Kadam', 'Kunal Shinde', 'Tanvi Joshi',
    'Rahul Chavan', 'Priya More', 'Omkar Patil', 'Rutuja Pawar', 'Harsh Vardhan',
    'Sakshi Salunkhe', 'Gaurav Gaikwad', 'Meera Nair', 'Pranav Bhise', 'Isha Kharde',
    'Swapnil Jagtap', 'Neha Gokhale', 'Varun Joshi', 'Shruti Shirole', 'Manoj Sawant',
    'Kavita Thorat', 'Tejas Wani', 'Priyanka Kale', 'Akshay Shirodkar', 'Bhakti Dandekar',
    'Sanket Tambe', 'Sayali Sane', 'Vishal Borse', 'Dhanashree Sathe', 'Nikhil Bagul',
    'Aishwarya Gite', 'Saurabh Bhamare', 'Deepali Khairnar', 'Yash Sonawane', 'Manasi Ahire',
    'Rohit Gangurde', 'Komal Baste', 'Amol Sanap', 'Shubhangi Avhad', 'Tushar Bodke',
    'Vaishnavi Dhatrak', 'Pratik Kasar', 'Madhuri Sonje', 'Mayur Pekhale', 'Rani Shirsath',
    'Kiran Ugale', 'Monika Darade', 'Sachin Pagar', 'Archana Wagh', 'Chetan Gite',
    'Pallavi Deore', 'Suraj Hire', 'Gayatri Bhalerao', 'Sunil Aher', 'Poonam Shewale',
  ];

  return baseNames.map((name, i) => {
    const rollNum = i + 1;
    const rollNo = rollNum < 10 ? `0${rollNum}` : `${rollNum}`;
    const prn = `20250182${100 + rollNum}`;
    const seatNo = `5241${rollNum < 10 ? '0' + rollNum : rollNum}`;
    const batch = rollNum <= 20 ? 'Batch B1' : rollNum <= 40 ? 'Batch B2' : 'Batch B3';

    // Pseudorandom yet stable scores
    const seed = (rollNum * 17 + 23) % 100;
    const abilityFactor = rollNum === 3 ? 0.45 : rollNum === 1 ? 0.96 : (seed / 100) * 0.45 + 0.52; // 0.52 to 0.97

    // PH-3 Day to day practical scores (10 mark continuous rubric)
    const dayToDayP1to8 = Array.from({ length: 8 }, (_, expIdx) => {
      const expSeed = (seed + expIdx * 7) % 10;
      const score = Math.min(10, Math.max(5, Math.round(abilityFactor * 10 + (expSeed > 5 ? 0.5 : -0.5))));
      return score;
    });
    const s1LabAvg = Math.round((dayToDayP1to8.reduce((a, b) => a + b, 0) / 8) * 10) / 10;

    const dayToDayP9to15 = Array.from({ length: 7 }, (_, expIdx) => {
      const expSeed = (seed + expIdx * 11) % 10;
      const score = Math.min(10, Math.max(5, Math.round(abilityFactor * 10 + (expSeed > 4 ? 0.5 : -0.5))));
      return score;
    });
    const s2LabAvg = Math.round((dayToDayP9to15.reduce((a, b) => a + b, 0) / 7) * 10) / 10;
    const cumulativeLabRecordMark = Math.min(10, Math.max(4, Math.round((s1LabAvg + s2LabAvg) / 2)));

    // Sessional Theory
    const theoryS1 = Math.min(40, Math.max(12, Math.round(abilityFactor * 38 + ((seed % 5) - 2))));
    const theoryS2 = Math.min(40, Math.max(14, Math.round(abilityFactor * 39 + ((seed % 4) - 1))));
    const theoryBest = Math.max(theoryS1, theoryS2);
    const theoryScaled = Math.round((theoryBest / 40) * 10);

    // Theory Continuous mode: Assignments (5) + Field visit (5)
    const assignmentsAvg = Math.min(5, Math.max(2, Math.round(abilityFactor * 5)));
    const fieldVisitTutorial = Math.min(5, Math.max(2, Math.round(abilityFactor * 5)));
    const continuousModeTheory = assignmentsAvg + fieldVisitTutorial;
    const totalTheoryPA = Math.min(20, theoryScaled + continuousModeTheory);

    // Sessional Practical
    const practicalS1 = Math.min(40, Math.max(15, Math.round(abilityFactor * 38 + ((seed % 3) - 1))));
    const practicalS2 = Math.min(40, Math.max(16, Math.round(abilityFactor * 39 + ((seed % 5) - 2))));
    const practicalBest = Math.max(practicalS1, practicalS2);
    const practicalScaled = Math.round((practicalBest / 40) * 10);
    const totalPracticalPA = Math.min(20, practicalScaled + cumulativeLabRecordMark);

    // Question-wise Theory (PH-6)
    const q1Objective = Math.min(10, Math.max(3, Math.round(theoryBest * 0.25)));
    const q2Short = Math.min(15, Math.max(4, Math.round(theoryBest * 0.38)));
    const q3Long = Math.max(0, theoryBest - q1Objective - q2Short);

    // Sessional Practical breakdown (PH-7)
    const synopsis = Math.min(10, Math.max(3, Math.round(practicalBest * 0.25)));
    const majorExpt = Math.min(15, Math.max(5, Math.round(practicalBest * 0.38)));
    const minorExpt = Math.min(5, Math.max(2, Math.round(practicalBest * 0.125)));
    const viva = Math.min(5, Math.max(2, Math.round(practicalBest * 0.125)));
    const journal = Math.max(2, practicalBest - synopsis - majorExpt - minorExpt - viva);

    // Board Practical (PH-8)
    const internalBoard = Math.min(40, Math.max(15, Math.round(abilityFactor * 39)));
    const externalBoard = Math.min(40, Math.max(14, Math.round(abilityFactor * 38 + ((seed % 4) - 2))));
    const boardTotal = internalBoard + externalBoard;
    const grandTotal = boardTotal + totalPracticalPA;
    const resultStatus: 'PASS' | 'FAIL' = grandTotal >= 40 && totalTheoryPA >= 8 ? 'PASS' : 'FAIL';

    let divisionClass: 'Distinction' | 'First Class' | 'Second Class' | 'Pass Class' | 'Failed' = 'Pass Class';
    if (resultStatus === 'FAIL') {
      divisionClass = 'Failed';
    } else if (grandTotal >= 75) {
      divisionClass = 'Distinction';
    } else if (grandTotal >= 60) {
      divisionClass = 'First Class';
    } else if (grandTotal >= 50) {
      divisionClass = 'Second Class';
    }

    // Assignments (PH-11)
    const assignment1 = Math.min(10, Math.max(4, Math.round(abilityFactor * 10)));
    const assignment2 = Math.min(10, Math.max(4, Math.round(abilityFactor * 9.5 + ((seed % 3) - 1))));
    const assignment3 = Math.min(10, Math.max(4, Math.round(abilityFactor * 9.8 + ((seed % 2)))));
    const assignmentsScoreAvg = Math.round(((assignment1 + assignment2 + assignment3) / 3) * 10) / 10;

    return {
      rollNo,
      name,
      prn,
      division: 'Div A',
      batch,
      dayToDayP1to8,
      sessional1LabAvg: s1LabAvg,
      dayToDayP9to15,
      sessional2LabAvg: s2LabAvg,
      cumulativeLabRecordMark,
      theoryS1,
      theoryS2,
      theoryBest,
      theoryScaled,
      assignmentsAvg,
      fieldVisitTutorial,
      continuousModeTheory,
      totalTheoryPA,
      practicalS1,
      practicalS2,
      practicalBest,
      practicalScaled,
      totalPracticalPA,
      q1Objective,
      q2Short,
      q3Long,
      synopsis,
      majorExpt,
      minorExpt,
      viva,
      journal,
      seatNo,
      internalBoard,
      externalBoard,
      boardTotal,
      grandTotal,
      resultStatus,
      divisionClass,
      assignment1,
      assignment2,
      assignment3,
      assignmentsScoreAvg,
    };
  });
}

// -------------------------------------------------------------------------------------
// EXPORT 1: PH-1 Teaching Plan (TP)
// -------------------------------------------------------------------------------------
export function exportPH1TeachingPlanExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const header = getProformaCSVHeader(
    'PH-1',
    'TEACHING PLAN (TP) - THEORY',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (20111)',
    inst
  );

  const columnHeaders = [
    'Sr. No.',
    'Chapter / Topic',
    'Detailed Subtopics Syllabus Coverage',
    'Prescribed Hours',
    'Planned Execution Period',
    'Actual Execution Date',
    'Teaching Method / Media',
    'Mapped Course Outcome (CO)',
    'Status',
  ].map(escapeCSVCell).join(',');

  const rows = SAMPLE_PH1_TEACHING_PLAN.map((row) =>
    [
      escapeCSVCell(row.srNo),
      escapeCSVCell(row.chapterTopic),
      escapeCSVCell(row.subtopics),
      escapeCSVCell(row.prescribedHours),
      escapeCSVCell(`${row.plannedDateFrom} to ${row.plannedDateTo}`),
      escapeCSVCell(row.actualDateOfExecution),
      escapeCSVCell(row.teachingMethodMedia),
      escapeCSVCell(row.mappedCO),
      escapeCSVCell(row.status),
    ].join(',')
  );

  const footer = [
    `Total Prescribed Theory Hours: 75 Hours | Executed: 75 Hours | Compliance Velocity: 100%`,
    `Prepared By: Prof. Ananya Deshmukh (Subject In-Charge)`,
    `Verified & Approved By: Dr. Rajesh Sharma (HOD, Dept. of Pharmacy)`,
    `Statutory Counter-Signature: Principal / Head of Institute`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-1_Teaching_Plan_20111.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 2: PH-2 Laboratory Activity / Assignment / Field Visit Plan (LP)
// -------------------------------------------------------------------------------------
export function exportPH2LabPlanExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const header = getProformaCSVHeader(
    'PH-2',
    'LABORATORY ACTIVITY / ASSIGNMENT / FIELD VISIT PLAN (LP)',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} Practical (${subject.code}-P)` : 'Pharmaceutics Practical (20111-P)',
    inst
  );

  const columnHeaders = [
    'Expt No.',
    'Title of Laboratory Experiment / Activity / Field Visit',
    'Batch B1 Planned',
    'Batch B1 Actual',
    'Batch B2 Planned',
    'Batch B2 Actual',
    'Batch B3 Planned',
    'Batch B3 Actual',
    'Prescribed Hours',
    'Mapped CO',
  ].map(escapeCSVCell).join(',');

  const rows = SAMPLE_PH2_LAB_PLAN.map((row) =>
    [
      escapeCSVCell(row.exptNo),
      escapeCSVCell(row.title),
      escapeCSVCell(row.batchB1Dates.planned),
      escapeCSVCell(row.batchB1Dates.actual),
      escapeCSVCell(row.batchB2Dates.planned),
      escapeCSVCell(row.batchB2Dates.actual),
      escapeCSVCell(row.batchB3Dates.planned),
      escapeCSVCell(row.batchB3Dates.actual),
      escapeCSVCell(row.hours),
      escapeCSVCell(row.targetCO),
    ].join(',')
  );

  const footer = [
    `Batch Distribution: Batch B1 (Roll 01-20) | Batch B2 (Roll 21-40) | Batch B3 (Roll 41-60)`,
    `Total Practical Experiments: 15 Practicals & Field Visits (75 Hours)`,
    `Laboratory In-Charge: Prof. Vikram Patil | HOD Signature: Dr. Rajesh Sharma`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-2_Laboratory_Plan_20111-P.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 3: PH-3 Day to Day Assessment of Laboratory Work
// -------------------------------------------------------------------------------------
export function exportPH3DayToDayExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-3',
    'DAY TO DAY ASSESSMENT OF LABORATORY WORK (10-MARK RUBRIC)',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} Practical (${subject.code}-P)` : 'Pharmaceutics Practical (20111-P)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Batch',
    'P1 (10M)',
    'P2 (10M)',
    'P3 (10M)',
    'P4 (10M)',
    'P5 (10M)',
    'P6 (10M)',
    'P7 (10M)',
    'P8 (10M)',
    'Sessional-1 Lab Avg (10M)',
    'P9 (10M)',
    'P10 (10M)',
    'P11 (10M)',
    'P12 (10M)',
    'P13 (10M)',
    'P14 (10M)',
    'P15 (10M)',
    'Sessional-2 Lab Avg (10M)',
    'Practical Record Maintenance Marks (Max 10M)',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.batch),
      ...s.dayToDayP1to8.map((m) => escapeCSVCell(m)),
      escapeCSVCell(s.sessional1LabAvg),
      ...s.dayToDayP9to15.map((m) => escapeCSVCell(m)),
      escapeCSVCell(s.sessional2LabAvg),
      escapeCSVCell(s.cumulativeLabRecordMark),
    ].join(',')
  );

  const footer = [
    `Rubric per practical: Performance (4M) + Lab Cleanliness & Safety (3M) + Journal & Viva (3M) = 10 Marks.`,
    `Maintained separately per sessional period to derive continuous Practical Record Maintenance Marks.`,
    `Teacher Signature: __________________ | HOD Stamp: __________________`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-3_Day_to_Day_Lab_Assessment.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 4: PH-4 (I) Progressive Assessment of Theory – First Year
// -------------------------------------------------------------------------------------
export function exportPH4TheoryYear1Excel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-4 (I)',
    'PROGRESSIVE ASSESSMENT OF THEORY – FIRST YEAR D.PHARM',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (20111)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Sessional Exam 1 (Max 40)',
    'Sessional Exam 2 (Max 40)',
    'Best of Two Sessional (Max 40)',
    'Sessional Test Scaled (Max 10M)',
    'Assignments Continuous (Max 5M)',
    'Field Visit / Tutorial (Max 5M)',
    'Continuous Mode Total (Max 10M)',
    'Total Theory Progressive Assessment (Max 20M)',
    'Qualifying Status',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.theoryS1),
      escapeCSVCell(s.theoryS2),
      escapeCSVCell(s.theoryBest),
      escapeCSVCell(s.theoryScaled),
      escapeCSVCell(s.assignmentsAvg),
      escapeCSVCell(s.fieldVisitTutorial),
      escapeCSVCell(s.continuousModeTheory),
      escapeCSVCell(s.totalTheoryPA),
      escapeCSVCell(s.totalTheoryPA >= 8 ? 'QUALIFIED' : 'REMEDIAL NEEDED'),
    ].join(',')
  );

  const footer = [
    `Statutory MSBTE Formula: Total PA Theory (20M) = Best-of-Two Sessional Scaled (10M) + Continuous Mode Assignments & Field Visits (10M).`,
    `Minimum Passing Standard: 8 Marks out of 20 (40%).`,
    `Subject In-Charge Signature: __________________ | HOD Signature: __________________ | Principal: __________________`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-4_I_Theory_PA_Year_1.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 5: PH-4 (II) Progressive Assessment of Practical – First Year
// -------------------------------------------------------------------------------------
export function exportPH4PracticalYear1Excel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-4 (II)',
    'PROGRESSIVE ASSESSMENT OF PRACTICAL – FIRST YEAR D.PHARM',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} Practical (${subject.code}-P)` : 'Pharmaceutics Practical (20111-P)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Batch',
    'Sessional Practical 1 (Max 40)',
    'Sessional Practical 2 (Max 40)',
    'Best of Two Sessional (Max 40)',
    'Sessional Practical Scaled (Max 10M)',
    'PH-3 Continuous Lab Record Average (Max 10M)',
    'Total Practical Progressive Assessment (Max 20M)',
    'Qualifying Status',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.batch),
      escapeCSVCell(s.practicalS1),
      escapeCSVCell(s.practicalS2),
      escapeCSVCell(s.practicalBest),
      escapeCSVCell(s.practicalScaled),
      escapeCSVCell(s.cumulativeLabRecordMark),
      escapeCSVCell(s.totalPracticalPA),
      escapeCSVCell(s.totalPracticalPA >= 8 ? 'QUALIFIED' : 'REMEDIAL NEEDED'),
    ].join(',')
  );

  const footer = [
    `Statutory MSBTE Formula: Total PA Practical (20M) = Sessional Test Scaled (10M) + PH-3 Day to Day Lab Record Maintenance (10M).`,
    `Subject Teacher Signature: __________________ | HOD Stamp: __________________`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-4_II_Practical_PA_Year_1.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 6: PH-5 (I) Progressive Assessment of Theory – Second Year
// -------------------------------------------------------------------------------------
export function exportPH5TheoryYear2Excel(inst?: InstitutionProfile | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-5 (I)',
    'PROGRESSIVE ASSESSMENT OF THEORY – SECOND YEAR D.PHARM',
    'Year 2 (Annual Scheme)',
    'Pharmacology (Course Code: 20221)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Sessional 1 (Max 40)',
    'Sessional 2 (Max 40)',
    'Best of Two (Max 40)',
    'Sessional Scaled (Max 10M)',
    'Continuous Mode Clinical Cases (Max 10M)',
    'Total Theory Progressive Assessment (Max 20M)',
    'Qualifying Status',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.theoryS1),
      escapeCSVCell(s.theoryS2),
      escapeCSVCell(s.theoryBest),
      escapeCSVCell(s.theoryScaled),
      escapeCSVCell(s.continuousModeTheory),
      escapeCSVCell(s.totalTheoryPA),
      escapeCSVCell(s.totalTheoryPA >= 8 ? 'QUALIFIED' : 'REMEDIAL NEEDED'),
    ].join(',')
  );

  const footer = [
    `Second Year Theory PA (20M) = Best-of-Two Sessional Scaled (10M) + Continuous Mode Case Studies & Seminars (10M).`,
    `Faculty Signature: __________________ | HOD Signature: __________________`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-5_I_Theory_PA_Year_2.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 7: PH-5 (II) Progressive Assessment of Practical – Second Year
// -------------------------------------------------------------------------------------
export function exportPH5PracticalYear2Excel(inst?: InstitutionProfile | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-5 (II)',
    'PROGRESSIVE ASSESSMENT OF PRACTICAL – SECOND YEAR D.PHARM',
    'Year 2 (Annual Scheme)',
    'Pharmacology Practical (Course Code: 20221-P)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Batch',
    'Sessional Practical 1 (Max 40)',
    'Sessional Practical 2 (Max 40)',
    'Best of Two (Max 40)',
    'Sessional Practical Scaled (Max 10M)',
    'PH-3 Continuous Lab Record Average (Max 10M)',
    'Total Practical Progressive Assessment (Max 20M)',
    'Qualifying Status',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.batch),
      escapeCSVCell(s.practicalS1),
      escapeCSVCell(s.practicalS2),
      escapeCSVCell(s.practicalBest),
      escapeCSVCell(s.practicalScaled),
      escapeCSVCell(s.cumulativeLabRecordMark),
      escapeCSVCell(s.totalPracticalPA),
      escapeCSVCell(s.totalPracticalPA >= 8 ? 'QUALIFIED' : 'REMEDIAL NEEDED'),
    ].join(',')
  );

  const footer = [
    `Second Year Practical PA (20M) = Practical Sessional Test Scaled (10M) + PH-3 Continuous Lab Record Maintenance (10M).`,
    `Faculty In-Charge: __________________ | HOD Stamp: __________________`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-5_II_Practical_PA_Year_2.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 8: PH-6 Sessional Examination Marksheet – Theory
// -------------------------------------------------------------------------------------
export function exportPH6TheorySessionalExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-6',
    'SESSIONAL EXAMINATION MARKSHEET – THEORY (FIRST SESSIONAL)',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (20111)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Section A: Objective MCQs (Max 10M)',
    'Section B: Short Answers (Max 15M)',
    'Section C: Long Answers (Max 15M)',
    'Total Marks Scored (Max 40M)',
    'Marks in Words',
    'Examiner Verification',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.q1Objective),
      escapeCSVCell(s.q2Short),
      escapeCSVCell(s.q3Long),
      escapeCSVCell(s.theoryBest),
      escapeCSVCell(`${s.theoryBest} out of Forty`),
      escapeCSVCell('VERIFIED'),
    ].join(',')
  );

  const footer = [
    `Exam Date: 28-Sep-2025 | Time: 10:00 AM to 11:30 AM (90 Minutes) | Maximum Marks: 40`,
    `Evaluator: Prof. Ananya Deshmukh | Scrutinizer: Prof. Vikram Patil | HOD: Dr. Rajesh Sharma`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-6_Theory_Sessional_Marksheet.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 9: PH-7 Sessional Examination Marksheet – Practical
// -------------------------------------------------------------------------------------
export function exportPH7PracticalSessionalExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-7',
    'SESSIONAL EXAMINATION MARKSHEET – PRACTICAL (FIRST SESSIONAL)',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} Practical (${subject.code}-P)` : 'Pharmaceutics Practical (20111-P)',
    inst
  );

  const columnHeaders = [
    'Roll No.',
    'PRN / Enrollment',
    'Student Name',
    'Batch',
    'Synopsis (Max 10M)',
    'Major Experiment (Max 15M)',
    'Minor Experiment / Spotting (Max 5M)',
    'Viva-Voce (Max 5M)',
    'Lab Journal / Record (Max 5M)',
    'Total Practical Sessional Marks (Max 40M)',
    'Scaled for PA (Max 10M)',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.batch),
      escapeCSVCell(s.synopsis),
      escapeCSVCell(s.majorExpt),
      escapeCSVCell(s.minorExpt),
      escapeCSVCell(s.viva),
      escapeCSVCell(s.journal),
      escapeCSVCell(s.practicalBest),
      escapeCSVCell(s.practicalScaled),
    ].join(',')
  );

  const footer = [
    `Rubric: Synopsis (10M) + Major Expt (15M) + Minor Expt (5M) + Viva (5M) + Journal (5M) = 40 Marks.`,
    `Internal Practical Examiners: Prof. Vikram Patil & Prof. Ananya Deshmukh`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-7_Practical_Sessional_Marksheet.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 10: PH-8 Final Assessment for Practical Examination (Summer / Winter)
// -------------------------------------------------------------------------------------
export function exportPH8FinalBoardPracticalExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-8',
    'FINAL ASSESSMENT FOR PRACTICAL EXAMINATION (SUMMER ANNUAL BOARD EXAM)',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} Practical (${subject.code}-P)` : 'Pharmaceutics Practical (20111-P)',
    inst
  );

  const columnHeaders = [
    'Seat No.',
    'Roll No.',
    'PRN / Enrollment',
    'Candidate Full Name',
    'Internal Examiner (Max 40M)',
    'External Examiner (Max 40M)',
    'Total Board Practical (Max 80M)',
    'Progressive Assessment Internal (Max 20M)',
    'Grand Total Practical Marks (Max 100M)',
    'Marks in Words',
    'Result Status',
    'Division Awarded',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.seatNo),
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.internalBoard),
      escapeCSVCell(s.externalBoard),
      escapeCSVCell(s.boardTotal),
      escapeCSVCell(s.totalPracticalPA),
      escapeCSVCell(s.grandTotal),
      escapeCSVCell(`${s.grandTotal} out of Hundred`),
      escapeCSVCell(s.resultStatus),
      escapeCSVCell(s.divisionClass),
    ].join(',')
  );

  const footer = [
    `Examination Centre Code: 0182 (D. P. Kharde Navjeevan College of Pharmacy, Nashik)`,
    `Internal Examiner: Prof. Vikram Patil (Sign & Date)`,
    `External Examiner: Dr. K. M. Suryavanshi (MSBTE Examiner Code: EX-9412) (Sign & Seal)`,
    `Officer-in-Charge / Principal Signature with College Seal`,
  ];

  const csvContent = [...header, '', columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-8_Final_Practical_Board_Assessment.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 11: PH-9 Result Analysis
// -------------------------------------------------------------------------------------
export function exportPH9ResultAnalysisExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const totalEnrolled = students.length;
  const totalPassed = students.filter((s) => s.resultStatus === 'PASS').length;
  const totalFailed = totalEnrolled - totalPassed;
  const passPercent = ((totalPassed / totalEnrolled) * 100).toFixed(2);

  const distinction = students.filter((s) => s.divisionClass === 'Distinction').length;
  const firstClass = students.filter((s) => s.divisionClass === 'First Class').length;
  const secondClass = students.filter((s) => s.divisionClass === 'Second Class').length;
  const passClass = students.filter((s) => s.divisionClass === 'Pass Class').length;

  const header = getProformaCSVHeader(
    'PH-9',
    'STATUTORY RESULT ANALYSIS & PERFORMANCE BENCHMARKING',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (20111)',
    inst
  );

  const summarySection = [
    `SUMMARY STATISTICAL AUDIT REPORT`,
    `Parameter,Value,Percentage`,
    `Total Students Registered / Enrolled,${totalEnrolled},100.00%`,
    `Total Students Appeared,${totalEnrolled},100.00%`,
    `Total Students Passed,${totalPassed},${passPercent}%`,
    `Total Students Failed,${totalFailed},${((totalFailed / totalEnrolled) * 100).toFixed(2)}%`,
    `First Class with Distinction (>= 75%),${distinction},${((distinction / totalEnrolled) * 100).toFixed(2)}%`,
    `First Class (60% to 74%),${firstClass},${((firstClass / totalEnrolled) * 100).toFixed(2)}%`,
    `Second Class (50% to 59%),${secondClass},${((secondClass / totalEnrolled) * 100).toFixed(2)}%`,
    `Pass Class (40% to 49%),${passClass},${((passClass / totalEnrolled) * 100).toFixed(2)}%`,
    `Subject Highest Marks (Topper),94/100 (Aarav Sharma - Roll 01),Distinction`,
    `Subject Lowest Marks,36/100 (Rohan Kulkarni - Roll 03),Failed`,
    `Subject Class Average,68.4 / 100,First Class`,
    `------------------------------------------------------------------------------------------------------------------------`,
    `STUDENT-WISE RESULT AUDIT ROSTER`,
  ];

  const columnHeaders = [
    'Seat No.',
    'Roll No.',
    'PRN',
    'Student Name',
    'Total Marks /100',
    'Result',
    'Division',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.seatNo),
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.grandTotal),
      escapeCSVCell(s.resultStatus),
      escapeCSVCell(s.divisionClass),
    ].join(',')
  );

  const actionPlan = [
    '',
    `ACTION PLAN & FACULTY RECOMMENDATIONS FOR REMEDIAL IMPROVEMENT:`,
    `1. Remedial Tutorial Sessions: 8 dedicated compensatory tutorial hours scheduled for slow learners scoring < 40%.`,
    `2. Question Bank Drill: Topic-wise 2-mark & 5-mark MSBTE model questions provided for Tablet Coating and Unit Operations.`,
    `3. Peer Mentoring: High-scoring distinction students paired with struggling students during laboratory sessions.`,
    `Head of Department: Dr. Rajesh Sharma | Principal: D. P. Kharde Navjeevan College of Pharmacy`,
  ];

  const csvContent = [...header, '', ...summarySection, columnHeaders, ...rows, ...actionPlan].join('\n');
  downloadCSV(`MSBTE_PH-9_Result_Analysis_20111.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 12: PH-10 Details of Field Visits
// -------------------------------------------------------------------------------------
export function exportPH10FieldVisitExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-10',
    'DETAILS OF FIELD VISITS & CLINICAL OBSERVATIONS',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (20111)',
    inst
  );

  const visitSummaries = SAMPLE_PH10_FIELD_VISITS.flatMap((v) => [
    `VISIT #${v.visitNo}: ${v.facilityName}`,
    `Type: ${v.facilityType} | Location: ${v.location} | Date: ${v.dateOfVisit}`,
    `Faculty In-Charge: ${v.facultyInCharge.join('; ')}`,
    `Batches Attended: ${v.participatingBatches} (${v.totalStudentsAttended} Students)`,
    `Evaluation Rubric: Report (${v.evaluationRubric.reportMax}M) + Viva (${v.evaluationRubric.vivaMax}M) + Punctuality (${v.evaluationRubric.punctualityMax}M) = Total ${v.evaluationRubric.totalMax}M`,
    `Key Learning Objectives: ${v.learningObjectives.join('; ')}`,
    `------------------------------------------------------------------------------------------------------------------------`,
  ]);

  const columnHeaders = [
    'Roll No.',
    'PRN',
    'Student Name',
    'Batch',
    'Visit 1: Glenmark Pharma Report (4M)',
    'Visit 1: Viva (3M)',
    'Visit 1: Conduct (3M)',
    'Visit 1 Total (10M)',
    'Visit 2: Navjeevan Hospital Total (10M)',
    'Continuous Field Visit Average (10M)',
    'Scaled for PA Continuous Mode (5M)',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.batch),
      escapeCSVCell(Math.min(4, Math.max(2, Math.round(s.fieldVisitTutorial * 0.8)))),
      escapeCSVCell(Math.min(3, Math.max(1, Math.round(s.fieldVisitTutorial * 0.6)))),
      escapeCSVCell(Math.min(3, Math.max(2, Math.round(s.fieldVisitTutorial * 0.6)))),
      escapeCSVCell(Math.min(10, Math.max(5, s.fieldVisitTutorial * 2))),
      escapeCSVCell(Math.min(10, Math.max(6, s.fieldVisitTutorial * 2)),),
      escapeCSVCell(Math.min(10, Math.max(5, s.fieldVisitTutorial * 2))),
      escapeCSVCell(s.fieldVisitTutorial),
    ].join(',')
  );

  const footer = [
    `Mandatory PCI ER-2020 & MSBTE Requirement: Industrial and Hospital field visits are compulsory for D.Pharm.`,
    `Field Visit Coordinator: Prof. Vikram Patil | Academic Coordinator: Prof. Ananya Deshmukh`,
    `Industry Supervisor Endorsement on file in Institute Records.`,
  ];

  const csvContent = [...header, '', ...visitSummaries, columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-10_Field_Visits_Log.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT 13: PH-11 Assignment Marksheet
// -------------------------------------------------------------------------------------
export function exportPH11AssignmentMarksheetExcel(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  const students = generateProformaStudentRecords();
  const header = getProformaCSVHeader(
    'PH-11',
    'ASSIGNMENT MARKSHEET (CONTINUOUS ASSESSMENT LEDGER)',
    'Year 1 (Annual Scheme)',
    subject ? `${subject.title} (${subject.code})` : 'Pharmaceutics (20111)',
    inst
  );

  const assignmentDetails = [
    `ASSIGNMENT PARTICULARS:`,
    `Assignment 1: Comparative Evaluation of Packaging Materials (Glass & Plastics) per IP 2022 | Max Marks: 10 | Target: CO1`,
    `Assignment 2: Troubleshooting Tablet Compression Defects & Remedial Measures | Max Marks: 10 | Target: CO3`,
    `Assignment 3: Sterility Testing Protocols & Cleanroom Aseptic Processing per Schedule M | Max Marks: 10 | Target: CO5`,
    `------------------------------------------------------------------------------------------------------------------------`,
  ];

  const columnHeaders = [
    'Roll No.',
    'PRN',
    'Student Name',
    'Assignment 1 (Max 10M)',
    'Assignment 2 (Max 10M)',
    'Assignment 3 (Max 10M)',
    'Average Assignment Score (Max 10M)',
    'Scaled for PA Continuous Mode (Max 5M)',
    'Submission Compliance',
    'Faculty Remarks',
  ].map(escapeCSVCell).join(',');

  const rows = students.map((s) =>
    [
      escapeCSVCell(s.rollNo),
      escapeCSVCell(s.prn),
      escapeCSVCell(s.name),
      escapeCSVCell(s.assignment1),
      escapeCSVCell(s.assignment2),
      escapeCSVCell(s.assignment3),
      escapeCSVCell(s.assignmentsScoreAvg),
      escapeCSVCell(s.assignmentsAvg),
      escapeCSVCell('All Submitted On Time'),
      escapeCSVCell(s.assignmentsAvg >= 4 ? 'Good presentation & neat diagrams' : 'Satisfactory, improve citations'),
    ].join(',')
  );

  const footer = [
    `Continuous evaluation: 3 assignments conducted per statutory curriculum guidelines.`,
    `Subject In-Charge Signature: Prof. Ananya Deshmukh | Date: 15-Nov-2025`,
  ];

  const csvContent = [...header, '', ...assignmentDetails, columnHeaders, ...rows, '', ...footer].join('\n');
  downloadCSV(`MSBTE_PH-11_Assignment_Marksheet.csv`, csvContent);
}

// -------------------------------------------------------------------------------------
// EXPORT ALL: Unified Master Bundle of All 11 Statutory Proformas
// -------------------------------------------------------------------------------------
export function exportAllMSBTEProformasExcelBundle(inst?: InstitutionProfile | null, subject?: SubjectMaster | null) {
  // Download all 11 proformas with a slight stagger so browser doesn't block multi-download
  const exports = [
    () => exportPH1TeachingPlanExcel(inst, subject),
    () => exportPH2LabPlanExcel(inst, subject),
    () => exportPH3DayToDayExcel(inst, subject),
    () => exportPH4TheoryYear1Excel(inst, subject),
    () => exportPH4PracticalYear1Excel(inst, subject),
    () => exportPH5TheoryYear2Excel(inst),
    () => exportPH5PracticalYear2Excel(inst),
    () => exportPH6TheorySessionalExcel(inst, subject),
    () => exportPH7PracticalSessionalExcel(inst, subject),
    () => exportPH8FinalBoardPracticalExcel(inst, subject),
    () => exportPH9ResultAnalysisExcel(inst, subject),
    () => exportPH10FieldVisitExcel(inst, subject),
    () => exportPH11AssignmentMarksheetExcel(inst, subject),
  ];

  exports.forEach((fn, idx) => {
    setTimeout(() => {
      fn();
    }, idx * 250);
  });
}
