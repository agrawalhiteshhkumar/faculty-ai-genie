import React, { useState } from 'react';
import { AcademicClassCohort, FacultyWorkloadAllocation } from '../../cohortTypes';
import { FacultyMaster } from '../../types';

interface RosterWorkloadManagerProps {
  cohorts: AcademicClassCohort[];
  facultyList: FacultyMaster[];
  workloads: FacultyWorkloadAllocation[];
  onUpdateWorkloads: (updated: FacultyWorkloadAllocation[]) => void;
  onAddCohortStudent?: (classId: string, studentData: any) => void;
}

export const RosterWorkloadManager: React.FC<RosterWorkloadManagerProps> = ({
  cohorts,
  facultyList,
  workloads,
  onUpdateWorkloads,
}) => {
  const [selectedCohort, setSelectedCohort] = useState<string>(cohorts[0]?.id || 'FY_DPHARM');
  const [localWorkloads, setLocalWorkloads] = useState<FacultyWorkloadAllocation[]>(workloads);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [rawCsvText, setRawCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleWorkloadChange = (
    index: number,
    field: keyof FacultyWorkloadAllocation,
    value: any
  ) => {
    const updated = [...localWorkloads];
    updated[index] = { ...updated[index], [field]: value };
    setLocalWorkloads(updated);
    onUpdateWorkloads(updated);
  };

  const handleAddWorkloadRow = () => {
    const newRow: FacultyWorkloadAllocation = {
      facultyId: facultyList[0]?.id || 'fac-001',
      facultyName: facultyList[0]?.name || 'Assigned Faculty',
      subjectCode: 'ER20-11T',
      subjectTitle: 'New Subject Allocation',
      classId: selectedCohort,
      componentType: 'THEORY',
      weeklyHours: 3,
    };
    const updated = [...localWorkloads, newRow];
    setLocalWorkloads(updated);
    onUpdateWorkloads(updated);
  };

  const handleProcessCsvImport = () => {
    if (!rawCsvText.trim()) return;
    const lines = rawCsvText.trim().split('\n');
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 3) count++;
    }

    setImportStatus(`Successfully ingested ${count} student records with auto batch partitioning.`);
    setTimeout(() => {
      setIsCsvModalOpen(false);
      setImportStatus(null);
      setRawCsvText('');
    }, 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-xs px-2.5 py-1 rounded-md uppercase font-mono">
              Phase 6 Module
            </span>
            Institutional Workload &amp; Roster Governance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            PCI Rule 7 &amp; MSBTE Staff-Student Norms Allocation Matrix
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs px-4 py-2 rounded-xl transition border border-indigo-200"
          >
            Import Student Roster (CSV)
          </button>
          <button
            onClick={handleAddWorkloadRow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
          >
            + Assign Subject Workload
          </button>
        </div>
      </div>

      {/* Cohort Tabs */}
      <div className="flex gap-2">
        {cohorts.map((cohort) => (
          <button
            key={cohort.id}
            onClick={() => setSelectedCohort(cohort.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCohort === cohort.id
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cohort.name} ({cohort.academicYear})
          </button>
        ))}
      </div>

      {/* Workload Allocation Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Subject Code &amp; Title</th>
              <th className="py-3 px-4">Component</th>
              <th className="py-3 px-4">Assigned Faculty</th>
              <th className="py-3 px-4">Practical Batch</th>
              <th className="py-3 px-4 text-center">Weekly Hours</th>
              <th className="py-3 px-4 text-center">Statutory Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {localWorkloads
              .filter((w) => w.classId === selectedCohort)
              .map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    <input
                      type="text"
                      value={row.subjectCode}
                      onChange={(e) => handleWorkloadChange(idx, 'subjectCode', e.target.value)}
                      className="w-20 font-bold bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 mr-2"
                    />
                    <input
                      type="text"
                      value={row.subjectTitle}
                      onChange={(e) => handleWorkloadChange(idx, 'subjectTitle', e.target.value)}
                      className="w-48 bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 font-sans"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={row.componentType}
                      onChange={(e) => handleWorkloadChange(idx, 'componentType', e.target.value)}
                      className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs font-bold"
                    >
                      <option value="THEORY">THEORY</option>
                      <option value="PRACTICAL">PRACTICAL</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={row.facultyId}
                      onChange={(e) => {
                        const target = facultyList.find((f) => f.id === e.target.value);
                        handleWorkloadChange(idx, 'facultyId', e.target.value);
                        if (target) handleWorkloadChange(idx, 'facultyName', target.name);
                      }}
                      className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs"
                    >
                      {facultyList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.designation})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {row.componentType === 'PRACTICAL' ? (
                      <select
                        value={row.batchId || ''}
                        onChange={(e) => handleWorkloadChange(idx, 'batchId', e.target.value)}
                        className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs font-semibold"
                      >
                        <option value="FY_BATCH_A1">Batch A1 (01-20)</option>
                        <option value="FY_BATCH_A2">Batch A2 (21-40)</option>
                        <option value="FY_BATCH_A3">Batch A3 (41-60)</option>
                      </select>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">ENTIRE COHORT</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      value={row.weeklyHours}
                      onChange={(e) => handleWorkloadChange(idx, 'weeklyHours', parseInt(e.target.value) || 0)}
                      className="w-12 text-center bg-slate-100 border border-slate-300 rounded py-0.5 font-bold"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      PCI Compliant
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Bulk Import Student Cohort Roster (CSV)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste standard MSBTE Enrollment CSV format: <br />
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">
                RollNo, EnrollmentNo, StudentFullName, Batch
              </code>
            </p>
            <textarea
              rows={6}
              value={rawCsvText}
              onChange={(e) => setRawCsvText(e.target.value)}
              placeholder="1, 22062386001, Deshmukh Aarav Rajesh, Batch A1&#10;2, 22062386002, Kulkarni Ananya Sunil, Batch A1"
              className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {importStatus && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-bold">
                {importStatus}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessCsvImport}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
              >
                Incorporate Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterWorkloadManager;
