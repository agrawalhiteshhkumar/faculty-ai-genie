import React, { useState } from 'react';
import {
  FlaskConical,
  AlertTriangle,
  Receipt,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  FileSpreadsheet,
  Trash2,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster } from '../types';
import { InstitutionSeal } from './InstitutionSeal';
import { DPK_COLLEGE_IDENTITY } from '../data/msbteProformasData';

interface LabBreakageApparatusLogProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
}

interface BreakageRecord {
  id: string;
  receiptNo: string;
  date: string;
  rollNo: string;
  studentName: string;
  prn: string;
  batch: 'B1' | 'B2' | 'B3';
  apparatusBroken: string;
  apparatusSpecification: string;
  costInRupees: number;
  fineAmount: number;
  reason: string;
  paymentStatus: 'PAID' | 'PENDING' | 'WAIVED';
  receiptDate: string;
}

interface ChemicalLedgerItem {
  id: string;
  chemicalName: string;
  casNo: string;
  grade: 'IP' | 'LR' | 'AR';
  experimentNo: string;
  issuedToBatch: string;
  dateIssued: string;
  quantityConsumed: string;
  balanceStock: string;
  labTechnician: string;
}

interface ApparatusLockerItem {
  lockerNo: string;
  batch: 'B1' | 'B2' | 'B3';
  studentRolls: string;
  standardKitItems: string;
  conditionStatus: 'Good' | 'Minor Wear' | 'Audit Complete';
  lastInspectionDate: string;
}

export const LabBreakageApparatusLog: React.FC<LabBreakageApparatusLogProps> = ({
  institution,
  subject,
}) => {
  const [activeTab, setActiveTab] = useState<'BREAKAGE' | 'CHEMICAL_LEDGER' | 'LOCKER_ISSUANCE'>('BREAKAGE');
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<BreakageRecord | null>(null);

  const college = institution?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = institution?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = institution?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = institution?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = institution?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;

  // Breakage Register State
  const [breakageList, setBreakageList] = useState<BreakageRecord[]>([
    {
      id: 'BRK-001',
      receiptNo: 'DPK/LAB/2025/042',
      date: '10-Sep-2025',
      rollNo: '07',
      studentName: 'Aditya Deshmukh',
      prn: '20250182107',
      batch: 'B1',
      apparatusBroken: 'Borosilicate Graduated Measuring Cylinder (100 mL)',
      apparatusSpecification: 'Borosil Class B, Tolerance ±1.0 mL',
      costInRupees: 280,
      fineAmount: 280,
      reason: 'Accidental slippage while rinsing at washing sink',
      paymentStatus: 'PAID',
      receiptDate: '10-Sep-2025',
    },
    {
      id: 'BRK-002',
      receiptNo: 'DPK/LAB/2025/043',
      date: '17-Sep-2025',
      rollNo: '24',
      studentName: 'Shruti Shirole',
      prn: '20250182124',
      batch: 'B2',
      apparatusBroken: 'Round Bottom Boiling Flask with Ground Glass Joint (250 mL)',
      apparatusSpecification: 'Joint 24/29 Borosil',
      costInRupees: 350,
      fineAmount: 350,
      reason: 'Thermal shock due to rapid cold water rinsing after heating',
      paymentStatus: 'PAID',
      receiptDate: '18-Sep-2025',
    },
    {
      id: 'BRK-003',
      receiptNo: 'DPK/LAB/2025/044',
      date: '08-Oct-2025',
      rollNo: '41',
      studentName: 'Rohit Gangurde',
      prn: '20250182141',
      batch: 'B3',
      apparatusBroken: 'Porcelain Mortar and Pestle (100 mm diameter)',
      apparatusSpecification: 'Heavy wall glazed exterior, rough interior',
      costInRupees: 220,
      fineAmount: 220,
      reason: 'Pestle dropped on ceramic tile floor during dry granulation trituration',
      paymentStatus: 'PENDING',
      receiptDate: '08-Oct-2025',
    },
  ]);

  // Chemical Ledger
  const [chemicalLedger, setChemicalLedger] = useState<ChemicalLedgerItem[]>([
    {
      id: 'CHM-101',
      chemicalName: 'Purified Sucrose IP',
      casNo: '57-50-1',
      grade: 'IP',
      experimentNo: 'Expt 4 (Simple Syrup IP)',
      issuedToBatch: 'Batch B1 (20 Students)',
      dateIssued: '05-Aug-2025',
      quantityConsumed: '13.34 kg',
      balanceStock: '36.66 kg',
      labTechnician: 'Mr. S. G. Kute',
    },
    {
      id: 'CHM-102',
      chemicalName: 'Liquid Paraffin (Heavy) IP',
      casNo: '8012-95-1',
      grade: 'IP',
      experimentNo: 'Expt 6 (Mineral Oil Emulsion)',
      issuedToBatch: 'Batch B2 (20 Students)',
      dateIssued: '19-Aug-2025',
      quantityConsumed: '2.50 Litres',
      balanceStock: '17.50 Litres',
      labTechnician: 'Mr. S. G. Kute',
    },
    {
      id: 'CHM-103',
      chemicalName: 'Acacia Powder (Gum Arabic) IP',
      casNo: '9000-01-5',
      grade: 'IP',
      experimentNo: 'Expt 6 & 7 (Emulsifying Agents)',
      issuedToBatch: 'Batch B2 (20 Students)',
      dateIssued: '19-Aug-2025',
      quantityConsumed: '1.20 kg',
      balanceStock: '8.80 kg',
      labTechnician: 'Mr. S. G. Kute',
    },
    {
      id: 'CHM-104',
      chemicalName: 'Paracetamol IP (Pure API)',
      casNo: '103-90-2',
      grade: 'IP',
      experimentNo: 'Expt 8 (Paracetamol Pediatric Elixir)',
      issuedToBatch: 'Batch B3 (20 Students)',
      dateIssued: '04-Sep-2025',
      quantityConsumed: '500 grams',
      balanceStock: '4.50 kg',
      labTechnician: 'Mr. S. G. Kute',
    },
    {
      id: 'CHM-105',
      chemicalName: 'Sulphacetamide Sodium IP',
      casNo: '6209-17-2',
      grade: 'IP',
      experimentNo: 'Expt 11 (Ophthalmic Drops IP)',
      issuedToBatch: 'Batch B1 (20 Students)',
      dateIssued: '07-Oct-2025',
      quantityConsumed: '400 grams',
      balanceStock: '2.10 kg',
      labTechnician: 'Mr. S. G. Kute',
    },
  ]);

  // Apparatus Locker Issuance
  const [lockerIssuance, setLockerIssuance] = useState<ApparatusLockerItem[]>([
    {
      lockerNo: 'LKR-B1-01',
      batch: 'B1',
      studentRolls: 'Roll No. 01 & 02 (Aarav Sharma & Diya Patel)',
      standardKitItems: 'Beakers (100ml, 250ml), Conical Flask 250ml, Pipette 10ml, Glass Rod, Watch Glass',
      conditionStatus: 'Good',
      lastInspectionDate: '01-Jul-2025',
    },
    {
      lockerNo: 'LKR-B1-02',
      batch: 'B1',
      studentRolls: 'Roll No. 03 & 04 (Rohan Kulkarni & Ananya Iyer)',
      standardKitItems: 'Beakers (100ml, 250ml), Conical Flask 250ml, Pipette 10ml, Glass Rod, Watch Glass',
      conditionStatus: 'Good',
      lastInspectionDate: '01-Jul-2025',
    },
    {
      lockerNo: 'LKR-B2-01',
      batch: 'B2',
      studentRolls: 'Roll No. 21 & 22 (Swapnil Jagtap & Neha Gokhale)',
      standardKitItems: 'Beakers (100ml, 250ml), Conical Flask 250ml, Pipette 10ml, Glass Rod, Watch Glass',
      conditionStatus: 'Minor Wear',
      lastInspectionDate: '01-Jul-2025',
    },
  ]);

  // Form State for Recording New Breakage
  const [newRollNo, setNewRollNo] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newApparatus, setNewApparatus] = useState('Beaker 250 mL (Borosil)');
  const [newCost, setNewCost] = useState(120);
  const [newReason, setNewReason] = useState('Slipped while washing');
  const [newBatch, setNewBatch] = useState<'B1' | 'B2' | 'B3'>('B1');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddBreakage = () => {
    if (!newRollNo || !newStudentName) return;
    const newRecord: BreakageRecord = {
      id: `BRK-${Date.now()}`,
      receiptNo: `DPK/LAB/2025/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB'),
      rollNo: newRollNo,
      studentName: newStudentName,
      prn: `20250182${100 + parseInt(newRollNo, 10)}`,
      batch: newBatch,
      apparatusBroken: newApparatus,
      apparatusSpecification: 'Official Laboratory Grade',
      costInRupees: newCost,
      fineAmount: newCost,
      reason: newReason,
      paymentStatus: 'PAID',
      receiptDate: new Date().toLocaleDateString('en-GB'),
    };
    setBreakageList([newRecord, ...breakageList]);
    setShowAddModal(false);
    setSelectedReceiptForPrint(newRecord);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                PCI SIF & MSBTE Laboratory Compliance
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Pharmaceutics Practical Operations
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Glassware & Apparatus Breakage Register, Fine Receipts & Lab Chemical Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Batch-wise apparatus locker management, daily experiment chemical consumption ledger, and official statutory breakage fine receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Record New Breakage
            </button>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('BREAKAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'BREAKAGE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Breakage Ledger & Receipts ({breakageList.length})
          </button>
          <button
            onClick={() => setActiveTab('CHEMICAL_LEDGER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'CHEMICAL_LEDGER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
            Chemical Consumption Log
          </button>
          <button
            onClick={() => setActiveTab('LOCKER_ISSUANCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'LOCKER_ISSUANCE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Batch Locker Issuance
          </button>
        </div>
      </div>

      {/* TAB 1: BREAKAGE LEDGER */}
      {activeTab === 'BREAKAGE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Receipt No</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Roll</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Batch</th>
                    <th className="p-2.5">Apparatus Broken</th>
                    <th className="p-2.5 text-right">Cost (₹)</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {breakageList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-2.5 font-mono text-[11px] font-bold text-slate-700">{item.receiptNo}</td>
                      <td className="p-2.5 text-slate-600">{item.date}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-500">{item.rollNo}</td>
                      <td className="p-2.5 font-bold text-slate-900">{item.studentName}</td>
                      <td className="p-2.5 font-mono text-[10px]">{item.batch}</td>
                      <td className="p-2.5 text-slate-700 font-semibold">{item.apparatusBroken}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-rose-700">₹{item.costInRupees}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setSelectedReceiptForPrint(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-bold text-[11px] transition flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Receipt className="w-3 h-3 text-purple-600" />
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHEMICAL CONSUMPTION LOG */}
      {activeTab === 'CHEMICAL_LEDGER' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Chemical Name (API / Reagent)</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Prescribed Practical</th>
                  <th className="p-2.5">Issued To</th>
                  <th className="p-2.5">Date Issued</th>
                  <th className="p-2.5 text-right">Consumed</th>
                  <th className="p-2.5 text-right">Balance In Stock</th>
                  <th className="p-2.5">Lab In-Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {chemicalLedger.map((chem) => (
                  <tr key={chem.id} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-bold text-slate-900">
                      {chem.chemicalName}
                      <span className="block text-[10px] font-mono text-slate-400">CAS: {chem.casNo}</span>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-indigo-700">{chem.grade}</td>
                    <td className="p-2.5 text-slate-700">{chem.experimentNo}</td>
                    <td className="p-2.5 text-slate-600">{chem.issuedToBatch}</td>
                    <td className="p-2.5 text-slate-500 font-mono text-[11px]">{chem.dateIssued}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-purple-700">{chem.quantityConsumed}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-700">{chem.balanceStock}</td>
                    <td className="p-2.5 text-slate-600">{chem.labTechnician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOCKER APPARATUS ISSUANCE */}
      {activeTab === 'LOCKER_ISSUANCE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Locker No</th>
                  <th className="p-2.5">Batch</th>
                  <th className="p-2.5">Student Assignees</th>
                  <th className="p-2.5">Standard Glassware Kit Items</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5">Last Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {lockerIssuance.map((l) => (
                  <tr key={l.lockerNo} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-mono font-bold text-slate-900">{l.lockerNo}</td>
                    <td className="p-2.5 font-mono text-indigo-700 font-bold">{l.batch}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{l.studentRolls}</td>
                    <td className="p-2.5 text-slate-600 text-[11px]">{l.standardKitItems}</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        {l.conditionStatus}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-500">{l.lastInspectionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECEIPT PREVIEW / PRINT MODAL */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200">
            {/* Printable Receipt Card */}
            <div className="border-2 border-slate-900 p-5 rounded-xl space-y-3 bg-white text-slate-900">
              <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                <div className="flex justify-center mb-1">
                  <InstitutionSeal profile={institution} variant="circular" size="sm" />
                </div>
                <div className="text-xs font-black uppercase">{college}</div>
                <div className="text-[10px] text-slate-500">Department of Pharmaceutics • Laboratory Store</div>
                <div className="text-[11px] font-mono font-bold text-rose-700 pt-1">
                  OFFICIAL GLASSWARE BREAKAGE & FINE RECEIPT
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-2">
                <div>Receipt No: <strong>{selectedReceiptForPrint.receiptNo}</strong></div>
                <div>Date: <strong>{selectedReceiptForPrint.date}</strong></div>
                <div>Student: <strong>{selectedReceiptForPrint.studentName}</strong></div>
                <div>Roll / Batch: <strong>{selectedReceiptForPrint.rollNo} ({selectedReceiptForPrint.batch})</strong></div>
                <div>PRN: <strong>{selectedReceiptForPrint.prn}</strong></div>
                <div>Payment: <strong className="text-emerald-700">{selectedReceiptForPrint.paymentStatus}</strong></div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-800">Apparatus Description:</div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] font-medium">
                  {selectedReceiptForPrint.apparatusBroken}
                </div>
                <div className="text-[10px] text-slate-500 italic">
                  Reason: {selectedReceiptForPrint.reason}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs font-black text-rose-950">
                <span>Total Replacement Fine Amount:</span>
                <span className="font-mono text-base">₹{selectedReceiptForPrint.fineAmount}</span>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-500">
                <div>
                  <div className="border-b border-slate-300 mb-1"></div>
                  Student Signature
                </div>
                <div>
                  <div className="border-b border-slate-300 mb-1"></div>
                  Storekeeper / HOD Seal
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedReceiptForPrint(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BREAKAGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Apparatus Breakage</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Roll Number:</label>
                  <input
                    type="text"
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                    placeholder="e.g. 14"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Student Name:</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Priya More"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Batch:</label>
                  <select
                    value={newBatch}
                    onChange={(e: any) => setNewBatch(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="B1">Batch B1</option>
                    <option value="B2">Batch B2</option>
                    <option value="B3">Batch B3</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Replacement Cost (₹):</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Apparatus Broken:</label>
                <input
                  type="text"
                  value={newApparatus}
                  onChange={(e) => setNewApparatus(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Circumstances / Reason:</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBreakage}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition"
              >
                Generate Fine Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
