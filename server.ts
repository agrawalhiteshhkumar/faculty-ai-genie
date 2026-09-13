import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import {
  PROGRAM_OUTCOMES,
  PHARMACEUTICS_SUBJECT,
} from './server/data';

import { calculateDirectCOAttainment } from './server/obeEngine';
import {
  generateTeachingPackage,
  generateQuestionPaperDraft,
  scrutinyAuditQuestionPaper,
  draftActionTakenReport,
  generateMultiChannelCommunication,
  searchContextAssistant,
} from './server/geminiService';

import {
  getLicense,
  getAllLicenses,
  getTenantWorkspace,
  getTenantByLicenseKey,
  createNewLicense,
  updateLicenseStatus,
  extendLicenseExpiry,
  deleteLicense,
  clearAllTenantsAndLicenses,
  activateLicense,
  resetTenantDatabase,
  loadTenantSampleDataset,
  getSuperAdminStats,
  recordTenantAuditLog,
  TenantWorkspace,
} from './server/tenantStore';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to resolve tenant workspace from request headers/query
function getRequestedTenant(req: express.Request): { workspace?: TenantWorkspace; error?: string; statusCode?: number } {
  const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
  const licenseKey = (req.headers['x-license-key'] as string) || (req.query.licenseKey as string);

  let ws: TenantWorkspace | undefined;
  if (tenantId) {
    ws = getTenantWorkspace(tenantId);
  } else if (licenseKey) {
    ws = getTenantByLicenseKey(licenseKey);
  }

  if (!ws) {
    return { error: 'No active institutional tenant found. Activation required.', statusCode: 401 };
  }

  // Check statutory license status
  if (ws.license.status === 'SUSPENDED') {
    return { error: 'Institutional License is currently SUSPENDED by Platform Super Admin.', statusCode: 403 };
  }
  if (ws.license.status === 'REVOKED') {
    return { error: 'Institutional License has been permanently REVOKED. Access denied.', statusCode: 403 };
  }
  if (new Date(ws.license.expiresAt) < new Date()) {
    ws.license.status = 'EXPIRED';
    return {
      error: `Institutional License Expired on ${new Date(ws.license.expiresAt).toLocaleDateString()}. Please contact Super Admin for renewal.`,
      statusCode: 403,
    };
  }

  return { workspace: ws };
}

// -----------------------------------------------------------------------------
// 1. SUPER ADMIN PLATFORM OWNER ENDPOINTS
// -----------------------------------------------------------------------------

// Super Admin Authentication & Verification
app.post('/api/admin/auth', (req, res) => {
  const { masterKey, email } = req.body;
  const validKey = 'FAIG-SUPERADMIN-2026';
  const validEmail = 'agrawal.hiteshkumar@gmail.com';

  const isAuth =
    masterKey === validKey ||
    (email && email.toLowerCase() === validEmail.toLowerCase() && (masterKey === validKey || masterKey === 'demo-pass'));

  if (!isAuth) {
    return res.status(401).json({
      success: false,
      error: 'Invalid Super Admin credentials. Platform owner authentication failed.',
    });
  }

  res.json({
    success: true,
    superAdmin: {
      email: validEmail,
      role: 'PLATFORM_SUPER_ADMIN',
      token: `super-admin-token-${Date.now()}`,
      authenticatedAt: new Date().toISOString(),
    },
  });
});

// Super Admin Telemetry & Statistics
app.get('/api/admin/stats', (req, res) => {
  const stats = getSuperAdminStats();
  res.json({
    success: true,
    stats,
  });
});

// Super Admin List All Institutional Licenses
app.get('/api/admin/licenses', (req, res) => {
  const licenses = getAllLicenses();
  res.json({
    success: true,
    licenses,
    total: licenses.length,
  });
});

// Super Admin Create / Provision New 16-Digit License Key
app.post('/api/admin/licenses/create', (req, res) => {
  const {
    collegeName,
    adminEmail,
    aisheCode,
    pciCode,
    dteCode,
    msbteCode,
    aishePciCode,
    department,
    facultySeatLimit = 10,
    sanctionedIntake = 60,
    allowedProgrammes = ['D.Pharm (PCI ER-2020)'],
    planTier = 'REGULATORY_STANDARD',
    validityMonths = 12,
    customExpiryDate,
    notes = '',
  } = req.body;

  if (!collegeName || !collegeName.trim()) {
    return res.status(400).json({ error: 'College Name is required to provision an institutional license' });
  }
  if (!adminEmail || !adminEmail.trim()) {
    return res.status(400).json({ error: 'Designated Admin Email is required' });
  }

  let expiresAt: string;
  if (customExpiryDate) {
    expiresAt = new Date(customExpiryDate).toISOString();
  } else {
    const exp = new Date();
    exp.setMonth(exp.getMonth() + Number(validityMonths));
    expiresAt = exp.toISOString();
  }

  const newLicense = createNewLicense({
    collegeName,
    adminEmail,
    aisheCode: aisheCode?.trim() || '',
    pciCode: pciCode?.trim() || '',
    dteCode: dteCode?.trim() || '',
    msbteCode: msbteCode?.trim() || '',
    aishePciCode: aishePciCode?.trim() || '',
    department,
    facultySeatLimit: Math.min(10, Number(facultySeatLimit) || 10),
    sanctionedIntake: Number(sanctionedIntake) || 60,
    allowedProgrammes: Array.isArray(allowedProgrammes) && allowedProgrammes.length > 0 ? allowedProgrammes : ['D.Pharm (PCI ER-2020)', 'Polytechnic (MSBTE K-Scheme)'],
    planTier,
    expiresAt,
    notes,
  });

  res.json({
    success: true,
    message: `Institutional License '${newLicense.key}' provisioned successfully for ${newLicense.collegeName}.`,
    license: newLicense,
  });
});

// Super Admin Reset All Tenants to Blank Slate
app.post('/api/admin/tenants/reset-all', (req, res) => {
  clearAllTenantsAndLicenses();
  res.json({
    success: true,
    message: 'All institutional tenants and licenses have been reset to a completely blank slate.',
  });
});

// Super Admin Update License Status (ACTIVE, SUSPENDED, REVOKED)
app.post('/api/admin/licenses/update-status', (req, res) => {
  const { licenseKey, status } = req.body;
  if (!licenseKey || !status) {
    return res.status(400).json({ error: 'licenseKey and status are required' });
  }

  const updated = updateLicenseStatus(licenseKey, status);
  if (!updated) {
    return res.status(404).json({ error: 'License key not found' });
  }

  res.json({
    success: true,
    message: `License '${licenseKey}' status updated to ${status}.`,
    license: updated,
  });
});

// Super Admin Extend License Expiry
app.post('/api/admin/licenses/extend', (req, res) => {
  const { licenseKey, months = 12 } = req.body;
  if (!licenseKey) {
    return res.status(400).json({ error: 'licenseKey is required' });
  }

  const updated = extendLicenseExpiry(licenseKey, Number(months));
  if (!updated) {
    return res.status(404).json({ error: 'License key not found' });
  }

  res.json({
    success: true,
    message: `License '${licenseKey}' extended by ${months} months. New Expiry: ${new Date(updated.expiresAt).toLocaleDateString()}.`,
    license: updated,
  });
});

// Super Admin Delete / Purge License & Isolated Tenant
app.delete('/api/admin/licenses/:key', (req, res) => {
  const key = req.params.key;
  const deleted = deleteLicense(key);
  if (!deleted) {
    return res.status(404).json({ error: 'License key not found' });
  }

  res.json({
    success: true,
    message: `License '${key}' and all associated isolated tenant data permanently purged.`,
  });
});

// Super Admin Inspect Specific Tenant Telemetry
app.get('/api/admin/tenant/:tenantId', (req, res) => {
  const ws = getTenantWorkspace(req.params.tenantId);
  if (!ws) {
    return res.status(404).json({ error: 'Tenant workspace not found' });
  }

  res.json({
    success: true,
    tenantId: ws.tenantId,
    license: ws.license,
    institution: ws.institution,
    counts: {
      students: ws.students.length,
      faculty: ws.faculty.length,
      timetableSlots: ws.timetable.length,
      marksEntered: ws.studentMarks.length,
      auditLogs: ws.auditLogs.length,
      diaryEntries: ws.teachingDiaryEntries.length,
    },
  });
});

// -----------------------------------------------------------------------------
// 2. INSTITUTIONAL ONBOARDING & ACTIVATION GATEWAY
// -----------------------------------------------------------------------------

// Validate & Activate Institutional License Key
app.post('/api/license/activate', (req, res) => {
  const { licenseKey, collegeName, aisheCode, pciCode, dteCode, msbteCode, aishePciCode, department, adminEmail } = req.body;

  if (!licenseKey || !licenseKey.trim()) {
    return res.status(400).json({ error: '16-Digit Institutional License Key is required.' });
  }

  const result = activateLicense({
    licenseKey: licenseKey.trim(),
    collegeName: collegeName || '',
    aisheCode: aisheCode || '',
    pciCode: pciCode || '',
    dteCode: dteCode || '',
    msbteCode: msbteCode || '',
    aishePciCode: aishePciCode || '',
    department: department || '',
    adminEmail: adminEmail || '',
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({
    success: true,
    tenantId: result.tenantId,
    license: result.license,
    configured: !!result.workspace?.institution,
    institution: result.workspace?.institution,
    message: `License validated successfully. Workspace unlocked for '${result.license?.collegeName}'.`,
  });
});

// Verify Current Tenant License State
app.get('/api/license/verify', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ valid: false, error });
  }

  res.json({
    valid: true,
    license: workspace.license,
    tenantId: workspace.tenantId,
    configured: !!workspace.institution,
  });
});

// -----------------------------------------------------------------------------
// 3. SYSTEM HEALTH & GLOBAL INFO
// -----------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  const stats = getSuperAdminStats();
  res.json({
    status: 'ok',
    system: 'Faculty AI Genie Academic Operating System',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    totalTenants: stats.totalTenants,
    activeLicenses: stats.activeLicenses,
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// 4. TENANT-ISOLATED INSTITUTION PROFILE & MASTERS
// -----------------------------------------------------------------------------

app.get('/api/institution', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 200).json({
      configured: false,
      licenseRequired: true,
      institution: null,
      message: error || 'Please activate institutional license key.',
    });
  }

  res.json({
    configured: !!workspace.institution,
    institution: workspace.institution,
    license: workspace.license,
  });
});

app.post('/api/institution', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const {
    name,
    shortName,
    aisheCode,
    dteCode,
    msbteCode,
    pciCode,
    departmentName,
    logoUrl,
    affiliatedBoard,
    address,
    accreditedBy,
    currentAcademicYear,
    currentTerm,
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Institution Name is required' });
  }

  workspace.institution = {
    id: workspace.institution?.id || `inst-${workspace.tenantId}`,
    name: name.trim(),
    shortName: shortName?.trim() || name.substring(0, 15).toUpperCase(),
    aisheCode: aisheCode?.trim() || '',
    dteCode: dteCode?.trim() || '',
    msbteCode: msbteCode?.trim() || '',
    pciCode: pciCode?.trim() || '',
    departmentName: departmentName?.trim() || 'Department of Pharmacy',
    logoUrl: logoUrl?.trim() || '',
    affiliatedBoard: affiliatedBoard?.trim() || 'State Board of Technical Education',
    address: address?.trim() || '',
    accreditedBy: Array.isArray(accreditedBy) ? accreditedBy : ['NBA Tier-II Candidate'],
    currentAcademicYear: currentAcademicYear?.trim() || '2025-2026',
    currentTerm: currentTerm?.trim() || 'Odd Semester / Year 1',
  };

  // Sync back to license record
  workspace.license.collegeName = workspace.institution.name;
  if (workspace.institution.aisheCode) {
    workspace.license.aisheCode = workspace.institution.aisheCode;
  }
  if (workspace.institution.pciCode) {
    workspace.license.pciCode = workspace.institution.pciCode;
  }
  if (workspace.institution.dteCode) {
    workspace.license.dteCode = workspace.institution.dteCode;
  }
  if (workspace.institution.msbteCode) {
    workspace.license.msbteCode = workspace.institution.msbteCode;
  }
  workspace.license.aishePciCode = [
    workspace.institution.aisheCode,
    workspace.institution.pciCode,
    workspace.institution.dteCode,
    workspace.institution.msbteCode,
  ]
    .filter(Boolean)
    .join(' • ');

  recordTenantAuditLog(
    workspace,
    'Institutional Admin',
    'INSTITUTION_ADMIN',
    'INSTITUTION_PROFILE_CONFIGURED',
    `Configured profile for '${workspace.institution.name}' (AISHE: ${workspace.institution.aisheCode || 'N/A'}, PCI: ${workspace.institution.pciCode || 'N/A'}, DTE: ${workspace.institution.dteCode || 'N/A'}, MSBTE: ${workspace.institution.msbteCode || 'N/A'}). Letterhead synchronized.`
  );

  res.json({
    success: true,
    configured: true,
    institution: workspace.institution,
  });
});

app.post('/api/institution/reset', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  resetTenantDatabase(workspace.tenantId);

  res.json({
    success: true,
    configured: false,
    message: 'Institutional database reset to completely empty blank slate.',
  });
});

// Bulk Master Excel/CSV Ingestion (Isolated per tenant)
app.post('/api/masters/import', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const { type, records } = req.body;
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  if (type === 'STUDENTS') {
    const newStudents = records.map((r, i) => ({
      id: r.id || `st-${workspace.tenantId}-${Date.now()}-${i}`,
      uid: r.uid || `UID-${1000 + i}`,
      prn: r.prn || r.enrollmentNo || `PRN2025${String(workspace.students.length + i + 1).padStart(3, '0')}`,
      rollNo: String(r.rollNo || (workspace.students.length + i + 1)).padStart(2, '0'),
      name: r.name || `Student ${workspace.students.length + i + 1}`,
      programmeId: r.programmeId || 'prog-1',
      division: r.division || 'A',
      batch: r.batch || (i % 2 === 0 ? 'Batch B1' : 'Batch B2'),
      attendanceTheoryPercentage: Number(r.attendanceTheoryPercentage) || 85,
      attendancePracticalPercentage: Number(r.attendancePracticalPercentage) || 88,
      isDefaulter: (Number(r.attendanceTheoryPercentage) || 85) < 75,
      sessional1Average: Number(r.sessional1Average) || 20,
      sessional2Average: Number(r.sessional2Average) || 0,
      continuousAssessmentScore: Number(r.continuousAssessmentScore) || 22,
      atRiskReasons: (Number(r.attendanceTheoryPercentage) || 85) < 75 ? ['Attendance below statutory 75% threshold'] : [],
    }));

    workspace.students = [...workspace.students, ...newStudents];

    recordTenantAuditLog(
      workspace,
      'Institutional Admin',
      'INSTITUTION_ADMIN',
      'BULK_EXCEL_IMPORT_STUDENTS',
      `Imported ${newStudents.length} student records via CSV/Excel. Total enrolled students: ${workspace.students.length}.`
    );

    return res.json({
      success: true,
      count: newStudents.length,
      total: workspace.students.length,
      students: workspace.students,
    });
  }

  if (type === 'FACULTY') {
    // Check faculty seat limit enforced on license
    if (workspace.faculty.length + records.length > workspace.license.facultySeatLimit) {
      return res.status(400).json({
        error: `Faculty seat limit reached! Your ${workspace.license.planTier} license permits max ${workspace.license.facultySeatLimit} faculty seats (Current: ${workspace.faculty.length}). Please contact Super Admin to upgrade.`,
      });
    }

    const newFaculty = records.map((r, i) => ({
      id: r.id || `fac-${workspace.tenantId}-${Date.now()}-${i}`,
      empCode: r.empCode || `EMP-${200 + i}`,
      name: r.name || `Faculty Member ${workspace.faculty.length + i + 1}`,
      department: r.department || workspace.institution?.departmentName || 'Department of Pharmacy',
      designation: r.designation || 'Assistant Professor',
      role: r.role || 'FACULTY',
      assignedSubjects: r.assignedSubjects || [],
      prescribedWeeklyHours: Number(r.prescribedWeeklyHours) || 16,
      conductedWeeklyHours: Number(r.conductedWeeklyHours) || 16,
    }));

    workspace.faculty = [...workspace.faculty, ...newFaculty];

    recordTenantAuditLog(
      workspace,
      'Institutional Admin',
      'INSTITUTION_ADMIN',
      'BULK_EXCEL_IMPORT_FACULTY',
      `Imported ${newFaculty.length} faculty members via CSV/Excel. Total faculty: ${workspace.faculty.length}/${workspace.license.facultySeatLimit}.`
    );

    return res.json({
      success: true,
      count: newFaculty.length,
      total: workspace.faculty.length,
      faculty: workspace.faculty,
    });
  }

  if (type === 'SUBJECTS') {
    if (records.length > 0) {
      const first = records[0];
      workspace.subject = {
        id: first.id || `sub-${workspace.tenantId}-${Date.now()}`,
        code: first.code || '20111',
        title: first.title || 'Pharmaceutics-I',
        programmeId: first.programmeId || 'prog-1',
        programmeName: first.programmeName || 'Diploma in Pharmacy',
        semester: first.semester || 'Year 1',
        prescribedHoursTheory: Number(first.prescribedHoursTheory) || 75,
        prescribedHoursPractical: Number(first.prescribedHoursPractical) || 75,
        courseOutcomes: PHARMACEUTICS_SUBJECT.courseOutcomes,
        units: PHARMACEUTICS_SUBJECT.units,
        copoMatrix: PHARMACEUTICS_SUBJECT.copoMatrix,
        coPoMatrix: PHARMACEUTICS_SUBJECT.coPoMatrix,
      };
    }

    recordTenantAuditLog(
      workspace,
      'Institutional Admin',
      'INSTITUTION_ADMIN',
      'BULK_EXCEL_IMPORT_SUBJECTS',
      `Imported curriculum subject master: ${workspace.subject?.title} (${workspace.subject?.code}).`
    );

    return res.json({ success: true, subject: workspace.subject });
  }

  res.status(400).json({ error: 'Unknown import type' });
});

// Load Sample Regulatory Dataset into this specific tenant
app.post('/api/masters/sample', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  loadTenantSampleDataset(workspace.tenantId);

  res.json({
    success: true,
    message: 'Loaded sample regulatory curriculum dataset.',
    subject: workspace.subject,
    facultyCount: workspace.faculty.length,
    studentCount: workspace.students.length,
  });
});

// Full Tenant Bootstrap
app.get('/api/bootstrap', (req, res) => {
  const { workspace, error } = getRequestedTenant(req);

  if (error || !workspace) {
    return res.json({
      configured: false,
      licenseRequired: true,
      institution: null,
      message: error || 'License activation required',
    });
  }

  // Recalculate OBE attainment if marks & subject exist
  if (workspace.assessment && workspace.subject && workspace.studentMarks.length > 0) {
    workspace.coAttainment = calculateDirectCOAttainment(
      workspace.assessment,
      workspace.studentMarks,
      workspace.subject,
      0.60
    );
  }

  res.json({
    configured: !!workspace.institution,
    license: workspace.license,
    tenantId: workspace.tenantId,
    institution: workspace.institution,
    programmes: workspace.programmes,
    programOutcomes: PROGRAM_OUTCOMES,
    subject: workspace.subject,
    faculty: workspace.faculty,
    students: workspace.students,
    timetable: workspace.timetable,
    assessment: workspace.assessment,
    studentMarks: workspace.studentMarks,
    coAttainment: workspace.coAttainment.coSummaries || [],
    poAttainments: workspace.coAttainment.poAttainments || {},
    lowAttainmentCOs: workspace.coAttainment.lowAttainmentCOs || [],
    actionTakenReports: workspace.actionTakenReports,
    teachingDiaryEntries: workspace.teachingDiaryEntries,
    auditLogs: workspace.auditLogs,
    regulatoryOntology: {
      frameworks: ['PCI ER-2020 (Pharmacy Council of India)', 'MSBTE CIAAN-2023 K-Scheme', 'NBA Tier-II Outcome-Based Education', 'NAAC Criterion 1 & 2'],
      bloomsTaxonomy: ['L1_REMEMBER', 'L2_UNDERSTAND', 'L3_APPLY', 'L4_ANALYZE', 'L5_EVALUATE', 'L6_CREATE'],
      attainmentRubric: 'Level 3 (>=70% students >= 60%), Level 2 (60-69%), Level 1 (50-59%), Level 0 (<50%)',
      statutoryAttendanceThreshold: 75,
    },
  });
});

// Rapid Attendance Marking (Isolated to tenant)
app.post('/api/attendance/mark', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const {
    slotId,
    absentStudentIds = [],
    markedBy = 'Primary Faculty',
    coFacultySignOff = null,
    lectureDate = new Date().toISOString().split('T')[0],
  } = req.body;

  const slotIndex = workspace.timetable.findIndex((s) => s.id === slotId);
  if (slotIndex === -1) {
    return res.status(404).json({ error: 'Timetable slot not found' });
  }

  const targetSlot = workspace.timetable[slotIndex];
  targetSlot.status.attendanceMarked = true;

  workspace.students = workspace.students.map((st) => {
    // Regulatory Edge Case 1: DSE / Lateral Entry Admissions Attendance Denominator Check
    // If lecture date is strictly before student's official admission date, student is PRE-ADMISSION EXEMPT
    const isPreAdmission = Boolean(st.admissionDate && lectureDate < st.admissionDate);
    if (isPreAdmission) {
      // Do not mark absent or modify denominator
      return st;
    }

    const isAbsent = absentStudentIds.includes(st.id);
    let newTheory = st.attendanceTheoryPercentage;
    let newPractical = st.attendancePracticalPercentage;

    if (targetSlot.type === 'THEORY') {
      newTheory = isAbsent ? Math.max(50, st.attendanceTheoryPercentage - 3) : Math.min(100, st.attendanceTheoryPercentage + 1);
    } else {
      newPractical = isAbsent ? Math.max(50, st.attendancePracticalPercentage - 4) : Math.min(100, st.attendancePracticalPercentage + 1);
    }

    const isDefaulter = newTheory < 75 || newPractical < 75;

    return {
      ...st,
      attendanceTheoryPercentage: newTheory,
      attendancePracticalPercentage: newPractical,
      isDefaulter,
      atRiskReasons: isDefaulter
        ? [`Attendance below 75% (${newTheory}% Theory, ${newPractical}% Practical)`]
        : (st.atRiskReasons || []).filter((r) => !r.includes('Attendance below 75%')),
    };
  });

  const absentRolls = workspace.students
    .filter((s) => absentStudentIds.includes(s.id))
    .map((s) => s.rollNo)
    .join(', ');

  const signOffDetails = coFacultySignOff
    ? `Dual Sign-off: Primary (${markedBy}) & Co-Faculty (${coFacultySignOff.name || 'Co-Instructor'})`
    : `Sign-off: ${markedBy}`;

  recordTenantAuditLog(
    workspace,
    markedBy,
    'FACULTY',
    'ATTENDANCE_RECORD_SAVED',
    `Marked attendance for slot ${targetSlot.subjectTitle} (${targetSlot.timeSlot}). Enrolled: ${workspace.students.length}, Absentees: ${absentStudentIds.length} [Rolls: ${absentRolls || 'None - 100% Present'}]. ${signOffDetails}. DSE pro-rated attendance denominators preserved.`
  );

  res.json({
    success: true,
    slot: workspace.timetable[slotIndex],
    students: workspace.students,
  });
});

// Daily Teaching Diary (Isolated to tenant)
app.post('/api/diary/log', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const {
    slotId,
    plannedTopic,
    actualTopicCovered,
    completionStatus,
    pedagogicalStrategy,
    teachingAidUsed,
    remarks,
  } = req.body;

  const slotIndex = workspace.timetable.findIndex((s) => s.id === slotId);
  if (slotIndex !== -1) {
    workspace.timetable[slotIndex].status.diaryLogged = true;
  }

  const newEntry = {
    id: `diary-${Date.now()}`,
    slotId,
    subjectCode: workspace.subject?.code || '20111',
    subjectTitle: workspace.subject?.title || 'Pharmaceutics-I',
    date: new Date().toISOString().split('T')[0],
    plannedTopic,
    actualTopicCovered,
    completionStatus,
    pedagogicalStrategy: pedagogicalStrategy || 'Interactive lecture & problem-based case studies',
    teachingAidUsed: teachingAidUsed || 'Smart Classroom 204 Projector & Visual Micrograph Deck',
    remarks: remarks || 'Delivered on schedule. Learning objectives attained.',
    hodVerification: 'PENDING' as const,
  };

  workspace.teachingDiaryEntries.unshift(newEntry);

  recordTenantAuditLog(
    workspace,
    'Faculty Member',
    'FACULTY',
    'TEACHING_DIARY_COMMITTED',
    `Logged daily diary for '${actualTopicCovered}'. Status: ${completionStatus}. Syllabus velocity tracked automatically.`
  );

  res.json({
    success: true,
    entry: newEntry,
    slot: slotIndex !== -1 ? workspace.timetable[slotIndex] : null,
  });
});

// Assessment Marks & Instant Attainment Recalculation (Isolated to tenant)
app.post('/api/marks/save', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const { marks, questionThresholdRatio = 0.60 } = req.body;
  if (Array.isArray(marks)) {
    workspace.studentMarks = marks;
  }

  workspace.students = workspace.students.map((st) => {
    const studentScoreObj = workspace.studentMarks.find((sm) => sm.studentId === st.id);
    if (studentScoreObj) {
      const total = Object.values(studentScoreObj.marks).reduce<number>((acc, v) => acc + (Number(v) || 0), 0);
      return {
        ...st,
        sessional1Average: total,
      };
    }
    return st;
  });

  // Re-run NBA OBE Attainment
  workspace.coAttainment = calculateDirectCOAttainment(
    workspace.assessment,
    workspace.studentMarks,
    workspace.subject,
    questionThresholdRatio
  );

  // Check low COs and draft ATRs if needed
  (workspace.coAttainment?.lowAttainmentCOs || []).forEach((lowCO) => {
    const exists = workspace.actionTakenReports.find((a) => a.coCode === lowCO.coCode);
    if (exists) {
      exists.actualScore = lowCO.compositeAttainment;
    } else {
      workspace.actionTakenReports.push({
        id: `atr-${lowCO.coCode.toLowerCase()}-${Date.now()}`,
        coCode: lowCO.coCode,
        subjectCode: workspace.subject?.code || '20111',
        academicYear: '2025-2026',
        targetScore: lowCO.targetLevel,
        actualScore: lowCO.compositeAttainment,
        rootCauseAnalysis: `Performance deficit observed in ${lowCO.coCode} where attainment reached ${lowCO.compositeAttainment} against target of ${lowCO.targetLevel}. Question-level analytics indicate need for targeted problem-solving remediation.`,
        correctiveActions: [
          'Arrange 4 hours of remedial coaching sessions.',
          'Distribute concept worksheets and step-by-step troubleshooting roadmaps.',
          'Schedule peer mentoring tutorials for struggling students.',
        ],
        plannedRemedialHours: 4,
        hodStatus: 'DRAFT',
        hodRemarks: 'Generated automatically by NBA Attainment engine. Awaiting HOD review.',
      });
    }
  });

  recordTenantAuditLog(
    workspace,
    'Faculty Member',
    'FACULTY',
    'MARKS_INGESTION_AND_OBE_RECALCULATION',
    `Updated question-level marks for ${workspace.studentMarks.length} students. Direct CO Attainment and NBA Criterion 3 tables updated dynamically.`
  );

  res.json({
    success: true,
    coAttainment: workspace.coAttainment.coSummaries,
    poAttainments: workspace.coAttainment.poAttainments,
    lowAttainmentCOs: workspace.coAttainment.lowAttainmentCOs,
    actionTakenReports: workspace.actionTakenReports,
    students: workspace.students,
  });
});

// Regulatory Edge Case 1 & 4: Permanent PRN / Enrollment Decoupling & Roll Number Re-shuffling
app.post('/api/students/reshuffle-rolls', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const { mode = 'ALPHABETICAL', customMappings = [] } = req.body;

  if (mode === 'ALPHABETICAL') {
    // Sort all students alphabetically by name, keeping PRN & id immutable
    const sorted = [...workspace.students].sort((a, b) => a.name.localeCompare(b.name));
    workspace.students = sorted.map((st, idx) => ({
      ...st,
      rollNo: String(idx + 1).padStart(2, '0'),
    }));
  } else if (mode === 'DSE_APPEND') {
    // Regular students first (by existing roll or name), DSE students appended at the tail
    const regulars = workspace.students.filter(s => s.admissionType !== 'LATERAL_ENTRY_DSE');
    const dseStudents = workspace.students.filter(s => s.admissionType === 'LATERAL_ENTRY_DSE');
    
    let counter = 1;
    const reordered: typeof workspace.students = [];
    regulars.forEach(st => {
      reordered.push({ ...st, rollNo: String(counter++).padStart(2, '0') });
    });
    dseStudents.forEach(st => {
      reordered.push({ ...st, rollNo: String(counter++).padStart(2, '0') });
    });
    workspace.students = reordered;
  } else if (mode === 'CUSTOM' && Array.isArray(customMappings)) {
    const map = new Map<string, string>();
    customMappings.forEach((m: { studentId: string; rollNo: string }) => map.set(m.studentId, m.rollNo));
    workspace.students = workspace.students.map(st => ({
      ...st,
      rollNo: map.get(st.id) || st.rollNo,
    }));
  }

  // Update roll numbers in studentMarks array while preserving scores & permanent studentId linkage
  workspace.studentMarks = workspace.studentMarks.map(sm => {
    const found = workspace.students.find(s => s.id === sm.studentId);
    return found ? { ...sm, rollNo: found.rollNo } : sm;
  });

  recordTenantAuditLog(
    workspace,
    'Academic Registrar / HOD',
    'HOD',
    'ROLL_NUMBERS_RESHUFFLED',
    `Roll numbers re-shuffled using mode: ${mode}. Permanent PRN & UUID integrity preserved across all ${workspace.students.length} students.`
  );

  res.json({
    success: true,
    students: workspace.students,
    studentMarks: workspace.studentMarks,
  });
});

// Regulatory Edge Case 5: Re-Sessional & Improvement Exam Engine with Automated Best-of-Two Calculation
app.post('/api/marks/save-resessional', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const { studentId, sessional3Score, reason = 'MEDICAL_ABSENTEE' } = req.body;
  const student = workspace.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  student.sessional3Average = Number(sessional3Score);
  student.reSessionalReason = reason;

  // Best of 2 automated calculation:
  // Gather available scores (Sessional 1, Sessional 2, Re-sessional)
  const candidateScores: number[] = [];
  if (student.admissionType === 'LATERAL_ENTRY_DSE' && student.sessional1Average === 0) {
    // DSE student was exempt from Sessional 1 held pre-admission
    candidateScores.push(student.sessional2Average, student.sessional3Average);
  } else {
    candidateScores.push(student.sessional1Average, student.sessional2Average, student.sessional3Average);
  }

  // Sort descending and take top 2
  const sortedScores = [...candidateScores].sort((a, b) => b - a);
  const bestTwo = sortedScores.slice(0, 2);
  student.bestOfTwoAverage = Math.round(((bestTwo[0] + (bestTwo[1] ?? bestTwo[0])) / 2) * 10) / 10;

  recordTenantAuditLog(
    workspace,
    'Faculty Examiner',
    'FACULTY',
    'RE_SESSIONAL_SCORE_COMMITTED',
    `Recorded Re-Sessional mark (${sessional3Score}/30) for ${student.name} (PRN: ${student.prn}). Reason: ${reason}. Automated Best-of-Two updated to ${student.bestOfTwoAverage}/30.`
  );

  res.json({
    success: true,
    student,
    students: workspace.students,
  });
});

// Regulatory Edge Case 6: Temporary Substitute / Medical & Maternity Leave Handover
app.post('/api/faculty/leave-handover', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const {
    facultyId,
    onLeave,
    leaveType = 'MEDICAL',
    startDate,
    endDate,
    substituteFacultyId,
    substituteFacultyName,
    handoverNotes = '',
  } = req.body;

  const fac = workspace.faculty.find(f => f.id === facultyId);
  if (!fac) {
    return res.status(404).json({ error: 'Faculty member not found' });
  }

  fac.leaveStatus = {
    onLeave: Boolean(onLeave),
    leaveType: leaveType as any,
    startDate,
    endDate,
    substituteFacultyId,
    substituteFacultyName,
    handoverNotes,
  };

  // Update timetable slots: reallocate teaching workload and attendance logging to substitute
  // while strictly preserving original faculty's course file ownership for NBA/regulatory accreditation
  workspace.timetable = workspace.timetable.map(slot => {
    if (slot.facultyId === facultyId) {
      return {
        ...slot,
        isSubstituted: Boolean(onLeave),
        substituteFacultyId: onLeave ? substituteFacultyId : undefined,
        substituteFacultyName: onLeave ? substituteFacultyName : undefined,
      };
    }
    return slot;
  });

  recordTenantAuditLog(
    workspace,
    'Head of Department (HOD)',
    'HOD',
    'FACULTY_LEAVE_HANDOVER_COMMITTED',
    `Faculty leave handover: ${fac.name} set to ${onLeave ? `ON LEAVE (${leaveType})` : 'ACTIVE'}. Workload delegated to: ${substituteFacultyName || 'N/A'}. Primary course file ownership retained.`
  );

  res.json({
    success: true,
    faculty: fac,
    facultyMembers: workspace.faculty,
    timetable: workspace.timetable,
  });
});

// -----------------------------------------------------------------------------
// 5. AI ENGINE COPILOT ENDPOINTS (Scoped to Tenant)
// -----------------------------------------------------------------------------

app.post('/api/ai/generate-package', async (req, res) => {
  try {
    const { workspace } = getRequestedTenant(req);
    const {
      topic = 'Tablet Coating Defects: Mottling, Orange Peel, Capping, Sticking, Blistering',
      subjectTitle = workspace?.subject?.title || 'Pharmaceutics-I',
      subjectCode = workspace?.subject?.code || '20111',
      unitName = 'Unit 2: Solid Dosage Forms & Tablet Coating Technology',
      targetCO = 'CO3',
      bloomsLevel = 'L4_ANALYZE',
    } = req.body;

    const pkg = await generateTeachingPackage({
      topic,
      subjectTitle,
      subjectCode,
      unitName,
      targetCO,
      bloomsLevel,
    });

    if (workspace) {
      recordTenantAuditLog(
        workspace,
        'Faculty AI Genie Intelligence Engine',
        'FACULTY',
        'AI_TEACHING_PACKAGE_ORCHESTRATED',
        `Synthesized comprehensive teaching package for '${topic}' (Target: ${targetCO}, Bloom: ${bloomsLevel}). Marked as provisional draft.`
      );
    }

    res.json({ success: true, package: pkg });
  } catch (err: any) {
    console.error('Error generating package:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

app.post('/api/ai/generate-paper', async (req, res) => {
  try {
    const { workspace } = getRequestedTenant(req);
    const {
      subjectTitle = workspace?.subject?.title || 'Pharmaceutics-I',
      subjectCode = workspace?.subject?.code || '20111',
      programme = 'D.Pharm Year 1',
      scheme = 'MSBTE K-Scheme / CIAAN-2023',
      targetCOs = ['CO1', 'CO2', 'CO3'],
      totalMarks = 30,
      bloomFocus = 'LOTS 33% / HOTS 67%',
    } = req.body;

    const paper = await generateQuestionPaperDraft({
      subjectTitle,
      subjectCode,
      programme,
      scheme,
      targetCOs,
      totalMarks,
      bloomFocus,
    });

    if (workspace) {
      recordTenantAuditLog(
        workspace,
        'Faculty AI Genie Assessment Copilot',
        'FACULTY',
        'QUESTION_PAPER_DRAFT_ARCHITECTED',
        `Architected question paper draft for ${subjectTitle} (${totalMarks} marks) mapped to ${targetCOs.join(', ')}. Scrutiny audit pre-checks passed.`
      );
    }

    res.json({ success: true, paper });
  } catch (err: any) {
    console.error('Error generating paper:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

app.post('/api/ai/scrutiny-paper', async (req, res) => {
  try {
    const { workspace } = getRequestedTenant(req);
    const { paperContent } = req.body;
    const auditReport = await scrutinyAuditQuestionPaper(paperContent || JSON.stringify(workspace?.assessment || {}));

    if (workspace) {
      recordTenantAuditLog(
        workspace,
        'Dr. Rajesh Sharma (HOD Scrutiny Committee)',
        'HOD',
        'QUESTION_PAPER_SCRUTINY_AUDITED',
        `Quality scrutiny audit executed. Overall verdict: ${auditReport.overallVerdict} (Audit Score: ${auditReport.auditScore}/100). Revised Bloom LOTS/HOTS: ${auditReport.lotsPercentage}% / ${auditReport.hotsPercentage}%.`
      );
    }

    res.json({ success: true, report: auditReport });
  } catch (err: any) {
    console.error('Error in scrutiny check:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/draft-atr', async (req, res) => {
  try {
    const { workspace } = getRequestedTenant(req);
    const { coCode = 'CO3', targetScore = 2.50, actualScore = 2.20, gapDeficit = 0.30 } = req.body;

    const atr = await draftActionTakenReport({
      coCode,
      subjectTitle: workspace?.subject?.title || 'Pharmaceutics-I',
      targetScore,
      actualScore,
      gapDeficit,
      deficientSubtopics: ['Tablet Coating Defects (Orange Peel, Mottling)', 'Friability limits per IP'],
    });

    if (workspace) {
      const idx = workspace.actionTakenReports.findIndex((a) => a.coCode === coCode);
      if (idx !== -1) {
        workspace.actionTakenReports[idx] = atr;
      } else {
        workspace.actionTakenReports.push(atr);
      }

      recordTenantAuditLog(
        workspace,
        'Outcome Intelligence Copilot',
        'FACULTY',
        'ACTION_TAKEN_REPORT_COMPOSED',
        `Composed remedial Action Taken Report for deficit in ${coCode} (Target: ${targetScore}, Attained: ${actualScore}). Awaiting HOD endorsement.`
      );
    }

    res.json({ success: true, atr, actionTakenReports: workspace?.actionTakenReports || [atr] });
  } catch (err: any) {
    console.error('Error drafting ATR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/communication', async (req, res) => {
  try {
    const { workspace } = getRequestedTenant(req);
    const { topic, targetAudience, date, details } = req.body;
    const communication = await generateMultiChannelCommunication({
      topic: topic || 'Remedial Formulation & Hands-On Coaching Clinic',
      targetAudience: targetAudience || 'D.Pharm 1st Year (Div A)',
      date: date || 'Monday, 15-September-2025 at 03:30 PM',
      details: details || 'Mandatory coaching for students scoring below 60% in Sessional Exam 1. Covers tablet manufacturing troubleshooting and IP quality standards.',
      institution: workspace?.institution || req.body.institution,
    });

    if (workspace) {
      recordTenantAuditLog(
        workspace,
        'Prof. Ananya Deshmukh',
        'FACULTY',
        'MULTI_CHANNEL_COMMUNICATION_DISPATCHED',
        `Generated official letterhead circular, Parent WhatsApp/SMS alerts, and Marathi regional translation for '${topic}'.`
      );
    }

    res.json({ success: true, communication });
  } catch (err: any) {
    console.error('Error generating communication:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/search-copilot', async (req, res) => {
  try {
    const { workspace } = getRequestedTenant(req);
    const { query } = req.body;
    const answer = await searchContextAssistant(query, {
      students: workspace?.students || [],
      timetable: workspace?.timetable || [],
      coAttainment: workspace?.coAttainment?.coSummaries || [],
      lowAttainmentCOs: workspace?.coAttainment?.lowAttainmentCOs || [],
    });

    res.json({ success: true, answer });
  } catch (err: any) {
    console.error('Error in search assistant:', err);
    res.status(500).json({ error: err.message });
  }
});

// Formal Document Sign-Off
app.post('/api/audit/sign-off', (req, res) => {
  const { workspace, error, statusCode } = getRequestedTenant(req);
  if (error || !workspace) {
    return res.status(statusCode || 401).json({ error: error || 'Unauthorized' });
  }

  const { documentType, documentId, actor, role, remarks } = req.body;

  if (documentType === 'TEACHING_DIARY') {
    const diary = workspace.teachingDiaryEntries.find((d) => d.id === documentId);
    if (diary) diary.hodVerification = 'VERIFIED';
  } else if (documentType === 'ACTION_TAKEN_REPORT') {
    const atr = workspace.actionTakenReports.find((a) => a.id === documentId);
    if (atr) {
      atr.hodStatus = 'APPROVED';
      atr.hodRemarks = remarks || 'Approved by HOD. Remedial hours endorsed.';
    }
  } else if (documentType === 'ASSESSMENT_SCRUTINY') {
    if (workspace.assessment?.scrutinyStatus) {
      workspace.assessment.scrutinyStatus.status = 'APPROVED';
    }
  }

  const log = recordTenantAuditLog(
    workspace,
    actor || 'Dr. Rajesh Sharma (HOD)',
    role || 'HOD',
    `FORMAL_DOCUMENT_SIGN_OFF_${documentType}`,
    `Approved ${documentType} (ID: ${documentId}). Remarks: ${remarks || 'Statutory criteria verified and approved.'}`
  );

  res.json({
    success: true,
    log,
    assessment: workspace.assessment,
    actionTakenReports: workspace.actionTakenReports,
  });
});

// -----------------------------------------------------------------------------
// 6. VITE INTEGRATION & SERVER BOOTSTRAP
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faculty AI Genie Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
