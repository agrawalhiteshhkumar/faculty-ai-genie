import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  FileText,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  SubjectMaster,
  COAttainmentSummary,
  ProgramOutcome,
  ActionTakenReport,
  UserRole,
} from '../../types';

interface OutcomesViewProps {
  subject: SubjectMaster | null;
  coAttainment: COAttainmentSummary[];
  poAttainments: Record<string, number>;
  programOutcomes: ProgramOutcome[];
  actionTakenReports: ActionTakenReport[];
  activeRole: UserRole;
  onSignOffATR: (atrId: string) => Promise<void>;
  onDraftNewATR: (coCode: string) => Promise<void>;
  onRecalculateWithThreshold?: (thresholdRatio: number) => void;
  onNavigateTab?: (tab: any) => void;
}

export const OutcomesView: React.FC<OutcomesViewProps> = ({
  subject,
  coAttainment,
  poAttainments,
  programOutcomes,
  actionTakenReports,
  activeRole,
  onSignOffATR,
  onDraftNewATR,
  onRecalculateWithThreshold,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'SUMMARY' | 'MATRIX' | 'ATR'>('SUMMARY');
  const [thresholdSlider, setThresholdSlider] = useState<number>(60);
  const [isDraftingATR, setIsDraftingATR] = useState(false);

  if (!subject || coAttainment.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-4 max-w-4xl mx-auto my-8">
        <Award className="w-12 h-12 text-slate-400 mx-auto" />
        <div>
          <h3 className="text-base font-bold text-slate-800">Outcome Intelligence Awaiting Data</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Direct Course Outcome (CO) and Program Outcome (PO) calculation requires Course Master syllabus and assessment marks. Bulk-import your student marks or load the regulatory reference dataset.
          </p>
        </div>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('SETUP')}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs"
          >
            Open Setup & Excel Importer →
          </button>
        )}
      </div>
    );
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setThresholdSlider(val);
    if (onRecalculateWithThreshold) {
      onRecalculateWithThreshold(val / 100);
    }
  };

  const handleDraftATR = async (coCode: string) => {
    setIsDraftingATR(true);
    try {
      await onDraftNewATR(coCode);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDraftingATR(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Regulation Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
            <Award className="w-3 h-3" />
            NBA Tier-II Criterion 3 & PCI OBE Compliance Engine
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Outcome Intelligence: Direct CO-PO Attainment & ATRs
          </h1>
          <p className="text-xs text-slate-500">
            {subject.title} ({subject.code}) • MSBTE CIAAN-2023 Mathematical Models
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('SUMMARY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'SUMMARY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CO-PO Attainment Summary
          </button>
          <button
            onClick={() => setActiveSubTab('MATRIX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'MATRIX'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CO-PO Mapping Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('ATR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'ATR'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Taken Reports (ATR)
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
              {actionTakenReports.length}
            </span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CO-PO ATTAINMENT SUMMARY */}
      {activeSubTab === 'SUMMARY' && (
        <div className="space-y-6">
          {/* Interactive Sensitivity Controller & Formula Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Institutional Benchmark Threshold Sensitivity Controller
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard MSBTE / NBA Benchmark is 60% of Max Marks per Question.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Question Threshold:</span>
                <input
                  type="range"
                  min="40"
                  max="80"
                  step="5"
                  value={thresholdSlider}
                  onChange={handleSliderChange}
                  className="w-28 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {thresholdSlider}%
                </span>
              </div>
            </div>

            {/* Formula display */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <strong>NBA 3-Tier Rubric:</strong> Level 3 (≥70% students ≥ {thresholdSlider}%), Level 2 (60-69%), Level 1 (50-59%), Level 0 (&lt;50%).
              </div>
              <div className="text-[11px] font-mono text-slate-600">
                Composite = (0.80 × Direct Internal) + (0.20 × External Board)
              </div>
            </div>
          </div>

          {/* Direct Course Outcome Attainment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coAttainment.map((co) => {
              const hasDeficit = !co.isAttained && co.studentsAttempted > 0;

              return (
                <div
                  key={co.coCode}
                  className={`p-5 rounded-2xl border shadow-xs transition space-y-3 relative overflow-hidden ${
                    hasDeficit
                      ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                      {co.coCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        hasDeficit
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {hasDeficit ? 'DEFICIT ALERT' : 'ATTAINED'}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Attainment Score</div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
                      {co.compositeAttainment.toFixed(2)}{' '}
                      <span className="text-xs text-slate-400 font-normal">/ 3.00</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>Target Level:</span>
                      <span className="font-bold text-slate-800">{co.targetLevel.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students Attempted:</span>
                      <span className="font-bold text-slate-800">{co.studentsAttempted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Met 60% Threshold:</span>
                      <span className="font-bold text-slate-800">
                        {co.studentsMeetingThreshold} ({co.percentageMeetingThreshold}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attainment Level:</span>
                      <span className="font-mono font-bold text-slate-900">
                        Level {co.directAttainmentLevel}
                      </span>
                    </div>
                  </div>

                  {hasDeficit && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveSubTab('ATR')}
                        className="w-full py-1.5 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Inspect Remedial ATR →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Program Outcome (PO) Rollup Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Program Outcomes (PO1 - PO11) Attainment Rollup Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated automatically from Course Outcomes mapped into the institutional curriculum matrix
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                Formula: Σ(CO Attainment × Correlation) / Σ(Correlation)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {programOutcomes.map((po) => {
                const score = poAttainments[po.code] || 0;
                return (
                  <div
                    key={po.code}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1"
                  >
                    <span className="text-xs font-mono font-bold text-slate-900">{po.code}</span>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      {score > 0 ? score.toFixed(2) : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate" title={po.statement}>
                      {po.statement}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CO-PO MAPPING MATRIX */}
      {activeSubTab === 'MATRIX' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Curriculum Correlation Matrix (CO-PO / PSO Mapping)
              </h3>
              <p className="text-xs text-slate-500">
                Correlation Levels: 3 (High), 2 (Medium), 1 (Low), '—' (No correlation)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Course Outcome</th>
                  <th className="py-2.5 px-2 text-center">PO1</th>
                  <th className="py-2.5 px-2 text-center">PO2</th>
                  <th className="py-2.5 px-2 text-center">PO3</th>
                  <th className="py-2.5 px-2 text-center">PO4</th>
                  <th className="py-2.5 px-2 text-center">PO5</th>
                  <th className="py-2.5 px-2 text-center">PO6</th>
                  <th className="py-2.5 px-2 text-center">PO7</th>
                  <th className="py-2.5 px-2 text-center">PSO1</th>
                  <th className="py-2.5 px-2 text-center">PSO2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {subject.courseOutcomes.map((co) => {
                  const m = subject.copoMatrix.find((item) => item.coCode === co.code);

                  return (
                    <tr key={co.code} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {co.code}: {co.statement.substring(0, 45)}...
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po1 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po2 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po3 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po4 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po5 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po6 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {m?.po7 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-indigo-700 bg-indigo-50/40">
                        {m?.pso1 || '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-indigo-700 bg-indigo-50/40">
                        {m?.pso2 || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ACTION TAKEN REPORTS (ATR) */}
      {activeSubTab === 'ATR' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  NBA Criterion 3: Continuous Improvement Action Taken Reports (ATR)
                </h3>
                <p className="text-xs text-slate-500">
                  Mandatory continuous improvement loop triggered automatically when CO attainment &lt; target level.
                </p>
              </div>

              <button
                onClick={() => handleDraftATR('CO3')}
                disabled={isDraftingATR}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isDraftingATR ? 'Drafting ATR...' : 'Re-Draft AI ATR for CO3'}
              </button>
            </div>

            <div className="space-y-4">
              {actionTakenReports.map((atr) => (
                <div
                  key={atr.id}
                  className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                        {atr.coCode}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        Course Outcome Deficit Remedial ATR (Sessional 1)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          atr.hodStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        HOD Status: {atr.hodStatus}
                      </span>

                      {atr.hodStatus !== 'APPROVED' && (
                        <button
                          onClick={() => onSignOffATR(atr.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Sign-off as HOD
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">
                        Target Benchmark:
                      </span>
                      <span className="font-bold text-slate-800">{atr.targetScore.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">
                        Actual Attainment:
                      </span>
                      <span className="font-bold text-rose-600">{atr.actualScore.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">
                        Gap Deficit:
                      </span>
                      <span className="font-bold text-rose-600">
                        -{(atr.targetScore - atr.actualScore).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    <div>
                      <strong className="text-slate-800 block mb-0.5">Root Cause Analysis:</strong>
                      <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                        {atr.rootCauseAnalysis}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        Statutory Corrective Actions & Remedial Coaching Plan:
                      </strong>
                      <ul className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 text-slate-700 list-disc list-inside">
                        {atr.correctiveActions.map((action, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Planned Remedial Tutorial Hours: <strong>{atr.plannedRemedialHours} Hours</strong></span>
                      <span>HOD Remarks: <em>{atr.hodRemarks}</em></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
