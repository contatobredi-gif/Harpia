import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface ContextualHelpProps {
  topic: string;
  explanation: string;
  moreInfoAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  topic,
  explanation,
  moreInfoAction,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-4 h-4 rounded-full bg-[#16264C]/70 hover:bg-[#00DDF2]/20 border border-[#1F3870] hover:border-[#00DDF2]/60 text-slate-400 hover:text-[#00DDF2] flex items-center justify-center transition-all ml-1.5 focus:outline-none"
        title={`O que é ${topic}?`}
        aria-label={`Ajuda sobre ${topic}`}
      >
        <span className="text-[10px] font-bold font-mono">?</span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3 rounded-xl bg-[#0A1329] border border-[#00DDF2]/50 shadow-[0_10px_25px_rgba(0,0,0,0.8)] text-slate-200 animate-in fade-in duration-150 backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-[#16264C] pb-1.5 mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2]" />
              {topic}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11.5px] leading-relaxed text-slate-300">
            {explanation}
          </p>

          {moreInfoAction && (
            <div className="mt-2.5 pt-2 border-t border-[#16264C]/80 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  moreInfoAction.onClick();
                }}
                className="text-[10.5px] font-semibold text-[#00DDF2] hover:underline flex items-center gap-1"
              >
                <span>{moreInfoAction.label}</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Pointer Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-[#0A1329] border-t-8 border-x-transparent border-x-8 border-b-0" />
        </div>
      )}
    </div>
  );
};
