import React from 'react';
import { AcademicClassCohort, FacultyWorkloadAllocation } from '../../cohortTypes';

interface CohortSelectorProps {
  cohorts?: AcademicClassCohort[];
  classes?: AcademicClassCohort[];
  workloads?: FacultyWorkloadAllocation[];
  allocations?: FacultyWorkloadAllocation[];
  batches?: any[];
  selectedClassId?: string;
  selectedSubjectCode?: string;
  selectedBatchId?: string;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subjectCode: string) => void;
  onBatchChange?: (batchId: string) => void;
}

export const CohortSelector: React.FC<CohortSelectorProps> = ({
  cohorts = [],
  classes = [],
  workloads = [],
  allocations = [],
  batches = [],
  selectedClassId = '',
  selectedSubjectCode = '',
  selectedBatchId = '',
  onClassChange,
  onSubjectChange,
  onBatchChange,
}) => {
  const activeCohorts = Array.isArray(cohorts) && cohorts.length > 0 ? cohorts : (Array.isArray(classes) ? classes : []);
  const activeWorkloads = Array.isArray(workloads) && workloads.length > 0 ? workloads : (Array.isArray(allocations) ? allocations : []);

  const filteredWorkloads = activeWorkloads.filter((w) => w?.classId === selectedClassId);
  const currentClass = activeCohorts.find((c) => c?.id === selectedClassId) || activeCohorts[0];
  const activeBatches = currentClass?.batches || (Array.isArray(batches) ? batches : []);

  const activeWorkload = filteredWorkloads.find((w) => w?.subjectCode === selectedSubjectCode) || filteredWorkloads[0];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
            Curricular Hierarchy Matrix
          </span>
          <span className="text-xs text-slate-400">MSBTE J-Scheme &amp; PCI ER-2020</span>
        </div>
        {activeWorkload && (
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Assigned: {activeWorkload.facultyName || 'Dr. Hiteshkumar Agrawal'} ({activeWorkload.weeklyHours || 3} hrs/wk)
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Class / Cohort Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Academic Cohort (Class)
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {activeCohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name} ({cohort.academicYear})
              </option>
            ))}
          </select>
        </div>

        {/* Subject Allocation Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Subject Allocation
          </label>
          <select
            value={selectedSubjectCode}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {filteredWorkloads.length > 0 ? (
              filteredWorkloads.map((workload, idx) => (
                <option key={`${workload.subjectCode}-${idx}`} value={workload.subjectCode}>
                  [{workload.subjectCode}] {workload.subjectTitle} ({workload.componentType})
                </option>
              ))
            ) : (
              <option value={selectedSubjectCode}>
                [{selectedSubjectCode || 'ER20-11T'}] Pharmaceutics
              </option>
            )}
          </select>
        </div>

        {/* Practical Batch Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Practical Batch
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => onBatchChange && onBatchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {activeBatches.length > 0 ? (
              activeBatches.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.rollNumberRange || `${b.studentCount || 20} students`})
                </option>
              ))
            ) : (
              <option value="ALL">Entire Class (General)</option>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CohortSelector;
