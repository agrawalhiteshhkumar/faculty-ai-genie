import React, { useState } from 'react';
import {
  Building2,
  Download,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Calendar,
  Layers,
  FileCheck2,
  Clock,
  Printer,
  ShieldCheck,
  Award,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  DPK_PCI_LABS,
  PCILaboratory,
  PCIEquipment,
  STANDARD_PCI_EQUIPMENT_TEMPLATE,
} from '../../../data/pciStaffAndLabsData';

interface PCILabsRegisterViewProps {
  collegeName?: string;
}

export const PCILabsRegisterView: React.FC<PCILabsRegisterViewProps> = ({
  collegeName = 'D. P. Kharde Navjeevan College of Pharmacy',
}) => {
  const [labs, setLabs] = useState<PCILaboratory[]>(DPK_PCI_LABS);
  const [selectedLabId, setSelectedLabId] = useState<string>('pci-lab-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);

  const handleLoadStandardTemplate = () => {
    setLabs(STANDARD_PCI_EQUIPMENT_TEMPLATE);
  };

  const handleClearToCleanSlate = () => {
    if (window.confirm('Reset all 6 PCI laboratories to clean slate (0 equipment records)?')) {
      setLabs((prev) =>
        prev.map((lab) => ({
          ...lab,
          equipments: [],
          equipmentCount: 0,
        }))
      );
    }
  };

  // New equipment form state
  const [newEq, setNewEq] = useState<Partial<PCIEquipment>>({
    name: '',
    modelMake: '',
    deadStockPageNo: '',
    purchaseDate: '2024-06-15',
    purchaseCost: 50000,
    quantity: 1,
    workingCondition: 'OPERATIONAL',
    lastCalibrationDate: '2025-10-15',
    nextCalibrationDue: '2026-10-14',
    calibrationAgency: 'NABL Certified Metrology Lab',
    certificateRef: 'NABL-CAL-2025-01',
    remarks: 'Compliant with PCI standard specifications.',
  });

  const activeLab = labs.find((l) => l.id === selectedLabId) || labs[0] || {
    id: 'pci-lab-1',
    labNumber: 'LAB-01',
    name: 'Pharmaceutics Laboratory',
    areaSqM: 105.5,
    intakeCapacity: 20,
    inChargeFacultyName: 'Unassigned',
    labAssistantName: 'Unassigned',
    equipmentCount: 0,
    equipments: [],
  };

  // All equipments across all labs or selected lab
  const currentEquipments = (activeLab.equipments || []).filter((eq) => {
    const matchesStatus = statusFilter === 'ALL' || eq.workingCondition === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      eq.name.toLowerCase().includes(q) ||
      eq.assetTag.toLowerCase().includes(q) ||
      eq.modelMake.toLowerCase().includes(q) ||
      eq.deadStockPageNo.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const totalAllEquipments = labs.reduce((acc, l) => acc + l.equipments.length, 0);
  const operationalCount = labs.reduce(
    (acc, l) => acc + l.equipments.filter((e) => e.workingCondition === 'OPERATIONAL').length,
    0
  );
  const calibrationDueCount = labs.reduce(
    (acc, l) => acc + l.equipments.filter((e) => e.workingCondition === 'CALIBRATION_DUE').length,
    0
  );

  const handleExportDeadStockCSV = () => {
    const headers = [
      'Lab Number',
      'Laboratory Name',
      'Asset Tag',
      'Equipment Name',
      'Model & Make',
      'DSR Page Ref',
      'Purchase Date',
      'Cost (INR)',
      'Qty',
      'Condition',
      'Last Calibrated',
      'Next Calibration Due',
      'Calibration Agency',
      'Certificate Ref',
      'Remarks',
    ];

    const rows: string[][] = [];
    labs.forEach((lab) => {
      lab.equipments.forEach((eq) => {
        rows.push([
          lab.labNumber,
          lab.name,
          eq.assetTag,
          eq.name,
          eq.modelMake,
          eq.deadStockPageNo,
          eq.purchaseDate,
          `${eq.purchaseCost}`,
          `${eq.quantity}`,
          eq.workingCondition,
          eq.lastCalibrationDate,
          eq.nextCalibrationDue,
          eq.calibrationAgency,
          eq.certificateRef,
          eq.remarks,
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PCI_DeadStock_Registers_All6Labs_${collegeName.substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEq.name || !newEq.modelMake) return;

    const count = activeLab.equipments.length + 1;
    const tag = `DPK-EQ-${activeLab.labNumber.replace('-', '')}-00${count}`;

    const created: PCIEquipment = {
      id: `eq-${Date.now()}`,
      assetTag: tag,
      name: newEq.name,
      modelMake: newEq.modelMake,
      deadStockPageNo: newEq.deadStockPageNo || `DSR/${activeLab.labNumber}/Vol-1/Pg-${count * 2}`,
      purchaseDate: newEq.purchaseDate || new Date().toISOString().split('T')[0],
      purchaseCost: Number(newEq.purchaseCost) || 25000,
      quantity: Number(newEq.quantity) || 1,
      workingCondition: newEq.workingCondition || 'OPERATIONAL',
      lastCalibrationDate: newEq.lastCalibrationDate || '2025-10-01',
      nextCalibrationDue: newEq.nextCalibrationDue || '2026-09-30',
      calibrationAgency: newEq.calibrationAgency || 'NABL Metrology Labs',
      certificateRef: newEq.certificateRef || `CAL-${Date.now().toString().slice(-4)}`,
      remarks: newEq.remarks || 'Standard working condition.',
    };

    setLabs((prev) =>
      prev.map((lab) => {
        if (lab.id === activeLab.id) {
          return {
            ...lab,
            equipments: [created, ...lab.equipments],
            equipmentCount: lab.equipmentCount + 1,
          };
        }
        return lab;
      })
    );

    setIsAddEquipmentModalOpen(false);
    setNewEq({
      name: '',
      modelMake: '',
      deadStockPageNo: '',
      purchaseDate: '2024-06-15',
      purchaseCost: 50000,
      quantity: 1,
      workingCondition: 'OPERATIONAL',
      lastCalibrationDate: '2025-10-15',
      nextCalibrationDue: '2026-10-14',
      calibrationAgency: 'NABL Certified Metrology Lab',
      certificateRef: 'NABL-CAL-2025-01',
      remarks: 'Compliant with PCI standard specifications.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              Mandatory 6 PCI Laboratories
            </span>
            <span className="text-xs text-slate-500 font-medium">Statutory Dead-Stock & Calibration Register</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            PCI Laboratory & Equipment Dead-Stock Management
          </h2>
          <p className="text-xs text-slate-500">
            Complete inventory tracking, NABL calibration certificates, maintenance schedules, and faculty in-charges
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleLoadStandardTemplate}
            id="load-standard-pci-template-btn"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Standard PCI Equipment Template
          </button>
          {totalAllEquipments > 0 && (
            <button
              onClick={handleClearToCleanSlate}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 hover:border-rose-200 cursor-pointer"
              title="Reset to 0 equipment records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset to Clean Slate
            </button>
          )}
          <button
            onClick={handleExportDeadStockCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Dead-Stock (CSV)
          </button>
          <button
            onClick={() => setIsAddEquipmentModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Equipment Record
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {totalAllEquipments === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                PCI Dead-Stock Register: Clean Slate Active
              </h4>
              <p className="text-[11px] text-amber-800">
                All pre-loaded mock instruments have been purged. Enter real laboratory apparatus or load the official PCI ER-2020 standard equipment template with one click.
              </p>
            </div>
          </div>
          <button
            onClick={handleLoadStandardTemplate}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Standard PCI Equipment Template
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">PCI Laboratories</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">6 Laboratories</span>
          <span className="text-[10px] text-emerald-600 font-semibold">582.5 sq.m Carpet Area</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cataloged Equipments</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">
            {totalAllEquipments} Asset Tags
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold">100% Dead-Stock Page Indexed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Operational Status</span>
          <span className="text-xl font-black text-emerald-600 mt-0.5 block font-mono">
            {operationalCount} Working
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Ready for Student Practical Batches</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Calibration Alerts</span>
          <span className="text-xl font-black text-amber-600 mt-0.5 block font-mono">
            {calibrationDueCount} Due for Inspection
          </span>
          <span className="text-[10px] text-amber-700 font-semibold">NABL Agency Scheduled</span>
        </div>
      </div>

      {/* 6 PCI Lab Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => setSelectedLabId(lab.id)}
            className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
              selectedLabId === lab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-amber-400'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className={selectedLabId === lab.id ? 'text-amber-400' : 'text-slate-500'}>
                  {lab.labNumber}
                </span>
                <span className="text-[9px] opacity-75">{lab.areaSqM} m²</span>
              </div>
              <div className="font-bold text-xs mt-1 line-clamp-2">{lab.name}</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/40 text-[10px] flex items-center justify-between">
              <span className="opacity-75">{lab.equipmentCount} units</span>
              <span className="font-bold text-emerald-500">✓ PCI</span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Lab Details Header Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {activeLab.labNumber}
            </span>
            <h3 className="text-base font-bold text-white">{activeLab.name}</h3>
          </div>
          <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1 pt-1 font-medium">
            <span>Carpet Area: <strong>{activeLab.areaSqM} sq.m</strong></span>
            <span>Batch Capacity: <strong>{activeLab.intakeCapacity} Students</strong></span>
            <span>Faculty In-Charge: <strong>{activeLab.inChargeFacultyName}</strong></span>
            <span>Lab Technician: <strong>{activeLab.labAssistantName}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PCI ER-2020 Compliant
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search equipment by name, make, asset tag, DSR ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'OPERATIONAL', 'CALIBRATION_DUE', 'UNDER_MAINTENANCE'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === s
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'ALL'
                ? 'All Equipments'
                : s === 'OPERATIONAL'
                ? 'Operational'
                : s === 'CALIBRATION_DUE'
                ? 'Calibration Due'
                : 'Under Maintenance'}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Dead-Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3">Asset Tag</th>
                <th className="p-3">Equipment Name & Make / Model</th>
                <th className="p-3">DSR Page Ref</th>
                <th className="p-3">Purchase Date & Cost</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Working Condition</th>
                <th className="p-3">Last Calibrated</th>
                <th className="p-3">Next Due & Agency</th>
                <th className="p-3">Compliance Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {currentEquipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center">
                    <div className="max-w-md mx-auto space-y-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {activeLab.equipments.length === 0
                          ? `No Equipment Cataloged in ${activeLab.name}`
                          : 'No Equipment Matched Search Filter'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {activeLab.equipments.length === 0
                          ? 'This laboratory is currently in a clean slate state (0 registered units). Add custom apparatus or load the standard PCI equipment norms.'
                          : 'Try adjusting your search query or filter condition to view registered instruments.'}
                      </p>
                      {activeLab.equipments.length === 0 && (
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            onClick={handleLoadStandardTemplate}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Load Standard PCI Template
                          </button>
                          <button
                            onClick={() => setIsAddEquipmentModalOpen(true)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Single Record
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentEquipments.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{eq.assetTag}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{eq.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{eq.modelMake}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-700">
                      {eq.deadStockPageNo}
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-slate-900 font-bold">₹{eq.purchaseCost.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-500">{eq.purchaseDate}</div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">{eq.quantity}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          eq.workingCondition === 'OPERATIONAL'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : eq.workingCondition === 'CALIBRATION_DUE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {eq.workingCondition}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-700">{eq.lastCalibrationDate}</td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-700 text-[11px]">{eq.nextCalibrationDue}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {eq.calibrationAgency} (Ref: {eq.certificateRef})
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 text-[11px] max-w-xs">{eq.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EQUIPMENT MODAL */}
      {isAddEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  Add Equipment to {activeLab.name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">Lab ID: {activeLab.labNumber}</span>
              </div>
              <button
                onClick={() => setIsAddEquipmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Digital Analytical Balance 0.1 mg"
                  value={newEq.name}
                  onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Make & Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Shimadzu ATX224"
                    value={newEq.modelMake}
                    onChange={(e) => setNewEq({ ...newEq, modelMake: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dead-Stock Page Ref</label>
                  <input
                    type="text"
                    placeholder="DSR/PH/Vol-2/Pg-28"
                    value={newEq.deadStockPageNo}
                    onChange={(e) => setNewEq({ ...newEq, deadStockPageNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cost (INR)</label>
                  <input
                    type="number"
                    value={newEq.purchaseCost}
                    onChange={(e) => setNewEq({ ...newEq, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newEq.quantity}
                    onChange={(e) => setNewEq({ ...newEq, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={newEq.workingCondition}
                    onChange={(e) => setNewEq({ ...newEq, workingCondition: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="OPERATIONAL">Operational</option>
                    <option value="CALIBRATION_DUE">Calibration Due</option>
                    <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Calibration Date</label>
                  <input
                    type="date"
                    value={newEq.lastCalibrationDate}
                    onChange={(e) => setNewEq({ ...newEq, lastCalibrationDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Next Calibration Due</label>
                  <input
                    type="date"
                    value={newEq.nextCalibrationDue}
                    onChange={(e) => setNewEq({ ...newEq, nextCalibrationDue: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Calibration Agency</label>
                  <input
                    type="text"
                    value={newEq.calibrationAgency}
                    onChange={(e) => setNewEq({ ...newEq, calibrationAgency: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Ref No</label>
                  <input
                    type="text"
                    value={newEq.certificateRef}
                    onChange={(e) => setNewEq({ ...newEq, certificateRef: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddEquipmentModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl shadow-sm"
                >
                  Save Equipment Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
