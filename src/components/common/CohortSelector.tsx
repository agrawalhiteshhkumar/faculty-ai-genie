'use client';

import React from 'react';
import { GraduationCap, BookOpen, Users, UserCheck } from 'lucide-react';
import {
  AcademicClassCohort,
  PracticalBatchDivision,
  FacultyWorkloadAllocation,
} from '../../cohortTypes';

interface CohortSelectorProps {
  classes: AcademicClassCohort[];
  batches: PracticalBatchDivision[];
  allocations: FacultyWorkloadAllocation[];
  selectedClassId: string;
  selectedSubjectCode: string;
  selectedBatchId: string;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subjectCode: string) => void;
  onBatchChange: (batchId: string) => void;
}

export const CohortSelector: React.FC<CohortSelectorProps> = ({
  classes,
  batches,
  allocations,
  selectedClassId,
  selectedSubjectCode,
  selectedBatchId,
  onClassChange,
  onSubjectChange,
  onBatchChange,
}) => {
  const filteredAllocations = allocations.filter((a) => a.classId === selectedClassId);
  const filteredBatches = batches.filter((b) => b.classId === selectedClassId);
  const activeAllocation =
    filteredAllocations.find((a) => a.subjectCode === selectedSubjectCode) || filteredAllocations[0];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white uppercase">
            Curricular Hierarchy Matrix
          </span>
          <span className="text-xs text-slate-400">MSBTE J-Scheme &amp; PCI ER-2020</span>
        </div>
        {activeAllocation && (
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>
              Assigned: {activeAllocation.facultyName} ({activeAllocation.designation})
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Class Cohort</span>
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-bold focus:outline-none focus:border-blue-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.academicYear})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Subject / Course</span>
          </label>
          <select
            value={selectedSubjectCode}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-bold focus:outline-none focus:border-amber-500"
          >
            {filteredAllocations.map((a) => (
              <option key={a.subjectCode} value={a.subjectCode}>
                {a.subjectCode} - {a.subjectTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Practical Batch</span>
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => onBatchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-bold focus:outline-none focus:border-emerald-500"
          >
            {filteredBatches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchName} ({b.rollNumberRange})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CohortSelector;
