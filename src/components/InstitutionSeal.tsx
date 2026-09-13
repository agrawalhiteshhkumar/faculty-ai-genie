import React, { useState } from 'react';

interface InstitutionSealProps {
  logoUrl?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCredentials?: boolean;
  institutionName?: string;
  shortName?: string;
  aisheCode?: string;
  dteCode?: string;
  msbteCode?: string;
  pciCode?: string;
}

export const InstitutionSeal: React.FC<InstitutionSealProps> = ({
  logoUrl,
  className = '',
  size = 'md',
  showCredentials = false,
  institutionName = 'D. P. Kharde Navjeevan College of Pharmacy',
  shortName = 'DPKCOP',
  aisheCode = 'S-22693',
  dteCode = '5539',
  msbteCode = '0182',
  pciCode = 'PCI-2041',
}) => {
  const [imgError, setImgError] = useState(false);

  // Size dimensions
  const sizeMap = {
    xs: { dim: 'w-7 h-7', px: 28, text: 'text-[9px]' },
    sm: { dim: 'w-10 h-10', px: 40, text: 'text-xs' },
    md: { dim: 'w-14 h-14', px: 56, text: 'text-sm' },
    lg: { dim: 'w-20 h-20', px: 80, text: 'text-base' },
    xl: { dim: 'w-28 h-28', px: 112, text: 'text-lg' },
  };

  const { dim, px } = sizeMap[size] || sizeMap.md;

  const renderOfficialSealSvg = () => (
    <svg
      viewBox="0 0 160 160"
      className="w-full h-full drop-shadow-sm select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sealBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="85%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        {/* Curved text paths */}
        <path
          id="textPathTop"
          d="M 22,80 A 58,58 0 0,1 138,80"
          fill="none"
        />
        <path
          id="textPathBottom"
          d="M 138,80 A 58,58 0 0,1 22,80"
          fill="none"
        />
      </defs>

      {/* Outer Ring */}
      <circle cx="80" cy="80" r="77" fill="url(#sealBg)" stroke="url(#goldGrad)" strokeWidth="3" />
      {/* Dashed Security Border */}
      <circle cx="80" cy="80" r="73" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,2" />
      {/* Inner Ring */}
      <circle cx="80" cy="80" r="54" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" />

      {/* Curved Text Top */}
      <text fill="#fbbf24" fontSize="8.2" fontWeight="bold" letterSpacing="0.8" textAnchor="middle">
        <textPath href="#textPathTop" startOffset="50%">
          D. P. KHARDE NAVJEEVAN COP
        </textPath>
      </text>

      {/* Curved Text Bottom */}
      <text fill="#cbd5e1" fontSize="7.2" fontWeight="600" letterSpacing="0.6" textAnchor="middle">
        <textPath href="#textPathBottom" startOffset="50%">
          ★ NASHIK • ESTD 2018 ★
        </textPath>
      </text>

      {/* Center Shield/Medallion */}
      <circle cx="80" cy="80" r="44" fill="#0f172a" stroke="#d97706" strokeWidth="1" />

      {/* Caduceus / Mortar & Pestle & Rx Icon */}
      {/* Mortar Bowl */}
      <path
        d="M 64,80 C 64,94 96,94 96,80 Z"
        fill="url(#goldGrad)"
        opacity="0.95"
      />
      {/* Pestle */}
      <path
        d="M 72,66 L 88,82"
        stroke="#fef08a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Rx Symbol */}
      <text
        x="63"
        y="75"
        fill="#fbbf24"
        fontSize="13"
        fontFamily="serif"
        fontWeight="bold"
      >
        ℞
      </text>
      {/* DPK Monogram */}
      <text
        x="80"
        y="107"
        fill="#f8fafc"
        fontSize="11"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="1.2"
        textAnchor="middle"
      >
        DPK
      </text>

      {/* Stars on Left and Right */}
      <circle cx="21" cy="80" r="2.5" fill="#fbbf24" />
      <circle cx="139" cy="80" r="2.5" fill="#fbbf24" />
    </svg>
  );

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className={`${dim} rounded-full flex items-center justify-center relative flex-shrink-0 transition-transform hover:scale-105 shadow-sm bg-slate-950`}
        title={`${institutionName} Official Seal`}
      >
        {logoUrl && !imgError ? (
          <img
            src={logoUrl}
            alt={shortName}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-full p-1"
            referrerPolicy="no-referrer"
          />
        ) : (
          renderOfficialSealSvg()
        )}
      </div>

      {showCredentials && (
        <div className="mt-2 text-center text-[10px] font-mono font-medium text-slate-500 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className="text-slate-700 font-bold">AISHE: {aisheCode}</span>
          <span>•</span>
          <span className="text-slate-700 font-bold">DTE: {dteCode}</span>
          <span>•</span>
          <span className="text-slate-700 font-bold">MSBTE: {msbteCode}</span>
          <span>•</span>
          <span className="text-slate-700 font-bold">PCI: {pciCode}</span>
        </div>
      )}
    </div>
  );
};
