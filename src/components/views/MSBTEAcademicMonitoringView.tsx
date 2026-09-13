import React, { useState } from 'react';
import {
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Building2,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, StudentMaster } from '../../types';
import { InstitutionSeal } from '../InstitutionSeal';

interface MSBTEAcademicMonitoringViewProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
}

export const MSBTEAcademicMonitoringView: React.FC<MSBTEAcademicMonitoringViewProps> = ({
  institution,
  subject,
  students = [],
}) => {
  const [monitoringType, setMonitoringType] = useState<'IAMC' | 'EAM'>('IAMC');
  const [selectedTerm, setSelectedTerm] = useState<'TERM_1' | 'TERM_2'>('TERM_1');

  const instName = institution?.name || 'D. P. Kharde Navjeevan College of Pharmacy';
  const aishe = institution?.aisheCode || 'S-22693';
  const dte = institution?.dteCode || '5539';
  const msbte = institution?.msbteCode || '0182';
  const pci = institution?.pciCode || 'PCI-2041';
  const subTitle = subject?.title || 'Pharmaceutics-I (Course Code: 20111)';

  // Defaulters calculation
  const defaulters = students.filter((s) => s.isDefaulter || s.attendanceTheoryPercentage < 75);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['MAHARASHTRA STATE BOARD OF TECHNICAL EDUCATION (MSBTE), MUMBAI'],
      ['OFFICIAL ACADEMIC MONITORING DOSSIER - CIAAN-2023'],
      [`INSTITUTION: ${instName}`],
      [`AISHE: ${aishe}`, `DTE: ${dte}`, `MSBTE: ${msbte}`, `PCI: ${pci}`],
      [`SUBJECT: ${subTitle}`, `MONITORING TYPE: ${monitoringType === 'IAMC' ? 'Internal (IAMC)' : 'External (EAM/CIAAN)'}`],
      [],
    ];

    if (monitoringType === 'IAMC') {
      rows.push(['--- INTERNAL ACADEMIC MONITORING COMMITTEE (IAMC) SUMMARY ---']);
      rows.push(['Unit No', 'Unit Title', 'Prescribed Hours', 'Conducted Hours', 'Planned %', 'Actual Velocity %', 'Status']);
      rows.push(['1', 'Introduction to Pharmacopoeias & Packaging', '12', '12', '100%', '100%', 'Completed as Planned']);
      rows.push(['2', 'Solid Dosage Forms & Coating', '18', '17', '100%', '94.4%', 'On Track']);
      rows.push(['3', 'Liquid Dosage Forms & Emulsions', '15', '13', '100%', '86.7%', 'On Track']);
      rows.push(['4', 'Semisolids & Suppositories', '14', '11', '100%', '78.6%', 'Remedial Planned']);
      rows.push(['5', 'Sterile Formulations & Cleanroom', '16', '13', '100%', '81.2%', 'On Track']);
      rows.push([]);
      rows.push(['--- ATTENDANCE DEFAULTER AUDIT (<75%) ---']);
      rows.push(['Roll No', 'PRN', 'Student Name', 'Theory %', 'Practical %', 'Parent Notified', 'Undertaking Signed']);
      defaulters.forEach((st) => {
        rows.push([st.rollNo, st.prn, st.name, `${st.attendanceTheoryPercentage}%`, `${st.attendancePracticalPercentage}%`, 'Yes (WhatsApp/Call)', 'Signed by Guardian']);
      });
    } else {
      rows.push(['--- EXTERNAL ACADEMIC MONITORING (EAM / CIAAN) KPI GRADES ---']);
      rows.push(['Sr', 'Monitoring Parameter', 'Max Marks', 'Awarded Marks', 'Grade', 'Remarks']);
      rows.push(['1', 'Teaching Plan (PH-1) & Daily Diary Adherence', '10', '9.5', 'Excellent', 'Rigorous topic mapping and zero date slippage']);
      rows.push(['2', 'Laboratory Plan & Continuous Rubrics (PH-2/PH-3)', '10', '9.2', 'Excellent', 'All 15 experiments graded on 10M continuous rubric']);
      rows.push(['3', 'Progressive Assessment & Sessional Exams (PH-4 to PH-7)', '10', '9.6', 'Excellent', 'Best-of-two scaled accurately to 20M per PCI']);
      rows.push(['4', 'Outcome Based Education & CO-PO Attainment', '10', '8.5', 'Very Good', 'CO targets attained with direct assessment rubrics']);
      rows.push(['5', 'Defaulter Mechanism & Remedial Mentoring', '10', '9.0', 'Excellent', '1:20 mentor ratio active with parent contact records']);
      rows.push(['6', 'Student Feedback & Continuous Improvement ATRs', '10', '8.4', 'Very Good', 'Action Taken Reports endorsed by HOD']);
      rows.push(['7', 'Industrial & Hospital Field Visits (PH-10)', '10', '9.6', 'Excellent', 'Mandatory cGMP & Civil Hospital visit verified']);
      rows.push(['8', 'Continuous Assignments Marksheet (PH-11)', '10', '8.6', 'Very Good', '3 assignments per year mapped to cognitive COs']);
      rows.push(['9', 'PCI Laboratories & Equipment Dead-Stock', '10', '9.3', 'Excellent', 'All 6 labs operational with valid calibration records']);
      rows.push(['10', 'Institutional Compliance & Administrative Hygiene', '10', '8.8', 'Very Good', 'Syllabus copy, academic calendar, notices complete']);
      rows.push([], ['TOTAL SCORE', '', '100', '90.5', 'EXCELLENT', 'Recommended for Highest MSBTE Rating']);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MSBTE_${monitoringType}_Monitoring_Report_${instName.substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              MSBTE CIAAN-2023 Statutory Suite
            </span>
            <span className="text-xs text-slate-500 font-medium">Academic Monitoring Dossier</span>
          </div>
          <h2 className="text-base font-black text-slate-900">
            Official MSBTE Academic Monitoring Dossier
          </h2>
          <p className="text-xs text-slate-500">
            Internal Academic Monitoring (IAMC) & External Inspection Evaluation (EAM / CIAAN)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMonitoringType('IAMC')}
              className={`px-3 py-1.5 rounded-lg transition ${
                monitoringType === 'IAMC'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Internal Monitoring (IAMC)
            </button>
            <button
              onClick={() => setMonitoringType('EAM')}
              className={`px-3 py-1.5 rounded-lg transition ${
                monitoringType === 'EAM'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              External Monitoring (EAM)
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
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Statutory Report Container */}
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
                MAHARASHTRA STATE BOARD OF TECHNICAL EDUCATION (MSBTE), MUMBAI
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
                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">PCI: {pci}</span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-slate-900 text-amber-400 font-mono">
                {monitoringType === 'IAMC' ? 'IAMC-REPORT' : 'EAM-CIAAN'}
              </span>
              <div className="text-[10px] text-slate-500 font-mono mt-1">AY 2025-2026</div>
            </div>
          </div>

          <div className="bg-slate-900 text-white py-1 px-4 w-full rounded text-xs font-bold uppercase tracking-wider mt-2">
            {monitoringType === 'IAMC'
              ? 'INTERNAL ACADEMIC MONITORING COMMITTEE (IAMC) AUDIT REPORT'
              : 'EXTERNAL ACADEMIC MONITORING (EAM / CIAAN-2023) KPI EVALUATION DOSSIER'}
          </div>
        </div>

        {/* Course & Inspection Identity Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Course Title</span>
            <span className="font-bold text-slate-900">{subTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Curriculum Pattern</span>
            <span className="font-bold text-slate-900">MSBTE J-Scheme (PCI ER-2020)</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Department / Section</span>
            <span className="font-bold text-slate-900">Department of Pharmacy</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Monitoring Schedule</span>
            <span className="font-bold text-emerald-700">Audit Completed & Endorsed</span>
          </div>
        </div>

        {/* CONTENT 1: IAMC INTERNAL MONITORING */}
        {monitoringType === 'IAMC' ? (
          <div className="space-y-6">
            {/* Section A: Syllabus Execution Velocity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Section A: Theory Syllabus Execution Velocity (PH-1 Adherence)
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Overall Velocity: 88.0% (On Schedule)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Unit No.</th>
                      <th className="p-2.5">Unit Chapter Title</th>
                      <th className="p-2.5 text-center">Prescribed Hrs</th>
                      <th className="p-2.5 text-center">Planned Hrs</th>
                      <th className="p-2.5 text-center">Conducted Hrs</th>
                      <th className="p-2.5 text-center">Execution %</th>
                      <th className="p-2.5 text-center">Velocity Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold text-center">1</td>
                      <td className="p-2.5 font-medium">History, Pharmacopoeias (IP/BP/USP) & Packaging Materials</td>
                      <td className="p-2.5 text-center font-mono">12</td>
                      <td className="p-2.5 text-center font-mono">12</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">12</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-600">100.0%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">Completed</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-center">2</td>
                      <td className="p-2.5 font-medium">Solid Dosage Forms, Granulation & Tablet Coating Technology</td>
                      <td className="p-2.5 text-center font-mono">18</td>
                      <td className="p-2.5 text-center font-mono">18</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">17</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-600">94.4%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">On Schedule</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-center">3</td>
                      <td className="p-2.5 font-medium">Liquid Dosage Forms, Suspensions & Biphasic Emulsions</td>
                      <td className="p-2.5 text-center font-mono">15</td>
                      <td className="p-2.5 text-center font-mono">15</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">13</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-600">86.7%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">On Schedule</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-center">4</td>
                      <td className="p-2.5 font-medium">Semisolid Formulations, Ointments, Pastes & Suppositories</td>
                      <td className="p-2.5 text-center font-mono">14</td>
                      <td className="p-2.5 text-center font-mono">14</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">11</td>
                      <td className="p-2.5 text-center font-mono font-bold text-amber-600">78.6%</td>
                      <td className="p-2.5 text-center font-bold text-amber-700 bg-amber-50/50">Remedial Extra Hrs</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-center">5</td>
                      <td className="p-2.5 font-medium">Sterile Formulations, Cleanroom Engineering & Parenterals</td>
                      <td className="p-2.5 text-center font-mono">16</td>
                      <td className="p-2.5 text-center font-mono">16</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">13</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-600">81.2%</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">On Schedule</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                    <tr>
                      <td colSpan={2} className="p-2.5 text-right font-bold uppercase text-[11px]">Cumulative Total</td>
                      <td className="p-2.5 text-center font-mono">75</td>
                      <td className="p-2.5 text-center font-mono">75</td>
                      <td className="p-2.5 text-center font-mono text-indigo-700">66</td>
                      <td className="p-2.5 text-center font-mono text-emerald-700 font-bold">88.0%</td>
                      <td className="p-2.5 text-center text-emerald-700">Satisfactory</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Section B: Attendance Defaulter Audit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Section B: Statutory Attendance Defaulter Audit (&lt;75% Cutoff)
                </h3>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {defaulters.length} Defaulters Identified & Contacted
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">PRN</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5 text-center">Theory Att. %</th>
                      <th className="p-2.5 text-center">Practical Att. %</th>
                      <th className="p-2.5 text-center">Deficit %</th>
                      <th className="p-2.5">Parent Notification Status</th>
                      <th className="p-2.5">Remedial Action Undertaken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {defaulters.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-slate-400 italic">
                          Zero attendance defaulters. All students have attendance ≥ 75%.
                        </td>
                      </tr>
                    ) : (
                      defaulters.map((st) => (
                        <tr key={st.id} className="bg-rose-50/20">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{st.rollNo}</td>
                          <td className="p-2.5 font-mono text-[11px]">{st.prn}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{st.name}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-rose-600">
                            {st.attendanceTheoryPercentage}%
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-rose-600">
                            {st.attendancePracticalPercentage}%
                          </td>
                          <td className="p-2.5 text-center font-mono text-rose-700 font-bold">
                            {(75 - Math.min(st.attendanceTheoryPercentage, st.attendancePracticalPercentage)).toFixed(1)}%
                          </td>
                          <td className="p-2.5 text-slate-600">
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Parent Meeting & Undertaking
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">
                            Assigned 8 hours compensatory makeup practicals & weekly mentor log.
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: IAMC Signatures Block */}
            <div className="pt-6 border-t border-slate-300">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-6">
                Internal Academic Monitoring Committee (IAMC) Endorsement & Sign-Off
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="border-t border-slate-400 pt-2 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Prof. Ananya Deshmukh</div>
                  <div className="text-[10px] text-slate-500">NBA & IAMC Coordinator</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">✓ Verified</div>
                </div>
                <div className="border-t border-slate-400 pt-2 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Rajesh Sharma</div>
                  <div className="text-[10px] text-slate-500">HOD, Pharmaceutics</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">✓ Endorsed</div>
                </div>
                <div className="border-t border-slate-400 pt-2 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Sunita V. Patil</div>
                  <div className="text-[10px] text-slate-500">HOD, Pharma Chemistry</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">✓ Endorsed</div>
                </div>
                <div className="border-t border-slate-400 pt-2 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Nitin K. Kharde</div>
                  <div className="text-[10px] text-slate-500">Principal & IAMC Chairman</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">✓ Approved</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CONTENT 2: EAM EXTERNAL ACADEMIC MONITORING */
          <div className="space-y-6">
            {/* EAM KPI Parameter Scoring Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  MSBTE External Monitoring Evaluation (10 Key Parameters per CIAAN-2023)
                </h3>
                <div className="text-xs font-black text-white bg-emerald-600 px-3 py-1 rounded-full shadow-xs">
                  Overall CIAAN Grade: EXCELLENT (90.5 / 100)
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 text-center">Sr.</th>
                      <th className="p-2.5">Key Monitoring Parameter</th>
                      <th className="p-2.5 text-center">Max Marks</th>
                      <th className="p-2.5 text-center">Awarded</th>
                      <th className="p-2.5 text-center">Evaluation Grade</th>
                      <th className="p-2.5">Committee Observations & Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-2.5 text-center font-bold">1</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Teaching Plan (PH-1) & Teacher Diary Adherence
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">9.5</td>
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50">Excellent</td>
                      <td className="p-2.5 text-slate-600">
                        Comprehensive topic-level breakdown with zero date deviation and accurate CO tags.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">2</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Laboratory Plan & Continuous Rubrics (PH-2 & PH-3)
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">9.2</td>
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50">Excellent</td>
                      <td className="p-2.5 text-slate-600">
                        All 15 experiments graded continuously with 10M rubric (Performance, Journal, Viva).
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">3</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Progressive Assessment & Sessional Exams (PH-4 to PH-7)
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">9.6</td>
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50">Excellent</td>
                      <td className="p-2.5 text-slate-600">
                        Statutory best-of-two averaging accurately scaled to 20M per PCI ER-2020.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">4</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Outcome Based Education (OBE) & CO-PO Attainment
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">8.5</td>
                      <td className="p-2.5 text-center font-black text-blue-700 bg-blue-50">Very Good</td>
                      <td className="p-2.5 text-slate-600">
                        Direct assessment matrices verified; attainment targets met for 4 out of 5 COs.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">5</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Defaulter Tracking & Mentor-Mentee Counseling
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">9.0</td>
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50">Excellent</td>
                      <td className="p-2.5 text-slate-600">
                        1:20 mentor-mentee ratio strictly maintained; parental call logs documented.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">6</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Student Feedback & Continuous Improvement ATRs
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">8.4</td>
                      <td className="p-2.5 text-center font-black text-blue-700 bg-blue-50">Very Good</td>
                      <td className="p-2.5 text-slate-600">
                        Action Taken Reports endorsed by HOD for lower scoring units.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">7</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Industrial & Hospital Field Visits (PH-10)
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">9.6</td>
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50">Excellent</td>
                      <td className="p-2.5 text-slate-600">
                        Mandatory cGMP pharmaceutical plant and 300-bed civil hospital logs verified.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">8</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Continuous Assignments Marksheet (PH-11)
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">8.6</td>
                      <td className="p-2.5 text-center font-black text-blue-700 bg-blue-50">Very Good</td>
                      <td className="p-2.5 text-slate-600">
                        Standardized assignment rubrics mapped to Bloom's taxonomy levels L1-L4.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">9</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        PCI Laboratories & Equipment Dead-Stock Registers
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">9.3</td>
                      <td className="p-2.5 text-center font-black text-emerald-700 bg-emerald-50">Excellent</td>
                      <td className="p-2.5 text-slate-600">
                        6 mandatory labs equipped with working digital balances, dissolution test, LAF.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-bold">10</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        Institutional Compliance & Administrative Records
                      </td>
                      <td className="p-2.5 text-center font-mono">10</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">8.8</td>
                      <td className="p-2.5 text-center font-black text-blue-700 bg-blue-50">Very Good</td>
                      <td className="p-2.5 text-slate-600">
                        AICTE, DTE, MSBTE and PCI approvals up to date; academic calendar adhered.
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-bold">
                    <tr>
                      <td colSpan={2} className="p-3 text-right uppercase text-xs">
                        Grand Cumulative Total / 100
                      </td>
                      <td className="p-3 text-center font-mono text-xs">100</td>
                      <td className="p-3 text-center font-mono text-amber-400 text-sm">90.5</td>
                      <td className="p-3 text-center text-emerald-400 uppercase text-xs tracking-wider">
                        EXCELLENT
                      </td>
                      <td className="p-3 text-xs text-slate-300">
                        Eligible for 3-Year Re-Accreditation & Commendation
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* External Monitoring Committee Endorsement Block */}
            <div className="pt-6 border-t border-slate-300">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-6">
                External Academic Monitoring Committee (EAM) Statutory Endorsement
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="border-t border-slate-400 pt-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Arvind M. Kulkarni</div>
                  <div className="text-[10px] text-slate-500">Principal, Govt. Polytechnic (External Member 1)</div>
                  <div className="text-[10px] font-mono text-slate-400">Signature: ______________________</div>
                </div>
                <div className="border-t border-slate-400 pt-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Mr. Sanjay P. Deshmukh</div>
                  <div className="text-[10px] text-slate-500">VP Quality, Glenmark Pharma (Industry Expert Member 2)</div>
                  <div className="text-[10px] font-mono text-slate-400">Signature: ______________________</div>
                </div>
                <div className="border-t border-slate-400 pt-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Dr. Prakash R. Wani</div>
                  <div className="text-[10px] text-slate-500">MSBTE Board Nominee & EAM Committee Chairman</div>
                  <div className="text-[10px] font-mono text-slate-400">Signature: ______________________</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
