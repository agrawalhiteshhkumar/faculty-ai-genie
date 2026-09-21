import React, { useState, useEffect } from 'react';
import { getAsset, saveAsset, compressImage } from '../utils/assetStorage';

interface ExecutiveHeaderProps {
  userRole: 'ADMIN' | 'FACULTY';
  onRoleSwitch: (role: 'ADMIN' | 'FACULTY') => void;
  teachingHours?: number;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  userRole,
  onRoleSwitch,
  teachingHours = 16,
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
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Logo & College Identity */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {logoSrc ? (
              <img src={logoSrc} alt="College Crest" className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-[11px] text-slate-400 font-semibold text-center leading-tight">Upload Crest</span>
            )}
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-[10px] text-white font-medium">
              Change
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
              D. P. Kharde Navjeevan College of Pharmacy
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">MSBTE Code: 1144</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">PCI: ER-2020</span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-medium">
                QCI Benchmark: Grade A
              </span>
            </div>
          </div>
        </div>

        {/* Center: Executive Signatory & Contact Credential Card */}
        <div className="w-full md:w-auto bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
              Dr. Hiteshkumar Agrawal
              <span className="text-[10px] font-normal bg-indigo-900/60 text-indigo-300 border border-indigo-700 px-1.5 py-0.5 rounded">
                Authorizing Signatory
              </span>
            </div>
            <p className="text-slate-300">Principal & Founder, Faculty AI Genie™</p>
            <div className="flex items-center gap-3 text-slate-400 text-[11px] pt-1">
              <a href="mailto:hiteshhkumar.agrawal@gmail.com" className="hover:text-indigo-400 transition underline underline-offset-2">
                ✉ hiteshhkumar.agrawal@gmail.com
              </a>
              <span>•</span>
              <a href="tel:+919637521852" className="hover:text-indigo-400 transition underline underline-offset-2">
                ✆ +91 9637521852
              </a>
            </div>
          </div>
        </div>

        {/* Right: Dual Persona Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => onRoleSwitch('ADMIN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition border ${
              userRole === 'ADMIN'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Executive Oversight
          </button>
          <button
            type="button"
            onClick={() => onRoleSwitch('FACULTY')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition border flex items-center gap-1.5 ${
              userRole === 'FACULTY'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>My Teaching Mode</span>
            <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-700 font-mono">
              {teachingHours}h Load
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default ExecutiveHeader;
