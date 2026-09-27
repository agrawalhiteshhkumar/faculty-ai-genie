'use client';

import React, { useState } from 'react';
import { generateOfficialReport } from '../../utils/printReport';
import { X, Printer } from 'lucide-react';

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  isSalary: boolean;
}

const DEFAULT_EXPENSES: ExpenseCategory[] = [
  { id: 'EXP-1', name: 'Teaching Faculty Salaries (PCI / 6th-7th Pay)', amount: 5200000, isSalary: true },
  { id: 'EXP-2', name: 'Non-Teaching / Technical Staff Salaries', amount: 1450000, isSalary: true },
  { id: 'EXP-3', name: 'Laboratory Consumables & Glassware', amount: 480000, isSalary: false },
  { id: 'EXP-4', name: 'Library Books, Journals & E-Resources', amount: 260000, isSalary: false },
  { id: 'EXP-5', name: 'Building Rent / Infrastructure Amortization', amount: 1200000, isSalary: false },
  { id: 'EXP-6', name: 'Institutional Overheads, Power & Water', amount: 540000, isSalary: false },
];

export default function FRAModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [expenses] = useState<ExpenseCategory[]>(DEFAULT_EXPENSES);
  const totalStudents = 120; // 1st & 2nd Year D.Pharm

  if (!isOpen) return null;

  const totalOperationalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perStudentCost = Math.round(totalOperationalExpense / totalStudents);
  const developmentFee = Math.round(perStudentCost * 0.10);
  const totalProposedFee = perStudentCost + developmentFee;

  const handlePrintFeeProposal = () => {
    const auditHash = '0x' + Math.random().toString(16).substring(2, 10) + 'fee4';
    onLogAudit('STATUTORY_FEE_PROPOSAL_PRINTED', `Generated FFC Fee Proposal Annexure with hash ${auditHash}`);

    generateOfficialReport({
      title: 'Fees Regulating Committee (FFC) Statutory Proposal - D.Pharm',
      subtitle: 'Verified against Maharashtra Unaided Private Professional Educational Institutions Act 2015',
      regulatoryBody: 'MAHA_FFC',
      reportRefNo: `DPKCOP/FFC/${new Date().getFullYear()}/PROP-01`,
      dataHeaders: ['Sr', 'Statutory Head', 'Classification', 'Audited Total', 'Per-Student Share'],
      dataRows: [
        ...expenses.map((e, idx) => [
          idx + 1,
          e.name,
          e.isSalary ? 'Salary Component' : 'Non-Salary Overhead',
          `₹ ${e.amount.toLocaleString('en-IN')}`,
          `₹ ${Math.round(e.amount / totalStudents).toLocaleString('en-IN')}`,
        ]),
        ['-', 'STATUTORY BASE TUITION COST', 'Aggregated Operational Base', `₹ ${totalOperationalExpense.toLocaleString('en-IN')}`, `₹ ${perStudentCost.toLocaleString('en-IN')}`],
        ['-', 'DEVELOPMENT FEE (MAX 10% CAP)', 'Statutory Capital Modernization', `₹ ${(developmentFee * totalStudents).toLocaleString('en-IN')}`, `₹ ${developmentFee.toLocaleString('en-IN')}`],
        ['-', 'TOTAL PROPOSED ANNUAL FEE', 'Final Approved Ceiling', '-', `₹ ${totalProposedFee.toLocaleString('en-IN')}`],
      ],
      summaryMetrics: [
        { label: 'Proposed Annual Tuition Fee', value: `₹ ${perStudentCost.toLocaleString('en-IN')}` },
        { label: 'Development Fee (10% Statutory)', value: `₹ ${developmentFee.toLocaleString('en-IN')}` },
        { label: 'Total Approved Fee Proposal', value: `₹ ${totalProposedFee.toLocaleString('en-IN')} / Year` },
      ],
      auditHash,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">Accounts &amp; Finance Wing</span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">FFC / FRA Fee Proposal Engine &amp; Schedule-A</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-3 bg-white flex justify-between items-center text-xs">
          <span className="text-slate-600 font-bold">Proposed Fee Ceiling: <strong className="text-blue-700 font-mono">₹ {totalProposedFee.toLocaleString('en-IN')} / Year</strong></span>
          <button onClick={handlePrintFeeProposal} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Printer className="w-3.5 h-3.5" /> Print Statutory Fee Annexure (PDF)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Expenditure Head</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Audited Total</th>
                <th className="pb-3 text-right">Per-Student Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-800">{e.name}</td>
                  <td className="py-3 text-slate-500">{e.isSalary ? 'Salary Norm' : 'Non-Salary'}</td>
                  <td className="py-3 text-right font-mono font-medium text-slate-700">₹ {e.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right font-mono text-slate-600">₹ {Math.round(e.amount / totalStudents).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
