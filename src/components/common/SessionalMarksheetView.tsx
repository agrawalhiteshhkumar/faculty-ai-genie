'use client';

import React, { useState } from 'react';
import { Award, Lock, Unlock, CheckCircle, Calculator } from 'lucide-react';
import { SessionalTestMarks, ContinuousInternalAssessmentMarks } from '../../examTypes';
import { calculateSessionalScales } from '../../services/examService';

interface SessionalMarksheetViewProps {
  classId: string;
  subjectCode: string;
  initialSessionals: SessionalTestMarks[];
  initialInternals: ContinuousInternalAssessmentMarks[];
}

export const SessionalMarksheetView: React.FC<SessionalMarksheetViewProps> = ({
  classId,
  subjectCode,
  initialSessionals,
  initialInternals,
}) => {
  const [sessionals, setSessionals] = useState<SessionalTestMarks[]>(initialSessionals);
  const [isLocked, setIsLocked] = useState(false);

  const handleScoreChange = (
    studentId: string,
    field: 'firstSessionalScore' | 'secondSessionalScore',
    value: number
  ) => {
    if (isLocked) return;

    setSessionals((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        const updated = { ...s, [field]: value };
        const { average, scaled } = calculateSessionalScales(
          field === 'firstSessionalScore' ? value : updated.firstSessionalScore,
          field === 'secondSessionalScore' ? value : updated.secondSessionalScore
        );
        updated.calculatedAverage = average;
        updated.scaledSessionalScore = scaled;
        return updated;
      })
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white uppercase">
              MSBTE CIAAN-2023 Standard
            </span>
            <span className="text-xs text-slate-400">Statutory Sessional Marksheet</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Continuous Internal Assessment &amp; Progressive Record
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
              isLocked
                ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Frozen for Audit</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Editable (Draft)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Roll &amp; Candidate</th>
              <th className="p-3 text-center">Sessional I (40M)</th>
              <th className="p-3 text-center">Sessional II (40M)</th>
              <th className="p-3 text-center">Avg (40M)</th>
              <th className="p-3 text-center">Scaled (20M)</th>
              <th className="p-3 text-center">CIA Bonus (10M)</th>
              <th className="p-3 text-center">Final Internal (30M)</th>
              <th className="p-3 text-center">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {sessionals.map((s) => {
              const internalRecord = initialInternals.find((i) => i.studentId === s.studentId);
              const ciaScore = internalRecord ? internalRecord.assignmentScore + internalRecord.attendanceScore : 0;
              const grandFinal = s.scaledSessionalScore + ciaScore;

              return (
                <tr key={s.studentId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-200">{s.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Roll: {s.studentRollNo}</div>
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={40}
                      disabled={isLocked}
                      value={s.firstSessionalScore}
                      onChange={(e) =>
                        handleScoreChange(s.studentId, 'firstSessionalScore', Number(e.target.value))
                      }
                      className="w-14 bg-slate-950 border border-slate-700 text-center font-bold text-xs text-white rounded p-1 disabled:opacity-60"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={40}
                      disabled={isLocked}
                      value={s.secondSessionalScore}
                      onChange={(e) =>
                        handleScoreChange(s.studentId, 'secondSessionalScore', Number(e.target.value))
                      }
                      className="w-14 bg-slate-950 border border-slate-700 text-center font-bold text-xs text-white rounded p-1 disabled:opacity-60"
                    />
                  </td>
                  <td className="p-3 text-center font-mono text-slate-300">
                    {s.calculatedAverage}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                      {s.scaledSessionalScore}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-amber-400">
                    +{ciaScore}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {grandFinal}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800">
                        <Lock className="w-3 h-3" /> Sealed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionalMarksheetView;
