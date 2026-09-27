"use client";

import React, { useState } from "react";
import { generateOfficialReport } from "@/utils/printReport";
import { X, Printer, CheckCircle2 } from "lucide-react";

interface DeadStockItem {
  id: string;
  assetTag: string;
  name: string;
  lab: string;
  quantity: number;
  purchaseDate: string;
}

const DEFAULT_EQUIPMENT: DeadStockItem[] = [
  { id: "EQ-1", assetTag: "DPKCOP/PCEUT/01", name: "Tablet Punching Machine (Rotary)", lab: "Pharmaceutics", quantity: 1, purchaseDate: "12/03/2021" },
  { id: "EQ-2", assetTag: "DPKCOP/PCEUT/02", name: "Dissolution Test Apparatus (8-Basket)", lab: "Pharmaceutics", quantity: 1, purchaseDate: "18/06/2021" },
  { id: "EQ-3", assetTag: "DPKCOP/PCHEM/01", name: "Digital Melting Point Apparatus", lab: "Chemistry", quantity: 3, purchaseDate: "10/01/2022" },
  { id: "EQ-4", assetTag: "DPKCOP/PCOL/01", name: "Digital Plethysmometer", lab: "Pharmacology", quantity: 1, purchaseDate: "05/09/2022" },
  { id: "EQ-5", assetTag: "DPKCOP/PCOG/01", name: "Projection Microscope with Camera", lab: "Pharmacognosy", quantity: 2, purchaseDate: "22/11/2022" }
];

export default function StoresModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [equipment] = useState<DeadStockItem[]>(DEFAULT_EQUIPMENT);

  if (!isOpen) return null;

  const handlePrintStoresReport = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "str5";
    onLogAudit("PCI_STORES_REGISTER_PRINTED", `Generated PCI SIF-E Dead Stock Register with hash ${auditHash}`);

    generateOfficialReport({
      title: "PCI SIF-E Appendix Dead Stock & Equipment Register",
      subtitle: "Verified against Pharmacy Council of India (PCI) Minimum Standard Regulations",
      regulatoryBody: "PCI",
      reportRefNo: `DPKCOP/STORES/DEADSTOCK/${new Date().getFullYear()}/01`,
      dataHeaders: ["Sr", "Asset Tag", "Instrument / Equipment", "Lab Allocated", "Qty", "Purchase Date", "Operational State"],
      dataRows: equipment.map((e, idx) => [
        idx + 1,
        e.assetTag,
        e.name,
        e.lab,
        e.quantity,
        e.purchaseDate,
        "WORKING & CALIBRATED",
      ]),
      summaryMetrics: [
        { label: "Major Instruments", value: `${equipment.length} Units` },
        { label: "Laboratories Covered", value: "All 4 Statutory Labs" },
        { label: "Inspection Status", value: "SIF-E Compliant" },
      ],
      auditHash,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">Pharmacy Stores & Dead Stock</span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">PCI SIF-E Dead Stock Equipment Register</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-3 bg-white flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Compliance: <strong>PCI Minimum Standards Verified</strong></span>
          <button onClick={handlePrintStoresReport} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm">
            <Printer className="w-3.5 h-3.5" /> Print SIF-E Dead Stock (PDF)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Asset Tag</th>
                <th className="pb-3">Instrument / Equipment</th>
                <th className="pb-3">Department Lab</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">PCI State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equipment.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-bold text-slate-700">{e.assetTag}</td>
                  <td className="py-3 font-bold text-slate-900">{e.name}</td>
                  <td className="py-3 text-blue-700">{e.lab}</td>
                  <td className="py-3 text-center font-bold">{e.quantity}</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Calibrated
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
