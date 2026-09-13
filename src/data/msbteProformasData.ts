import { InstitutionProfile, SubjectMaster, StudentMaster } from '../types';

export const OFFICIAL_MSBTE_CURRICULUM_SCHEME = 'MSBTE J-Scheme (PCI ER-2020 Annual Pattern)';

export const DPK_COLLEGE_IDENTITY: InstitutionProfile = {
  id: 'inst-dpk-pharmacy',
  name: 'D. P. Kharde Navjeevan College of Pharmacy',
  shortName: 'DPKCOP',
  aisheCode: 'S-22693',
  pciCode: 'PCI-2041',
  dteCode: '5539',
  msbteCode: '0182',
  departmentName: 'Department of Pharmacy',
  affiliatedBoard: 'Maharashtra State Board of Technical Education (MSBTE), Mumbai',
  accreditedBy: ['PCI Approved', 'MSBTE Recognized', 'NBA Tier-II Aligned'],
  address: 'Navjeevan Knowledge City, CIDCO, Nashik - 422008, Maharashtra',
  currentAcademicYear: '2025-2026',
  currentTerm: 'Annual Pattern (Academic Year 2025-26)',
  logoUrl: '',
};

export interface ProformaTabDefinition {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  patternYear: 'Year 1' | 'Year 2' | 'Annual Scheme';
  nature: 'Theory' | 'Practical' | 'Both' | 'Field Visit' | 'Result';
}

export const MSBTE_PROFORMA_LIST: ProformaTabDefinition[] = [
  {
    id: 'PH-1',
    code: 'PH-1',
    title: 'PH-1: Teaching Plan (TP)',
    shortTitle: 'PH-1: Teaching Plan',
    description: 'Statutory Theory Teaching Plan with Topics, Subtopics, Prescribed Hours, Planned vs Actual Execution Dates, Teaching Media, and CO Allocation.',
    patternYear: 'Annual Scheme',
    nature: 'Theory',
  },
  {
    id: 'PH-2',
    code: 'PH-2',
    title: 'PH-2: Laboratory Activity / Assignment / Field Visit Plan (LP)',
    shortTitle: 'PH-2: Lab & Visit Plan',
    description: 'Laboratory practical schedule with batch distributions (Batch B1, B2, B3), planned dates, actual performance dates, hours, and target COs.',
    patternYear: 'Annual Scheme',
    nature: 'Practical',
  },
  {
    id: 'PH-3',
    code: 'PH-3',
    title: 'PH-3: Day to Day Assessment of Laboratory Work',
    shortTitle: 'PH-3: Continuous Lab Work',
    description: '10-mark continuous rubric per experiment (Attendance/Prep 3M, Performance 4M, Viva/Journal 3M), maintained separately per sessional to derive Practical Record Maintenance marks.',
    patternYear: 'Annual Scheme',
    nature: 'Practical',
  },
  {
    id: 'PH-4_I',
    code: 'PH-4 (I)',
    title: 'PH-4 (I): Progressive Assessment of Theory – First Year',
    shortTitle: 'PH-4 (I): Theory PA Y1',
    description: 'First Year Progressive Assessment of Theory: Best-of-two sessional exams (scaled to 10M) + Continuous Mode assignments and field visit (10M) = Total 20 Marks.',
    patternYear: 'Year 1',
    nature: 'Theory',
  },
  {
    id: 'PH-4_II',
    code: 'PH-4 (II)',
    title: 'PH-4 (II): Progressive Assessment of Practical – First Year',
    shortTitle: 'PH-4 (II): Practical PA Y1',
    description: 'First Year Progressive Assessment of Practical: Sessional practical test (scaled to 10M) + PH-3 continuous practical record maintenance average (10M) = Total 20 Marks.',
    patternYear: 'Year 1',
    nature: 'Practical',
  },
  {
    id: 'PH-5_I',
    code: 'PH-5 (I)',
    title: 'PH-5 (I): Progressive Assessment of Theory – Second Year',
    shortTitle: 'PH-5 (I): Theory PA Y2',
    description: 'Second Year Progressive Assessment of Theory: Best-of-two sessional exams scaled + continuous mode assignments/case studies scaled to 20 Marks.',
    patternYear: 'Year 2',
    nature: 'Theory',
  },
  {
    id: 'PH-5_II',
    code: 'PH-5 (II)',
    title: 'PH-5 (II): Progressive Assessment of Practical – Second Year',
    shortTitle: 'PH-5 (II): Practical PA Y2',
    description: 'Second Year Progressive Assessment of Practical: Sessional practical test + PH-3 continuous laboratory work average scaled to 20 Marks.',
    patternYear: 'Year 2',
    nature: 'Practical',
  },
  {
    id: 'PH-6',
    code: 'PH-6',
    title: 'PH-6: Sessional Examination Marksheet – Theory',
    shortTitle: 'PH-6: Theory Sessional',
    description: 'Official Sessional Theory Exam Marksheet with Section A (Objective/MCQ), Section B (Short), Section C (Long), marks in figures & words, and examiner signatures.',
    patternYear: 'Annual Scheme',
    nature: 'Theory',
  },
  {
    id: 'PH-7',
    code: 'PH-7',
    title: 'PH-7: Sessional Examination Marksheet – Practical',
    shortTitle: 'PH-7: Practical Sessional',
    description: 'Official Sessional Practical Exam Marksheet with Synopsis (10M), Major Experiment (15M), Minor Experiment (5M), Viva-Voce (5M), Journal (5M) = Total 40M.',
    patternYear: 'Annual Scheme',
    nature: 'Practical',
  },
  {
    id: 'PH-8',
    code: 'PH-8',
    title: 'PH-8: Final Assessment for Practical Examination (Summer / Winter)',
    shortTitle: 'PH-8: Final Board Practical',
    description: 'Annual MSBTE Board Practical Examination Marks Award: Internal Examiner (40M) + External Examiner (40M) = 80M + Progressive Assessment (20M) = Grand Total 100 Marks.',
    patternYear: 'Annual Scheme',
    nature: 'Practical',
  },
  {
    id: 'PH-9',
    code: 'PH-9',
    title: 'PH-9: Result Analysis',
    shortTitle: 'PH-9: Result Analysis',
    description: 'Statistical performance analysis: Total Registered, Appeared, Passed, Passing %, Distinction, First Class, Second Class, Pass Class, Failed, Highest/Lowest Marks, and Action Plan.',
    patternYear: 'Annual Scheme',
    nature: 'Result',
  },
  {
    id: 'PH-10',
    code: 'PH-10',
    title: 'PH-10: Details of Field Visits',
    shortTitle: 'PH-10: Field Visits',
    description: 'Mandatory PCI ER-2020 & MSBTE Field Visit Logs: Industry/Hospital units visited, Faculty in-charge, Student roll lists, Learning objectives, Rubrics, and Student report marks.',
    patternYear: 'Annual Scheme',
    nature: 'Field Visit',
  },
  {
    id: 'PH-11',
    code: 'PH-11',
    title: 'PH-11: Assignment Marksheet',
    shortTitle: 'PH-11: Assignments',
    description: 'Continuous Assignment Evaluation Ledger: Assignment 1, Assignment 2, Assignment 3 marks, submission compliance, feedback, and student submissions record.',
    patternYear: 'Annual Scheme',
    nature: 'Theory',
  },
];

// Sample Teaching Plan Data (PH-1)
export interface PH1TeachingPlanRow {
  srNo: number;
  chapterTopic: string;
  subtopics: string;
  prescribedHours: number;
  plannedDateFrom: string;
  plannedDateTo: string;
  actualDateOfExecution: string;
  teachingMethodMedia: string;
  mappedCO: string;
  status: 'Completed' | 'In Progress';
}

export const SAMPLE_PH1_TEACHING_PLAN: PH1TeachingPlanRow[] = [
  {
    srNo: 1,
    chapterTopic: 'History of Pharmacy Profession & Pharmacopoeias',
    subtopics: 'History of pharmacy profession and education in India. Introduction to Indian Pharmacopoeia (IP), British Pharmacopoeia (BP), United States Pharmacopeia (USP), and International Pharmacopoeia.',
    prescribedHours: 10,
    plannedDateFrom: '01-Jul-2025',
    plannedDateTo: '18-Jul-2025',
    actualDateOfExecution: '01-Jul-2025 to 19-Jul-2025',
    teachingMethodMedia: 'Chalk & Board, Interactive PPT, Display of Physical Pharmacopoeias',
    mappedCO: 'CO1',
    status: 'Completed',
  },
  {
    srNo: 2,
    chapterTopic: 'Packaging Materials for Pharmaceutical Products',
    subtopics: 'Types of containers: Glass (Type I, II, III, NP), Plastics, Metals, Rubber closures. Physicochemical quality evaluation, alkalinity tests, and leak test per IP.',
    prescribedHours: 8,
    plannedDateFrom: '21-Jul-2025',
    plannedDateTo: '02-Aug-2025',
    actualDateOfExecution: '21-Jul-2025 to 04-Aug-2025',
    teachingMethodMedia: 'Demonstration of container specimens, Audio-Visual Videos',
    mappedCO: 'CO1',
    status: 'Completed',
  },
  {
    srNo: 3,
    chapterTopic: 'Pharmaceutical Aids & Preservatives',
    subtopics: 'Organoleptic additives: Coloring agents, Flavoring agents, Sweetening agents (natural & synthetic), Preservatives, and Antioxidants.',
    prescribedHours: 8,
    plannedDateFrom: '05-Aug-2025',
    plannedDateTo: '18-Aug-2025',
    actualDateOfExecution: '05-Aug-2025 to 19-Aug-2025',
    teachingMethodMedia: 'Chalk & Board, Problem Solving sessions on dosage stability',
    mappedCO: 'CO2',
    status: 'Completed',
  },
  {
    srNo: 4,
    chapterTopic: 'Unit Operations: Size Reduction & Size Separation',
    subtopics: 'Mechanisms of size reduction. Principles, construction, and operation of Hammer Mill and Ball Mill. Official sieving standards and Cyclone Separator.',
    prescribedHours: 9,
    plannedDateFrom: '20-Aug-2025',
    plannedDateTo: '03-Sep-2025',
    actualDateOfExecution: '20-Aug-2025 to 04-Sep-2025',
    teachingMethodMedia: '3D Machinery Animation Models, Animated Video Clips',
    mappedCO: 'CO2',
    status: 'Completed',
  },
  {
    srNo: 5,
    chapterTopic: 'Solid Dosage Forms: Tablet Manufacturing Technology',
    subtopics: 'Granulation techniques: Wet granulation, Dry granulation, Direct compression. Tablet compression machines (single punch & rotary multi-station). Tablet tooling (B & D tooling).',
    prescribedHours: 12,
    plannedDateFrom: '06-Sep-2025',
    plannedDateTo: '27-Sep-2025',
    actualDateOfExecution: '06-Sep-2025 to 29-Sep-2025',
    teachingMethodMedia: 'Chalk & Talk, Industrial Tooling Demonstration, Rotary cycle diagram',
    mappedCO: 'CO3',
    status: 'Completed',
  },
  {
    srNo: 6,
    chapterTopic: 'Tablet Coating & Coating Defects Troubleshooting',
    subtopics: 'Sugar coating, Film coating, Enteric coating. Tablet defects: Capping, Lamination, Mottling, Orange Peel effect, Picking, Sticking, and Blistering. Quality control tests per IP.',
    prescribedHours: 8,
    plannedDateFrom: '01-Oct-2025',
    plannedDateTo: '16-Oct-2025',
    actualDateOfExecution: '01-Oct-2025 to 18-Oct-2025',
    teachingMethodMedia: 'Defective tablet specimen inspection, Troubleshooting flowcharts',
    mappedCO: 'CO3',
    status: 'Completed',
  },
  {
    srNo: 7,
    chapterTopic: 'Liquid Oral Dosage Forms: Solutions, Suspensions & Emulsions',
    subtopics: 'Formulation, stabilization, and evaluation of Syrups, Elixirs, Suspensions (flocculated & deflocculated), and Biphasic Emulsions (Primary emulsion calculation 4:2:1).',
    prescribedHours: 10,
    plannedDateFrom: '20-Oct-2025',
    plannedDateTo: '10-Nov-2025',
    actualDateOfExecution: '22-Oct-2025 to 12-Nov-2025',
    teachingMethodMedia: 'Interactive Lab Demonstration, Formula calculation exercises',
    mappedCO: 'CO4',
    status: 'Completed',
  },
  {
    srNo: 8,
    chapterTopic: 'Sterile Formulations & Cleanroom Technology (Schedule M)',
    subtopics: 'Parenteral products: Formulation, water for injection (WFI), pyrogen testing (LAL test), Ophthalmic preparations. Cleanroom layout, HEPA filters, laminar air flow, and aseptic processing.',
    prescribedHours: 10,
    plannedDateFrom: '15-Nov-2025',
    plannedDateTo: '15-Dec-2025',
    actualDateOfExecution: '17-Nov-2025 to 18-Dec-2025',
    teachingMethodMedia: 'Virtual Cleanroom Tour, Schedule M Regulatory Guidelines PPT',
    mappedCO: 'CO5',
    status: 'Completed',
  },
];

// Sample Lab Plan Data (PH-2)
export interface PH2LabPlanRow {
  exptNo: number;
  title: string;
  batchB1Dates: { planned: string; actual: string };
  batchB2Dates: { planned: string; actual: string };
  batchB3Dates: { planned: string; actual: string };
  hours: number;
  targetCO: string;
}

export const SAMPLE_PH2_LAB_PLAN: PH2LabPlanRow[] = [
  {
    exptNo: 1,
    title: 'Preparation and evaluation of Simple Syrup IP (66.7% w/w sucrose)',
    batchB1Dates: { planned: '08-Jul-2025', actual: '08-Jul-2025' },
    batchB2Dates: { planned: '09-Jul-2025', actual: '09-Jul-2025' },
    batchB3Dates: { planned: '10-Jul-2025', actual: '10-Jul-2025' },
    hours: 3,
    targetCO: 'CO4',
  },
  {
    exptNo: 2,
    title: 'Preparation and evaluation of Piperazine Citrate Elixir IP',
    batchB1Dates: { planned: '15-Jul-2025', actual: '15-Jul-2025' },
    batchB2Dates: { planned: '16-Jul-2025', actual: '16-Jul-2025' },
    batchB3Dates: { planned: '17-Jul-2025', actual: '17-Jul-2025' },
    hours: 3,
    targetCO: 'CO4',
  },
  {
    exptNo: 3,
    title: 'Preparation and stability evaluation of Castor Oil Emulsion (Primary emulsion 4:2:1)',
    batchB1Dates: { planned: '22-Jul-2025', actual: '22-Jul-2025' },
    batchB2Dates: { planned: '23-Jul-2025', actual: '23-Jul-2025' },
    batchB3Dates: { planned: '24-Jul-2025', actual: '24-Jul-2025' },
    hours: 3,
    targetCO: 'CO4',
  },
  {
    exptNo: 4,
    title: 'Preparation and redispersibility evaluation of Calamine Lotion IP',
    batchB1Dates: { planned: '29-Jul-2025', actual: '29-Jul-2025' },
    batchB2Dates: { planned: '30-Jul-2025', actual: '30-Jul-2025' },
    batchB3Dates: { planned: '31-Jul-2025', actual: '31-Jul-2025' },
    hours: 3,
    targetCO: 'CO4',
  },
  {
    exptNo: 5,
    title: 'Preparation and evaluation of Magnesium Hydroxide Oral Suspension IP (Milk of Magnesia)',
    batchB1Dates: { planned: '05-Aug-2025', actual: '05-Aug-2025' },
    batchB2Dates: { planned: '06-Aug-2025', actual: '06-Aug-2025' },
    batchB3Dates: { planned: '07-Aug-2025', actual: '07-Aug-2025' },
    hours: 3,
    targetCO: 'CO4',
  },
  {
    exptNo: 6,
    title: 'Particle size distribution analysis of pharmaceutical powder by mechanical sieving method',
    batchB1Dates: { planned: '12-Aug-2025', actual: '12-Aug-2025' },
    batchB2Dates: { planned: '13-Aug-2025', actual: '13-Aug-2025' },
    batchB3Dates: { planned: '14-Aug-2025', actual: '14-Aug-2025' },
    hours: 3,
    targetCO: 'CO2',
  },
  {
    exptNo: 7,
    title: 'Determination of Angle of Repose, Bulk Density, Tapped Density, and Carr Index of Granules',
    batchB1Dates: { planned: '19-Aug-2025', actual: '19-Aug-2025' },
    batchB2Dates: { planned: '20-Aug-2025', actual: '20-Aug-2025' },
    batchB3Dates: { planned: '21-Aug-2025', actual: '21-Aug-2025' },
    hours: 3,
    targetCO: 'CO2',
  },
  {
    exptNo: 8,
    title: 'Preparation and compression of Paracetamol 500mg Tablets by Wet Granulation Method',
    batchB1Dates: { planned: '02-Sep-2025', actual: '02-Sep-2025' },
    batchB2Dates: { planned: '03-Sep-2025', actual: '03-Sep-2025' },
    batchB3Dates: { planned: '04-Sep-2025', actual: '04-Sep-2025' },
    hours: 3,
    targetCO: 'CO3',
  },
  {
    exptNo: 9,
    title: 'Quality control evaluation of tablets: Weight Variation test and Hardness testing per IP',
    batchB1Dates: { planned: '09-Sep-2025', actual: '09-Sep-2025' },
    batchB2Dates: { planned: '10-Sep-2025', actual: '10-Sep-2025' },
    batchB3Dates: { planned: '11-Sep-2025', actual: '11-Sep-2025' },
    hours: 3,
    targetCO: 'CO3',
  },
  {
    exptNo: 10,
    title: 'Quality control evaluation of tablets: Friability test and Disintegration time per IP',
    batchB1Dates: { planned: '16-Sep-2025', actual: '16-Sep-2025' },
    batchB2Dates: { planned: '17-Sep-2025', actual: '17-Sep-2025' },
    batchB3Dates: { planned: '18-Sep-2025', actual: '18-Sep-2025' },
    hours: 3,
    targetCO: 'CO3',
  },
  {
    exptNo: 11,
    title: 'Preparation and aseptic membrane filtration of Sulphacetamide Eye Drops IP',
    batchB1Dates: { planned: '07-Oct-2025', actual: '07-Oct-2025' },
    batchB2Dates: { planned: '08-Oct-2025', actual: '08-Oct-2025' },
    batchB3Dates: { planned: '09-Oct-2025', actual: '09-Oct-2025' },
    hours: 3,
    targetCO: 'CO5',
  },
  {
    exptNo: 12,
    title: 'Formulation and texture evaluation of Cold Cream and Vanishing Cream',
    batchB1Dates: { planned: '14-Oct-2025', actual: '14-Oct-2025' },
    batchB2Dates: { planned: '15-Oct-2025', actual: '15-Oct-2025' },
    batchB3Dates: { planned: '16-Oct-2025', actual: '16-Oct-2025' },
    hours: 3,
    targetCO: 'CO4',
  },
  {
    exptNo: 13,
    title: 'Preparation and effervescence time testing of Effervescent Granules',
    batchB1Dates: { planned: '21-Oct-2025', actual: '21-Oct-2025' },
    batchB2Dates: { planned: '22-Oct-2025', actual: '22-Oct-2025' },
    batchB3Dates: { planned: '23-Oct-2025', actual: '23-Oct-2025' },
    hours: 3,
    targetCO: 'CO2',
  },
  {
    exptNo: 14,
    title: 'Quality control alkalinity testing of glass containers (USP/IP Surface Glass Test)',
    batchB1Dates: { planned: '04-Nov-2025', actual: '04-Nov-2025' },
    batchB2Dates: { planned: '05-Nov-2025', actual: '05-Nov-2025' },
    batchB3Dates: { planned: '06-Nov-2025', actual: '06-Nov-2025' },
    hours: 3,
    targetCO: 'CO1',
  },
  {
    exptNo: 15,
    title: 'Mandatory Industrial Field Visit to Sterile Formulation & Cleanroom HVAC Facility',
    batchB1Dates: { planned: '18-Nov-2025', actual: '18-Nov-2025' },
    batchB2Dates: { planned: '18-Nov-2025', actual: '18-Nov-2025' },
    batchB3Dates: { planned: '18-Nov-2025', actual: '18-Nov-2025' },
    hours: 6,
    targetCO: 'CO5',
  },
];

// Sample Field Visit Logs (PH-10)
export interface PH10FieldVisitRecord {
  visitNo: number;
  facilityName: string;
  facilityType: 'Pharmaceutical Industry' | 'Multispeciality Hospital Pharmacy' | 'Medicinal Botanical Garden' | 'Primary Health Centre (PHC)';
  location: string;
  dateOfVisit: string;
  facultyInCharge: string[];
  participatingBatches: string;
  totalStudentsAttended: number;
  learningObjectives: string[];
  evaluationRubric: { reportMax: number; vivaMax: number; punctualityMax: number; totalMax: number };
  averageScoreScored: number;
  reportSubmissionStatus: string;
}

export const SAMPLE_PH10_FIELD_VISITS: PH10FieldVisitRecord[] = [
  {
    visitNo: 1,
    facilityName: 'Glenmark Pharmaceuticals Ltd. (Formulations Division)',
    facilityType: 'Pharmaceutical Industry',
    location: 'Plot No. 2, MIDC Malegaon, Sinnar, Nashik - 422113',
    dateOfVisit: '18-Sep-2025',
    facultyInCharge: ['Dr. Rajesh Sharma (Professor & HOD)', 'Prof. Ananya Deshmukh (Asst. Prof.)'],
    participatingBatches: 'Batch B1, B2 & B3 (Roll No. 01 to 60)',
    totalStudentsAttended: 60,
    learningObjectives: [
      'Observe automated high-speed rotary tablet compression and tooling maintenance',
      'Understand pharmaceutical blister & strip packaging operations under cGMP guidelines',
      'Study cleanroom HVAC pressure cascades (Class 100 / Grade A-D laminar air flow systems)',
      'Review Schedule M documentation and computerized quality control testing',
    ],
    evaluationRubric: { reportMax: 4, vivaMax: 3, punctualityMax: 3, totalMax: 10 },
    averageScoreScored: 8.8,
    reportSubmissionStatus: '100% Student Reports Submitted & Graded',
  },
  {
    visitNo: 2,
    facilityName: 'Navjeevan Multispeciality Hospital & Research Centre (Pharmacy Division)',
    facilityType: 'Multispeciality Hospital Pharmacy',
    location: 'CIDCO Knowledge Hub, Nashik - 422008',
    dateOfVisit: '12-Nov-2025',
    facultyInCharge: ['Prof. Vikram Patil (Asst. Prof.)', 'Dr. Sunita Mehta (Assoc. Prof.)'],
    participatingBatches: 'Batch B1, B2 & B3 (Roll No. 01 to 60)',
    totalStudentsAttended: 59,
    learningObjectives: [
      'Observe cold-chain management for vaccines and biologicals (2°C - 8°C)',
      'Study Unit-Dose Drug Distribution System (UDDS) in indoor patient wards',
      'Inspect Narcotic & Psychotropic substance storage under NDPS Act statutory register',
      'Observe clinical pharmacy dispensing and patient counseling protocols',
    ],
    evaluationRubric: { reportMax: 4, vivaMax: 3, punctualityMax: 3, totalMax: 10 },
    averageScoreScored: 9.1,
    reportSubmissionStatus: '100% Student Reports Submitted & Graded',
  },
];

// Sample Assignments (PH-11)
export interface PH11AssignmentDefinition {
  assignmentNo: number;
  topic: string;
  dateOfIssue: string;
  dateOfSubmission: string;
  maxMarks: number;
  mappedCO: string;
}

export const SAMPLE_PH11_ASSIGNMENTS: PH11AssignmentDefinition[] = [
  {
    assignmentNo: 1,
    topic: 'Comparative Evaluation of Packaging Materials (Type I, II, III Glass & Plastics) per Indian Pharmacopoeia 2022',
    dateOfIssue: '15-Jul-2025',
    dateOfSubmission: '30-Jul-2025',
    maxMarks: 10,
    mappedCO: 'CO1',
  },
  {
    assignmentNo: 2,
    topic: 'Systematic Troubleshooting of Tablet Compression Defects (Capping, Lamination, Mottling, Sticking) & Remedial Measures',
    dateOfIssue: '20-Aug-2025',
    dateOfSubmission: '05-Sep-2025',
    maxMarks: 10,
    mappedCO: 'CO3',
  },
  {
    assignmentNo: 3,
    topic: 'Sterility Testing Protocols & Aseptic Environmental Monitoring in Cleanrooms as per Schedule M Guidelines',
    dateOfIssue: '15-Oct-2025',
    dateOfSubmission: '30-Oct-2025',
    maxMarks: 10,
    mappedCO: 'CO5',
  },
];
