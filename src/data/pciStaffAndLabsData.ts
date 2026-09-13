export interface StaffCredential {
  id: string;
  empCode: string;
  name: string;
  role: 'PLATFORM_SUPER_ADMIN' | 'INSTITUTION_ADMIN' | 'PRINCIPAL_DEAN' | 'HOD' | 'FACULTY' | 'LAB_ASSISTANT';
  designation: string;
  department: string;
  email: string;
  tempPassword: string;
  pciRegNo: string;
  qualification: string;
  experienceYears: number;
  assignedSubjectOrLab: string;
  contactNumber: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RELIEVED';
  joinedDate: string;
}

export interface PCILaboratory {
  id: string;
  labNumber: string;
  name: string;
  areaSqM: number;
  prescribedByPCI: boolean;
  intakeCapacity: number;
  inChargeFacultyId: string;
  inChargeFacultyName: string;
  labAssistantName: string;
  equipmentCount: number;
  operationalCount: number;
  calibrationDueCount: number;
  underMaintenanceCount: number;
  equipments: PCIEquipment[];
}

export interface PCIEquipment {
  id: string;
  assetTag: string;
  name: string;
  modelMake: string;
  deadStockPageNo: string;
  purchaseDate: string;
  purchaseCost: number;
  quantity: number;
  workingCondition: 'OPERATIONAL' | 'CALIBRATION_DUE' | 'UNDER_MAINTENANCE';
  lastCalibrationDate: string;
  nextCalibrationDue: string;
  calibrationAgency: string;
  certificateRef: string;
  remarks: string;
}

export interface MentorMenteeGroup {
  mentorId: string;
  mentorName: string;
  mentorDesignation: string;
  mentorPciRegNo: string;
  allottedStudentCount: number;
  allottedRollRange: string;
  counselingMeetingsCount: number;
  avgAttendancePercentage: number;
  remedialCasesCount: number;
  records: Array<{
    studentRoll: string;
    studentName: string;
    academicYear: 'FY' | 'SY';
    attendancePct: number;
    sessionalAvg: number;
    counselingRemarks: string;
    academicImprovementPlan: string;
    parentContactLog: string;
    status: 'Satisfactory' | 'Needs Improvement' | 'Critical Followup';
  }>;
}

export type MentorMenteeRecord = MentorMenteeGroup['records'][number];

// Hard locked institutional tenant seat allocation strictly to 10 Faculty Seats (not 30)
export const HARD_LOCKED_FACULTY_SEAT_LIMIT = 10;

// Faculty Directory initialized to a completely blank slate with exactly 0 Active Members loaded
export const DPK_STAFF_SEATS: StaffCredential[] = [];

// Standard PCI Statutory Equipment Catalog Template (Available for Optional One-Click Load)
export const STANDARD_PCI_EQUIPMENT_TEMPLATE: Record<string, PCIEquipment[]> = {
  'pci-lab-1': [
    {
      id: 'eq-101-1',
      assetTag: 'DPK-EQ-PHT-001',
      name: 'Digital Dissolution Test Apparatus (8-Station Type)',
      modelMake: 'Labindia DS-8000',
      deadStockPageNo: 'DSR/PH/Vol-2/Pg-14',
      purchaseDate: '2021-03-12',
      purchaseCost: 285000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-11-15',
      nextCalibrationDue: '2026-11-14',
      calibrationAgency: 'NABL Calibrations Pvt Ltd, Pune',
      certificateRef: 'CAL-2025-LI-940',
      remarks: 'Calibrated with USP Prednisone calibrator tablets. Passed compliance.',
    },
    {
      id: 'eq-101-2',
      assetTag: 'DPK-EQ-PHT-002',
      name: 'Digital Tablet Hardness Tester (Monsanto & Pfizer Type)',
      modelMake: 'Electrolab EH-01P',
      deadStockPageNo: 'DSR/PH/Vol-2/Pg-18',
      purchaseDate: '2020-09-08',
      purchaseCost: 65000,
      quantity: 2,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2026-01-10',
      nextCalibrationDue: '2027-01-09',
      calibrationAgency: 'Metrology Systems, Nashik',
      certificateRef: 'MET-2026-081',
      remarks: 'Load cell verified with standard brass weights.',
    },
    {
      id: 'eq-101-3',
      assetTag: 'DPK-EQ-PHT-003',
      name: 'Tablet Friability Test Apparatus (Dual Drum with Counter)',
      modelMake: 'Electrolab EF-2W',
      deadStockPageNo: 'DSR/PH/Vol-2/Pg-21',
      purchaseDate: '2019-11-20',
      purchaseCost: 48000,
      quantity: 2,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-10-22',
      nextCalibrationDue: '2026-10-21',
      calibrationAgency: 'Metrology Systems, Nashik',
      certificateRef: 'MET-2025-412',
      remarks: 'RPM checked at 25 rpm ± 1. Drum drop height 6 inches verified.',
    },
    {
      id: 'eq-101-4',
      assetTag: 'DPK-EQ-PHT-004',
      name: 'Rotary Tablet Punching Machine (8-Station Tooling)',
      modelMake: 'Karnavati Engineering Mini-Press-II',
      deadStockPageNo: 'DSR/PH/Vol-1/Pg-05',
      purchaseDate: '2018-09-15',
      purchaseCost: 450000,
      quantity: 1,
      workingCondition: 'CALIBRATION_DUE',
      lastCalibrationDate: '2025-02-10',
      nextCalibrationDue: '2026-02-10',
      calibrationAgency: 'Karnavati Services, Ahmedabad',
      certificateRef: 'KAR-SRV-2025-11',
      remarks: 'Turret inspection scheduled for upcoming weekend.',
    },
    {
      id: 'eq-101-5',
      assetTag: 'DPK-EQ-PHT-005',
      name: 'Laminar Air Flow Bench (Horizontal HEPA 99.97%)',
      modelMake: 'Thermotech Clean Air Services',
      deadStockPageNo: 'DSR/PH/Vol-2/Pg-32',
      purchaseDate: '2020-04-18',
      purchaseCost: 110000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-12-05',
      nextCalibrationDue: '2026-12-04',
      calibrationAgency: 'CleanAir Certifications, Mumbai',
      certificateRef: 'CAC-2025-LAF-31',
      remarks: 'Particle count test: Class 100 ISO 5 verified. Velocity 90 fpm.',
    },
  ],
  'pci-lab-2': [
    {
      id: 'eq-102-1',
      assetTag: 'DPK-EQ-CHM-001',
      name: 'UV-Visible Double Beam Spectrophotometer (190-1100 nm)',
      modelMake: 'Shimadzu UV-1900i',
      deadStockPageNo: 'DSR/CH/Vol-2/Pg-08',
      purchaseDate: '2021-08-14',
      purchaseCost: 490000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-09-18',
      nextCalibrationDue: '2026-09-17',
      calibrationAgency: 'Toshvin Analytical Pvt Ltd, Mumbai',
      certificateRef: 'TOS-CAL-2025-881',
      remarks: 'Holmium oxide and potassium dichromate wavelength checks compliant.',
    },
    {
      id: 'eq-102-2',
      assetTag: 'DPK-EQ-CHM-002',
      name: 'Digital Precision Analytical Balances (0.1 mg / 4-Decimal)',
      modelMake: 'Mettler Toledo ME204',
      deadStockPageNo: 'DSR/CH/Vol-1/Pg-44',
      purchaseDate: '2019-07-25',
      purchaseCost: 145000,
      quantity: 3,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-11-02',
      nextCalibrationDue: '2026-11-01',
      calibrationAgency: 'NABL Metrology Calibration Labs, Pune',
      certificateRef: 'MT-CAL-2025-502',
      remarks: 'F1 class standard weights certified. Repeatability 0.1 mg.',
    },
    {
      id: 'eq-102-3',
      assetTag: 'DPK-EQ-CHM-003',
      name: 'Digital Melting Point Apparatus with TFT Video Display',
      modelMake: 'Optics Technology VMP-II',
      deadStockPageNo: 'DSR/CH/Vol-2/Pg-19',
      purchaseDate: '2022-01-10',
      purchaseCost: 52000,
      quantity: 2,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-10-15',
      nextCalibrationDue: '2026-10-14',
      calibrationAgency: 'Optics Metrology, Ambala',
      certificateRef: 'OPT-2025-810',
      remarks: 'Calibrated with Vanillin (81-83°C) and Caffeine (238°C) standards.',
    },
  ],
  'pci-lab-3': [
    {
      id: 'eq-103-1',
      assetTag: 'DPK-EQ-COG-001',
      name: 'Binocular Research Compound Microscopes with LED Illumination',
      modelMake: 'Olympus CX21i',
      deadStockPageNo: 'DSR/COG/Vol-1/Pg-12',
      purchaseDate: '2018-10-05',
      purchaseCost: 320000,
      quantity: 15,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-08-20',
      nextCalibrationDue: '2026-08-19',
      calibrationAgency: 'Opto-Scientific Services, Mumbai',
      certificateRef: 'OSS-2025-714',
      remarks: 'Stage micrometers calibrated (100 divisions = 1 mm). Clean optics.',
    },
    {
      id: 'eq-103-2',
      assetTag: 'DPK-EQ-COG-002',
      name: 'Rotary Vacuum Flash Evaporator with Chiller',
      modelMake: 'Buchi R-100',
      deadStockPageNo: 'DSR/COG/Vol-2/Pg-04',
      purchaseDate: '2021-05-18',
      purchaseCost: 380000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-11-28',
      nextCalibrationDue: '2026-11-27',
      calibrationAgency: 'Buchi India Pvt Ltd, Mumbai',
      certificateRef: 'BUCHI-SRV-2025-90',
      remarks: 'Vacuum seal and digital water bath temperature verified.',
    },
  ],
  'pci-lab-4': [
    {
      id: 'eq-104-1',
      assetTag: 'DPK-EQ-PCL-001',
      name: 'Computer-Assisted Animal Simulator Software (Ex-Pharm Suite)',
      modelMake: 'Elsevier / CalSim Academic Multi-User Lab License',
      deadStockPageNo: 'DSR/PCL/Vol-2/Pg-01',
      purchaseDate: '2020-02-14',
      purchaseCost: 195000,
      quantity: 30,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-07-01',
      nextCalibrationDue: '2026-06-30',
      calibrationAgency: 'Elsevier Software Tech Support',
      certificateRef: 'CPCSEA-COMP-2025',
      remarks: '100% compliant with CPCSEA / PCI guidelines banning animal sacrifice.',
    },
    {
      id: 'eq-104-2',
      assetTag: 'DPK-EQ-PCL-002',
      name: 'Digital Plethysmometer for Paw Edema Measurement',
      modelMake: 'Panlab Harvard Apparatus LE7500',
      deadStockPageNo: 'DSR/PCL/Vol-1/Pg-28',
      purchaseDate: '2019-04-11',
      purchaseCost: 185000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-10-18',
      nextCalibrationDue: '2026-10-17',
      calibrationAgency: 'Panlab India Service, Pune',
      certificateRef: 'PAN-2025-PLE-09',
      remarks: 'Zero conductance sensor calibrated with 0.1% NaCl cell.',
    },
  ],
  'pci-lab-5': [
    {
      id: 'eq-105-1',
      assetTag: 'DPK-EQ-BIO-001',
      name: 'Semi-Automated Clinical Biochemistry Analyzer',
      modelMake: 'Erba Chem-5 Plus v2',
      deadStockPageNo: 'DSR/BIO/Vol-2/Pg-06',
      purchaseDate: '2021-09-02',
      purchaseCost: 175000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-12-10',
      nextCalibrationDue: '2026-12-09',
      calibrationAgency: 'Erba Diagnostics Mannheim Services',
      certificateRef: 'ERBA-CAL-2025-331',
      remarks: 'Flow cell cleaned. Multi-calibrator lipid and glucose tests passed.',
    },
    {
      id: 'eq-105-2',
      assetTag: 'DPK-EQ-BIO-002',
      name: 'Clinical Centrifuge (8-Place Digital Timer with Speed Control)',
      modelMake: 'Remi R-8C BL',
      deadStockPageNo: 'DSR/BIO/Vol-1/Pg-15',
      purchaseDate: '2019-01-20',
      purchaseCost: 36000,
      quantity: 4,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-11-19',
      nextCalibrationDue: '2026-11-18',
      calibrationAgency: 'Remi Electro Services, Nashik',
      certificateRef: 'REMI-2025-CEN-44',
      remarks: 'Stroboscopic tachometer RPM verified up to 4000 rpm.',
    },
  ],
  'pci-lab-6': [
    {
      id: 'eq-106-1',
      assetTag: 'DPK-EQ-PRC-001',
      name: 'Hospital Pharmacy UDDS (Unit Dose Dispensing) Mobile Cart',
      modelMake: 'OmniMed Hospital Care HC-40',
      deadStockPageNo: 'DSR/PRC/Vol-1/Pg-02',
      purchaseDate: '2022-04-12',
      purchaseCost: 88000,
      quantity: 2,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-06-10',
      nextCalibrationDue: '2026-06-09',
      calibrationAgency: 'OmniMed Healthcare Services',
      certificateRef: 'OMNI-2025-901',
      remarks: 'Fitted with narcotic security lock boxes and bar-code readers.',
    },
    {
      id: 'eq-106-2',
      assetTag: 'DPK-EQ-PRC-002',
      name: 'Pharmaceutical Refrigerator for Vaccines & Cold Chain (2-8°C)',
      modelMake: 'Godrej Medical Cold Chain GVR-225',
      deadStockPageNo: 'DSR/PRC/Vol-1/Pg-07',
      purchaseDate: '2021-10-18',
      purchaseCost: 95000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-11-04',
      nextCalibrationDue: '2026-11-03',
      calibrationAgency: 'Godrej Climate & Temperature Calibrations',
      certificateRef: 'GDJ-TEMP-2025-112',
      remarks: 'Digital data logger temperature mapped (2.4°C to 7.8°C range).',
    },
  ],
};

// Mandatory 6 PCI Laboratories with Clean Slate (0 Pre-Loaded Instruments)
export const DPK_PCI_LABS: PCILaboratory[] = [
  {
    id: 'pci-lab-1',
    labNumber: 'LAB-101',
    name: 'Pharmaceutics Laboratory (Including Machine Room)',
    areaSqM: 108.5,
    prescribedByPCI: true,
    intakeCapacity: 30,
    inChargeFacultyId: '',
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    operationalCount: 0,
    calibrationDueCount: 0,
    underMaintenanceCount: 0,
    equipments: [],
  },
  {
    id: 'pci-lab-2',
    labNumber: 'LAB-102',
    name: 'Pharmaceutical Chemistry Laboratory',
    areaSqM: 106.0,
    prescribedByPCI: true,
    intakeCapacity: 30,
    inChargeFacultyId: '',
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    operationalCount: 0,
    calibrationDueCount: 0,
    underMaintenanceCount: 0,
    equipments: [],
  },
  {
    id: 'pci-lab-3',
    labNumber: 'LAB-103',
    name: 'Pharmacognosy & Phytochemistry Laboratory',
    areaSqM: 105.0,
    prescribedByPCI: true,
    intakeCapacity: 30,
    inChargeFacultyId: '',
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    operationalCount: 0,
    calibrationDueCount: 0,
    underMaintenanceCount: 0,
    equipments: [],
  },
  {
    id: 'pci-lab-4',
    labNumber: 'LAB-104',
    name: 'Pharmacology Laboratory (Ex-Pharm Experimental Facility)',
    areaSqM: 105.0,
    prescribedByPCI: true,
    intakeCapacity: 30,
    inChargeFacultyId: '',
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    operationalCount: 0,
    calibrationDueCount: 0,
    underMaintenanceCount: 0,
    equipments: [],
  },
  {
    id: 'pci-lab-5',
    labNumber: 'LAB-105',
    name: 'Biochemistry & Clinical Pathology Laboratory',
    areaSqM: 78.0,
    prescribedByPCI: true,
    intakeCapacity: 20,
    inChargeFacultyId: '',
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    operationalCount: 0,
    calibrationDueCount: 0,
    underMaintenanceCount: 0,
    equipments: [],
  },
  {
    id: 'pci-lab-6',
    labNumber: 'LAB-106',
    name: 'Pharmacy Practice & Model Community Pharmacy Lab',
    areaSqM: 80.0,
    prescribedByPCI: true,
    intakeCapacity: 20,
    inChargeFacultyId: '',
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    operationalCount: 0,
    calibrationDueCount: 0,
    underMaintenanceCount: 0,
    equipments: [],
  },
];

// Mentor-Mentee Scheme Allocation (Clean Slate - Initialized to 0 Allotment Groups)
export const DPK_MENTOR_MENTEE_GROUPS: MentorMenteeGroup[] = [];
