import crypto from 'crypto';
import {
  InstitutionalLicense,
  LicenseStatus,
  PlanTier,
  SuperAdminStats,
  InstitutionProfile,
  Programme,
  SubjectMaster,
  StudentMaster,
  FacultyMaster,
  TimetableSlot,
  Assessment,
  StudentQuestionMark,
  AuditLogEntry,
  TeachingDiaryEntry,
  ActionTakenReport,
} from '../src/types';
import {
  PROGRAMMES,
  PHARMACEUTICS_SUBJECT,
  FACULTY_MEMBERS,
  INITIAL_STUDENTS,
  TODAY_TIMETABLE_SLOTS,
  INITIAL_ASSESSMENT,
  INITIAL_STUDENT_MARKS,
  INITIAL_AUDIT_LOGS,
} from './data';
import { calculateDirectCOAttainment } from './obeEngine';

export interface TenantWorkspace {
  tenantId: string;
  licenseKey: string;
  license: InstitutionalLicense;
  institution: InstitutionProfile | null;
  programmes: Programme[];
  subject: SubjectMaster | null;
  faculty: FacultyMaster[];
  students: StudentMaster[];
  timetable: TimetableSlot[];
  assessment: Assessment | null;
  studentMarks: StudentQuestionMark[];
  auditLogs: AuditLogEntry[];
  teachingDiaryEntries: TeachingDiaryEntry[];
  coAttainment: {
    coSummaries: any[];
    poAttainments: Record<string, number>;
    lowAttainmentCOs: any[];
  };
  actionTakenReports: ActionTakenReport[];
}

// Master In-Memory Stores
const licenses = new Map<string, InstitutionalLicense>();
const tenants = new Map<string, TenantWorkspace>();

// Cryptographic 16-Digit License Key Generator: FAIG-2026-XXXX-XXXX
export function generateLicenseKey(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Base32 without confusing chars (0, 1, I, O)
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FAIG-2026-${part1}-${part2}`;
}

// Initialize Initial Licenses
function seedInitialLicenses() {
  // Initial registry starts completely blank (all pre-seeded demo/mock institutions removed)
}

export function clearAllTenantsAndLicenses(): void {
  licenses.clear();
  tenants.clear();
}

// Helper to create an isolated blank workspace
export function createBlankWorkspace(tenantId: string, license: InstitutionalLicense): TenantWorkspace {
  return {
    tenantId,
    licenseKey: license.key,
    license,
    institution: null,
    programmes: [],
    subject: null,
    faculty: [],
    students: [],
    timetable: [],
    assessment: null,
    studentMarks: [],
    auditLogs: [],
    teachingDiaryEntries: [],
    coAttainment: { coSummaries: [], poAttainments: {}, lowAttainmentCOs: [] },
    actionTakenReports: [],
  };
}

// Record tenant-isolated audit log
export function recordTenantAuditLog(
  workspace: TenantWorkspace,
  actor: string,
  role: any,
  action: string,
  details: string
): AuditLogEntry {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST';
  const rawData = `${timestamp}|${workspace.tenantId}|${actor}|${action}|${details}`;
  const sha256Hash = crypto.createHash('sha256').update(rawData).digest('hex');

  const entry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    actor,
    role,
    action,
    details,
    sha256Hash,
  };

  workspace.auditLogs.unshift(entry);
  return entry;
}

// Initialize
seedInitialLicenses();

// -----------------------------------------------------------------------------
// TENANT & LICENSE RETRIEVAL / MUTATION EXPORTS
// -----------------------------------------------------------------------------

export function getLicense(key: string): InstitutionalLicense | undefined {
  if (!key) return undefined;
  const normalizedKey = key.trim().toUpperCase();
  return licenses.get(normalizedKey);
}

export function getAllLicenses(): InstitutionalLicense[] {
  const list: InstitutionalLicense[] = [];
  licenses.forEach((lic) => {
    const ws = tenants.get(lic.tenantId);
    list.push({
      ...lic,
      stats: {
        facultyCount: ws ? ws.faculty.length : 0,
        studentCount: ws ? ws.students.length : 0,
        subjectCount: ws && ws.subject ? 1 : 0,
      },
    });
  });
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getTenantWorkspace(tenantId: string): TenantWorkspace | undefined {
  return tenants.get(tenantId);
}

export function getTenantByLicenseKey(key: string): TenantWorkspace | undefined {
  const lic = getLicense(key);
  if (!lic) return undefined;
  let ws = tenants.get(lic.tenantId);
  if (!ws) {
    ws = createBlankWorkspace(lic.tenantId, lic);
    tenants.set(lic.tenantId, ws);
  }
  return ws;
}

export function createNewLicense(params: {
  collegeName: string;
  adminEmail: string;
  aisheCode?: string;
  pciCode?: string;
  dteCode?: string;
  msbteCode?: string;
  aishePciCode?: string;
  department?: string;
  facultySeatLimit: number;
  sanctionedIntake?: number;
  allowedProgrammes: string[];
  planTier: PlanTier;
  expiresAt: string;
  notes?: string;
}): InstitutionalLicense {
  const key = generateLicenseKey();
  const tenantId = `tenant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const aisheCode = params.aisheCode?.trim() || '';
  const pciCode = params.pciCode?.trim() || '';
  const dteCode = params.dteCode?.trim() || '';
  const msbteCode = params.msbteCode?.trim() || '';
  const combinedFallback = [aisheCode, pciCode, dteCode, msbteCode].filter(Boolean).join(' • ') || params.aishePciCode?.trim() || '';

  const newLicense: InstitutionalLicense = {
    id: `lic-${Date.now()}`,
    key,
    collegeName: params.collegeName.trim(),
    aisheCode,
    pciCode,
    dteCode,
    msbteCode,
    aishePciCode: combinedFallback,
    department: params.department?.trim() || 'Department of Pharmacy',
    adminEmail: params.adminEmail.trim(),
    facultySeatLimit: Math.min(10, Number(params.facultySeatLimit) || 10),
    sanctionedIntake: Number(params.sanctionedIntake) || 60,
    allowedProgrammes: params.allowedProgrammes.length > 0 ? params.allowedProgrammes : ['D.Pharm (PCI ER-2020)', 'Polytechnic (MSBTE K-Scheme)'],
    planTier: params.planTier || 'REGULATORY_STANDARD',
    status: 'ACTIVE',
    createdAt: now,
    activatedAt: now,
    expiresAt: params.expiresAt,
    notes: params.notes || '',
    tenantId,
  };

  licenses.set(key, newLicense);

  // Initialize an isolated, completely blank workspace for this tenant with institutional identity populated
  const blankWs = createBlankWorkspace(tenantId, newLicense);
  blankWs.institution = {
    id: `inst-${tenantId}`,
    name: newLicense.collegeName,
    shortName: newLicense.collegeName.substring(0, 18).toUpperCase(),
    aisheCode: newLicense.aisheCode || '',
    dteCode: newLicense.dteCode || '',
    msbteCode: newLicense.msbteCode || '',
    pciCode: newLicense.pciCode || '',
    departmentName: newLicense.department || 'Department of Pharmacy',
    affiliatedBoard: newLicense.msbteCode ? 'Maharashtra State Board of Technical Education (MSBTE)' : 'Pharmacy Council of India (PCI)',
    address: 'Maharashtra, India',
    accreditedBy: ['PCI Approved', 'MSBTE Recognized'],
    currentAcademicYear: '2025-2026',
    currentTerm: 'Odd Semester / Year 1',
  };
  tenants.set(tenantId, blankWs);

  return newLicense;
}

export function updateLicenseStatus(key: string, status: LicenseStatus): InstitutionalLicense | null {
  const lic = getLicense(key);
  if (!lic) return null;

  lic.status = status;
  licenses.set(lic.key, lic);

  const ws = tenants.get(lic.tenantId);
  if (ws) {
    ws.license.status = status;
  }

  return lic;
}

export function extendLicenseExpiry(key: string, monthsToAdd: number): InstitutionalLicense | null {
  const lic = getLicense(key);
  if (!lic) return null;

  const currentExpiry = new Date(lic.expiresAt);
  currentExpiry.setMonth(currentExpiry.getMonth() + monthsToAdd);
  lic.expiresAt = currentExpiry.toISOString();

  // If was expired, restore to active
  if (lic.status === 'EXPIRED') {
    lic.status = 'ACTIVE';
  }

  licenses.set(lic.key, lic);
  return lic;
}

export function deleteLicense(key: string): boolean {
  const lic = getLicense(key);
  if (!lic) return false;

  tenants.delete(lic.tenantId);
  licenses.delete(lic.key);
  return true;
}

// Onboarding Activation
export function activateLicense(payload: {
  licenseKey: string;
  collegeName?: string;
  aisheCode?: string;
  pciCode?: string;
  dteCode?: string;
  msbteCode?: string;
  aishePciCode?: string;
  department?: string;
  adminEmail?: string;
}): { success: boolean; error?: string; tenantId?: string; license?: InstitutionalLicense; workspace?: TenantWorkspace } {
  const { licenseKey, collegeName, aisheCode, pciCode, dteCode, msbteCode, aishePciCode, department, adminEmail } = payload;
  const lic = getLicense(licenseKey);

  if (!lic) {
    return {
      success: false,
      error: 'Invalid Institutional License Key. Please check the 16-character code or contact the Super Admin.',
    };
  }

  // Check expiration
  if (new Date(lic.expiresAt) < new Date()) {
    lic.status = 'EXPIRED';
    return {
      success: false,
      error: `Institutional License Expired on ${new Date(lic.expiresAt).toLocaleDateString()}. Please contact Super Admin for renewal.`,
    };
  }

  // Check suspension / revocation
  if (lic.status === 'SUSPENDED') {
    return {
      success: false,
      error: 'Institutional License is currently SUSPENDED by Platform Super Admin. Access locked.',
    };
  }

  if (lic.status === 'REVOKED') {
    return {
      success: false,
      error: 'Institutional License has been permanently REVOKED. Access denied.',
    };
  }

  // Activate license if pending
  const now = new Date().toISOString();
  lic.status = 'ACTIVE';
  lic.activatedAt = lic.activatedAt || now;
  lic.lastAccessedAt = now;

  if (collegeName && collegeName.trim()) {
    lic.collegeName = collegeName.trim();
  }
  if (aisheCode && aisheCode.trim()) {
    lic.aisheCode = aisheCode.trim();
  }
  if (pciCode && pciCode.trim()) {
    lic.pciCode = pciCode.trim();
  }
  if (dteCode && dteCode.trim()) {
    lic.dteCode = dteCode.trim();
  }
  if (msbteCode && msbteCode.trim()) {
    lic.msbteCode = msbteCode.trim();
  }
  if (lic.aisheCode || lic.pciCode || lic.dteCode || lic.msbteCode) {
    lic.aishePciCode = [lic.aisheCode, lic.pciCode, lic.dteCode, lic.msbteCode].filter(Boolean).join(' • ');
  } else if (aishePciCode && aishePciCode.trim()) {
    lic.aishePciCode = aishePciCode.trim();
  }

  if (department && department.trim()) {
    lic.department = department.trim();
  }
  if (adminEmail && adminEmail.trim()) {
    lic.adminEmail = adminEmail.trim();
  }

  licenses.set(lic.key, lic);

  // Retrieve or create isolated workspace
  let ws = tenants.get(lic.tenantId);
  if (!ws) {
    ws = createBlankWorkspace(lic.tenantId, lic);
    tenants.set(lic.tenantId, ws);
  }

  // If workspace institution is not set yet, populate initial identity from onboarding input
  if (!ws.institution) {
    ws.institution = {
      id: `inst-${lic.tenantId}`,
      name: lic.collegeName,
      shortName: lic.collegeName.substring(0, 15).toUpperCase(),
      aisheCode: lic.aisheCode || '',
      dteCode: lic.dteCode || '',
      msbteCode: lic.msbteCode || '',
      pciCode: lic.pciCode || '',
      departmentName: lic.department || 'Department of Pharmacy',
      affiliatedBoard: 'State Board of Technical Education (MSBTE)',
      address: '',
      accreditedBy: ['NBA Tier-II Candidate'],
      currentAcademicYear: '2025-2026',
      currentTerm: 'Odd Semester / Year 1',
    };
  } else {
    // Sync newly updated statutory codes to the institution profile
    if (lic.aisheCode) ws.institution.aisheCode = lic.aisheCode;
    if (lic.pciCode) ws.institution.pciCode = lic.pciCode;
    if (lic.dteCode) ws.institution.dteCode = lic.dteCode;
    if (lic.msbteCode) ws.institution.msbteCode = lic.msbteCode;
    if (lic.collegeName) ws.institution.name = lic.collegeName;
    if (lic.department) ws.institution.departmentName = lic.department;
  }

  recordTenantAuditLog(
    ws,
    lic.adminEmail || 'Admin',
    'INSTITUTION_ADMIN',
    'LICENSE_ACTIVATED_WORKSPACE_UNLOCKED',
    `Institutional License Key '${lic.key}' successfully validated and activated for '${lic.collegeName}'. Tenant Workspace ID: ${lic.tenantId}.`
  );

  return {
    success: true,
    tenantId: lic.tenantId,
    license: lic,
    workspace: ws,
  };
}

// Reset Tenant Database to Blank
export function resetTenantDatabase(tenantId: string): boolean {
  const ws = tenants.get(tenantId);
  if (!ws) return false;

  ws.institution = null;
  ws.programmes = [];
  ws.subject = null;
  ws.faculty = [];
  ws.students = [];
  ws.timetable = [];
  ws.assessment = null;
  ws.studentMarks = [];
  ws.auditLogs = [];
  ws.teachingDiaryEntries = [];
  ws.coAttainment = { coSummaries: [], poAttainments: {}, lowAttainmentCOs: [] };
  ws.actionTakenReports = [];

  recordTenantAuditLog(
    ws,
    'Institutional Admin',
    'INSTITUTION_ADMIN',
    'TENANT_DATABASE_PURGED_TO_BLANK',
    `All master tables, student marks, and timetable records reset to completely blank slate.`
  );

  return true;
}

// Load Sample Dataset for a specific tenant
export function loadTenantSampleDataset(tenantId: string): boolean {
  const ws = tenants.get(tenantId);
  if (!ws) return false;

  ws.programmes = [...PROGRAMMES];
  ws.subject = { ...PHARMACEUTICS_SUBJECT };
  ws.faculty = [...FACULTY_MEMBERS];
  ws.students = [...INITIAL_STUDENTS];
  ws.timetable = [...TODAY_TIMETABLE_SLOTS];
  ws.assessment = { ...INITIAL_ASSESSMENT };
  ws.studentMarks = [...INITIAL_STUDENT_MARKS];
  ws.auditLogs = [...INITIAL_AUDIT_LOGS];

  ws.coAttainment = calculateDirectCOAttainment(ws.assessment, ws.studentMarks, ws.subject, 0.60);

  recordTenantAuditLog(
    ws,
    'Institutional Admin',
    'INSTITUTION_ADMIN',
    'SAMPLE_REGULATORY_CURRICULUM_LOADED',
    `Loaded reference PCI ER-2020 & MSBTE K-Scheme dataset into isolated workspace.`
  );

  return true;
}

// Super Admin High-Level Telemetry
export function getSuperAdminStats(): SuperAdminStats {
  let totalAllocatedSeats = 0;
  let totalEnrolledStudents = 0;
  let active = 0;
  let suspended = 0;
  let revoked = 0;
  let expired = 0;
  let pending = 0;

  const now = new Date();

  licenses.forEach((lic) => {
    totalAllocatedSeats += lic.facultySeatLimit;

    if (lic.status === 'ACTIVE') {
      if (new Date(lic.expiresAt) < now) {
        expired++;
      } else {
        active++;
      }
    } else if (lic.status === 'SUSPENDED') {
      suspended++;
    } else if (lic.status === 'REVOKED') {
      revoked++;
    } else if (lic.status === 'PENDING_ACTIVATION') {
      pending++;
    } else if (lic.status === 'EXPIRED') {
      expired++;
    }
  });

  tenants.forEach((ws) => {
    totalEnrolledStudents += ws.students.length;
  });

  return {
    totalTenants: licenses.size,
    activeLicenses: active,
    suspendedLicenses: suspended,
    revokedLicenses: revoked,
    expiredLicenses: expired,
    pendingActivation: pending,
    totalAllocatedSeats,
    totalEnrolledStudents,
  };
}
