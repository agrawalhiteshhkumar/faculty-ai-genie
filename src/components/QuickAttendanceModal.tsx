import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Users,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { StudentMaster, TimetableSlot } from '../types';

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: TimetableSlot[];
  students: StudentMaster[];
  onSaveAttendance: (slotId: string, absentIds: string[]) => Promise<void>;
}

export const QuickAttendanceModal: React.FC<QuickAttendanceModalProps> = ({
  isOpen,
  onClose,
  slots,
  students,
  onSaveAttendance,
}) => {
  if (!isOpen) return null;

  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    slots[0]?.id || ''
  );
  const [absentStudentIds, setAbsentStudentIds] = useState<string[]>(['s-08', 's-14']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];

  // Filter students if it's a specific batch
  const eligibleStudents = currentSlot?.batch?.includes('B1')
    ? students.filter((s) => s.batch === 'B1')
    : currentSlot?.batch?.includes('B2')
    ? students.filter((s) => s.batch === 'B2')
    : students;

  const toggleAbsent = (studentId: string) => {
    setAbsentStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const markAllPresent = () => {
    setAbsentStudentIds([]);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSaveAttendance(selectedSlotId, absentStudentIds);
      setSuccessMessage('Attendance recorded successfully! Defaulter statistics and parent alert buffers synchronized.');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEnrolled = eligibleStudents.length;
  const absentCount = absentStudentIds.filter((id) =>
    eligibleStudents.some((s) => s.id === id)
  ).length;
  const presentCount = totalEnrolled - absentCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500 text-slate-950">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base">Rapid 1-Tap Attendance Roster</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MSBTE CIAAN-2023 Aligned
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pre-filled 'All Present'. Simply tap students who are absent.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot Selector & Live Counters */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <label htmlFor="modal-slot-select" className="text-xs font-semibold text-slate-700">Lecture Slot:</label>
            <select
              id="modal-slot-select"
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-500 text-slate-800"
            >
              {slots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.timeSlot} — {s.subjectTitle} ({s.division} {s.batch || ''})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Present: {presentCount}
              </span>
              <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                Absent: {absentCount}
              </span>
            </div>

            <button
              onClick={markAllPresent}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold underline"
            >
              Reset to All Present
            </button>
          </div>
        </div>

        {/* Student Roster Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>TAP ANY CARD TO TOGGLE ABSENT / PRESENT STATUS</span>
            <span>Enrolled Students ({eligibleStudents.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {eligibleStudents.map((st) => {
              const isAbsent = absentStudentIds.includes(st.id);
              const willBeDefaulter =
                isAbsent && st.attendanceTheoryPercentage <= 76;

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => toggleAbsent(st.id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 relative flex items-center justify-between gap-2 ${
                    isAbsent
                      ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm ring-1 ring-rose-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        #{st.rollNo}
                      </span>
                      <span className="text-xs font-bold truncate">
                        {st.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>Curr: {st.attendanceTheoryPercentage}%</span>
                      {st.isDefaulter && (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> Defaulter
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isAbsent ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-lg">
                        <XCircle className="w-3.5 h-3.5" /> ABSENT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {absentCount > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900 mt-4">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Downstream Impact Preview:</span>{' '}
                Saving attendance will automatically update student attendance records, evaluate MSBTE 75% thresholds, and stage parent SMS alerts for marked absentees.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Topic: <span className="font-semibold text-slate-700">{currentSlot.topicPlanned}</span>
          </div>

          <div className="flex items-center gap-3">
            {successMessage && (
              <span className="text-xs font-bold text-emerald-600 animate-pulse">
                {successMessage}
              </span>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              id="confirm-save-attendance-btn"
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              {isSubmitting ? 'Recording...' : `Commit Attendance (${presentCount} Present)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
