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
      className="flex flex-col items-center justify-center space-y-4 w-32 group"
      title={isCompleted ? `Completed ${completedCount}x` : "Never completed"}
    >
      <div
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden
          transition-all duration-300 ease-in-out
          ${
            isCompleted
              ? "border-0"
              : "border-2 border-gray-600 bg-transparent opacity-50 group-hover:opacity-80"
          }
        `}
      >
        {isCompleted && svg ? (
          <Image
            src={`/badges/${svg}`}
            alt={name}
            className="w-full h-full object-cover"
            height={96}
            width={96}
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
      </div>

      <span
        className={`
        text-center text-[10px] font-bold tracking-widest uppercase break-words px-2 leading-tight
        ${isCompleted ? "text-white" : "text-gray-500"}
      `}
      >
        {name}
      </span>
    </div>
  );
};

export const BadgeList: React.FC<BadgeListProps> = ({badges, results}) => {
  const [showLegacy, setShowLegacy] = useState(false);

  // 1. Process completion logic
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

  // 2. Separate into Active and Legacy groups
  const activeBadges = processedBadges.filter((b) => !b.isLegacy);
  const legacyBadges = processedBadges.filter((b) => b.isLegacy);

  return (
    <div className="p-4 lg:p-0 flex flex-wrap gap-4 items-start justify-center">
      {/* Render Active Badges */}
      {activeBadges.map((badge) => (
        <Link href={`/event/${badge.slug}`} key={badge.slug}>
          <Badge badge={badge} />
        </Link>
      ))}

      {/* Render Legacy Badges if toggled */}
      {showLegacy &&
        legacyBadges.map((badge) => (
          <Link href={`/event/${badge.slug}`} key={badge.slug}>
            <Badge badge={badge} />
          </Link>
        ))}

      {/* "Show Legacy" Toggle Button - Sized exactly like a Badge */}
      {!showLegacy && legacyBadges.length > 0 && (
        <button
          onClick={() => setShowLegacy(true)}
          className="flex flex-col items-center justify-center space-y-4 w-32 group outline-none"
        >
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center transition-colors group-hover:border-gray-400">
            <span className="text-gray-500 text-2xl group-hover:text-gray-300 font-light">
              +
            </span>
          </div>
          <span className="text-center text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-gray-300 leading-tight">
            Legacy events
          </span>
        </button>
      )}
    </div>
  );
};

export default BadgeList;
