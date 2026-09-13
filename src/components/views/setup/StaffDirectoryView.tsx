import React, { useState } from 'react';
import {
  Users,
  Search,
  Copy,
  Check,
  Download,
  Printer,
  ShieldCheck,
  Plus,
  KeyRound,
  Filter,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Building2,
  Lock,
} from 'lucide-react';
import { DPK_STAFF_SEATS, StaffCredential, HARD_LOCKED_FACULTY_SEAT_LIMIT } from '../../../data/pciStaffAndLabsData';

interface StaffDirectoryViewProps {
  collegeName?: string;
  onSelectFacultyForPreview?: (staff: StaffCredential) => void;
}

export const StaffDirectoryView: React.FC<StaffDirectoryViewProps> = ({
  collegeName = 'D. P. Kharde Navjeevan College of Pharmacy',
}) => {
  const [staffList, setStaffList] = useState<StaffCredential[]>(DPK_STAFF_SEATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSlipsModalOpen, setIsSlipsModalOpen] = useState(false);

  // New staff form state
  const [newStaff, setNewStaff] = useState<Partial<StaffCredential>>({
    name: '',
    role: 'FACULTY',
    designation: 'Assistant Professor',
    department: 'Department of Pharmacy',
    email: '',
    pciRegNo: '',
    qualification: 'M.Pharm',
    experienceYears: 3,
    assignedSubjectOrLab: '',
    contactNumber: '+91 ',
    status: 'ACTIVE',
  });

  const filteredStaff = staffList.filter((staff) => {
    const matchesRole = roleFilter === 'ALL' || staff.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      staff.name.toLowerCase().includes(q) ||
      staff.empCode.toLowerCase().includes(q) ||
      staff.email.toLowerCase().includes(q) ||
      staff.pciRegNo.toLowerCase().includes(q) ||
      staff.designation.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  const handleCopyCredentials = (staff: StaffCredential) => {
    const credText = `Institution: ${collegeName}\nEmployee Code: ${staff.empCode}\nFull Name: ${staff.name}\nRole: ${staff.role}\nOfficial Email / Username: ${staff.email}\nTemporary Password: ${staff.tempPassword}\nPCI Reg No: ${staff.pciRegNo}\nPortal Access: https://dpkpharmacy.ai.studio`;
    navigator.clipboard.writeText(credText);
    setCopiedId(staff.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = [
      'Emp Code',
      'Full Name',
      'Role',
      'Designation',
      'Department',
      'Official Email',
      'Temporary Password',
      'PCI Reg Number',
      'Qualification',
      'Experience (Yrs)',
      'Assigned Subject / Lab',
      'Contact Number',
      'Status',
    ];

    const rows = staffList.map((s) => [
      s.empCode,
      s.name,
      s.role,
      s.designation,
      s.department,
      s.email,
      s.tempPassword,
      s.pciRegNo,
      s.qualification,
      s.experienceYears,
      s.assignedSubjectOrLab,
      s.contactNumber,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DPKCOP_Faculty_Credentials_Directory_10Seats.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    if (staffList.length >= HARD_LOCKED_FACULTY_SEAT_LIMIT) {
      alert(`Institutional seat capacity limit of ${HARD_LOCKED_FACULTY_SEAT_LIMIT} faculty seats reached. Additional faculty cannot be provisioned.`);
      return;
    }

    const count = staffList.length + 1;
    const code =
      newStaff.role === 'LAB_ASSISTANT'
        ? `DPK-LAB-00${count - 24}`
        : newStaff.role === 'HOD'
        ? `DPK-HOD-00${count}`
        : `DPK-FAC-0${count}`;

    const created: StaffCredential = {
      id: `staff-${Date.now()}`,
      empCode: code,
      name: newStaff.name,
      role: newStaff.role || 'FACULTY',
      designation: newStaff.designation || 'Assistant Professor',
      department: newStaff.department || 'Department of Pharmacy',
      email: newStaff.email,
      tempPassword: `DPK-${newStaff.name.split(' ')[0]}#2026`,
      pciRegNo: newStaff.pciRegNo || 'Awaiting State Council',
      qualification: newStaff.qualification || 'M.Pharm',
      experienceYears: Number(newStaff.experienceYears) || 1,
      assignedSubjectOrLab: newStaff.assignedSubjectOrLab || 'General Pharmacy',
      contactNumber: newStaff.contactNumber || '+91 98000 00000',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setStaffList([created, ...staffList]);
    setIsAddModalOpen(false);
    setNewStaff({
      name: '',
      role: 'FACULTY',
      designation: 'Assistant Professor',
      department: 'Department of Pharmacy',
      email: '',
      pciRegNo: '',
      qualification: 'M.Pharm',
      experienceYears: 3,
      assignedSubjectOrLab: '',
      contactNumber: '+91 ',
      status: 'ACTIVE',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              Allocated {HARD_LOCKED_FACULTY_SEAT_LIMIT} Faculty Seats (Strictly Locked)
            </span>
            <span className="text-xs text-slate-500 font-medium">Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Staff Directory & Auto-Generated Credentials Management
          </h2>
          <p className="text-xs text-slate-500">
            Super Admin, Principal, HODs, Teaching Faculty, and Lab Technicians with statutory PCI registration numbers
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsSlipsModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            Print Credential Slips
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Staff Member
          </button>
        </div>
      </div>

      {/* Quick Role Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setRoleFilter('ALL')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            roleFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Total Seats</span>
          <span className="text-xl font-black mt-0.5 block font-mono">{staffList.length} / {HARD_LOCKED_FACULTY_SEAT_LIMIT}</span>
          <span className="text-[10px] opacity-80">{Math.round((staffList.length / HARD_LOCKED_FACULTY_SEAT_LIMIT) * 100)}% Allocated</span>
        </div>

        <div
          onClick={() => setRoleFilter('PLATFORM_SUPER_ADMIN')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            roleFilter === 'PLATFORM_SUPER_ADMIN'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Super Admin</span>
          <span className="text-xl font-black mt-0.5 block font-mono">1</span>
          <span className="text-[10px] opacity-80">Platform Owner</span>
        </div>

        <div
          onClick={() => setRoleFilter('PRINCIPAL_DEAN')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            roleFilter === 'PRINCIPAL_DEAN'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Principal / Admin</span>
          <span className="text-xl font-black mt-0.5 block font-mono">1</span>
          <span className="text-[10px] opacity-80">Institutional Head</span>
        </div>

        <div
          onClick={() => setRoleFilter('FACULTY')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            roleFilter === 'FACULTY'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Teaching Faculty</span>
          <span className="text-xl font-black mt-0.5 block font-mono">
            {staffList.filter((s) => s.role === 'FACULTY' || s.role === 'HOD').length}
          </span>
          <span className="text-[10px] opacity-80">Prof / Assoc / Asst</span>
        </div>

        <div
          onClick={() => setRoleFilter('LAB_ASSISTANT')}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            roleFilter === 'LAB_ASSISTANT'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Lab Technicians</span>
          <span className="text-xl font-black mt-0.5 block font-mono">
            {staffList.filter((s) => s.role === 'LAB_ASSISTANT').length}
          </span>
          <span className="text-[10px] opacity-80">6 PCI Laboratories</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, emp code, PCI reg, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Role:
          </span>
          {['ALL', 'PLATFORM_SUPER_ADMIN', 'PRINCIPAL_DEAN', 'HOD', 'FACULTY', 'LAB_ASSISTANT'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL'
                ? 'All Roles'
                : r === 'PLATFORM_SUPER_ADMIN'
                ? 'Super Admin'
                : r === 'PRINCIPAL_DEAN'
                ? 'Principal'
                : r === 'HOD'
                ? 'HOD'
                : r === 'FACULTY'
                ? 'Faculty'
                : 'Lab Tech'}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3">Emp Code</th>
                <th className="p-3">Staff Name & Designation</th>
                <th className="p-3">Role & Dept</th>
                <th className="p-3">PCI Reg. Number</th>
                <th className="p-3">Assigned Workload / Lab</th>
                <th className="p-3">Username & Temp Password</th>
                <th className="p-3 text-center">One-Click Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {staffList.length === 0
                          ? `Faculty Directory is Clean Slate (0 / ${HARD_LOCKED_FACULTY_SEAT_LIMIT} Seats Used)`
                          : 'No Staff Records Match Filter'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {staffList.length === 0
                          ? `All mock records have been purged. Tenant capacity is strictly locked to ${HARD_LOCKED_FACULTY_SEAT_LIMIT} faculty seats, ready for real staff creation or CSV import.`
                          : 'Try changing your search query or role filter to view other faculty members.'}
                      </p>
                      {staffList.length === 0 && (
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          + Add First Staff Member
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{staff.empCode}</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-xs">{staff.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{staff.designation}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {staff.qualification} • {staff.experienceYears} Yrs Exp
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        staff.role === 'PLATFORM_SUPER_ADMIN'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : staff.role === 'PRINCIPAL_DEAN'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : staff.role === 'HOD'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : staff.role === 'FACULTY'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {staff.role}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1 font-medium">{staff.department}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-700 bg-emerald-50/30">
                    {staff.pciRegNo}
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{staff.assignedSubjectOrLab}</td>
                  <td className="p-3 font-mono">
                    <div className="text-slate-800 font-medium text-[11px]">{staff.email}</div>
                    <div className="text-amber-700 font-bold text-[11px] bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5 border border-amber-200">
                      {staff.tempPassword}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopyCredentials(staff)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer ${
                        copiedId === staff.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                      title="Copy Login Slip to Clipboard"
                    >
                      {copiedId === staff.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          Copy Credentials
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Add New Staff Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Prof. Vikrant S. Patil"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="FACULTY">Teaching Faculty</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="PRINCIPAL_DEAN">Principal / Dean</option>
                    <option value="LAB_ASSISTANT">Lab Assistant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@dpkpharmacy.edu.in"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PCI Reg. Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 294812/A"
                    value={newStaff.pciRegNo}
                    onChange={(e) => setNewStaff({ ...newStaff, pciRegNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="M.Pharm / Ph.D."
                    value={newStaff.qualification}
                    onChange={(e) => setNewStaff({ ...newStaff, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Subject / Lab</label>
                  <input
                    type="text"
                    placeholder="Pharmaceutics Lab 101"
                    value={newStaff.assignedSubjectOrLab}
                    onChange={(e) => setNewStaff({ ...newStaff, assignedSubjectOrLab: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl shadow-sm"
                >
                  Save & Provision Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE CREDENTIAL SLIPS MODAL */}
      {isSlipsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-600" />
                  Official Faculty & Staff Credential Slips (30 Seats)
                </h3>
                <p className="text-xs text-slate-500">
                  Ready-to-cut individualized credential slips for secure distribution
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print All Slips
                </button>
                <button
                  onClick={() => setIsSlipsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {staffList.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Faculty Credentials Available</h4>
                <p className="text-xs text-slate-500">Directory is currently empty (0 active staff). Add faculty members to generate print slips.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 space-y-2 text-xs relative"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900 uppercase text-[11px] truncate max-w-[200px]">
                        {collegeName}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">
                        {staff.empCode}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Name:</span>
                        <span className="font-bold text-slate-900">{staff.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Role / Post:</span>
                        <span className="font-semibold text-slate-800">
                          {staff.role} ({staff.designation})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">PCI Reg No:</span>
                        <span className="font-mono font-bold text-emerald-700">{staff.pciRegNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Login Username:</span>
                        <span className="font-mono font-bold text-slate-900">{staff.email}</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-100/60 p-1.5 rounded border border-amber-300">
                        <span className="text-amber-900 font-bold flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-amber-700" />
                          Temp Password:
                        </span>
                        <span className="font-mono font-black text-amber-950">{staff.tempPassword}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between items-center">
                      <span>Portal: https://dpkpharmacy.ai.studio</span>
                      <span className="italic">Strictly Confidential</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
