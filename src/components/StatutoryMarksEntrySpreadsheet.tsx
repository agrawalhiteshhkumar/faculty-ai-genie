import React, { useState, useMemo } from 'react';
import {
  Table,
  Calculator,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Sparkles,
  ClipboardPaste,
} from 'lucide-react';
import { StudentMaster, SubjectMaster, InstitutionProfile } from '../types';
import { generateProformaStudentRecords, StudentProformaRecord } from '../utils/msbteProformaExports';

interface StatutoryMarksEntrySpreadsheetProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
  students?: StudentMaster[];
  onSavedNotification?: (msg: string) => void;
}

export interface StudentThreeSessionalRecord {
  rollNo: string;
  name: string;
  prn: string;
  // Theory 3 sessionals (Max 40 each)
  theoryS1: number;
  theoryS2: number;
  theoryS3: number;
  // Continuous assessment components
  assignmentsMark: number; // Max 5
  fieldVisitMark: number; // Max 5
  // Practical 3 sessionals (Max 40 each)
  practicalS1: number;
  practicalS2: number;
  practicalS3: number;
  continuousLabRecord: number; // Max 10 from PH-3
  // Board Practical Exam (Max 80)
  boardPractical: number;
}

export const StatutoryMarksEntrySpreadsheet: React.FC<StatutoryMarksEntrySpreadsheetProps> = ({
  institution,
  subject,
  students: appStudents,
  onSavedNotification,
}) => {
  const [activeMode, setActiveMode] = useState<'THEORY' | 'PRACTICAL' | 'ALL'>('THEORY');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteTargetCol, setPasteTargetCol] = useState<'theoryS1' | 'theoryS2' | 'theoryS3' | 'practicalS1' | 'practicalS2' | 'practicalS3'>('theoryS1');

  // Initial student records with 3 sessional fields
  const [records, setRecords] = useState<StudentThreeSessionalRecord[]>(() => {
    const base = generateProformaStudentRecords(appStudents);
    return base.map((r, i) => {
      // Sessional 3 simulation (improvement / third chance)
      const seed = (parseInt(r.rollNo, 10) * 19 + 7) % 40;
      const s3Theory = Math.min(40, Math.max(16, Math.round((r.theoryS1 + r.theoryS2) / 2 + ((seed % 7) - 3))));
      const s3Practical = Math.min(40, Math.max(18, Math.round((r.practicalS1 + r.practicalS2) / 2 + ((seed % 5) - 2))));

      return {
        rollNo: r.rollNo,
        name: r.name,
        prn: r.prn,
        theoryS1: r.theoryS1,
        theoryS2: r.theoryS2,
        theoryS3: s3Theory,
        assignmentsMark: r.assignmentsAvg || 4,
        fieldVisitMark: r.fieldVisitTutorial || 4,
        practicalS1: r.practicalS1,
        practicalS2: r.practicalS2,
        practicalS3: s3Practical,
        continuousLabRecord: r.cumulativeLabRecordMark || 8,
        boardPractical: r.boardTotal || 68,
      };
    });
  });

  // Calculate Best of Two out of Three
  const calculateBestOfTwo = (s1: number, s2: number, s3: number) => {
    const scores = [
      { id: 'S1', val: s1 },
      { id: 'S2', val: s2 },
      { id: 'S3', val: s3 },
    ].sort((a, b) => b.val - a.val);

    const best1 = scores[0];
    const best2 = scores[1];
    const dropped = scores[2];

    const averageBestTwo = Math.round(((best1.val + best2.val) / 2) * 10) / 10;
    return {
      best1,
      best2,
      droppedId: dropped.id,
      averageBestTwo,
    };
  };

  const handleCellChange = (
    rollNo: string,
    field: keyof StudentThreeSessionalRecord,
    valStr: string
  ) => {
    const parsed = parseFloat(valStr);
    const val = isNaN(parsed) ? 0 : parsed;

    setRecords((prev) =>
      prev.map((r) => {
        if (r.rollNo === rollNo) {
          return {
            ...r,
            [field]: val,
          };
        }
        return r;
      })
    );
  };

  // Validation checks
  const outOfRangeEntries = useMemo(() => {
    const errors: { rollNo: string; field: string; val: number; max: number }[] = [];
    records.forEach((r) => {
      if (r.theoryS1 > 40 || r.theoryS1 < 0) errors.push({ rollNo: r.rollNo, field: 'Theory S1', val: r.theoryS1, max: 40 });
      if (r.theoryS2 > 40 || r.theoryS2 < 0) errors.push({ rollNo: r.rollNo, field: 'Theory S2', val: r.theoryS2, max: 40 });
      if (r.theoryS3 > 40 || r.theoryS3 < 0) errors.push({ rollNo: r.rollNo, field: 'Theory S3', val: r.theoryS3, max: 40 });
      if (r.practicalS1 > 40 || r.practicalS1 < 0) errors.push({ rollNo: r.rollNo, field: 'Prac S1', val: r.practicalS1, max: 40 });
      if (r.practicalS2 > 40 || r.practicalS2 < 0) errors.push({ rollNo: r.rollNo, field: 'Prac S2', val: r.practicalS2, max: 40 });
      if (r.practicalS3 > 40 || r.practicalS3 < 0) errors.push({ rollNo: r.rollNo, field: 'Prac S3', val: r.practicalS3, max: 40 });
      if (r.assignmentsMark > 5 || r.assignmentsMark < 0) errors.push({ rollNo: r.rollNo, field: 'Assignments', val: r.assignmentsMark, max: 5 });
      if (r.fieldVisitMark > 5 || r.fieldVisitMark < 0) errors.push({ rollNo: r.rollNo, field: 'Field Visit', val: r.fieldVisitMark, max: 5 });
      if (r.continuousLabRecord > 10 || r.continuousLabRecord < 0) errors.push({ rollNo: r.rollNo, field: 'Lab Record', val: r.continuousLabRecord, max: 10 });
      if (r.boardPractical > 80 || r.boardPractical < 0) errors.push({ rollNo: r.rollNo, field: 'Board Exam', val: r.boardPractical, max: 80 });
    });
    return errors;
  }, [records]);

  // Handle Excel Bulk Paste
  const handleApplyPaste = () => {
    if (!pasteText.trim()) return;

    // Split by newlines and tabs
    const lines = pasteText.trim().split(/\r?\n/);
    const newRecords = [...records];

    lines.forEach((line, lineIdx) => {
      if (lineIdx < newRecords.length) {
        const tokens = line.split('\t');
        const num = parseFloat(tokens[0]);
        if (!isNaN(num)) {
          newRecords[lineIdx] = {
            ...newRecords[lineIdx],
            [pasteTargetCol]: num,
          };
        }
      }
    });

    setRecords(newRecords);
    setPasteModalOpen(false);
    setPasteText('');
    setFeedback(`Pasted ${lines.length} values from Excel into column [${pasteTargetCol}]!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveMarks = () => {
    if (outOfRangeEntries.length > 0) {
      alert(`Cannot save marks: Found ${outOfRangeEntries.length} out-of-range values (> 40 or > 80). Please correct highlighted fields.`);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFeedback('All Best-of-Two Sessional & Continuous Marks committed to MSBTE Proformas ledger!');
      if (onSavedNotification) {
        onSavedNotification('Committed statutory progressive assessment records.');
      }
      setTimeout(() => setFeedback(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header with Regulatory Rule Explanation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                PCI ER-2020 & MSBTE J-Scheme Rule
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Statutory 3 Sessional Ledger
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Best-of-Two of Three Sessionals & Sensitive Marks Entry Grid
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Three Sessional examinations (40 Marks each). Lowest score is mathematically dropped (grayed out). Top two are averaged and combined with continuous mode components.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPasteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <ClipboardPaste className="w-4 h-4 text-slate-600" />
              Paste from Excel
            </button>
            <button
              onClick={handleSaveMarks}
              disabled={isSaving || outOfRangeEntries.length > 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Calculating...' : 'Commit & Lock Marks'}
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveMode('THEORY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeMode === 'THEORY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              Theory PA (PH-4_I / PH-5_I)
            </button>
            <button
              onClick={() => setActiveMode('PRACTICAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeMode === 'PRACTICAL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              Practical PA (PH-4_II / PH-5_II)
            </button>
            <button
              onClick={() => setActiveMode('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeMode === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
              Consolidated Theory + Practical
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Top 2 Highest (Counted)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Dropped / Lowest (Ignored)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Out-of-Range (&gt;40 / &gt;80)
            </span>
          </div>
        </div>

        {/* Out of range alert banner */}
        {outOfRangeEntries.length > 0 && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <strong>Validation Alert:</strong> {outOfRangeEntries.length} marks entries exceed statutory bounds (e.g. Roll No. {outOfRangeEntries[0].rollNo} in {outOfRangeEntries[0].field} is {outOfRangeEntries[0].val}, max allowed is {outOfRangeEntries[0].max}). Please correct before committing.
            </div>
          </div>
        )}

        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {feedback}
          </div>
        )}
      </div>

      {/* SPREADSHEET TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-bold text-[11px] uppercase sticky top-0 z-10 border-b border-slate-200 shadow-xs">
              <tr>
                <th className="p-2.5 w-12 text-center bg-slate-200">Roll</th>
                <th className="p-2.5 w-36 bg-slate-200">Student Name</th>
                <th className="p-2.5 w-24 bg-slate-200 font-mono text-[10px]">PRN</th>

                {/* THEORY COLUMNS */}
                {(activeMode === 'THEORY' || activeMode === 'ALL') && (
                  <>
                    <th className="p-2 text-center bg-blue-50 text-blue-900 border-l border-blue-200">Theory S1 (40)</th>
                    <th className="p-2 text-center bg-blue-50 text-blue-900">Theory S2 (40)</th>
                    <th className="p-2 text-center bg-blue-50 text-blue-900">Theory S3 (40)</th>
                    <th className="p-2 text-center bg-indigo-50 text-indigo-900 font-black">Best-of-2 Avg (40)</th>
                    <th className="p-2 text-center bg-indigo-50 text-indigo-900">Scaled (10)</th>
                    <th className="p-2 text-center bg-slate-50 text-slate-700">Assign (5)</th>
                    <th className="p-2 text-center bg-slate-50 text-slate-700">Visit (5)</th>
                    <th className="p-2 text-center bg-amber-100 text-amber-950 font-black border-r border-amber-300">Total Theory PA (20)</th>
                  </>
                )}

                {/* PRACTICAL COLUMNS */}
                {(activeMode === 'PRACTICAL' || activeMode === 'ALL') && (
                  <>
                    <th className="p-2 text-center bg-purple-50 text-purple-900 border-l border-purple-200">Prac S1 (40)</th>
                    <th className="p-2 text-center bg-purple-50 text-purple-900">Prac S2 (40)</th>
                    <th className="p-2 text-center bg-purple-50 text-purple-900">Prac S3 (40)</th>
                    <th className="p-2 text-center bg-purple-100 text-purple-900 font-black">Prac Best-2 (40)</th>
                    <th className="p-2 text-center bg-purple-100 text-purple-900">Scaled (10)</th>
                    <th className="p-2 text-center bg-slate-50 text-slate-700">Lab Record (10)</th>
                    <th className="p-2 text-center bg-emerald-100 text-emerald-950 font-black border-r border-emerald-300">Total Prac PA (20)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {records.map((row) => {
                const theoryCalc = calculateBestOfTwo(row.theoryS1, row.theoryS2, row.theoryS3);
                const practicalCalc = calculateBestOfTwo(row.practicalS1, row.practicalS2, row.practicalS3);

                // Theory math
                const theoryScaled10 = Math.round((theoryCalc.averageBestTwo / 40) * 10);
                const continuousTheory10 = row.assignmentsMark + row.fieldVisitMark;
                const totalTheoryPA20 = Math.min(20, theoryScaled10 + continuousTheory10);

                // Practical math
                const pracScaled10 = Math.round((practicalCalc.averageBestTwo / 40) * 10);
                const totalPracPA20 = Math.min(20, pracScaled10 + row.continuousLabRecord);

                return (
                  <tr key={row.rollNo} className="hover:bg-slate-50 transition">
                    <td className="p-2 text-center font-mono font-bold text-slate-500 bg-slate-50/50">{row.rollNo}</td>
                    <td className="p-2 font-bold text-slate-900 truncate max-w-[140px]">{row.name}</td>
                    <td className="p-2 font-mono text-[10px] text-slate-500">{row.prn}</td>

                    {/* THEORY CELLS */}
                    {(activeMode === 'THEORY' || activeMode === 'ALL') && (
                      <>
                        {/* Theory S1 */}
                        <td className={`p-1.5 text-center border-l border-slate-200 ${theoryCalc.droppedId === 'S1' ? 'bg-slate-100/80 text-slate-400' : 'text-slate-900 font-bold'}`}>
                          <input
                            type="number"
                            value={row.theoryS1}
                            onChange={(e) => handleCellChange(row.rollNo, 'theoryS1', e.target.value)}
                            className={`w-14 text-center py-1 rounded border font-mono text-xs transition ${
                              row.theoryS1 > 40 || row.theoryS1 < 0
                                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-400'
                                : theoryCalc.droppedId === 'S1'
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-blue-200 bg-white text-slate-900'
                            }`}
                          />
                        </td>

                        {/* Theory S2 */}
                        <td className={`p-1.5 text-center ${theoryCalc.droppedId === 'S2' ? 'bg-slate-100/80 text-slate-400' : 'text-slate-900 font-bold'}`}>
                          <input
                            type="number"
                            value={row.theoryS2}
                            onChange={(e) => handleCellChange(row.rollNo, 'theoryS2', e.target.value)}
                            className={`w-14 text-center py-1 rounded border font-mono text-xs transition ${
                              row.theoryS2 > 40 || row.theoryS2 < 0
                                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-400'
                                : theoryCalc.droppedId === 'S2'
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-blue-200 bg-white text-slate-900'
                            }`}
                          />
                        </td>

                        {/* Theory S3 */}
                        <td className={`p-1.5 text-center ${theoryCalc.droppedId === 'S3' ? 'bg-slate-100/80 text-slate-400' : 'text-slate-900 font-bold'}`}>
                          <input
                            type="number"
                            value={row.theoryS3}
                            onChange={(e) => handleCellChange(row.rollNo, 'theoryS3', e.target.value)}
                            className={`w-14 text-center py-1 rounded border font-mono text-xs transition ${
                              row.theoryS3 > 40 || row.theoryS3 < 0
                                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-400'
                                : theoryCalc.droppedId === 'S3'
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-blue-200 bg-white text-slate-900'
                            }`}
                          />
                        </td>

                        {/* Average Best Two */}
                        <td className="p-2 text-center font-mono font-bold text-indigo-900 bg-indigo-50/40">
                          {theoryCalc.averageBestTwo.toFixed(1)}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-700">
                          {theoryScaled10}
                        </td>
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            value={row.assignmentsMark}
                            onChange={(e) => handleCellChange(row.rollNo, 'assignmentsMark', e.target.value)}
                            className={`w-10 text-center py-1 rounded border font-mono text-xs ${
                              row.assignmentsMark > 5 || row.assignmentsMark < 0 ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-slate-200'
                            }`}
                          />
                        </td>
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            value={row.fieldVisitMark}
                            onChange={(e) => handleCellChange(row.rollNo, 'fieldVisitMark', e.target.value)}
                            className={`w-10 text-center py-1 rounded border font-mono text-xs ${
                              row.fieldVisitMark > 5 || row.fieldVisitMark < 0 ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-slate-200'
                            }`}
                          />
                        </td>
                        <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-50 border-r border-amber-200">
                          {totalTheoryPA20}
                        </td>
                      </>
                    )}

                    {/* PRACTICAL CELLS */}
                    {(activeMode === 'PRACTICAL' || activeMode === 'ALL') && (
                      <>
                        {/* Prac S1 */}
                        <td className={`p-1.5 text-center border-l border-slate-200 ${practicalCalc.droppedId === 'S1' ? 'bg-slate-100/80 text-slate-400' : 'text-slate-900 font-bold'}`}>
                          <input
                            type="number"
                            value={row.practicalS1}
                            onChange={(e) => handleCellChange(row.rollNo, 'practicalS1', e.target.value)}
                            className={`w-14 text-center py-1 rounded border font-mono text-xs transition ${
                              row.practicalS1 > 40 || row.practicalS1 < 0
                                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-400'
                                : practicalCalc.droppedId === 'S1'
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-purple-200 bg-white text-slate-900'
                            }`}
                          />
                        </td>

                        {/* Prac S2 */}
                        <td className={`p-1.5 text-center ${practicalCalc.droppedId === 'S2' ? 'bg-slate-100/80 text-slate-400' : 'text-slate-900 font-bold'}`}>
                          <input
                            type="number"
                            value={row.practicalS2}
                            onChange={(e) => handleCellChange(row.rollNo, 'practicalS2', e.target.value)}
                            className={`w-14 text-center py-1 rounded border font-mono text-xs transition ${
                              row.practicalS2 > 40 || row.practicalS2 < 0
                                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-400'
                                : practicalCalc.droppedId === 'S2'
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-purple-200 bg-white text-slate-900'
                            }`}
                          />
                        </td>

                        {/* Prac S3 */}
                        <td className={`p-1.5 text-center ${practicalCalc.droppedId === 'S3' ? 'bg-slate-100/80 text-slate-400' : 'text-slate-900 font-bold'}`}>
                          <input
                            type="number"
                            value={row.practicalS3}
                            onChange={(e) => handleCellChange(row.rollNo, 'practicalS3', e.target.value)}
                            className={`w-14 text-center py-1 rounded border font-mono text-xs transition ${
                              row.practicalS3 > 40 || row.practicalS3 < 0
                                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-400'
                                : practicalCalc.droppedId === 'S3'
                                ? 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                                : 'border-purple-200 bg-white text-slate-900'
                            }`}
                          />
                        </td>

                        {/* Practical Best Two */}
                        <td className="p-2 text-center font-mono font-bold text-purple-900 bg-purple-50/40">
                          {practicalCalc.averageBestTwo.toFixed(1)}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-700">
                          {pracScaled10}
                        </td>
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            value={row.continuousLabRecord}
                            onChange={(e) => handleCellChange(row.rollNo, 'continuousLabRecord', e.target.value)}
                            className={`w-12 text-center py-1 rounded border font-mono text-xs ${
                              row.continuousLabRecord > 10 || row.continuousLabRecord < 0 ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-slate-200'
                            }`}
                          />
                        </td>
                        <td className="p-2 text-center font-mono font-black text-emerald-950 bg-emerald-50 border-r border-emerald-200">
                          {totalPracPA20}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXCEL PASTE MODAL */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Direct Paste from Excel / CSV</h3>
              </div>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Copy a column of numerical marks from Excel or Google Sheets and paste below. The engine will sequentially populate student scores from Roll No. 01 downward.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Target Column:</label>
              <select
                value={pasteTargetCol}
                onChange={(e: any) => setPasteTargetCol(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
              >
                <option value="theoryS1">Theory Sessional 1 (Max 40)</option>
                <option value="theoryS2">Theory Sessional 2 (Max 40)</option>
                <option value="theoryS3">Theory Sessional 3 (Max 40)</option>
                <option value="practicalS1">Practical Sessional 1 (Max 40)</option>
                <option value="practicalS2">Practical Sessional 2 (Max 40)</option>
                <option value="practicalS3">Practical Sessional 3 (Max 40)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Paste Data (One value per row):</label>
              <textarea
                rows={6}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="28&#10;34&#10;31&#10;38&#10;..."
                className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPaste}
                disabled={!pasteText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                Apply Marks to Cohort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
