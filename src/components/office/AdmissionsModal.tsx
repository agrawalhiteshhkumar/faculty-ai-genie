"use client";

import React, { useState } from "react";
import { generateOfficialReport } from "@/utils/printReport";
import { X, Printer, CheckCircle2 } from "lucide-react";

interface StudentAdmissionRecord {
  id: string;
  capMeritNo: number;
  applicationId: string;
  candidateName: string;
  category: string;
  admissionSeatType: string;
  scholarshipScheme: string;
}

const DEFAULT_ADMISSIONS: StudentAdmissionRecord[] = [
  { id: "ADM-01", capMeritNo: 1420, applicationId: "DEN24105539", candidateName: "Aarav Santosh Patil", category: "OPEN", admissionSeatType: "GOPENH", scholarshipScheme: "EBC Rajarshi Shahu" },
  { id: "ADM-02", capMeritNo: 2185, applicationId: "DEN24105540", candidateName: "Pooja Ramesh Jadhav", category: "OBC", admissionSeatType: "GOBCH", scholarshipScheme: "VJNT/OBC Welfare Freeship" },
  { id: "ADM-03", capMeritNo: 3410, applicationId: "DEN24105541", candidateName: "Rohan Vinod Shinde", category: "SC", admissionSeatType: "GSCH", scholarshipScheme: "Social Justice Freeship" },
  { id: "ADM-04", capMeritNo: 4890, applicationId: "DEN24105542", candidateName: "Ananya Nitin Deshmukh", category: "EWS", admissionSeatType: "EWS", scholarshipScheme: "EBC Tuition Concession" }
];

export default function AdmissionsModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [admissions] = useState<StudentAdmissionRecord[]>(DEFAULT_ADMISSIONS);

  if (!isOpen) return null;

  const handlePrintAdmissionsReport = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "adm8";
    onLogAudit("DTE_ADMISSIONS_REGISTER_PRINTED", `Generated official DTE CAP Matrix with hash ${auditHash}`);

    generateOfficialReport({
      title: "DTE Maharashtra Centralized Admission Process (CAP) Allocation Matrix",
      subtitle: "Verified against Admissions Regulating Authority (ARA) & DTE Code: 5539 Norms",
      regulatoryBody: "DTE",
      reportRefNo: `DPKCOP/DTE-CAP/${new Date().getFullYear()}/ADM-01`,
      dataHeaders: ["Sr", "Merit Rank", "Application ID", "Candidate Name", "Category", "Seat Allotment", "Status"],
      dataRows: admissions.map((a, idx) => [
        idx + 1,
        `# ${a.capMeritNo}`,
        a.applicationId,
        a.candidateName,
        a.category,
        a.admissionSeatType,
        "CONFIRMED & ENROLLED",
      ]),
      summaryMetrics: [
        { label: "Sanctioned Intake", value: "60 Seats (D.Pharm)" },
        { label: "Confirmed Enrolments", value: `${admissions.length} Admitted` },
        { label: "DTE Regional Office", value: "Nashik (RO-5)" },
      ],
      auditHash,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">Student Admissions & Eligibility</span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">DTE CAP Allocation Matrix & MahaDBT Wing</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-3 bg-white flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Intake: <strong>60 Approved Seats</strong></span>
          <button onClick={handlePrintAdmissionsReport} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm">
            <Printer className="w-3.5 h-3.5" /> Print DTE CAP Matrix (PDF)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Candidate Legal Name</th>
                <th className="pb-3">Application ID</th>
                <th className="pb-3 text-center">Merit</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">MSBTE Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{a.candidateName}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-600">{a.applicationId}</td>
                  <td className="py-3 text-center font-bold text-slate-800">#{a.capMeritNo}</td>
                  <td className="py-3 text-slate-700">{a.category}</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Enrolled
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
