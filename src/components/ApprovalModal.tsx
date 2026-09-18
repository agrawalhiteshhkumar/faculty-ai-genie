'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  Lock 
} from 'lucide-react';

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemType: 'Lesson Plan' | 'Question Paper' | 'Teaching Diary' | 'Marks Register' | 'ATR' | 'License Request';
  submittedBy: string;
  department: string;
  details?: { label: string; value: string }[];
  onApprove: (remarks: string) => Promise<void> | void;
  onReject: (remarks: string) => Promise<void> | void;
}

export function ApprovalModal({
  isOpen,
  onClose,
  title,
  itemType,
  submittedBy,
  department,
  details = [],
  onApprove,
  onReject
}: ApprovalModalProps) {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !remarks.trim()) {
      setError('Please provide specific remarks/feedback explaining the reason for revision or rejection.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      if (action === 'approve') {
        await onApprove(remarks);
      } else {
        await onReject(remarks);
      }
      onClose();
    } catch (err) {
      setError('An error occurred while saving the verification state. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header (Clean Royal Blue) */}
        <div className="bg-blue-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-800 border border-blue-700 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">Administrative Scrutiny &amp; Sign-off</h2>
              <p className="text-xs text-blue-200 mt-0.5">{itemType} Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Target Metadata Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-blue-700 tracking-wider uppercase">{itemType}</span>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                Pending Sign-off
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Faculty / Submitter</span>
                <span className="font-medium text-slate-800">{submittedBy}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
                <span className="font-medium text-slate-800">{department}</span>
              </div>
            </div>

            {details && details.length > 0 && (
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                {details.map((item, idx) => (
                  <div key={idx}>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{item.label}</span>
                    <span className="font-medium text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remarks Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="approvalRemarks" className="block text-xs font-semibold text-slate-700">
              Scrutiny Remarks &amp; Audit Notes
            </label>
            <textarea
              id="approvalRemarks"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter institutional remarks, corrections, or approval conditions..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          {/* Validation / Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Governance Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
            <span>
              Approval commits this academic record into official accreditation dossiers (PCI / MSBTE / NBA) with an immutable cryptographic timestamp.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleAction('reject')}
              className="w-full sm:flex-1 py-2.5 px-4 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
            >
              Request Revisions
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleAction('approve')}
              className="w-full sm:flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-900/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isProcessing ? 'Recording...' : 'Authorize & Sign-off'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ApprovalModal;
