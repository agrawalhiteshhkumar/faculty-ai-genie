import React, { useState } from 'react';
import {
  Printer,
  Download,
  Building2,
  Users,
  Award,
  CheckCircle2,
  FileCheck2,
  ClipboardList,
  Clock,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { InstitutionProfile } from '../../types';
import { InstitutionSeal } from '../InstitutionSeal';
import { DPK_STAFF_SEATS, DPK_PCI_LABS } from '../../data/pciStaffAndLabsData';

interface PCIComplianceHubViewProps {
  institution: InstitutionProfile | null;
}

interface InternshipRecord {
  id: string;
  studentRoll: string;
  studentName: string;
  hospitalName: string;
  hospitalType: 'GOVT_CIVIL' | 'NABH_PRIVATE' | 'COMMUNITY_PHARMACY';
  preceptorPharmacist: string;
  preceptorPciRegNo: string;
  startDate: string;
  endDate: string;
  hoursCompleted: number;
  totalPrescribedHours: number;
  competencies: {
    dispensing: boolean;
    storageAndInventory: boolean;
    patientCounseling: boolean;
    medicationHistory: boolean;
    adrReporting: boolean;
  };
  preceptorSignOff: 'APPROVED' | 'IN_PROGRESS' | 'PENDING_REVIEW';
  certificateIssued: boolean;
  certificateNumber: string;
}

const SAMPLE_INTERNSHIPS: InternshipRecord[] = [
  {
    id: 'int-001',
    studentRoll: 'SY-01',
    studentName: 'Aarav Patil',
    hospitalName: 'District Civil Hospital, Nashik (450-Bedded Tertiary Center)',
    hospitalType: 'GOVT_CIVIL',
    preceptorPharmacist: 'Dr. Ramesh G. Joshi, Chief Pharmacist',
    preceptorPciRegNo: 'PCI-MAH-110294',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    hoursCompleted: 500,
    totalPrescribedHours: 500,
    competencies: {
      dispensing: true,
      storageAndInventory: true,
      patientCounseling: true,
      medicationHistory: true,
      adrReporting: true,
    },
    preceptorSignOff: 'APPROVED',
    certificateIssued: true,
    certificateNumber: 'DPK/PCI-TRG/2025/001',
  },
  {
    id: 'int-002',
    studentRoll: 'SY-02',
    studentName: 'Priya Sharma',
    hospitalName: 'Apollo Hospitals & Medical Research Centre, Nashik',
    hospitalType: 'NABH_PRIVATE',
    preceptorPharmacist: 'Mrs. Rekha S. Nair, Head Clinical Pharmacist',
    preceptorPciRegNo: 'PCI-MAH-134981',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    hoursCompleted: 500,
    totalPrescribedHours: 500,
    competencies: {
      dispensing: true,
      storageAndInventory: true,
      patientCounseling: true,
      medicationHistory: true,
      adrReporting: true,
    },
    preceptorSignOff: 'APPROVED',
    certificateIssued: true,
    certificateNumber: 'DPK/PCI-TRG/2025/002',
  },
  {
    id: 'int-003',
    studentRoll: 'SY-03',
    studentName: 'Rohan Deshpande',
    hospitalName: 'Nashik Municipal Corporation General Hospital, CIDCO',
    hospitalType: 'GOVT_CIVIL',
    preceptorPharmacist: 'Mr. Vilas T. Shinde, Senior Pharmacist',
    preceptorPciRegNo: 'PCI-MAH-098210',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    hoursCompleted: 420,
    totalPrescribedHours: 500,
    competencies: {
      dispensing: true,
      storageAndInventory: true,
      patientCounseling: false,
      medicationHistory: true,
      adrReporting: false,
    },
    preceptorSignOff: 'IN_PROGRESS',
    certificateIssued: false,
    certificateNumber: 'PENDING',
  },
  {
    id: 'int-004',
    studentRoll: 'SY-04',
    studentName: 'Snehal Jagtap',
    hospitalName: 'Sahyadri Super Speciality Hospital, Nashik',
    hospitalType: 'NABH_PRIVATE',
    preceptorPharmacist: 'Dr. Vivek Kulkarni, Chief of Pharmacy Services',
    preceptorPciRegNo: 'PCI-MAH-145620',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    hoursCompleted: 500,
    totalPrescribedHours: 500,
    competencies: {
      dispensing: true,
      storageAndInventory: true,
      patientCounseling: true,
      medicationHistory: true,
      adrReporting: true,
    },
    preceptorSignOff: 'APPROVED',
    certificateIssued: true,
    certificateNumber: 'DPK/PCI-TRG/2025/004',
  },
];

export const PCIComplianceHubView: React.FC<PCIComplianceHubViewProps> = ({
  institution,
}) => {
  const [activeTab, setActiveTab] = useState<'SIF' | 'INTERNSHIP'>('SIF');
  const [selectedInternship, setSelectedInternship] = useState<InternshipRecord | null>(null);

  const instName = institution?.name || 'D. P. Kharde Navjeevan College of Pharmacy';
  const aishe = institution?.aisheCode || 'S-22693';
  const dte = institution?.dteCode || '5539';
  const msbte = institution?.msbteCode || '0182';
  const pci = institution?.pciCode || 'PCI-2041';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['PHARMACY COUNCIL OF INDIA (PCI) NEW DELHI'],
      ['STANDARD STATUTORY COMPLIANCE & SIF DOSSIER'],
      [`INSTITUTION: ${instName}`],
      [`AISHE: ${aishe}`, `DTE: ${dte}`, `MSBTE: ${msbte}`, `PCI CODE: ${pci}`],
      ['APPROVED ANNUAL INTAKE: 60 SEATS (D.PHARM ANNUAL PATTERN)'],
      [],
    ];

    if (activeTab === 'SIF') {
      rows.push(['--- FACULTY CADRE & PCI REGISTRATION DIRECTORY ---']);
      rows.push(['Emp Code', 'Faculty Name', 'Designation', 'Qualification', 'PCI Reg No', 'Experience (Yrs)', 'Cadre Status']);
      DPK_STAFF_SEATS.forEach((f) => {
        rows.push([f.empCode, f.name, f.designation, f.qualification, f.pciRegNo, `${f.experienceYears} Years`, f.status]);
      });
      rows.push([]);
      rows.push(['--- PCI MANDATORY LABORATORIES VERIFICATION ---']);
      rows.push(['Lab No', 'Lab Name', 'Area (sq.m)', 'PCI Prescribed', 'Intake Capacity', 'Faculty Incharge', 'Total Equipment']);
      DPK_PCI_LABS.forEach((lab) => {
        rows.push([lab.labNumber, lab.name, `${lab.areaSqM} sq.m`, 'Mandatory', `${lab.intakeCapacity}/batch`, lab.inChargeFacultyName, `${lab.equipmentCount}`]);
      });
    } else {
      rows.push(['--- PCI CHAPTER VI: 500-HOUR HOSPITAL TRAINING REGISTER ---']);
      rows.push(['Roll No', 'Student Name', 'Hospital / Training Centre', 'Preceptor Pharmacist', 'Preceptor PCI Reg', 'Hours Completed', 'Total Prescribed', 'Preceptor Endorsement', 'Certificate No']);
      SAMPLE_INTERNSHIPS.forEach((rec) => {
        rows.push([
          rec.studentRoll,
          rec.studentName,
          rec.hospitalName,
          rec.preceptorPharmacist,
          rec.preceptorPciRegNo,
          `${rec.hoursCompleted}`,
          '500 Hours',
          rec.preceptorSignOff,
          rec.certificateNumber,
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PCI_Compliance_${activeTab}_${instName.substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              PCI Statutory Compliance Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">PCI ER-2020 Statutory Engine</span>
          </div>
          <h2 className="text-base font-black text-slate-900">
            Pharmacy Council of India (PCI) Compliance & SIF Portal
          </h2>
          <p className="text-xs text-slate-500">
            Standard Inspection Format (SIF-A / SIF-C) & Chapter VI 500-Hour Practical Training Suite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('SIF')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'SIF'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SIF-A / SIF-C Dossier
            </button>
            <button
              onClick={() => setActiveTab('INTERNSHIP')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'INTERNSHIP'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              500-Hr Internship Tracker
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Dossier
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Statutory College Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center relative flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <InstitutionSeal
              logoUrl={institution?.logoUrl}
              size="md"
              institutionName={instName}
              shortName={institution?.shortName || 'DPK'}
            />
            <div className="text-center flex-1 px-4">
              <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                PHARMACY COUNCIL OF INDIA (PCI), NEW DELHI
              </div>
              <h1 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                {instName}
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Navjeevan Knowledge City, CIDCO, Nashik - 422008, Maharashtra
              </p>
              <div className="text-[10px] font-mono font-bold text-slate-700 mt-1 flex items-center justify-center gap-3">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">AISHE: {aishe}</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">DTE: {dte}</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">MSBTE: {msbte}</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-black text-emerald-800">
                  PCI CODE: {pci}
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-emerald-700 text-white font-mono">
                {activeTab === 'SIF' ? 'PCI-SIF-2025' : 'PCI-CHAP-VI'}
              </span>
              <div className="text-[10px] text-slate-500 font-mono mt-1">60 Approved Seats</div>
            </div>
          </div>

          <div className="bg-emerald-800 text-white py-1 px-4 w-full rounded text-xs font-bold uppercase tracking-wider mt-2">
            {activeTab === 'SIF'
              ? 'STANDARD INSPECTION FORMAT (SIF-A / SIF-C) STATUTORY AUDIT REPORT'
              : 'PCI CHAPTER VI: 500-HOUR PRACTICAL HOSPITAL & COMMUNITY PHARMACY TRAINING DOSSIER'}
          </div>
        </div>

        {/* TAB 1: SIF-A / SIF-C DOSSIER */}
        {activeTab === 'SIF' ? (
          <div className="space-y-6">
            {/* SIF Cadre Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned Intake</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block font-mono">60 Seats / Year</span>
                <span className="text-[10px] text-emerald-600 font-medium">100% Filled</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Cadre</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block font-mono">24 Teaching Faculty</span>
                <span className="text-[10px] text-emerald-600 font-medium">Cadre Ratio: 1:15 (Exceeds 1:20)</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">PCI Registered Staff</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block font-mono">100% Certified</span>
                <span className="text-[10px] text-emerald-600 font-medium">Valid State Pharmacy Council</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandatory PCI Labs</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block font-mono">6 Laboratories</span>
                <span className="text-[10px] text-emerald-600 font-medium">Total Area: 582.5 sq.m</span>
              </div>
            </div>

            {/* Teaching Cadre Table with PCI Registration Numbers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  Section 1: Faculty Cadre Register & Statutory PCI Registration Numbers
                </h3>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Total Allocated: {DPK_STAFF_SEATS.filter((s) => s.role !== 'PLATFORM_SUPER_ADMIN').length} / 10 Teaching & Technical Staff
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Emp Code</th>
                      <th className="p-2.5">Faculty Name</th>
                      <th className="p-2.5">Designation</th>
                      <th className="p-2.5">Qualification</th>
                      <th className="p-2.5">PCI Reg. Number</th>
                      <th className="p-2.5 text-center">Experience</th>
                      <th className="p-2.5">Assigned Section / Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {DPK_STAFF_SEATS.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                          No faculty records loaded. Faculty Directory is clean slate (0 / 10 seats allocated). Add teaching faculty in Staff Directory or upload CSV roster.
                        </td>
                      </tr>
                    ) : (
                      DPK_STAFF_SEATS.slice(1, 15).map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-900">{staff.empCode}</td>
                        <td className="p-2.5 font-bold text-slate-900">{staff.name}</td>
                        <td className="p-2.5 text-slate-600">{staff.designation}</td>
                        <td className="p-2.5 font-medium text-slate-800">{staff.qualification}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                          {staff.pciRegNo}
                        </td>
                        <td className="p-2.5 text-center font-mono">{staff.experienceYears} Yrs</td>
                        <td className="p-2.5 text-slate-600">{staff.department}</td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PCI Laboratories Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Section 2: PCI Prescribed 6 Mandatory Laboratories Verification
              </h3>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Lab No.</th>
                      <th className="p-2.5">Laboratory Name</th>
                      <th className="p-2.5 text-center">Carpet Area</th>
                      <th className="p-2.5 text-center">Batch Capacity</th>
                      <th className="p-2.5">Faculty In-Charge</th>
                      <th className="p-2.5">Lab Assistant</th>
                      <th className="p-2.5 text-center">Major Equipment</th>
                      <th className="p-2.5 text-center">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {DPK_PCI_LABS.map((lab) => (
                      <tr key={lab.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-900">{lab.labNumber}</td>
                        <td className="p-2.5 font-bold text-slate-900">{lab.name}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-800">{lab.areaSqM} sq.m</td>
                        <td className="p-2.5 text-center font-mono">{lab.intakeCapacity} Students</td>
                        <td className="p-2.5 font-semibold text-slate-800">{lab.inChargeFacultyName}</td>
                        <td className="p-2.5 text-slate-600">{lab.labAssistantName}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700">
                          {lab.equipmentCount} Units
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            ✓ PCI Standard
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIF Statutory Endorsement Block */}
            <div className="pt-6 border-t border-slate-300">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-6">
                Institutional Statutory Head Endorsement (SIF Declaration)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                <div className="border-t border-slate-400 pt-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Rajesh Sharma</div>
                  <div className="text-[10px] text-slate-500">HOD & Academic Council Member (PCI Reg: 158302/A)</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">✓ Verified & Certified</div>
                </div>
                <div className="border-t border-slate-400 pt-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Nitin K. Kharde</div>
                  <div className="text-[10px] text-slate-500">Principal & Professor (PCI Reg: 142091/A)</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">✓ Officially Sealed & Approved</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: 500-HOUR PRACTICAL TRAINING (INTERNSHIP) TRACKER */
          <div className="space-y-6">
            {/* Mandatory Guidelines Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">
                  PCI Education Regulations 2020 – Chapter VI Mandatory Practical Training
                </span>
                <p className="mt-1 text-amber-800 leading-relaxed">
                  Every candidate shall undergo practical training in a Government Hospital, Municipal Corporation
                  Hospital, or recognized private hospital/community pharmacy of not less than <strong>500 hours spread over not less than three months</strong>. 
                  The preceptor registered pharmacist shall certify mastery of dispensing, patient counseling, and ADR reporting prior to board certificate grant.
                </p>
              </div>
            </div>

            {/* Internship Records Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-emerald-700" />
                  Second Year (SY) Pharmacy Hospital Internship Register
                </h3>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Prescribed Threshold: 500 Hours
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Allotted Hospital / Health Facility</th>
                      <th className="p-2.5">Preceptor Registered Pharmacist</th>
                      <th className="p-2.5 text-center">Hours Logged</th>
                      <th className="p-2.5 text-center">Competencies</th>
                      <th className="p-2.5 text-center">Preceptor Sign-off</th>
                      <th className="p-2.5 text-center">Statutory Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {SAMPLE_INTERNSHIPS.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-900">{rec.studentRoll}</td>
                        <td className="p-2.5 font-bold text-slate-900">{rec.studentName}</td>
                        <td className="p-2.5 text-slate-700">
                          <div className="font-semibold">{rec.hospitalName}</div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {rec.startDate} to {rec.endDate}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-800">{rec.preceptorPharmacist}</div>
                          <span className="text-[10px] font-mono text-emerald-700">
                            Reg: {rec.preceptorPciRegNo}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="font-mono font-bold text-slate-900">
                            {rec.hoursCompleted} / 500
                          </span>
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-1.5 rounded-full"
                              style={{ width: `${(rec.hoursCompleted / 500) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {Object.values(rec.competencies).filter(Boolean).length}/5 Mastered
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              rec.preceptorSignOff === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.preceptorSignOff}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          {rec.certificateIssued ? (
                            <button
                              onClick={() => setSelectedInternship(rec)}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline font-mono cursor-pointer"
                            >
                              {rec.certificateNumber}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Certificate Modal Preview if selected */}
            {selectedInternship && (
              <div className="bg-slate-50 border-2 border-dashed border-emerald-600 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Appendix-E: Practical Training Completion Certificate (Live Preview)
                  </span>
                  <button
                    onClick={() => setSelectedInternship(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                  >
                    Close Preview ✕
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-center space-y-3">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    PHARMACY COUNCIL OF INDIA • EDUCATION REGULATIONS 2020 (APPENDIX-E)
                  </div>
                  <h4 className="text-base font-black text-slate-900 uppercase">
                    PRACTICAL TRAINING COMPLETION CERTIFICATE FOR D.PHARM
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                    This is to certify that <strong>{selectedInternship.studentName}</strong> (Roll No: {selectedInternship.studentRoll}) 
                    of <strong>{instName}</strong> has satisfactorily undergone 
                    <strong> 500 hours</strong> of statutory hospital pharmacy practical training 
                    at <strong>{selectedInternship.hospitalName}</strong> under the professional preceptorship of 
                    <strong> {selectedInternship.preceptorPharmacist}</strong> (PCI Reg: {selectedInternship.preceptorPciRegNo}).
                  </p>
                  <div className="text-xs font-mono font-bold text-slate-700 pt-2">
                    Certificate Ref No: {selectedInternship.certificateNumber} • Date of Issue: 31-Aug-2025
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 mt-4 text-xs">
                    <div className="text-slate-700 font-semibold">
                      ____________________________________<br />
                      Preceptor Registered Pharmacist
                    </div>
                    <div className="text-slate-700 font-semibold">
                      ____________________________________<br />
                      Civil Surgeon / Medical Superintendent
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
