import {
  DualDateConductRecord,
  PracticalAssessmentLog,
  InstitutionalHoliday,
} from '../dateEngineTypes';

export const INITIAL_INSTITUTIONAL_HOLIDAYS: InstitutionalHoliday[] = [
  { date: '2026-08-15', title: 'Independence Day', type: 'PUBLIC_HOLIDAY' },
  { date: '2026-08-27', title: 'Ganesh Chaturthi', type: 'PUBLIC_HOLIDAY' },
  { date: '2026-10-02', title: 'Mahatma Gandhi Jayanti', type: 'PUBLIC_HOLIDAY' },
  { date: '2026-11-08', title: 'Diwali Festival Break', type: 'TERM_BREAK' },
  { date: '2027-01-26', title: 'Republic Day', type: 'PUBLIC_HOLIDAY' },
];

export const INITIAL_TEACHING_DIARY_RECORDS: DualDateConductRecord[] = [
  {
    id: 'DIARY_001',
    classId: 'FY_DPHARM',
    subjectCode: 'ER20-11T',
    topicOrExperimentTitle: 'Historical background and development of pharmacy profession in India',
    curriculumReferenceUnit: 'Unit 1: Introduction to Pharmacy',
    plannedDate: '2026-07-15',
    actualDate: '2026-07-15',
    discrepancyReason: 'Conducted as per schedule',
    chalkieDeckGenerated: true,
  },
  {
    id: 'DIARY_002',
    classId: 'FY_DPHARM',
    subjectCode: 'ER20-11T',
    topicOrExperimentTitle: 'Packaging materials: Types, selection criteria, and quality control tests',
    curriculumReferenceUnit: 'Unit 2: Packaging Materials',
    plannedDate: '2026-07-22',
    actualDate: '2026-07-24',
    discrepancyReason: 'Rescheduled due to institutional orientation assembly',
    chalkieDeckGenerated: false,
  },
  {
    id: 'DIARY_003',
    classId: 'SY_DPHARM',
    subjectCode: 'ER20-21T',
    topicOrExperimentTitle: 'General Pharmacology: Routes of administration, absorption and bioavailability',
    curriculumReferenceUnit: 'Unit 1: General Pharmacology',
    plannedDate: '2026-07-16',
    actualDate: '2026-07-16',
    discrepancyReason: 'Conducted as per schedule',
    chalkieDeckGenerated: true,
  },
];

export const INITIAL_PRACTICAL_LOGS: PracticalAssessmentLog[] = [
  {
    id: 'PRAC_001',
    batchId: 'FY_BATCH_A1',
    classId: 'FY_DPHARM',
    subjectCode: 'ER20-11P',
    studentId: 'STD_001',
    studentRollNo: '01',
    studentName: 'Aarav Patil',
    experimentNumber: 1,
    conductDate: '2026-07-18',
    evaluationDate: '2026-07-25',
    performanceScore: 9,
    vivaVoceScore: 4,
    journalScore: 5,
    totalScore: 18,
    facultySignatureStatus: 'SIGNED',
  },
  {
    id: 'PRAC_002',
    batchId: 'FY_BATCH_A1',
    classId: 'FY_DPHARM',
    subjectCode: 'ER20-11P',
    studentId: 'STD_002',
    studentRollNo: '02',
    studentName: 'Ananya Sharma',
    experimentNumber: 1,
    conductDate: '2026-07-18',
    evaluationDate: '2026-07-25',
    performanceScore: 8,
    vivaVoceScore: 4,
    journalScore: 4,
    totalScore: 16,
    facultySignatureStatus: 'SIGNED',
  },
];

export const calculateDiscrepancyTag = (plannedDate: string, actualDate: string): string => {
  if (!plannedDate || !actualDate) return 'Pending Conduct';
  if (plannedDate === actualDate) return 'Conducted On Schedule';
  return plannedDate < actualDate ? 'Conducted with Delay' : 'Conducted Ahead of Schedule';
};
