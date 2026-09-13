import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { TimetableSlot } from '../types';

interface DailyDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimetableSlot | null;
  onSaveDiary: (data: {
    slotId: string;
    plannedTopic: string;
    actualTopicCovered: string;
    completionStatus: 'COMPLETED_AS_PLANNED' | 'PARTIALLY_COVERED' | 'ALTERNATE_TOPIC';
    pedagogicalStrategy: string;
    teachingAidUsed: string;
    remarks: string;
  }) => Promise<void>;
}

export const DailyDiaryModal: React.FC<DailyDiaryModalProps> = ({
  isOpen,
  onClose,
  slot,
  onSaveDiary,
}) => {
  if (!isOpen || !slot) return null;

  const [completionStatus, setCompletionStatus] = useState<
    'COMPLETED_AS_PLANNED' | 'PARTIALLY_COVERED' | 'ALTERNATE_TOPIC'
  >('COMPLETED_AS_PLANNED');
  const [actualTopic, setActualTopic] = useState(slot.topicPlanned);
  const [pedagogicalStrategy, setPedagogicalStrategy] = useState(
    'Interactive case-based lecture with industrial defective tablet micrographs and Ishikawa analysis'
  );
  const [teachingAidUsed, setTeachingAidUsed] = useState(
    'Smart Board, IP Pharmacopoeia monograph & Tablet Tooling sample kit'
  );
  const [remarks, setRemarks] = useState(
    '100% of planned concepts delivered. Students performed defect diagnostics and calculated friability limits.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSaveDiary({
        slotId: slot.id,
        plannedTopic: slot.topicPlanned,
        actualTopicCovered: actualTopic,
        completionStatus,
        pedagogicalStrategy,
        teachingAidUsed,
        remarks,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500 text-slate-950">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base">Closed-Loop Daily Teaching Diary</h3>
              <p className="text-xs text-slate-400">
                {slot.subjectTitle} • {slot.timeSlot} ({slot.division})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Planned Syllabus Topic (Per Term Academic Calendar)
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
              {slot.topicPlanned}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Execution Status Confirmation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCompletionStatus('COMPLETED_AS_PLANNED')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                  completionStatus === 'COMPLETED_AS_PLANNED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                ✓ Completed as Planned
              </button>
              <button
                type="button"
                onClick={() => setCompletionStatus('PARTIALLY_COVERED')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                  completionStatus === 'PARTIALLY_COVERED'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                ⚠ Partially Covered
              </button>
              <button
                type="button"
                onClick={() => setCompletionStatus('ALTERNATE_TOPIC')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                  completionStatus === 'ALTERNATE_TOPIC'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-800 ring-1 ring-indigo-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                🔄 Alternate Topic
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="diary-actual-topic" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Actual Topic Covered & Specific Sub-modules
            </label>
            <textarea
              id="diary-actual-topic"
              value={actualTopic}
              onChange={(e) => setActualTopic(e.target.value)}
              rows={2}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="diary-pedagogical-strategy" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pedagogical Strategy Applied
              </label>
              <input
                id="diary-pedagogical-strategy"
                type="text"
                value={pedagogicalStrategy}
                onChange={(e) => setPedagogicalStrategy(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="diary-teaching-aid" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Teaching Aids / Equipment Deployed
              </label>
              <input
                id="diary-teaching-aid"
                type="text"
                value={teachingAidUsed}
                onChange={(e) => setTeachingAidUsed(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="diary-observations" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Faculty Classroom Observations & Follow-up
            </label>
            <input
              id="diary-observations"
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Syllabus Velocity Tracker:</span> Logging this entry automatically advances the semester course velocity index and submits the execution record for HOD verification.
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              id="confirm-submit-diary-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              {isSubmitting ? 'Committing...' : 'Commit to Teaching Diary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
