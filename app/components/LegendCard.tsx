import React, {useState} from "react";
import {RiderName} from "./RiderName";

interface LegendCardProps {
  title: string;
  stat: string | number;
  statLabel: string;
  riders: {rider_name: string; rider_id: string}[];
  icon: string; // Emoji or Lucide Icon
}

export const LegendCard = ({
  title,
  stat,
  statLabel,
  riders,
  icon,
}: LegendCardProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayLimit = 2;
  const hasMore = riders.length > displayLimit;
  const displayedRiders = riders.slice(0, displayLimit);
  const remainingCount = riders.length - displayLimit;

  return (
    <div className="relative bg-slate-900 border border-white/50 rounded-2xl p-5 flex flex-col items-center text-center">
      {/* Icon & Title */}
      <span className="mb-4">
        {icon === "appearances" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            color="currentColor"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6.43614 8C6.15488 8.84221 6 9.76282 6 10.7273C6 14.7439 8.68629 18 12 18C15.3137 18 18 14.7439 18 10.7273C18 9.76282 17.8451 8.84221 17.5639 8" />
            <path d="M14.5 21C14.5 21 13.818 18 12 18C10.182 18 9.5 21 9.5 21" />
            <path d="M18.5202 5.22967C18.8121 6.89634 17.5004 8 17.5004 8C17.5004 8 15.8969 7.437 15.605 5.77033C15.3131 4.10366 16.6248 3 16.6248 3C16.6248 3 18.2284 3.56301 18.5202 5.22967Z" />
            <path d="M21.0942 12.1393C19.8128 13.4061 18.0778 12.9003 18.0778 12.9003C18.0778 12.9003 17.6241 11.1276 18.9055 9.86074C20.1868 8.59388 21.9219 9.09972 21.9219 9.09972C21.9219 9.09972 22.3756 10.8724 21.0942 12.1393Z" />
            <path d="M18.2335 18.1896C16.7335 17.614 16.5 16 16.5 16C16.5 16 17.7665 14.9616 19.2665 15.5372C20.7665 16.1128 21 17.7268 21 17.7268C21 17.7268 19.7335 18.7652 18.2335 18.1896Z" />
            <path d="M5.76651 18.1895C7.26651 17.6139 7.5 15.9999 7.5 15.9999C7.5 15.9999 6.23349 14.9615 4.73349 15.5371C3.23349 16.1127 3 17.7267 3 17.7267C3 17.7267 4.26651 18.7651 5.76651 18.1895Z" />
            <path d="M2.90552 12.1393C4.18688 13.4061 5.92191 12.9003 5.92191 12.9003C5.92191 12.9003 6.37559 11.1276 5.09423 9.86074C3.81288 8.59388 2.07785 9.09972 2.07785 9.09972C2.07785 9.09972 1.62417 10.8724 2.90552 12.1393Z" />
            <path d="M5.47987 5.22967C5.18799 6.89634 6.49968 8 6.49968 8C6.49968 8 8.10325 7.437 8.39513 5.77033C8.68701 4.10366 7.37532 3 7.37532 3C7.37532 3 5.77175 3.56301 5.47987 5.22967Z" />
          </svg>
        )}
        {icon === "points" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            color="currentColor"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 18C3.5 16.5858 3.5 15.8787 3.93934 15.4393C4.37868 15 5.08579 15 6.5 15H7C7.94281 15 8.41421 15 8.70711 15.2929C9 15.5858 9 16.0572 9 17V22H3.5V18Z" />
            <path d="M15 19C15 18.0572 15 17.5858 15.2929 17.2929C15.5858 17 16.0572 17 17 17H17.5C18.9142 17 19.6213 17 20.0607 17.4393C20.5 17.8787 20.5 18.5858 20.5 20V22H15V19Z" />
            <path d="M2 22H22" />
            <path d="M9 16C9 14.5858 9 13.8787 9.43934 13.4393C9.87868 13 10.5858 13 12 13C13.4142 13 14.1213 13 14.5607 13.4393C15 13.8787 15 14.5858 15 16V22H9V16Z" />
            <path d="M12.6911 2.57767L13.395 3.99715C13.491 4.19475 13.7469 4.38428 13.9629 4.42057L15.2388 4.6343C16.0547 4.77141 16.2467 5.36824 15.6587 5.957L14.6668 6.95709C14.4989 7.12646 14.4069 7.4531 14.4589 7.68699L14.7428 8.925C14.9668 9.90492 14.4509 10.284 13.591 9.77185L12.3951 9.05808C12.1791 8.92903 11.8232 8.92903 11.6032 9.05808L10.4073 9.77185C9.5514 10.284 9.03146 9.90089 9.25543 8.925L9.5394 7.68699C9.5914 7.4531 9.49941 7.12646 9.33143 6.95709L8.33954 5.957C7.7556 5.36824 7.94358 4.77141 8.75949 4.6343L10.0353 4.42057C10.2473 4.38428 10.5033 4.19475 10.5993 3.99715L11.3032 2.57767C11.6872 1.80744 12.3111 1.80744 12.6911 2.57767Z" />
          </svg>
        )}
        {icon === "wins" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            color="currentColor"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M12 12V18" />
            <path d="M12 18C10.3264 18 8.86971 19.012 8.11766 20.505C7.75846 21.218 8.27389 22 8.95877 22H15.0412C15.7261 22 16.2415 21.218 15.8823 20.505C15.1303 19.012 13.6736 18 12 18Z" />
            <path d="M5 5H3.98471C2.99819 5 2.50493 5 2.20017 5.37053C1.89541 5.74106 1.98478 6.15597 2.16352 6.9858C2.50494 8.57086 3.24548 9.9634 4.2489 11" />
            <path d="M19 5H20.0153C21.0018 5 21.4951 5 21.7998 5.37053C22.1046 5.74106 22.0152 6.15597 21.8365 6.9858C21.4951 8.57086 20.7545 9.9634 19.7511 11" />
            <path d="M12 12C15.866 12 19 8.8831 19 5.03821C19 4.93739 18.9978 4.83707 18.9936 4.73729C18.9509 3.73806 18.9295 3.23845 18.2523 2.61922C17.5751 2 16.8247 2 15.324 2H8.67596C7.17526 2 6.42492 2 5.74772 2.61922C5.07051 3.23844 5.04915 3.73806 5.00642 4.73729C5.00215 4.83707 5 4.93739 5 5.03821C5 8.8831 8.13401 12 12 12Z" />
          </svg>
        )}
        {icon === "age" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            color="currentColor"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 3.00195H21.5" />
            <path d="M4.5 3.00195V14.001C4.5 16.3298 4.93059 17.0903 6.92752 18.2885L9.94202 20.0972C10.9447 20.6987 11.446 20.9996 12 20.9996C12.554 20.9996 13.0553 20.6987 14.058 20.0972L17.0725 18.2885C19.0694 17.0903 19.5 16.3298 19.5 14.001V3.00195" />
            <path d="M12.6045 8.00546L13.2204 9.24751C13.3044 9.4204 13.5284 9.58625 13.7173 9.618L14.8337 9.80501C15.5476 9.92498 15.7156 10.4472 15.2012 10.9624L14.3333 11.8374C14.1863 11.9856 14.1058 12.2715 14.1513 12.4761L14.3998 13.5594C14.5957 14.4168 14.1443 14.7485 13.3919 14.3004L12.3455 13.6758C12.1565 13.5629 11.845 13.5629 11.6526 13.6758L10.6062 14.3004C9.85726 14.7485 9.40231 14.4133 9.59829 13.5594L9.84676 12.4761C9.89226 12.2715 9.81177 11.9856 9.66478 11.8374L8.79688 10.9624C8.28594 10.4472 8.45042 9.92498 9.16434 9.80501L10.2807 9.618C10.4662 9.58625 10.6902 9.4204 10.7742 9.24751L11.3901 8.00546C11.7261 7.33151 12.272 7.33151 12.6045 8.00546Z" />
          </svg>
        )}
      </span>
      <h3 className="text-xs uppercase tracking-widest text-gray-300 font-semibold leading-tight mb-1">
        {title}
      </h3>

      {/* The Big Number */}
      <div className="mb-4">
        <span className="text-4xl font-black text-white tabular-nums">
          {stat}
        </span>
        {/* <span className="text-xl opacity-80 ml-1">{statLabel}</span> */}
      </div>

      {/* The Legend(s) Area */}
      <div className="w-full pt-4 border-t border-neutral-800/50">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5">
          {displayedRiders.map((r, idx) => (
            <div key={r.rider_id} className="flex items-center gap-2">
              <span className="text-md text-neutral-200 font-medium hover:text-amber-400 cursor-pointer transition-colors">
                <RiderName
                  name={r.rider_name}
                  rider_id={r.rider_id}
                  abbreviated
                />
              </span>
              {/* Add dot separator only between names, not after the last displayed name */}
              {(idx < displayedRiders.length - 1 || hasMore) && (
                <span className="text-neutral-700 text-xs">•</span>
              )}
            </div>
          ))}
        </div>
        {/* "+ More" Trigger */}
        {hasMore && (
          <div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors underline-offset-4 hover:underline"
            >
              +{remainingCount} more
            </button>
          </div>
        )}
      </div>

      {/* The Overlay (Pop-out List) */}
      {showAll && (
        <>
          {/* Invisible Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-10 p-6"
            onClick={() => setShowAll(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-4  ">
            <div className="flex flex-col gap-2 text-left">
              <p className="text-xs uppercase font-bold text-neutral-300 mb-1 border-b border-neutral-700 pb-1">
                Joint Record Holders
              </p>
              <div className="overflow-y-auto max-h-48">
                {riders.map((r) => (
                  <div
                    key={r.rider_id}
                    className="text-md text-white py-1 border-b border-neutral-700/50 last:border-0 "
                  >
                    <RiderName name={r.rider_name} rider_id={r.rider_id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
