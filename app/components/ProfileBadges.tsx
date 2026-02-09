import React, {useState} from "react";
import {BadgeData, RiderResult} from "../lib/bumps/model";
import Image from "next/image";
import Link from "next/link";

interface BadgeProps {
  badge: BadgeData;
}

export interface BadgeListProps {
  badges: BadgeData[];
  results: RiderResult[];
}

const Badge: React.FC<BadgeProps> = ({badge}) => {
  const {name, svg, isCompleted, completedCount} = badge;

  return (
    <div
      className="flex flex-col items-center justify-center space-y-2 md:space-y-4 w-24 md:w-32 group"
      title={
        isCompleted ? `Completed ${completedCount} times` : "Not completed"
      }
    >
      {/* Responsive Badge Circle: 5rem (80px) on mobile, 6rem (96px) on MD+ */}
      <div
        className={`
          relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${
            isCompleted
              ? "border-0"
              : "border-2 border-gray-600 bg-transparent opacity-50 group-hover:opacity-80 overflow-hidden"
          }
        `}
      >
        {isCompleted && svg ? (
          <div>
            <span
              className="absolute bg-gray-900 monospace text-center rounded-md tracking-widest text-sm md:text-base"
              style={{top: 0, right: 0, width: "28px"}}
            >
              {completedCount}
              <span className="opacity-80">x</span>
            </span>
            <Image
              src={`/badges/${svg}`}
              alt={name}
              className="w-full h-full object-cover"
              height={96}
              width={96}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-neutral-900 monospace font-semibold" />
        )}
      </div>

      {/* Responsive Label Text */}
      <span
        className={`
        text-center text-[9px] md:text-[10px] font-bold tracking-widest uppercase break-words px-1 md:px-2 leading-tight
        ${isCompleted ? "text-white" : "text-gray-400"}
      `}
      >
        {name}
      </span>
    </div>
  );
};

export const BadgeList: React.FC<BadgeListProps> = ({badges, results}) => {
  const [showLegacy, setShowLegacy] = useState(false);

  const processedBadges = badges.map((b) => {
    const completed = results.some((r) =>
      b.altSlugs
        ? b.altSlugs.includes(r.event_slug) || r.event_slug === b.slug
        : r.event_slug === b.slug,
    );

    return {
      ...b,
      isCompleted: completed,
      completedCount: completed
        ? results.filter((r) =>
            b.altSlugs
              ? b.altSlugs.includes(r.event_slug) || r.event_slug === b.slug
              : r.event_slug === b.slug,
          ).length
        : 0,
    };
  });

  const activeBadges = processedBadges.filter((b) => !b.isLegacy);
  const legacyBadges = processedBadges.filter((b) => b.isLegacy);

  return (
    <div className="p-4 lg:p-0 flex flex-wrap gap-3 md:gap-4 items-start">
      {activeBadges.map((badge) => (
        <Link href={`/event/${badge.slug}`} key={badge.slug}>
          <Badge badge={badge} />
        </Link>
      ))}

      {showLegacy &&
        legacyBadges.map((badge) => (
          <Link href={`/event/${badge.slug}`} key={badge.slug}>
            <Badge badge={badge} />
          </Link>
        ))}

      {!showLegacy && legacyBadges.length > 0 && (
        <button
          onClick={() => setShowLegacy(true)}
          className="flex flex-col items-center justify-center space-y-2 md:space-y-4 w-24 md:w-32 group outline-none"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center transition-colors group-hover:border-gray-400">
            <span className="text-gray-500 text-xl md:text-2xl group-hover:text-gray-300 font-light">
              +
            </span>
          </div>
          <span className="text-center text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-gray-300 leading-tight">
            Show Legacy Events
          </span>
        </button>
      )}
    </div>
  );
};

export default BadgeList;
