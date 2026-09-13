import {
  InstitutionProfile,
  Programme,
  SubjectMaster,
  StudentMaster,
  FacultyMaster,
  TimetableSlot,
  AttendanceRecord,
  TeachingDiaryEntry,
  Assessment,
  StudentQuestionMark,
  COAttainmentSummary,
  ActionTakenReport,
  AuditLogEntry,
  ProgramOutcome
} from '../src/types';

export const SAMPLE_INSTITUTION_TEMPLATE: InstitutionProfile = {
  id: 'inst-dpk-pharmacy',
  name: 'D. P. Kharde Navjeevan College of Pharmacy',
  shortName: 'DPKCOP',
  aisheCode: 'S-22693',
  dteCode: '5539',
  msbteCode: '0182',
  pciCode: 'PCI-2041',
  departmentName: 'Department of Pharmacy',
  affiliatedBoard: 'Maharashtra State Board of Technical Education (MSBTE), Mumbai',
  accreditedBy: ['PCI Approved', 'MSBTE Recognized', 'NBA Tier-II Aligned'],
  address: 'Navjeevan Knowledge City, CIDCO, Nashik - 422008, Maharashtra',
  currentAcademicYear: '2025-2026',
  currentTerm: 'Annual Pattern (Academic Year 2025-26)',
};

export const PROGRAMMES: Programme[] = [
  {
    id: 'prog-dpharm',
    code: 'D.PHARM',
    name: 'Diploma in Pharmacy (D.Pharm)',
    department: 'Department of Pharmacy',
    durationYears: 2,
    regulatoryBody: 'PCI',
    curriculumScheme: 'MSBTE J-Scheme (PCI ER-2020 Annual Pattern)',
  },
  {
    id: 'prog-bpharm',
    code: 'B.PHARM',
    name: 'Bachelor of Pharmacy (B.Pharm)',
    department: 'Department of Pharmaceutical Sciences',
    durationYears: 4,
    regulatoryBody: 'PCI',
    curriculumScheme: 'PCI CBCS Regulations 2014 & NBA Tier-II',
  },
];

export const PROGRAM_OUTCOMES: ProgramOutcome[] = [
  { code: 'PO1', statement: 'Pharmacy Knowledge: Apply core principles of dosage formulation, pharmacology, and drug chemistry.' },
  { code: 'PO2', statement: 'Modern Tool Usage: Utilize industrial tablet compression machines, UV spectrophotometers, and dissolution apparatus.' },
  { code: 'PO3', statement: 'Problem Analysis: Identify pharmaceutical manufacturing anomalies and formulation incompatibilities.' },
  { code: 'PO4', statement: 'Conduct Investigations: Perform quality control tests adhering strictly to Indian Pharmacopoeia standards.' },
  { code: 'PO5', statement: 'Professional Ethics: Practice pharmacy in accordance with Drugs & Cosmetics Act 1940 and Pharmacy Act 1948.' },
  { code: 'PO6', statement: 'Environment & Sustainability: Implement safe disposal of cytotoxic reagents and pharmaceutical industrial waste.' },
  { code: 'PO7', statement: 'Life-long Learning: Adapt to modern regulatory submissions, WHO-GMP, and US-FDA guidelines.' },
  { code: 'PO8', statement: 'Communication: Convey dosage regimens and patient counseling in Marathi, Hindi, and English.' },
  { code: 'PSO1', statement: 'Industrial Competence: Execute cGMP manufacturing, packaging, and validation of solid and liquid dosage forms.' },
  { code: 'PSO2', statement: 'Community Pharmacy: Manage hospital drug distribution, inventory control, and pharmacovigilance reports.' },
];

export const PHARMACEUTICS_SUBJECT: SubjectMaster = {
  id: 'sub-ph101',
  code: '20111',
  title: 'Pharmaceutics-I',
  programmeId: 'prog-dpharm',
  programmeName: 'D.Pharm (Year 1)',
  semester: 'Year 1 / Annual Scheme',
  prescribedHoursTheory: 75,
  prescribedHoursPractical: 75,
  courseOutcomes: [
    {
      id: 'co1',
      code: 'CO1',
      statement: 'Describe the history of pharmacy, pharmacopoeias (IP, BP, USP), and classify pharmaceutical dosage forms.',
      targetBlooms: 'L2_UNDERSTAND',
      targetAttainmentScore: 2.5,
    },
    {
      id: 'co2',
      code: 'CO2',
      statement: 'Formulate and evaluate conventional solid dosage forms like powders, granules, and uncoated tablets.',
      targetBlooms: 'L3_APPLY',
      targetAttainmentScore: 2.5,
    },
    {
      id: 'co3',
      code: 'CO3',
      statement: 'Analyze tablet manufacturing defects (capping, lamination, mottling, orange peel) and recommend remedial measures.',
      targetBlooms: 'L4_ANALYZE',
      targetAttainmentScore: 2.5,
    },
    {
      id: 'co4',
      code: 'CO4',
      statement: 'Evaluate liquid orals, biphasic emulsions, suspensions, and evaluate physical stability parameters.',
      targetBlooms: 'L5_EVALUATE',
      targetAttainmentScore: 2.5,
    },
    {
      id: 'co5',
      code: 'CO5',
      statement: 'Design sterile parenterals, ophthalmic preparations, and formulate aseptic cleanroom protocols per Schedule M.',
      targetBlooms: 'L6_CREATE',
      targetAttainmentScore: 2.5,
    },
  ],
  units: [
    {
      unitNumber: 1,
      title: 'Historical Background & Introduction to Dosage Forms',
      hours: 12,
      targetCO: 'CO1',
      subtopics: [
        'History of Pharmacy profession and Pharmacy Education in India',
        'Introduction to Pharmacopoeias: IP, BP, USP, and International Pharmacopoeia',
        'Packaging materials for pharmaceutical products: Glass, Plastic, Rubber, and Metals',
        'Prescription: Parts of prescription, handling, and posology calculations',
      ],
    },
    {
      unitNumber: 2,
      title: 'Solid Dosage Forms & Tablet Coating Technology',
      hours: 18,
      targetCO: 'CO3',
      subtopics: [
        'Tablet manufacturing methods: Wet granulation, Dry granulation, Direct compression',
        'Tablet tooling, rotary compression cycle, and in-process quality control',
        'Tablet Coating: Sugar coating, Film coating, and Enteric coating techniques',
        'Tablet Coating Defects: Mottling, Orange Peel effect, Capping, Lamination, Sticking, Picking, and Blistering',
        'Evaluation of tablets: Weight variation, Friability, Hardness, Disintegration, and Dissolution testing per IP',
      ],
    },
    {
      unitNumber: 3,
      title: 'Liquid Dosage Forms & Biphasic Dispersions',
      hours: 15,
      targetCO: 'CO4',
      subtopics: [
        'Monophasic liquids: Syrups, Elixirs, Linctuses, and Solutions',
        'Suspensions: Flocculated vs Deflocculated systems, wetting agents, and sedimentation volume',
        'Emulsions: Types, emulsifying agents, Bancroft rule, and identification tests',
      ],
    },
    {
      unitNumber: 4,
      title: 'Semisolid Formulations & Suppositories',
      hours: 14,
      targetCO: 'CO2',
      subtopics: [
        'Ointments, Creams, Gels, and Pastes: Base selection and preparation',
        'Suppositories and Pessaries: Types of bases, displacement value calculations',
      ],
    },
    {
      unitNumber: 5,
      title: 'Sterile Formulations & Cleanroom Engineering',
      hours: 16,
      targetCO: 'CO5',
      subtopics: [
        'Parenteral products: Water for Injection (WFI), pyrogen testing, and sterilization methods',
        'Aseptic manufacturing suite, laminar airflow benches, HEPA filters, and cleanroom air classifications',
        'Ophthalmic solutions, contact lens fluids, and tonicity adjustments',
      ],
    },
  ],
  coPoMatrix: {
    CO1: { PO1: 3, PO2: 1, PO3: 2, PO4: 1, PO5: 2, PO6: 1, PO7: 2, PO8: 3, PSO1: 2, PSO2: 2 },
    CO2: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 2, PO7: 2, PO8: 1, PSO1: 3, PSO2: 2 },
    CO3: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 2, PO7: 3, PO8: 2, PSO1: 3, PSO2: 1 },
    CO4: { PO1: 3, PO2: 2, PO3: 3, PO4: 3, PO5: 1, PO6: 2, PO7: 2, PO8: 2, PSO1: 3, PSO2: 2 },
    CO5: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 3, PO6: 3, PO7: 3, PO8: 2, PSO1: 3, PSO2: 3 },
  },
};

export const FACULTY_MEMBERS: FacultyMaster[] = [];

export const INITIAL_STUDENTS: StudentMaster[] = [];

export const TODAY_TIMETABLE_SLOTS: TimetableSlot[] = [];

export const INITIAL_ASSESSMENT: Assessment = {
  id: 'assess-sessional-1',
  subjectCode: '20111',
  title: 'First Sessional Examination (MSBTE CIAAN-2023 Aligned)',
  type: 'SESSIONAL_1',
  date: '2025-08-28',
  totalMarks: 30,
  isLocked: false,
  questions: [
    { questionNo: 'Q1a', subPart: 'Unit 1 Introduction', text: 'Define Pharmacopoeia and outline the history of Indian Pharmacopoeia editions.', targetCO: 'CO1', bloomsLevel: 'L2_UNDERSTAND', maxMarks: 5 },
    { questionNo: 'Q1b', subPart: 'Unit 1 Posology', text: 'Calculate dose for a 6-year-old child if adult dose is 500mg using Young and Dilling formulas.', targetCO: 'CO1', bloomsLevel: 'L3_APPLY', maxMarks: 5 },
    { questionNo: 'Q2a', subPart: 'Unit 2 Granulation', text: 'Contrast wet granulation versus direct compression technology for thermolabile drugs.', targetCO: 'CO2', bloomsLevel: 'L3_APPLY', maxMarks: 5 },
    { questionNo: 'Q2b', subPart: 'Unit 2 QC Testing', text: 'Explain the working principle and IP acceptance criteria of the Roche Friabilator.', targetCO: 'CO2', bloomsLevel: 'L3_APPLY', maxMarks: 5 },
    { questionNo: 'Q3a', subPart: 'Unit 2 Coating Defects', text: 'Analyze causes and remedies for tablet coating defects: Orange Peel effect and Mottling.', targetCO: 'CO3', bloomsLevel: 'L4_ANALYZE', maxMarks: 5 },
    { questionNo: 'Q3b', subPart: 'Unit 2 Tooling Defects', text: 'Examine machine-induced capping and lamination during rotary tablet compression.', targetCO: 'CO3', bloomsLevel: 'L4_ANALYZE', maxMarks: 5 },
  ],
  scrutinyStatus: {
    status: 'PASSED',
    lotsHotsRatio: 'LOTS (L1-L2): 33% | HOTS (L3-L4): 67% (Optimal NBA & Bloom Balance)',
    coCoverageScore: 98,
    scrutinyReport: 'Scrutiny Committee Verdict: Verified by HOD. Zero question ambiguity, precise mark arithmetic (30 marks total), rigorous compliance with MSBTE CIAAN-2023 guidelines.',
  },
};

export const INITIAL_STUDENT_MARKS: StudentQuestionMark[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];
