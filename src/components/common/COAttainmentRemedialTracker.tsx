'use client';

import React, { useMemo } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Brain, RefreshCw } from 'lucide-react';
import { CourseOutcomeItem, StudentCOAttainmentScore } from '../../coAttainmentTypes';
import { generateSummaryAttainment } from '../../services/coAttainmentService';

interface COAttainmentRemedialTrackerProps {
  subjectCode: string;
  academicYear: string;
  courseOutcomes: CourseOutcomeItem[];
  studentScores: StudentCOAttainmentScore[];
  onTriggerRemedialModule?: (studentId: string, coCode: string) => void;
}

export const COAttainmentRemedialTracker: React.FC<COAttainmentRemedialTrackerProps> = ({
  subjectCode,
  academicYear,
  courseOutcomes,
  studentScores,
  onTriggerRemedialModule,
}) => {
  const summaryReport = useMemo(() => {
    return generateSummaryAttainment(subjectCode, academicYear, courseOutcomes, studentScores);
  }, [subjectCode, academicYear, courseOutcomes, studentScores]);

  const bloomsBadgeColor: Record<string, string> = {
    K1_REMEMBER: 'bg-slate-800 text-slate-300 border-slate-700',
    K2_UNDERSTAND: 'bg-blue-950/70 text-blue-300 border-blue-800',
    K3_APPLY: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
    K4_ANALYZE: 'bg-amber-950/70 text-amber-300 border-amber-800',
    K5_EVALUATE: 'bg-purple-950/70 text-purple-300 border-purple-800',
    K6_CREATE: 'bg-rose-950/70 text-rose-300 border-rose-800',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white uppercase">
              PCI ER-2020 &amp; NBA Criterion 3
            </span>
            <span className="text-xs text-slate-400">Direct Internal Attainment</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Course Outcome (CO) &amp; Bloom&apos;s Attainment Matrix
          </h2>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Course: <b>{subjectCode}</b> | Cohort Eval: <b>{studentScores.length} Students</b></span>
        </div>
      </div>

      {/* CO Cohort Attainment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {summaryReport.outcomes.map((co) => {
          const isHighAttainment = co.cohortAttainmentPercentage >= 70;
          return (
            <div
              key={co.coId}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-800">
                    {co.coCode}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      bloomsBadgeColor[co.bloomsLevel] || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {co.bloomsLevel.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">{co.statement}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Attainment</div>
                  <div className="font-mono font-bold text-sm text-slate-200">
                    {co.cohortAttainmentPercentage}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">MSBTE Level</div>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      isHighAttainment
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                    }`}
                  >
                    Level {co.attainmentLevelAchieved} / 3
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remedial Candidate Flagging Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wide">
              Remedial Intervention &amp; Candidate Diagnostics
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Threshold: &ge; 60% per Outcome
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Roll &amp; Candidate</th>
                {summaryReport.outcomes.map((co) => (
                  <th key={co.coId} className="p-3 text-center">
                    {co.coCode} Attainment
                  </th>
                ))}
                <th className="p-3 text-center">Diagnostics</th>
                <th className="p-3 text-right">Remedial Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {studentScores.map((student) => {
                const needsRemedial = student.remedialRecommended;
                return (
                  <tr key={student.studentId} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{student.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Roll: {student.studentRollNo}
                      </div>
                    </td>

                    {summaryReport.outcomes.map((co) => {
                      const score = student.attainmentPercentageByCO[co.coCode] ?? 0;
                      const belowThreshold = score < 60;
                      return (
                        <td key={co.coId} className="p-3 text-center font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              belowThreshold
                                ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            }`}
                          >
                            {score}%
                          </span>
                        </td>
                      );
                    })}

                    <td className="p-3 text-center">
                      {needsRemedial ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800">
                          <AlertTriangle className="w-3 h-3" /> Support Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Competency Met
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {needsRemedial ? (
                        <button
                          onClick={() =>
                            onTriggerRemedialModule &&
                            onTriggerRemedialModule(student.studentId, 'CO1')
                          }
                          className="inline-flex items-center gap-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/50 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-rose-400" />
                          <span>Generate Remedial</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">On Track</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COAttainmentRemedialTracker;
