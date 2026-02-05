import React from "react";
import {years} from "../lib/bumps/const";

export const SeasonGridSelector: React.FunctionComponent<{
  currentYear: string;
  onChange: (year: string) => void;
}> = ({currentYear, onChange}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* 1. The Visual Representation (Your Button Styling) */}
        <div
          className="
            flex items-center gap-2 px-6 py-2.5 rounded-full border 
            bg-neutral-900 text-white border-neutral-40
            transition-all duration-200 
            group-hover:border-neutral-100 group-focus-within:ring-2 group-focus-within:ring-white/30
          "
        >
          <span className="text-lg tracking-wider uppercase pointer-events-none">
            Season: <span className="font-bold">{currentYear}</span>
          </span>
          <svg
            className="w-4 h-4 text-neutral-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* 2. The Native Select (Invisible but functional) */}
        <select
          value={currentYear}
          onChange={(e) => onChange(e.target.value)}
          className="
            absolute inset-0 w-full h-full opacity-0 cursor-pointer 
            appearance-none
          "
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
