import React, {useState, useRef, useEffect} from "react";
import {years} from "../lib/bumps/const";

export const SeasonGridSelector: React.FunctionComponent<{
  currentYear: string;
  onChange: (year: string) => void;
}> = ({currentYear, onChange}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu if clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      <div className="relative">
        {/* The Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-500 transition-all duration-200
            ${
              isOpen
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-neutral-900 text-white border-neutral-500 hover:border-neutral-300"
            }
          `}
        >
          <span className="text-lg tracking-wider uppercase">
            Season: <span className="font-bold ">{currentYear}</span>
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
        </button>

        {/* The Grid Popover */}
        {isOpen && (
          <div className="absolute z-50 mt-3 left-1/2 -translate-x-1/2 w-72 p-2 bg-neutral-950 border border-neutral-500 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="grid grid-cols-3 gap-1.5">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onChange(year);
                    setIsOpen(false);
                  }}
                  className={`
                    py-3 rounded-xl text-md  transition-all
                    ${
                      currentYear === year
                        ? "bg-white text-black"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
