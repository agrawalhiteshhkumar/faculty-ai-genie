import React, { useState, useRef } from 'react';
import {
  Building2,
  Upload,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Layers,
  ArrowRight,
  Database,
  Trash2,
  Image as ImageIcon,
  Users,
  Wrench,
} from 'lucide-react';
import { InstitutionProfile, UserRole } from '../../types';
import {
  downloadStudentTemplate,
  downloadFacultyTemplate,
  downloadSubjectTemplate,
  parseCSV,
} from '../../utils/excelTemplates';
import { InstitutionSeal } from '../InstitutionSeal';
import { StaffDirectoryView } from './setup/StaffDirectoryView';
import { PCILabsRegisterView } from './setup/PCILabsRegisterView';
import { BackupRestoreView } from './setup/BackupRestoreView';

interface InstitutionSetupViewProps {
  institution: InstitutionProfile | null;
  onSaveInstitution: (profile: InstitutionProfile) => Promise<void>;
  onResetDatabase: () => Promise<void>;
  onLoadSampleDataset: () => Promise<void>;
  studentCount: number;
  facultyCount: number;
  hasSubject: boolean;
  subjectTitle?: string;
  onImportComplete: () => Promise<void>;
  isInitialOnboarding?: boolean;
}

export const InstitutionSetupView: React.FC<InstitutionSetupViewProps> = ({
  institution,
  onSaveInstitution,
  onResetDatabase,
  onLoadSampleDataset,
  studentCount,
  facultyCount,
  hasSubject,
  subjectTitle,
  onImportComplete,
  isInitialOnboarding = false,
}) => {
  // Institution Profile Form State
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    shortName: institution?.shortName || '',
    aisheCode: institution?.aisheCode || '',
    dteCode: institution?.dteCode || '',
    msbteCode: institution?.msbteCode || '',
    pciCode: institution?.pciCode || '',
    departmentName: institution?.departmentName || 'Department of Pharmacy',
    affiliatedBoard: institution?.affiliatedBoard || 'Maharashtra State Board of Technical Education (MSBTE)',
    address: institution?.address || '',
    currentAcademicYear: institution?.currentAcademicYear || '2025-2026',
    currentTerm: institution?.currentTerm || 'Odd Semester / Year 1',
    logoUrl: institution?.logoUrl || '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<
    'PROFILE' | 'STAFF_DIRECTORY' | 'PCI_LABS' | 'BACKUP_RESTORE' | 'EXCEL_IMPORT'
  >('PROFILE');

  // Excel / CSV Import State
  const [importTarget, setImportTarget] = useState<'STUDENTS' | 'FACULTY' | 'SUBJECTS'>('STUDENTS');
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<Array<Record<string, string>>>([]);
  const [importing, setImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Logo Upload as Base64 Data URL with 2MB validation
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose an image file smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick-fill helper for testing statutory credentials
  const handleQuickFillSample = () => {
    setFormData({
      name: 'D. P. Kharde Navjeevan College of Pharmacy',
      shortName: 'DPKCOP',
      aisheCode: 'S-22693',
      dteCode: '5539',
      msbteCode: '0182',
      pciCode: 'PCI-2041',
      departmentName: 'Department of Pharmacy',
      affiliatedBoard: 'Maharashtra State Board of Technical Education (MSBTE), Mumbai',
      address: 'Navjeevan Knowledge City, CIDCO, Nashik - 422008, Maharashtra',
      currentAcademicYear: '2025-2026',
      currentTerm: 'MSBTE J-Scheme (PCI ER-2020 Annual Pattern)',
      logoUrl: '',
    });
  };

  // Profile submission
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter Institution Name');
      return;
    }

    setSavingProfile(true);
    try {
      const newProfile: InstitutionProfile = {
        id: institution?.id || `inst-${Date.now()}`,
        name: formData.name.trim(),
        shortName: formData.shortName.trim() || formData.name.substring(0, 15).toUpperCase(),
        aisheCode: formData.aisheCode.trim(),
        dteCode: formData.dteCode.trim(),
        msbteCode: formData.msbteCode.trim(),
        pciCode: formData.pciCode.trim(),
        departmentName: formData.departmentName.trim(),
        affiliatedBoard: formData.affiliatedBoard.trim(),
        address: formData.address.trim(),
        currentAcademicYear: formData.currentAcademicYear.trim(),
        currentTerm: formData.currentTerm.trim(),
        logoUrl: formData.logoUrl.trim(),
        accreditedBy: institution?.accreditedBy || ['NBA Tier-II Candidate', 'NAAC Accredited'],
      };

      await onSaveInstitution(newProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save institution profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle CSV file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setCsvText(text);
        const rows = parseCSV(text);
        setParsedRows(rows);
      };
      reader.readAsText(file);
    }
  };

  // Handle CSV text change
  const handleCsvTextChange = (text: string) => {
    setCsvText(text);
    const rows = parseCSV(text);
    setParsedRows(rows);
  };

  // Execute Bulk Import to Backend API
  const handleCommitImport = async () => {
    if (parsedRows.length === 0) {
      alert('No parsed rows to import. Please select a valid CSV file or paste valid CSV data.');
      return;
    }

    setImporting(true);
    setImportFeedback(null);
    try {
      const formattedRecords = parsedRows.map((row) => {
        if (importTarget === 'STUDENTS') {
          return {
            rollNo: row.RollNo || row.rollNo || row.Roll_No,
            name: row.Name || row.name || row.StudentName,
            prn: row.PRN_EnrollmentNo || row.PRN || row.EnrollmentNo || row.prn,
            division: row.Division || row.division || 'A',
            batch: row.Batch || row.batch || 'Batch B1',
            attendanceTheoryPercentage: Number(row.AttendanceTheoryPct || row.TheoryAttendance || 85),
            attendancePracticalPercentage: Number(row.AttendancePracticalPct || row.PracticalAttendance || 88),
            sessional1Average: Number(row.Sessional1Marks || row.Sessional1 || 22),
            continuousAssessmentScore: Number(row.ContinuousAssessment || row.CA || 22),
          };
        } else if (importTarget === 'FACULTY') {
          return {
            empCode: row.EmpCode || row.empCode || row.Code,
            name: row.Name || row.name || row.FacultyName,
            department: row.Department || row.department || formData.departmentName,
            designation: row.Designation || row.designation || 'Assistant Professor',
            role: (row.Role || 'FACULTY') as UserRole,
            prescribedWeeklyHours: Number(row.WeeklyPrescribedHours || row.Hours || 16),
            conductedWeeklyHours: Number(row.WeeklyPrescribedHours || row.Hours || 16),
          };
        } else {
          return {
            code: row.SubjectCode || row.code || row.Code,
            title: row.SubjectTitle || row.title || row.Title,
            programmeName: row.Programme || row.programme || 'Diploma in Pharmacy (D.Pharm)',
            semester: row.Semester || row.semester || 'Year 1',
            prescribedHoursTheory: Number(row.PrescribedTheoryHours || 75),
            prescribedHoursPractical: Number(row.PrescribedPracticalHours || 75),
          };
        }
      });

      const tenantId = localStorage.getItem('faculty_genie_tenant_id') || '';
      const licenseKey = localStorage.getItem('faculty_genie_license_key') || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (tenantId) headers['x-tenant-id'] = tenantId;
      if (licenseKey) headers['x-license-key'] = licenseKey;

      const res = await fetch('/api/masters/import', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: importTarget,
          records: formattedRecords,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setImportFeedback(`Successfully imported ${data.count} ${importTarget.toLowerCase()} records into Master database.`);
        setCsvText('');
        setParsedRows([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await onImportComplete();
      } else {
        setImportFeedback(`Import error: ${data.error || 'Failed to parse records'}`);
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setImportFeedback(`Failed to import: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Banner / Onboarding Context */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 rounded-3xl border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              {isInitialOnboarding ? 'Welcome to Faculty AI Genie' : 'Institutional Administration & Masters'}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              {isInitialOnboarding ? 'Configure New Educational Institution' : 'Institution Setup & Master Ledgers'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Define statutory identifiers (AISHE, DTE, MSBTE/PCI Codes), branding badges, and bulk-onboard
              Students, Faculty, and Course Curriculum via Excel/CSV templates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleQuickFillSample}
              type="button"
              className="px-4 py-2 text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-400/30 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick Fill Sample Info
            </button>
            <button
              onClick={onLoadSampleDataset}
              type="button"
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Database className="w-4 h-4 text-slate-950" />
              Load Sample Curriculum (D.Pharm)
            </button>
          </div>
        </div>

        {/* Dynamic Status Counter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Institution Status</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {institution?.name ? 'Configured' : 'Awaiting Setup'}
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Student Master</span>
            <span className="text-sm font-bold text-white mt-0.5 block font-mono">
              {studentCount} Enrolled
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Faculty Master</span>
            <span className="text-sm font-bold text-white mt-0.5 block font-mono">
              {facultyCount} Active Members
            </span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Subject Curriculum</span>
            <span className="text-sm font-bold text-white mt-0.5 block truncate">
              {hasSubject ? subjectTitle || 'Configured' : 'Empty / Unloaded'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('PROFILE')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'PROFILE'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          1. Institution Identity & Official Logo
        </button>
        <button
          onClick={() => setActiveSubTab('STAFF_DIRECTORY')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'STAFF_DIRECTORY'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          2. Staff Directory & Credentials (RBAC - 30 Seats)
        </button>
        <button
          onClick={() => setActiveSubTab('PCI_LABS')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'PCI_LABS'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          3. PCI Laboratories & Equipment Register (6 Labs)
        </button>
        <button
          onClick={() => setActiveSubTab('BACKUP_RESTORE')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'BACKUP_RESTORE'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-blue-600" />
          4. Disaster Recovery & Backup (.json)
        </button>
        <button
          onClick={() => setActiveSubTab('EXCEL_IMPORT')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'EXCEL_IMPORT'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          5. Bulk Excel/CSV Import & Masters
        </button>
      </div>

      {/* TAB 1: INSTITUTION PROFILE FORM */}
      {activeSubTab === 'PROFILE' && (
        <form onSubmit={handleSubmitProfile} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                Institutional Accreditation Profile & Header Badge Settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                These credentials populate accreditation dossiers (NBA Tier-II, NAAC, PCI) and update the universal header badge in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Institution Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Institution Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Government Polytechnic & Institute of Technology"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Short Name / Acronym */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Short Name / Acronym <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GPIT or SVIT"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Department Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Pharmacy or Computer Engineering"
                  value={formData.departmentName}
                  onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* AISHE Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  AISHE Code (All India Survey on Higher Education)
                </label>
                <input
                  type="text"
                  placeholder="e.g. C-54201"
                  value={formData.aisheCode}
                  onChange={(e) => setFormData({ ...formData, aisheCode: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* DTE Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  DTE Code (Directorate of Technical Education)
                </label>
                <input
                  type="text"
                  placeholder="e.g. DTE-4102"
                  value={formData.dteCode}
                  onChange={(e) => setFormData({ ...formData, dteCode: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* MSBTE / PCI Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  MSBTE / Board Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSBTE-0891"
                  value={formData.msbteCode}
                  onChange={(e) => setFormData({ ...formData, msbteCode: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  PCI / Regulatory Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. PCI-2041/MH"
                  value={formData.pciCode}
                  onChange={(e) => setFormData({ ...formData, pciCode: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Affiliated Board */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Affiliated Board / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra State Board of Technical Education (MSBTE), Mumbai"
                  value={formData.affiliatedBoard}
                  onChange={(e) => setFormData({ ...formData, affiliatedBoard: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Logo URL or File Upload */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Institution Logo (URL or Upload Image File)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Institution Logo"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <GraduationCap className="w-8 h-8 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="https://example.edu/logo.png"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition border border-slate-300 inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        Choose Local Logo File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                          className="px-2 py-1.5 text-xs text-rose-600 hover:text-rose-700 transition"
                        >
                          Clear Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Year & Term */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Academic Year
                </label>
                <input
                  type="text"
                  value={formData.currentAcademicYear}
                  onChange={(e) => setFormData({ ...formData, currentAcademicYear: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Term / Semester
                </label>
                <input
                  type="text"
                  value={formData.currentTerm}
                  onChange={(e) => setFormData({ ...formData, currentTerm: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Live Header Badge & Official Seal Preview */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
                Official Institution Seal & Header Badge Live Preview
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Header Preview */}
                <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center gap-3 border border-slate-800">
                  <InstitutionSeal
                    profile={{
                      ...institution,
                      id: institution?.id || 'inst-dpk',
                      name: formData.name || 'D. P. Kharde Navjeevan College of Pharmacy',
                      shortName: formData.shortName || 'DPKCOP',
                      aisheCode: formData.aisheCode || 'S-22693',
                      dteCode: formData.dteCode || '5539',
                      msbteCode: formData.msbteCode || '0182',
                      pciCode: formData.pciCode || 'PCI-2041',
                      departmentName: formData.departmentName || 'Department of Pharmacy',
                      logoUrl: formData.logoUrl,
                    }}
                    variant="header"
                    size="md"
                  />
                </div>

                {/* Circular Statutory Seal Preview */}
                <div className="bg-slate-50 p-3.5 rounded-xl flex items-center gap-3 border border-slate-200">
                  <InstitutionSeal
                    profile={{
                      ...institution,
                      id: institution?.id || 'inst-dpk',
                      name: formData.name || 'D. P. Kharde Navjeevan College of Pharmacy',
                      shortName: formData.shortName || 'DPKCOP',
                      aisheCode: formData.aisheCode || 'S-22693',
                      dteCode: formData.dteCode || '5539',
                      msbteCode: formData.msbteCode || '0182',
                      pciCode: formData.pciCode || 'PCI-2041',
                      departmentName: formData.departmentName || 'Department of Pharmacy',
                      logoUrl: formData.logoUrl,
                    }}
                    variant="circular"
                    size="md"
                  />
                  <div className="text-xs text-slate-600">
                    <div className="font-bold text-slate-900">Official Institutional Seal</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Embedded across all printable headers, PH proformas, marksheets, and Course File exports.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onResetDatabase}
                  className="px-4 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1.5 border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  Reset Database to Empty State
                </button>
              </div>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved & Header Updated!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Institution Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: STAFF DIRECTORY & CREDENTIALS (RBAC - 30 SEATS) */}
      {activeSubTab === 'STAFF_DIRECTORY' && (
        <StaffDirectoryView collegeName={formData.name || institution?.name} />
      )}

      {/* TAB 3: PCI LABS REGISTER */}
      {activeSubTab === 'PCI_LABS' && (
        <PCILabsRegisterView collegeName={formData.name || institution?.name} />
      )}

      {/* TAB 4: BACKUP & RESTORE */}
      {activeSubTab === 'BACKUP_RESTORE' && (
        <BackupRestoreView
          institution={institution}
          studentCount={studentCount}
          facultyCount={facultyCount}
          onResetDatabase={onResetDatabase}
          onLoadSampleDataset={onLoadSampleDataset}
        />
      )}

      {/* TAB 2: EXCEL / CSV BULK MASTERS IMPORT */}
      {activeSubTab === 'EXCEL_IMPORT' && (
        <div className="space-y-6">
          {/* Target Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setImportTarget('STUDENTS');
                setCsvText('');
                setParsedRows([]);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                importTarget === 'STUDENTS'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Ledger 1</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 font-mono">
                  {studentCount} Loaded
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Student Master</h3>
              <p className="text-xs text-slate-500 mt-1">
                Roll No, Full Name, PRN/Enrollment, Division, Batch, Attendance %
              </p>
            </button>

            <button
              onClick={() => {
                setImportTarget('FACULTY');
                setCsvText('');
                setParsedRows([]);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                importTarget === 'FACULTY'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Ledger 2</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 font-mono">
                  {facultyCount} Loaded
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Faculty Master</h3>
              <p className="text-xs text-slate-500 mt-1">
                Employee Code, Name, Department, Designation, Roles (HOD/Faculty)
              </p>
            </button>

            <button
              onClick={() => {
                setImportTarget('SUBJECTS');
                setCsvText('');
                setParsedRows([]);
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                importTarget === 'SUBJECTS'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Ledger 3</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                  {hasSubject ? 'Configured' : 'Empty'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Subject Master</h3>
              <p className="text-xs text-slate-500 mt-1">
                Subject Code, Title, Theory & Practical Prescribed Hours, Scheme
              </p>
            </button>
          </div>

          {/* Import Workstation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                  Import {importTarget === 'STUDENTS' ? 'Student Ledger' : importTarget === 'FACULTY' ? 'Faculty Directory' : 'Curriculum Subject'}
                </h3>
                <p className="text-xs text-slate-500">
                  Download the sample template, populate your institutional records in Excel, and upload or paste below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (importTarget === 'STUDENTS') downloadStudentTemplate();
                    else if (importTarget === 'FACULTY') downloadFacultyTemplate();
                    else downloadSubjectTemplate();
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 border border-slate-300 shadow-2xs"
                >
                  <Download className="w-4 h-4 text-slate-700" />
                  Download Sample Excel Template ({importTarget.toLowerCase()}.csv)
                </button>
              </div>
            </div>

            {/* Drag & Drop File Selector */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, text/csv, .txt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drag & drop CSV / Excel file
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports standard RFC 4180 CSV files exported directly from Microsoft Excel or Google Sheets
                  </p>
                </div>
              </div>
            </div>

            {/* Direct CSV Text Area (Fallback & Quick Paste) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Or Paste Raw CSV Data Directly
              </label>
              <textarea
                rows={4}
                value={csvText}
                onChange={(e) => handleCsvTextChange(e.target.value)}
                placeholder="RollNo,Name,PRN_EnrollmentNo,Division,Batch,AttendanceTheoryPct,AttendancePracticalPct..."
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
            </div>

            {/* Parsed Preview Table */}
            {parsedRows.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Validated Preview ({parsedRows.length} Rows Detected)
                  </span>
                  <button
                    onClick={() => {
                      setParsedRows([]);
                      setCsvText('');
                    }}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Clear Preview
                  </button>
                </div>

                <div className="max-h-56 overflow-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                      <tr>
                        {Object.keys(parsedRows[0]).map((header) => (
                          <th key={header} className="p-2.5 whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {parsedRows.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-2.5 whitespace-nowrap text-slate-800">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {parsedRows.length > 10 && (
                  <p className="text-[11px] text-slate-500 italic text-right">
                    Showing first 10 of {parsedRows.length} total rows. All {parsedRows.length} rows will be committed.
                  </p>
                )}
              </div>
            )}

            {/* Feedback Message */}
            {importFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {importFeedback}
              </div>
            )}

            {/* Commit Button */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={importing || parsedRows.length === 0}
                className="px-6 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md transition flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Ingesting Master Data...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm & Ingest {parsedRows.length > 0 ? `${parsedRows.length} Records` : 'Data'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
