'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, PlusCircle, Sparkles } from 'lucide-react';
import { DualDateConductRecord } from '../../dateEngineTypes';
import { calculateDiscrepancyTag } from '../../services/dateEngineService';

interface TeachingDiaryViewProps {
  classId: string;
  subjectCode: string;
  initialRecords: DualDateConductRecord[];
  onGenerateChalkieDeck?: (record: DualDateConductRecord) => void;
}

export const TeachingDiaryView: React.FC<TeachingDiaryViewProps> = ({
  classId,
  subjectCode,
  initialRecords,
  onGenerateChalkieDeck,
}) => {
  const [records, setRecords] = useState<DualDateConductRecord[]>(
    initialRecords.filter((r) => r.classId === classId && r.subjectCode === subjectCode)
  );

  const [newTopic, setNewTopic] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newPlannedDate, setNewPlannedDate] = useState('2026-07-01');
  const [newActualDate, setNewActualDate] = useState('2026-07-01');

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const discrepancy = calculateDiscrepancyTag(newPlannedDate, newActualDate);

    const record: DualDateConductRecord = {
      id: `DIARY_${Date.now()}`,
      classId,
      subjectCode,
      topicOrExperimentTitle: newTopic,
      curriculumReferenceUnit: newUnit || 'General Syllabus',
      plannedDate: newPlannedDate,
      actualDate: newActualDate,
      discrepancyReason: discrepancy,
      chalkieDeckGenerated: false,
    };

    setRecords((prev) => [record, ...prev]);
    setNewTopic('');
    setNewUnit('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white uppercase">
              MSBTE Format PH-4
            </span>
            <span className="text-xs text-slate-400">Academic Session 2026-2027</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Faculty Teaching Diary &amp; Retrospective Log
          </h2>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Cohort: <b>{classId}</b> | Course: <b>{subjectCode}</b></span>
        </div>
      </div>

      {/* Retrospective Conduct Entry Form */}
      <form onSubmit={handleAddRecord} className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4 text-blue-400" />
          <span>Log Theory Conduct Record</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="md:col-span-2">
            <label className="text-[10px] text-slate-400 font-bold block mb-1">Topic / Lecture Contents</label>
            <input
              type="text"
              placeholder="e.g., Excipients in solid dosage forms..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">Curricular Unit</label>
            <input
              type="text"
              placeholder="e.g., Unit 3: Tablets"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Planned Date</label>
              <input
                type="date"
                value={newPlannedDate}
                onChange={(e) => setNewPlannedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Actual Date</label>
              <input
                type="date"
                value={newActualDate}
                onChange={(e) => setNewActualDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Commit to Diary</span>
          </button>
        </div>
      </form>

      {/* Diary Records Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Topic &amp; Curricular Unit</th>
              <th className="p-3">Planned Date</th>
              <th className="p-3">Actual Date</th>
              <th className="p-3">Compliance Status</th>
              <th className="p-3 text-right">Chalkie AI Deck</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No teaching diary records found for this cohort and subject.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const isDelayed = r.plannedDate !== r.actualDate;
                return (
                  <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-slate-200">{r.topicOrExperimentTitle}</div>
                      <div className="text-[10px] text-slate-400">{r.curriculumReferenceUnit}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{r.plannedDate}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{r.actualDate}</td>
                    <td className="p-3">
                      {isDelayed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                          <AlertCircle className="w-3 h-3" />
                          {r.discrepancyReason || 'Rescheduled'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Conducted On Time
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onGenerateChalkieDeck && onGenerateChalkieDeck(r)}
                        className="inline-flex items-center gap-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/50 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>Chalkie Deck</span>
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

export default TeachingDiaryView;
