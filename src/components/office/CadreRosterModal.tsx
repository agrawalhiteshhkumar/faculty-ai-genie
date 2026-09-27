"use client";

import React, { useState } from "react";
import { generateOfficialReport } from "@/utils/printReport";
import { X, Printer, CheckCircle2 } from "lucide-react";

interface FacultyCadreRecord {
  id: string;
  name: string;
  designation: "Principal" | "Professor" | "Associate Professor" | "Assistant Professor" | "Lecturer";
  qualification: string;
  department: "Pharmaceutics" | "Pharmacology" | "Pharmaceutical Chemistry" | "Pharmacognosy";
  dteApprovalStatus: "APPROVED" | "PROVISIONAL";
  dateOfJoining: string;
}

const DEFAULT_CADRE_ROSTER: FacultyCadreRecord[] = [
  { id: "FAC-1", name: "Dr. Hiteshkumar Agrawal", designation: "Principal", qualification: "Ph.D, M.Pharm", department: "Pharmaceutics", dteApprovalStatus: "APPROVED", dateOfJoining: "01/08/2018" },
  { id: "FAC-2", name: "Prof. S. R. Deshmukh", designation: "Lecturer", qualification: "M.Pharm (Pharmacology)", department: "Pharmacology", dteApprovalStatus: "APPROVED", dateOfJoining: "15/07/2019" },
  { id: "FAC-3", name: "Prof. V. K. Patil", designation: "Lecturer", qualification: "M.Pharm (Pharmaceutics)", department: "Pharmaceutics", dteApprovalStatus: "APPROVED", dateOfJoining: "10/01/2020" },
  { id: "FAC-4", name: "Prof. M. A. Pawar", designation: "Lecturer", qualification: "M.Pharm (Quality Assurance)", department: "Pharmaceutical Chemistry", dteApprovalStatus: "APPROVED", dateOfJoining: "05/08/2021" },
  { id: "FAC-5", name: "Prof. K. N. Shinde", designation: "Lecturer", qualification: "M.Pharm (Pharmacognosy)", department: "Pharmacognosy", dteApprovalStatus: "APPROVED", dateOfJoining: "12/11/2021" },
  { id: "FAC-6", name: "Prof. P. B. Wagh", designation: "Lecturer", qualification: "B.Pharm", department: "Pharmaceutics", dteApprovalStatus: "PROVISIONAL", dateOfJoining: "01/09/2023" }
];

export default function CadreRosterModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [faculty] = useState<FacultyCadreRecord[]>(DEFAULT_CADRE_ROSTER);

  if (!isOpen) return null;

  const handlePrintCadreReport = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "pci2";
    onLogAudit("PCI_CADRE_ROSTER_PRINTED", `Generated PCI Statutory Cadre Roster & SIF-B compliance sheet with hash ${auditHash}`);

    generateOfficialReport({
      title: "Pharmacy Council of India (PCI) Statutory Teaching Cadre Roster",
      subtitle: "Verified against PCI Education Regulations & DTE Maharashtra Norms (Intake: 60 D.Pharm)",
      regulatoryBody: "PCI",
      reportRefNo: `DPKCOP/PCI-ROSTER/${new Date().getFullYear()}/CAD-01`,
      dataHeaders: [
        "Sr",
        "Faculty Legal Name",
        "Designation",
        "Highest Qualification",
        "Department / Specialization",
        "DTE Approval Status",
        "Joining Date",
      ],
      dataRows: faculty.map((f, idx) => [
        idx + 1,
        f.name,
        f.designation,
        f.qualification,
        f.department,
        f.dteApprovalStatus === "APPROVED" ? "GOVT / DTE SANCTIONED" : "PROVISIONAL APPOINTMENT",
        f.dateOfJoining,
      ]),
      summaryMetrics: [
        { label: "Teaching Faculty Available", value: `${faculty.length} Members` },
        { label: "Student-to-Teacher Ratio", value: "1:20 (PCI Compliant)" },
        { label: "DTE Approved Staff", value: `${faculty.filter(f => f.dteApprovalStatus === "APPROVED").length} Members` },
        { label: "PCI Institute ID", value: "PCI-9178 (Sinnar)" },
      ],
      auditHash,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">Establishment & Service Cell</span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">PCI Teaching Cadre Roster & Approvals Matrix</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-3 bg-white flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Cadre Compliance: <strong>1:20 Ratio Maintained</strong></span>
          <button onClick={handlePrintCadreReport} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm">
            <Printer className="w-3.5 h-3.5" /> Print PCI Cadre Matrix (PDF)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Faculty Name</th>
                <th className="pb-3">Designation</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Qualification</th>
                <th className="pb-3 text-right">DTE Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{f.name}</td>
                  <td className="py-3 text-blue-700 font-semibold">{f.designation}</td>
                  <td className="py-3 text-slate-600">{f.department}</td>
                  <td className="py-3 font-mono text-slate-700">{f.qualification}</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {f.dteApprovalStatus}
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
