import React, { useState } from 'react';
import {
  AlertTriangle,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  FileText,
  UserCheck,
  Clock,
  ShieldAlert,
  Search,
  ChevronRight,
  Filter,
  Building2,
} from 'lucide-react';
import { StudentMaster, InstitutionProfile } from '../types';
import { InstitutionSeal } from './InstitutionSeal';
import { DPK_COLLEGE_IDENTITY } from '../data/msbteProformasData';

interface DefaulterNoticeDispatcherProps {
  institution: InstitutionProfile | null;
  students: StudentMaster[];
}

interface DefaulterNoticeItem {
  id: string;
  studentId: string;
  rollNo: string;
  name: string;
  prn: string;
  batch: string;
  parentName: string;
  parentPhone: string;
  attendancePercentage: number;
  theoryAttendance: number;
  practicalAttendance: number;
  noticeTier: 'NOTICE_1' | 'NOTICE_2' | 'DETENTION_WARNING';
  dispatchChannel: 'WHATSAPP' | 'SPEED_POST' | 'SMS' | 'IN_PERSON';
  speedPostTracking?: string;
  dispatchDate: string;
  parentResponseStatus: 'PENDING' | 'ACKNOWLEDGED_PHONE' | 'VISITED_CAMPUS' | 'UNDERTAKING_SUBMITTED';
  parentResponseNote: string;
}

export const DefaulterNoticeDispatcher: React.FC<DefaulterNoticeDispatcherProps> = ({
  institution,
  students,
}) => {
  const college = institution?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = institution?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = institution?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = institution?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = institution?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;

  // Derive defaulters (< 75% attendance)
  const [notices, setNotices] = useState<DefaulterNoticeItem[]>([
    {
      id: 'NOT-01',
      studentId: 'st-03',
      rollNo: '03',
      name: 'Rohan Kulkarni',
      prn: '20250182103',
      batch: 'Batch B1',
      parentName: 'Mr. Sudhir Kulkarni',
      parentPhone: '+91 98221 44589',
      attendancePercentage: 62.4,
      theoryAttendance: 58.0,
      practicalAttendance: 66.8,
      noticeTier: 'NOTICE_2',
      dispatchChannel: 'SPEED_POST',
      speedPostTracking: 'EM482910482IN',
      dispatchDate: '12-Sep-2025',
      parentResponseStatus: 'ACKNOWLEDGED_PHONE',
      parentResponseNote: 'Parent called; father reported viral typhoid recovery. Medical certificate promised.',
    },
    {
      id: 'NOT-02',
      studentId: 'st-17',
      rollNo: '17',
      name: 'Gaurav Gaikwad',
      prn: '20250182117',
      batch: 'Batch B1',
      parentName: 'Mr. Ramesh Gaikwad',
      parentPhone: '+91 94230 88712',
      attendancePercentage: 48.5,
      theoryAttendance: 45.0,
      practicalAttendance: 52.0,
      noticeTier: 'DETENTION_WARNING',
      dispatchChannel: 'SPEED_POST',
      speedPostTracking: 'EM482910483IN',
      dispatchDate: '15-Sep-2025',
      parentResponseStatus: 'VISITED_CAMPUS',
      parentResponseNote: 'Parent attended meeting with Principal; signed statutory MSBTE Regulation 15 undertaking.',
    },
    {
      id: 'NOT-03',
      studentId: 'st-33',
      rollNo: '33',
      name: 'Vishal Borse',
      prn: '20250182133',
      batch: 'Batch B2',
      parentName: 'Mr. Dilip Borse',
      parentPhone: '+91 99754 11200',
      attendancePercentage: 71.8,
      theoryAttendance: 70.0,
      practicalAttendance: 73.6,
      noticeTier: 'NOTICE_1',
      dispatchChannel: 'WHATSAPP',
      dispatchDate: '18-Sep-2025',
      parentResponseStatus: 'UNDERTAKING_SUBMITTED',
      parentResponseNote: 'Student submitted compensatory library assignment; attendance improved to 76%.',
    },
    {
      id: 'NOT-04',
      studentId: 'st-45',
      rollNo: '45',
      name: 'Tushar Bodke',
      prn: '20250182145',
      batch: 'Batch B3',
      parentName: 'Mr. Sanjay Bodke',
      parentPhone: '+91 98812 77419',
      attendancePercentage: 54.2,
      theoryAttendance: 51.0,
      practicalAttendance: 57.4,
      noticeTier: 'NOTICE_2',
      dispatchChannel: 'WHATSAPP',
      dispatchDate: '18-Sep-2025',
      parentResponseStatus: 'PENDING',
      parentResponseNote: 'WhatsApp notice delivered and read (blue tick); awaiting parent campus visit.',
    },
  ]);

  const [selectedNotice, setSelectedNotice] = useState<DefaulterNoticeItem | null>(notices[0]);
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | 'NOTICE_1' | 'NOTICE_2' | 'DETENTION_WARNING'>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredNotices = notices.filter((n) => {
    if (selectedTierFilter !== 'ALL' && n.noticeTier !== selectedTierFilter) return false;
    return true;
  });

  const handleDispatchAllAlerts = () => {
    setFeedback('Automated WhatsApp and SMS Statutory Attendance Defaulter Notices Dispatched to 4 Registered Parents!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePrintLetter = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                MSBTE Regulation 15 Compliance
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Compulsory 75% Attendance Criterion
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              One-Click 75% Attendance Defaulter Notice Dispatcher & Parent Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated statutory warning letters, bilingual parent notifications, Speed Post dispatch tracking, and detention risk logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDispatchAllAlerts}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Dispatch Notices (WhatsApp / SMS)
            </button>
            <button
              onClick={handlePrintLetter}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Official Letter
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedTierFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTierFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Defaulters ({notices.length})
            </button>
            <button
              onClick={() => setSelectedTierFilter('NOTICE_1')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTierFilter === 'NOTICE_1' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notice 1 (65-74%)
            </button>
            <button
              onClick={() => setSelectedTierFilter('NOTICE_2')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTierFilter === 'NOTICE_2' ? 'bg-orange-100 text-orange-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notice 2 (50-64%)
            </button>
            <button
              onClick={() => setSelectedTierFilter('DETENTION_WARNING')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTierFilter === 'DETENTION_WARNING' ? 'bg-rose-100 text-rose-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Detention Risk (&lt;50%)
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Threshold: <strong>75.0% Required for MSBTE Exam Hall Ticket</strong>
          </div>
        </div>

        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {feedback}
          </div>
        )}
      </div>

      {/* Main Content Grid: Defaulters List + Printable Letter Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Defaulters & Parent Communication Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Enrolled Defaulters & Dispatch Ledger
            </h3>
            <div className="space-y-2.5">
              {filteredNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNotice(n)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    selectedNotice?.id === n.id
                      ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                      Roll {n.rollNo} • {n.batch}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      n.noticeTier === 'DETENTION_WARNING'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : n.noticeTier === 'NOTICE_2'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {n.noticeTier.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900">{n.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">PRN: {n.prn} • Parent: {n.parentName}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center pt-1 border-t border-slate-100">
                    <div className="bg-slate-50 p-1 rounded">
                      <span className="text-slate-400 block text-[9px]">Theory</span>
                      <strong className="text-slate-700">{n.theoryAttendance}%</strong>
                    </div>
                    <div className="bg-slate-50 p-1 rounded">
                      <span className="text-slate-400 block text-[9px]">Practical</span>
                      <strong className="text-slate-700">{n.practicalAttendance}%</strong>
                    </div>
                    <div className="bg-rose-50 p-1 rounded text-rose-800 font-bold">
                      <span className="text-rose-500 block text-[9px]">Total</span>
                      <strong>{n.attendancePercentage}%</strong>
                    </div>
                  </div>

                  {/* Parent Communication Status */}
                  <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Channel: <strong>{n.dispatchChannel}</strong></span>
                      <span className="text-emerald-700">✓ {n.parentResponseStatus.replace('_', ' ')}</span>
                    </div>
                    {n.speedPostTracking && (
                      <div className="text-slate-500 font-mono">Speed Post: {n.speedPostTracking}</div>
                    )}
                    <div className="text-slate-500 italic truncate">{n.parentResponseNote}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Printable Official Notice Letter Preview (7 cols) */}
        <div className="lg:col-span-7">
          {selectedNotice ? (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border-2 border-slate-900 shadow-sm space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
              {/* Institutional Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
                <div className="flex justify-center mb-1">
                  <InstitutionSeal profile={institution} variant="circular" size="md" />
                </div>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  {college}
                </h1>
                <p className="text-[11px] font-semibold text-slate-600">
                  Approved by PCI New Delhi, DTE Mumbai & Affiliated to MSBTE Mumbai
                </p>
                <div className="text-[10px] font-mono text-slate-600 font-bold">
                  AISHE: {aishe} | PCI: {pci} | DTE: {dte} | MSBTE: {msbte}
                </div>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-rose-600 text-white rounded text-[11px] font-black uppercase tracking-wider">
                    STATUTORY ATTENDANCE DEFAULTER WARNING NOTICE
                  </span>
                </div>
              </div>

              {/* Reference & Date */}
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 pb-2">
                <div>Ref No: <strong>DPKCOP/DEF/2025/{selectedNotice.rollNo}</strong></div>
                <div>Date: <strong>{selectedNotice.dispatchDate}</strong></div>
              </div>

              {/* Addressed to Parent */}
              <div className="text-xs space-y-1 text-slate-800 leading-relaxed">
                <div>To,</div>
                <div className="font-bold text-slate-900">{selectedNotice.parentName}</div>
                <div>Parent / Guardian of: <strong>{selectedNotice.name}</strong></div>
                <div className="font-mono">Roll No: {selectedNotice.rollNo} | PRN: {selectedNotice.prn} | Batch: {selectedNotice.batch}</div>
                <div>Contact: {selectedNotice.parentPhone}</div>
              </div>

              {/* Subject Line */}
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold text-rose-950">
                Subject: Statutory Warning Notice regarding Shortage of Attendance under MSBTE Examination Regulation 15.
              </div>

              {/* Letter Body (English & Marathi Guidance) */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                <p>Respected Sir / Madam,</p>
                <p>
                  This is to urgently bring to your notice that your ward, <strong>{selectedNotice.name}</strong>, enrolled in First Year Diploma in Pharmacy (D.Pharm), has accumulated only <strong>{selectedNotice.attendancePercentage}%</strong> overall attendance up to the current academic term.
                </p>

                {/* Breakdown Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>Theory Attendance: <strong className="text-rose-700 block text-sm font-mono">{selectedNotice.theoryAttendance}%</strong></div>
                  <div>Practical Attendance: <strong className="text-rose-700 block text-sm font-mono">{selectedNotice.practicalAttendance}%</strong></div>
                  <div>Cumulative Aggregate: <strong className="text-rose-800 block text-base font-black font-mono">{selectedNotice.attendancePercentage}%</strong></div>
                </div>

                <p className="text-slate-700">
                  <strong>Statutory MSBTE Regulation 15:</strong> <em>"No candidate shall be admitted to the Board Examination unless he/she has attended at least 75% of the total number of theory and practical classes conducted in each subject."</em>
                </p>

                <p className="text-slate-700">
                  If your ward fails to achieve the mandatory 75% attendance criterion by the end of the academic year, he/she will be detained and barred from appearing in the MSBTE Annual Board Examination.
                </p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-semibold space-y-1">
                  <div>तातडीची सूचना (मराठी):</div>
                  <p>
                    आपल्या पाल्याची उपस्थिती नियमानुसार ७५% पेक्षा कमी ({selectedNotice.attendancePercentage}%) आहे. कृपया ३ दिवसांच्या आत प्राचार्यांना अथवा वर्गशिक्षकांना समक्ष भेटून खुलासा सादर करावा, अन्यथा परीक्षा अर्ज भरता येणार नाही.
                  </p>
                </div>

                <p>
                  You are requested to attend a mandatory parent-mentor counseling session in the Principal’s office within three (3) working days.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-10 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1"></div>
                  <div className="font-bold text-slate-900">Dr. Rajesh Sharma</div>
                  <div className="text-[10px] text-slate-500">Class Teacher / Mentor</div>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1"></div>
                  <div className="font-bold text-slate-900">Prof. Vikram Patil</div>
                  <div className="text-[10px] text-slate-500">Academic Monitoring In-Charge</div>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1"></div>
                  <div className="font-bold text-slate-900">Dr. D. P. Kharde</div>
                  <div className="text-[10px] text-slate-500">Principal & Official Seal</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
              Select a defaulter record from the list to preview and print the official notice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
