import React, { useState, useEffect } from 'react';
import { getAsset, saveAsset, compressImage } from '../utils/assetStorage';
import { ShieldCheck, Building2, UserCheck, Crown, CheckCircle2 } from 'lucide-react';

interface ExecutiveHeaderProps {
  userRole: 'ADMIN' | 'FACULTY';
  onRoleSwitch: (role: 'ADMIN' | 'FACULTY') => void;
  onOpenSuperAdmin?: () => void;
  teachingHours?: number;
  currentFacultyName?: string;
  isSuperAdminUser?: boolean;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  userRole,
  onRoleSwitch,
  onOpenSuperAdmin,
  teachingHours = 16,
  currentFacultyName = 'Dr. Hiteshkumar Agrawal',
  isSuperAdminUser = false,
}) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogo() {
      try {
        const savedLogo = await getAsset('college_logo');
        if (savedLogo) setLogoSrc(savedLogo);
      } catch (err) {
        console.error('Failed to load institutional logo from IndexedDB:', err);
      }
    }
    loadLogo();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 280);
        await saveAsset('college_logo', compressed);
        setLogoSrc(compressed);
      } catch (err) {
        console.error('Failed to process and store logo:', err);
      }
    }
  };

  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 text-white px-4 sm:px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* 1. Left: Institutional Charter & College Crest */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          <div className="relative group w-14 h-14 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {logoSrc ? (
              <img src={logoSrc} alt="College Crest" className="w-full h-full object-contain p-1" />
            ) : (
              <div className="flex flex-col items-center justify-center p-1 text-center">
                <Building2 className="w-5 h-5 text-amber-400 mb-0.5" />
                <span className="text-[9px] text-slate-400 font-bold leading-tight">Crest</span>
              </div>
            )}
            <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-[9px] text-amber-300 font-bold">
              Update
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>

          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Navjeevan Education Society's
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
              D. P. Kharde Navjeevan College of Pharmacy, Sinnar
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-mono">
              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200">
                MSBTE: <strong>62386</strong>
              </span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200">
                DTE: <strong>5539</strong>
              </span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200">
                PCI: <strong>9178</strong>
              </span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200">
                AISHE: <strong>S-22693</strong>
              </span>
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded font-sans font-bold">
                PCI ER-2020 • J-Scheme
              </span>
            </div>
          </div>
        </div>

        {/* 2. Center: Authorizing Executive Signature & Signatory Block */}
        <div className="w-full lg:w-auto bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-950 border border-blue-800/80 flex items-center justify-center text-amber-400 font-black shrink-0 shadow-sm">
            HA
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-100 text-xs truncate">
                Dr. Hiteshkumar Agrawal
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Digital Signatory Active
              </span>
            </div>
            <div className="text-[10px] text-slate-300 truncate">
              Principal, Professor &amp; Academic Architect
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>✉ hiteshhkumar.agrawal@gmail.com</span>
              <span>•</span>
              <span>✆ +91 9637521852</span>
            </div>
          </div>
        </div>

        {/* 3. Right: Primary 3-Tier Login & Role Control Bar */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Tier 1: Platform SuperAdmin */}
          {onOpenSuperAdmin && (
            <button
              type="button"
              onClick={onOpenSuperAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 cursor-pointer"
              title="Statutory Multi-Tenant Provisioning"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin</span>
            </button>
          )}

          {/* Tier 2: Institute Admin (Executive Oversight) */}
          <button
            type="button"
            onClick={() => onRoleSwitch('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
              userRole === 'ADMIN'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-1 ring-indigo-300'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Institute Admin</span>
          </button>

          {/* Tier 3: HOD / Faculty Workspace */}
          <button
            type="button"
            onClick={() => onRoleSwitch('FACULTY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
              userRole === 'FACULTY'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-300'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Faculty / HOD</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-200 px-1.5 py-0.2 rounded font-mono border border-emerald-700">
              {teachingHours}h
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default ExecutiveHeader;
