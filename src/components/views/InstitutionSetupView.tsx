'use client';

import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  Download,
  Info
} from 'lucide-react';
import { InstitutionProfile } from '../../types';

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

export function InstitutionSetupView({
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
}: InstitutionSetupViewProps) {
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'FACULTY' | 'LABS' | 'STUDENTS'>('IDENTITY');
  const [saving, setSaving] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(institution?.name || '');
  const [shortName, setShortName] = useState(institution?.shortName || '');
  const [departmentName, setDepartmentName] = useState(institution?.departmentName || 'Department of Pharmacy');
  const [aisheCode, setAisheCode] = useState(institution?.aisheCode || '');
  const [dteCode, setDteCode] = useState(institution?.dteCode || '');
  const [msbteCode, setMsbteCode] = useState(institution?.msbteCode || '');
  const [pciCode, setPciCode] = useState(institution?.pciCode || '');
  const [affiliatedBoard, setAffiliatedBoard] = useState(institution?.affiliatedBoard || 'Maharashtra State Board of Technical Education (MSBTE)');
  const [logoUrl, setLogoUrl] = useState(institution?.logoUrl || '');
  const [academicYear, setAcademicYear] = useState(institution?.academicYear || '2025-2026');
  const [currentTerm, setCurrentTerm] = useState(institution?.currentTerm || 'Odd Semester / Year 1');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleQuickFillSample = () => {
    setName('D. P. Kharde Navjeevan College of Pharmacy, Sinnar');
    setShortName('DPKCOP');
    setDepartmentName('Department of Pharmacy');
    setAisheCode('S-22693');
    setDteCode('5539');
    setMsbteCode('62386');
    setPciCode('9178');
    setAffiliatedBoard('Maharashtra State Board of Technical Education (MSBTE)');
    setAcademicYear('2025-2026');
    setCurrentTerm('Odd Semester / Year 1');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await onSaveInstitution({
        id: institution?.id || 'inst-1',
        name,
        shortName,
        departmentName,
        aisheCode,
        dteCode,
        msbteCode,
        pciCode,
        affiliatedBoard,
        logoUrl,
        academicYear,
        currentTerm,
        curriculumScheme: 'MSBTE J-Scheme / PCI ER-2020',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSample = async () => {
    setLoadingSample(true);
    try {
      handleQuickFillSample();
      await onLoadSampleDataset();
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      
      {/* Crisp White Top Banner Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Welcome to Faculty AI Genie</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Configure Educational Institution
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Define statutory identifiers (AISHE, DTE, MSBTE &amp; PCI Codes), branding badges, and bulk-onboard Students, Faculty, and Course Curriculum.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleQuickFillSample}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Quick Fill Info</span>
            </button>
            <button
              type="button"
              disabled={loadingSample}
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" />
              <span>{loadingSample ? 'Loading Dataset...' : 'Load Sample Curriculum (D.Pharm)'}</span>
            </button>
          </div>
        </div>

        {/* Clean Light Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Institution Status</span>
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{institution?.name ? 'Configured' : 'Awaiting Setup'}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student Master</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{studentCount} Enrolled</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faculty Master</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{facultyCount} Active Members</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject Curriculum</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm truncate">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{hasSubject ? subjectTitle || 'Active' : 'Empty / Unloaded'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Institutional Identity &amp; Statutory Dossier</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These credentials populate regulatory headers, PCI compliance dossiers, and MSBTE J-Scheme marksheets.
            </p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name and Acronym */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. D. P. Kharde Navjeevan College of Pharmacy, Sinnar"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Acronym / Short Name *
              </label>
              <input
                type="text"
                required
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. DPKCOP"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Department & Affiliated Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Department Name *
              </label>
              <input
                type="text"
                required
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Department of Pharmacy"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Affiliated Board / University
              </label>
              <input
                type="text"
                value={affiliatedBoard}
                onChange={(e) => setAffiliatedBoard(e.target.value)}
                placeholder="Maharashtra State Board of Technical Education (MSBTE)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: The 4 Statutory Codes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                AISHE Code
              </label>
              <input
                type="text"
                value={aisheCode}
                onChange={(e) => setAisheCode(e.target.value)}
                placeholder="e.g. S-22693"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                DTE Code
              </label>
              <input
                type="text"
                value={dteCode}
                onChange={(e) => setDteCode(e.target.value)}
                placeholder="e.g. 5539"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                MSBTE Code
              </label>
              <input
                type="text"
                value={msbteCode}
                onChange={(e) => setMsbteCode(e.target.value)}
                placeholder="e.g. 62386"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                PCI Code
              </label>
              <input
                type="text"
                value={pciCode}
                onChange={(e) => setPciCode(e.target.value)}
                placeholder="e.g. 9178"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Academic Year & Term */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Current Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025-2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Current Term / Semester
              </label>
              <input
                type="text"
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value)}
                placeholder="Odd Semester / Year 1"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onResetDatabase}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database to Empty State</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Institution Profile'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default InstitutionSetupView;
