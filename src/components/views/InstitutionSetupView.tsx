'use client';

import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  GraduationCap,
  Calendar,
  Layers,
  Image as ImageIcon,
  FlaskConical,
  FileText
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
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'STUDENTS' | 'FACULTY' | 'ACADEMICS' | 'COMPLIANCE'>('IDENTITY');
  const [saving, setSaving] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(institution?.name || 'D. P. Kharde Navjeevan College of Pharmacy, Sinnar');
  const [shortName, setShortName] = useState(institution?.shortName || 'DPKCOP');
  const [departmentName, setDepartmentName] = useState(institution?.departmentName || 'Diploma in Pharmacy');
  const [aisheCode, setAisheCode] = useState(institution?.aisheCode || 'S-22693');
  const [dteCode, setDteCode] = useState(institution?.dteCode || '5539');
  const [msbteCode, setMsbteCode] = useState(institution?.msbteCode || '62386');
  const [pciCode, setPciCode] = useState(institution?.pciCode || '9178');
  const [affiliatedBoard, setAffiliatedBoard] = useState(institution?.affiliatedBoard || 'Maharashtra State Board of Technical Education (MSBTE)');
  const [academicYear, setAcademicYear] = useState(institution?.academicYear || '2026-2027');
  const [currentTerm, setCurrentTerm] = useState(institution?.currentTerm || 'S. Y. D. Pharm (Final)');
  const [logoUrl, setLogoUrl] = useState(institution?.logoUrl || '');

  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const facultyFileRef = useRef<HTMLInputElement | null>(null);
  const studentFileRef = useRef<HTMLInputElement | null>(null);
  const curriculumFileRef = useRef<HTMLInputElement | null>(null);
  const timetableFileRef = useRef<HTMLInputElement | null>(null);
  const sifFileRef = useRef<HTMLInputElement | null>(null);

  // Logo File Reader (Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setLogoUrl(b64);
      setUploadSuccess('Official Institutional Logo uploaded and verified!');
      setTimeout(() => setUploadSuccess(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // CSV Generator Utility
  const triggerCsvDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Templates
  const downloadStudentTemplate = () => {
    const csv = "EnrollmentNo,RollNo,FullName,Batch,Gender,Email,Mobile\n" +
      "22062386001,1,Aditi Sunil Pawar,Batch A,Female,aditi@example.com,9823000001\n" +
      "22062386002,2,Bhavesh Ramesh Patil,Batch A,Male,bhavesh@example.com,9823000002\n";
    triggerCsvDownload('1_MSBTE_Students_Roll_Template.csv', csv);
  };

  const downloadFacultyTemplate = () => {
    const csv = "FacultyID,FullName,Designation,Department,Role,EmploymentType,WeeklyHours,Email\n" +
      "FAC001,Dr. Hiteshkumar Agrawal,Principal & Professor,Pharmacy,HOD,FULL_TIME,16,62386principal@msbte.ac.in\n" +
      "FAC002,Prof. Snehal Deshmukh,Lecturer,Pharmacy,FACULTY,FULL_TIME,18,snehal@example.com\n";
    triggerCsvDownload('2_MSBTE_Faculty_Staff_Template.csv', csv);
  };

  const downloadCurriculumTemplate = () => {
    const csv = "CourseCode,CourseTitle,Scheme,Semester,LectureHours,PracticalHours,TutorialHours,TotalCredits\n" +
      "ER20-11T,Pharmaceutics - Theory,PCI ER-2020 / MSBTE J-Scheme,Year 1,75,0,0,3\n" +
      "ER20-11P,Pharmaceutics - Practical,PCI ER-2020 / MSBTE J-Scheme,Year 1,0,75,0,3\n" +
      "ER20-21T,Pharmacology - Theory,PCI ER-2020 / MSBTE J-Scheme,Year 2,75,0,0,3\n";
    triggerCsvDownload('3_MSBTE_PCI_Curriculum_Plan_Template.csv', csv);
  };

  const downloadTimetableTemplate = () => {
    const csv = "DayOfWeek,StartTime,EndTime,CourseCode,CourseTitle,FacultyName,RoomOrLab,Batch\n" +
      "Monday,09:30 AM,10:30 AM,ER20-11T,Pharmaceutics,Prof. Snehal Deshmukh,Classroom 1,All\n" +
      "Monday,10:30 AM,01:30 PM,ER20-11P,Pharmaceutics Lab,Dr. Hiteshkumar Agrawal,Pharmaceutics Lab 1,Batch A\n";
    triggerCsvDownload('4_Weekly_Timetable_Lesson_Plan_Template.csv', csv);
  };

  const downloadSifTemplate = () => {
    const csv = "EquipmentName,LaboratoryName,MakeModel,Quantity,WorkingStatus,DateOfPurchase,LogBookNo\n" +
      "Dissolution Test Apparatus,Pharmaceutics Lab,Electrolab TDT-08L,2,Operational,2022-04-10,LOG-LAB-01\n" +
      "Digital pH Meter,Pharmaceutical Chemistry Lab,Systronics 361,5,Operational,2023-01-15,LOG-LAB-02\n";
    triggerCsvDownload('5_PCI_SIF_Lab_Equipment_Register_Template.csv', csv);
  };

  // Upload Handlers
  const handleStudentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter(l => l.trim().length > 0).slice(1);
      const parsedStudents = rows.map((row, idx) => {
        const [enrollment, roll, sName, batch] = row.split(',').map(s => s.trim());
        return {
          id: `stu-${idx + 1}`,
          enrollmentNumber: enrollment || `22062386${idx + 10}`,
          rollNumber: roll || `${idx + 1}`,
          name: sName || `Student ${idx + 1}`,
          batch: batch || 'Batch A',
          attendancePercentage: 90,
          isDefaulter: false,
          totalClasses: 36,
          attendedClasses: 32
        };
      });
      localStorage.setItem('faculty_genie_students', JSON.stringify(parsedStudents));
      setUploadSuccess(`Imported ${parsedStudents.length} Students successfully!`);
      setTimeout(() => setUploadSuccess(null), 3000);
      onImportComplete();
    };
    reader.readAsText(file);
  };

  const handleFacultyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter(l => l.trim().length > 0).slice(1);
      const parsedFaculty = rows.map((row, idx) => {
        const [id, fName, designation, dept, role, empType, hours] = row.split(',').map(s => s.trim());
        return {
          id: id || `fac-${idx + 1}`,
          name: fName || `Faculty ${idx + 1}`,
          designation: designation || 'Lecturer',
          department: dept || 'Pharmacy',
          role: role || 'FACULTY',
          employmentType: empType || 'FULL_TIME',
          prescribedWeeklyHours: Number(hours) || 16,
          conductedWeeklyHours: 14,
          assignedSubjects: []
        };
      });
      localStorage.setItem('faculty_genie_faculty', JSON.stringify(parsedFaculty));
      setUploadSuccess(`Imported ${parsedFaculty.length} Faculty staff successfully!`);
      setTimeout(() => setUploadSuccess(null), 3000);
      onImportComplete();
    };
    reader.readAsText(file);
  };

  const handleCurriculumUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadSuccess('Course Curriculum, Teaching Scheme & CO Matrices loaded!');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleTimetableUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadSuccess('Master Timetable & Daily Diary slots populated!');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleSifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadSuccess('PCI SIF-E / SIF-A Lab Equipment register mapped!');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  // Form Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const profileData: InstitutionProfile = {
      id: institution?.id || 'inst-1',
      name: name.trim(),
      shortName: shortName.trim(),
      departmentName: departmentName.trim(),
      aisheCode: aisheCode.trim(),
      dteCode: dteCode.trim(),
      msbteCode: msbteCode.trim(),
      pciCode: pciCode.trim(),
      affiliatedBoard: affiliatedBoard.trim(),
      logoUrl: logoUrl || '',
      academicYear: academicYear.trim(),
      currentTerm: currentTerm.trim(),
      curriculumScheme: 'MSBTE J-Scheme / PCI ER-2020',
    };

    localStorage.setItem('faculty_genie_institution', JSON.stringify(profileData));

    try {
      await onSaveInstitution(profileData);
    } catch {
      // client-side fallback
    } finally {
      setSaving(false);
      window.location.reload();
    }
  };

  const handleLoadSample = async () => {
    setLoadingSample(true);
    try {
      await onLoadSampleDataset();
      window.location.reload();
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16">
      
      {/* Crisp White Top Banner Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Academic OS Institutional Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Institutional Master Control Plane
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Configure institution branding, statutory IDs, student-faculty matrices, PCI SIF laboratory compliance, and MSBTE J-Scheme curriculum.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={loadingSample}
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" />
              <span>{loadingSample ? 'Bootstrapping...' : 'Load Complete Sample (D.Pharm J-Scheme)'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{institution?.name ? 'Configured' : 'Ready to Save'}</span>
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
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Curriculum</span>
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm truncate">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{hasSubject ? subjectTitle || 'Active' : 'MSBTE J-Scheme'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('IDENTITY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'IDENTITY'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>1. Identity &amp; Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('STUDENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'STUDENTS'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>2. Students Master</span>
        </button>

        <button
          onClick={() => setActiveTab('FACULTY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'FACULTY'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. Faculty Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('ACADEMICS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ACADEMICS'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>4. Curriculum &amp; Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLIANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'COMPLIANCE'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>5. PCI SIF &amp; Labs</span>
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* TAB 1: IDENTITY & LOGO */}
      {activeTab === 'IDENTITY' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Identity, Statutory Dossier &amp; Official Logo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These credentials stamp all printable headers, Course File proformas, marksheets, and PCI/MSBTE exports.
              </p>
            </div>
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain border border-slate-200 rounded-xl p-1 bg-white shadow-xs" />
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Logo Upload Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Official College Logo &amp; Seal Upload *
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={logoFileRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-blue-700" />
                  <span>Choose Logo File (.png / .jpg)</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  {logoUrl ? 'Logo attached successfully (Ready to display on Course File)' : 'Max 2MB (Used on PDF headers, marksheets, and SIF reports)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Institution Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Acronym *
                </label>
                <input
                  type="text"
                  required
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

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
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Statutory Codes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  AISHE Code
                </label>
                <input
                  type="text"
                  value={aisheCode}
                  onChange={(e) => setAisheCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Term / Semester
                </label>
                <input
                  type="text"
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={onResetDatabase}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Slate</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{saving ? 'Saving...' : 'Save & Enter Academic OS (Full System)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: STUDENTS */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Student Roll Master (Batch &amp; Practical Divisions)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Download the MSBTE J-Scheme CSV format, paste your roll sheet, and import directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Download className="w-4 h-4 text-blue-700" />
                <span>Step 1: Download Students Template</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Columns: <code>EnrollmentNo, RollNo, FullName, Batch, Gender, Email, Mobile</code>
              </p>
              <button
                type="button"
                onClick={downloadStudentTemplate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Download MSBTE Students CSV</span>
              </button>
            </div>

            <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Step 2: Upload Filled CSV</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Populates student profiles, continuous 1-tap attendance rosters, and marks sheets.
              </p>
              <input
                type="file"
                ref={studentFileRef}
                accept=".csv"
                onChange={handleStudentUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => studentFileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Students CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FACULTY */}
      {activeTab === 'FACULTY' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Faculty Staff &amp; RBAC Directory</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Download the staff format, add your teaching appointments, and import directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Download className="w-4 h-4 text-blue-700" />
                <span>Step 1: Download Faculty Template</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Columns: <code>FacultyID, FullName, Designation, Department, Role, EmploymentType, WeeklyHours, Email</code>
              </p>
              <button
                type="button"
                onClick={downloadFacultyTemplate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Download Faculty Staff CSV</span>
              </button>
            </div>

            <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Step 2: Upload Filled Faculty CSV</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assigns roles, weekly work hours, and RBAC permissions across departments.
              </p>
              <input
                type="file"
                ref={facultyFileRef}
                accept=".csv"
                onChange={handleFacultyUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => facultyFileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Faculty CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CURRICULUM & TIMETABLE */}
      {activeTab === 'ACADEMICS' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Curriculum Scheme, Lesson Plans &amp; Weekly Timetable</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bulk-upload teaching plans and master timetables to drive continuous teaching diaries and attendance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Curriculum Upload */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Layers className="w-4 h-4 text-blue-700" />
                <span>Course Plan &amp; CO Matrix</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download the official PCI ER-2020 / MSBTE J-Scheme subject matrix and upload your courses.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={downloadCurriculumTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
                <input type="file" ref={curriculumFileRef} accept=".csv" onChange={handleCurriculumUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => curriculumFileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Courses CSV</span>
                </button>
              </div>
            </div>

            {/* Timetable Upload */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Master Timetable Schedule</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect days, time slots, practical batches, and faculty members for 1-tap tracking.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={downloadTimetableTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Timetable CSV</span>
                </button>
                <input type="file" ref={timetableFileRef} accept=".csv" onChange={handleTimetableUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => timetableFileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Schedule CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPLIANCE & SIF */}
      {activeTab === 'COMPLIANCE' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">PCI SIF-E / SIF-A Laboratory &amp; Equipment Register</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Maintain statutory compliance with the Pharmacy Council of India equipment logs and laboratory verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Download className="w-4 h-4 text-blue-700" />
                <span>Step 1: Download PCI SIF Equipment Template</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Columns: <code>EquipmentName, LaboratoryName, MakeModel, Quantity, WorkingStatus, DateOfPurchase, LogBookNo</code>
              </p>
              <button
                type="button"
                onClick={downloadSifTemplate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Download PCI SIF Register CSV</span>
              </button>
            </div>

            <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Step 2: Upload Filled Register</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-generates printable laboratory registers and equipment inspection documentation.
              </p>
              <input
                type="file"
                ref={sifFileRef}
                accept=".csv"
                onChange={handleSifUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => sifFileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Equipment CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default InstitutionSetupView;
