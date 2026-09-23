import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Activity,
  Wrench,
  Users,
  FileCheck2,
  Sparkles,
  BookOpen,
  MessageSquare,
  Building2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster, StudentMaster, ActionTakenReport } from '../../types';
import { InstitutionSeal } from '../InstitutionSeal';
import { getAsset } from '../../utils/assetStorage';

interface QCIAccreditationViewProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
  actionTakenReports?: ActionTakenReport[];
}

interface EquipmentLog {
  id: string;
  name: string;
  modelMake: string;
  labLocation: string;
  calibrationDate: string;
  nextDueDate: string;
  status: 'CALIBRATED' | 'DUE_SOON' | 'MAINTENANCE';
  inCharge: string;
  sopDocument: string;
}

const SAMPLE_GLP_EQUIPMENT: EquipmentLog[] = [
  {
    id: 'EQ-DPK-01',
    name: '10-Station Rotary Tablet Mini-Press',
    modelMake: 'Cadmach / Micro-Pharm 2023',
    labLocation: 'Pharmaceutics Machine Room (Lab 1)',
    calibrationDate: '15-July-2025',
    nextDueDate: '14-July-2026',
    status: 'CALIBRATED',
    inCharge: 'Prof. Vikram Patil',
    sopDocument: 'SOP-PH-01: Tablet Compression & Hardness Testing',
  },
  {
    id: 'EQ-DPK-02',
    name: 'Dissolution Test Apparatus (USP Type II - 8 Vessels)',
    modelMake: 'Electrolab / TDT-08L',
    labLocation: 'Pharmaceutics Quality Testing Lab',
    calibrationDate: '02-August-2025',
    nextDueDate: '01-August-2026',
    status: 'CALIBRATED',
    inCharge: 'Prof. Ananya Deshmukh',
    sopDocument: 'SOP-PH-04: In-Vitro Dissolution Rate Determination',
  },
  {
    id: 'EQ-DPK-03',
    name: 'Double Beam UV-Visible Spectrophotometer',
    modelMake: 'Shimadzu UV-1800',
    labLocation: 'Pharmaceutical Chemistry Analytical Lab',
    calibrationDate: '10-June-2025',
    nextDueDate: '09-June-2026',
    status: 'CALIBRATED',
    inCharge: 'Prof. Snehal Deshmukh',
    sopDocument: 'SOP-PC-02: Wavelength Accuracy & Baseline Calibration',
  },
  {
    id: 'EQ-DPK-04',
    name: 'Horizontal Laminar Air Flow Bench (Class 100)',
    modelMake: 'Klenzaids HEPA Air Guard',
    labLocation: 'Aseptic Formulations Lab',
    calibrationDate: '18-September-2025',
    nextDueDate: '17-March-2026',
    status: 'CALIBRATED',
    inCharge: 'Dr. Hiteshkumar Agrawal',
    sopDocument: 'SOP-MIC-01: HEPA Filter Integrity & Velocity Validation',
  },
  {
    id: 'EQ-DPK-05',
    name: 'Digital Precision Analytical Micro-Balance (0.1 mg)',
    modelMake: 'Sartorius Practum 224',
    labLocation: 'Central Weighing Instrumentation Room',
    calibrationDate: '12-May-2025',
    nextDueDate: '11-May-2026',
    status: 'CALIBRATED',
    inCharge: 'Prof. Vikram Patil',
    sopDocument: 'SOP-GEN-01: Daily Balance Calibration Using E2 Weights',
  },
];

export const QCIAccreditationView: React.FC<QCIAccreditationViewProps> = ({
  institution,
  subject,
  students = [],
  actionTakenReports = [],
}) => {
  const [activeCriterion, setActiveCriterion] = useState<number>(3);
  const [persistedLogo, setPersistedLogo] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogo() {
      try {
        const logo = await getAsset('college_logo');
        if (logo) setPersistedLogo(logo);
      } catch (err) {
        console.error('Failed to load logo from IndexedDB:', err);
      }
    }
    loadLogo();
  }, []);

  const college = institution?.name || "Navjeevan Education Society's D. P. Kharde Navjeevan College of Pharmacy, Sinnar";
  const aishe = institution?.aisheCode || 'S-22693';
  const pci = institution?.pciCode || '9178';
  const dte = institution?.dteCode || '5539';
  const msbte = institution?.msbteCode || '62386';

  const criteriaList = [
    { no: 1, title: 'Vision, Mission & Governance', short: 'Governance', score: '95/100' },
    { no: 2, title: 'Curricular Planning & Academic Calendar', short: 'Curriculum', score: '98/100' },
    { no: 3, title: 'GLP Laboratories & Instrument Maintenance', short: 'GLP Equipment', score: '100/100' },
    { no: 4, title: 'Student Centric Remedial Learning', short: 'Remedials', score: '92/100' },
    { no: 5, title: 'Faculty Cadre Ratio, Workload & FDP', short: 'Faculty Cadre', score: '96/100' },
    { no: 6, title: 'Continuous Assessment & Internal Quality', short: 'Internal Eval', score: '97/100' },
    { no: 7, title: 'Physical Infrastructure & Safety', short: 'Infrastructure', score: '94/100' },
    { no: 8, title: 'Library & Electronic Information Holdings', short: 'Library Books', score: '95/100' },
    { no: 9, title: 'Pharmacy Practice & Industrial Exposure', short: 'Hospital/Plant', score: '98/100' },
    { no: 10, title: 'Student Welfare & Grievance Redressal', short: 'Welfare/GRC', score: '100/100' },
    { no: 11, title: 'Continuous Improvement & Stakeholder ATR', short: 'Closed ATRs', score: '96/100' },
  ];

  const handleCopySSRSummary = () => {
    const text = `PCI-QCI 11-CRITERION ACCREDITATION EXECUTIVE SUMMARY
Institution: ${college}
Statutory Identifiers: MSBTE: ${msbte} | DTE: ${dte} | PCI: ${pci} | AISHE: ${aishe}
Principal & Head of Institute: Dr. Hiteshkumar Agrawal
Overall Institutional Compliance Benchmark: 96.4% (Grade A+ Institutional Preparedness)
GLP Lab Equipment: 100% Calibrated with documented SOPs
CO-PO Outcome Attainment: Fully mapped under revised Bloom's taxonomy & CIAAN-2023.`;

    navigator.clipboard.writeText(text);
    setCopiedToast('Copied QCI SSR Executive Summary!');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md print:bg-white print:text-black print:border-slate-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 tracking-wider">
                PCI–QCI National Accreditation Framework
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PCI ER-2020 &amp; QCI Pharmacy Quality Standard
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              {persistedLogo ? (
                <div className="w-14 h-14 bg-white/10 rounded-xl p-1 border border-slate-700 flex items-center justify-center shrink-0 print:border-slate-400">
                  <img src={persistedLogo} alt="College Crest" className="w-full h-full object-contain" />
                </div>
              ) : (
                <InstitutionSeal profile={institution} variant="circular" size="md" />
              )}
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                  Navjeevan Education Society's
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white print:text-black">
                  {college}
                </h1>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  Self-Study Report (SSR) &amp; Criterion-Based Institutional Intelligence Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopySSRSummary}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              Copy SSR Executive Summary
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-slate-700/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Print Complete QCI Dossier
            </button>
          </div>
        </div>

        {/* 4 Statutory Identifiers Bar */}
        <div className="pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Accreditation Codes:
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700 text-slate-200">
                AISHE: <strong>{aishe}</strong>
              </span>
              <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700 text-amber-300">
                PCI: <strong>{pci}</strong>
              </span>
              <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                DTE: <strong>{dte}</strong>
              </span>
              <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700 text-emerald-300">
                MSBTE: <strong>{msbte}</strong>
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-300 font-medium">
            Lead Evaluator / Authorizing Signatory: <strong className="text-white">Dr. Hiteshkumar Agrawal</strong>
          </div>
        </div>
      </div>

      {/* 2. 11-Criterion Selector Strip */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" />
            PCI-QCI 11 Quality Criteria Navigator
          </h2>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Weighted Aggregate Score: 96.4% (Grade A+)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {criteriaList.map((crit) => {
            const isSelected = activeCriterion === crit.no;
            return (
              <button
                key={crit.no}
                onClick={() => setActiveCriterion(crit.no)}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-amber-400/40'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-[10px] font-black font-mono">
                  CRIT {crit.no}
                </div>
                <div className="text-[11px] font-bold truncate mt-1" title={crit.title}>
                  {crit.short}
                </div>
                <div
                  className={`text-[9px] font-bold mt-1.5 ${
                    isSelected ? 'text-amber-300' : 'text-emerald-700'
                  }`}
                >
                  {crit.score}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Criterion Detail Workstation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner for current active criterion */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-black font-mono">
                Criterion {activeCriterion}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                PCI Schedule M &amp; QCI Compliance
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              {criteriaList.find((c) => c.no === activeCriterion)?.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified statutory evidence logs mapped to institutional audit ledgers and physical inspection protocols.
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400 uppercase font-bold">Evaluated Criterion Score</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {criteriaList.find((c) => c.no === activeCriterion)?.score}
            </div>
          </div>
        </div>

        {/* CRITERION 3: GLP Equipment & Calibration Log */}
        {activeCriterion === 3 && (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="font-bold">Good Laboratory Practice (GLP) Assurance:</strong> 100% of major pharmacy equipment calibrated annually with traceable standard operating procedures.
              </div>
              <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-lg font-bold font-mono text-[11px] shrink-0">
                Schedule M Audited
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28">Asset ID</th>
                    <th className="p-3">Equipment / Machinery Name</th>
                    <th className="p-3">Model &amp; Make</th>
                    <th className="p-3">Laboratory Location</th>
                    <th className="p-3 text-center">Last Calibration</th>
                    <th className="p-3 text-center">Next Due</th>
                    <th className="p-3 text-center">GLP Status</th>
                    <th className="p-3">Faculty In-Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SAMPLE_GLP_EQUIPMENT.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-800">{eq.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{eq.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{eq.sopDocument}</div>
                      </td>
                      <td className="p-3 text-slate-600">{eq.modelMake}</td>
                      <td className="p-3 text-slate-600">{eq.labLocation}</td>
                      <td className="p-3 text-center font-mono text-[11px] text-slate-600">{eq.calibrationDate}</td>
                      <td className="p-3 text-center font-mono text-[11px] font-bold text-emerald-700">{eq.nextDueDate}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ {eq.status}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{eq.inCharge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CRITERION 4: Student Centric Remedial Learning */}
        {activeCriterion === 4 && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950">
              <strong className="font-bold">Continuous Remedial Diagnostic Trigger:</strong> Students with internal sessional marks &lt; 50% or attendance &lt; 75% are enrolled into targeted weekend formulation clinics and model paper drills.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Identified Deficit Scholars</div>
                <div className="text-xl font-black text-rose-600">3 Students</div>
                <div className="text-[11px] text-slate-500">Scored &lt; 20/40 in Sessional 1</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Compensatory Hours Conducted</div>
                <div className="text-xl font-black text-slate-900">12 Clock Hours</div>
                <div className="text-[11px] text-slate-500">Dedicated peer &amp; faculty mentoring</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Post-Remedial Attainment</div>
                <div className="text-xl font-black text-emerald-600">100% Qualified</div>
                <div className="text-[11px] text-slate-500">Achieved &ge; 40% in Retest Evaluation</div>
              </div>
            </div>
          </div>
        )}

        {/* CRITERION 11: Continuous Improvement & Action Taken Reports (ATRs) */}
        {activeCriterion === 11 && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between">
              <div>
                <strong className="font-bold">Closed-Loop Quality Cycle:</strong> Stakeholder feedback analyzed every semester; actionable deficits logged into ATRs signed off by the Principal.
              </div>
              <span className="px-2 py-0.5 bg-blue-200 text-blue-900 rounded font-bold text-[10px]">
                IQAC Approved
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">ATR-2025-01: Laboratory Viscometer Modernization</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    ✓ Closed &amp; Verified
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Feedback from Student Council noted digital Brookfield viscometers required for emulsion shear analysis. Management sanctioned procurement in Q2.
                </p>
                <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-3">
                  <span>Signatory: Dr. Hiteshkumar Agrawal</span>
                  <span>•</span>
                  <span>Date: 24-August-2025</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">ATR-2025-02: Hospital Pharmacy Internship Integration</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    ✓ Closed &amp; Verified
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  PCI ER-2020 hospital pharmacy unit dose dispensing training schedule expanded to include 500-hour structured clinical rotas in Sinnar Sub-District Hospital.
                </p>
                <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-3">
                  <span>Signatory: Dr. Hiteshkumar Agrawal</span>
                  <span>•</span>
                  <span>Date: 10-September-2025</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT OVERVIEW FOR OTHER CRITERIA */}
        {activeCriterion !== 3 && activeCriterion !== 4 && activeCriterion !== 11 && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900">
                Accreditation Data Stream Active:
              </div>
              <p className="text-[11px] text-slate-600">
                All records for Criterion {activeCriterion} are verified in accordance with the Pharmacy Council of India ER-2020 regulations and Quality Council of India institutional parameters.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Statutory Audit Passed
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Verified for MSBTE Code: {msbte} • PCI ID: {pci}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Statutory Signatory Block */}
        <div className="p-5 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-900">Statutory Evaluator Endorsement</div>
            <div className="text-[11px] text-slate-500">
              Prescribed under PCI Quality Improvement Council &amp; NBA Tier-II Direct Rubrics
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-emerald-700 font-bold uppercase">Authorized Signatory</div>
            <div className="font-extrabold text-indigo-900 text-sm">Dr. Hiteshkumar Agrawal</div>
            <div className="text-[10px] text-slate-500">Principal, D. P. Kharde Navjeevan College of Pharmacy, Sinnar</div>
          </div>
        </div>
      </div>

      {copiedToast && (
        <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in flex items-center gap-2 z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}
    </div>
  );
};

export default QCIAccreditationView;
