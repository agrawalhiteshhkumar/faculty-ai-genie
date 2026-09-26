'use client';

import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';
import { PracticalAssessmentLog } from '../../dateEngineTypes';

interface PracticalAssessmentViewProps {
  classId: string;
  subjectCode: string;
  batchId: string;
  initialLogs: PracticalAssessmentLog[];
}

export const PracticalAssessmentView: React.FC<PracticalAssessmentViewProps> = ({
  classId,
  subjectCode,
  batchId,
  initialLogs,
}) => {
  const [logs, setLogs] = useState<PracticalAssessmentLog[]>(
    initialLogs.filter((l) => l.classId === classId && l.batchId === batchId)
  );

  const handleScoreChange = (
    id: string,
    field: 'performanceScore' | 'vivaVoceScore' | 'journalScore',
    value: number
  ) => {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.id !== id) return log;
        const updated = { ...log, [field]: value };
        updated.totalScore =
          Number(updated.performanceScore || 0) +
          Number(updated.vivaVoceScore || 0) +
          Number(updated.journalScore || 0);
        return updated;
      })
    );
  };

  const handleToggleSign = (id: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === id
          ? {
              ...log,
              facultySignatureStatus:
                log.facultySignatureStatus === 'SIGNED' ? 'PENDING' : 'SIGNED',
            }
          : log
      )
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white uppercase">
              MSBTE Format PH-5
            </span>
            <span className="text-xs text-slate-400">Continuous Assessment Rubric</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Practical Logbook &amp; Day-to-Day Assessment
          </h2>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <ClipboardCheck className="w-4 h-4 text-amber-400" />
          <span>Batch: <b>{batchId}</b> | Course: <b>{subjectCode}</b></span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Roll &amp; Candidate</th>
              <th className="p-3">Exp #</th>
              <th className="p-3">Conduct Date</th>
              <th className="p-3">Evaluation Date</th>
              <th className="p-3 text-center">Performance (10M)</th>
              <th className="p-3 text-center">Viva (5M)</th>
              <th className="p-3 text-center">Journal (5M)</th>
              <th className="p-3 text-center">Total (20M)</th>
              <th className="p-3 text-right">Faculty Sign</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-500">
                  No practical assessment records found for this cohort and batch.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isSigned = log.facultySignatureStatus === 'SIGNED';
                return (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{log.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Roll: {log.studentRollNo}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-300">#{log.experimentNumber}</td>
                    <td className="p-3 font-mono text-slate-400">{log.conductDate}</td>
                    <td className="p-3 font-mono text-slate-400">{log.evaluationDate}</td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={log.performanceScore}
                        onChange={(e) =>
                          handleScoreChange(log.id, 'performanceScore', Number(e.target.value))
                        }
                        className="w-12 bg-slate-950 border border-slate-700 text-center font-bold text-xs text-white rounded p-1"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={log.vivaVoceScore}
                        onChange={(e) =>
                          handleScoreChange(log.id, 'vivaVoceScore', Number(e.target.value))
                        }
                        className="w-12 bg-slate-950 border border-slate-700 text-center font-bold text-xs text-white rounded p-1"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={log.journalScore}
                        onChange={(e) =>
                          handleScoreChange(log.id, 'journalScore', Number(e.target.value))
                        }
                        className="w-12 bg-slate-950 border border-slate-700 text-center font-bold text-xs text-white rounded p-1"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        {log.totalScore}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleSign(log.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                          isSigned
                            ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {isSigned ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Signed</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Sign</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PracticalAssessmentView;
