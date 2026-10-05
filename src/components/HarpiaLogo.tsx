import React from 'react';

interface HarpiaLogoProps {
  collapsed?: boolean;
  className?: string;
}

export const HarpiaLogo: React.FC<HarpiaLogoProps> = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Harpy Eagle Crest */}
      <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#0A1329] border border-[#00DDF2]/30 shadow-[0_0_15px_rgba(0,221,242,0.15)] group-hover:border-[#00DDF2] transition-colors">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#00DDF2]"
        >
          {/* Stylized Harpy Eagle Head & Keen Eye */}
          <path
            d="M5 22L13 6L21 16L27 9L27 25H5Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M13 14L16 19L19 14"
            stroke="#00DDF2"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="16" cy="11" r="1.75" fill="#00DDF2" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-wider font-extrabold text-base text-white">
            <span>HARPIA</span>
            <span className="text-[#00DDF2] ml-1.5 font-light tracking-widest text-sm">TECH</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            INTELIGÊNCIA B2G
          </span>
        </div>
      )}
    </div>
  );
};
