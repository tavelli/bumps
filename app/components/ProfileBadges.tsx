import React from "react";
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
  const {name, svg, isCompleted} = badge;

  return (
    <div
      className="flex flex-col items-center justify-center space-y-4 w-32"
      title={isCompleted ? `` : "Never competed"}
    >
      {/* Badge Circle Container */}
      <div
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden
          transition-all duration-300 ease-in-out
          ${
            isCompleted
              ? "border-0"
              : "border-2 border-gray-600 bg-transparent opacity-50"
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
          /* Empty State Placeholder */
          <div className="w-full h-full bg-neutral-900" />
        )}
      </div>

      {/* Label Text */}
      <span
        className={`
        text-center text-xs font-bold tracking-widest uppercase break-words px-2
        ${isCompleted ? "text-white" : "text-gray-500"}
      `}
      >
        {name}
      </span>
    </div>
  );
};

export const BadgeList: React.FC<BadgeListProps> = ({badges, results}) => {
  const badgeResults = badges.map((b) => {
    const completed = results.some((r) =>
      b.altSlugs
        ? b.altSlugs.includes(r.event_slug) || r.event_slug === b.slug
        : r.event_slug === b.slug,
    );

    return {
      ...b,
      isCompleted: completed,
      // bestTime: completed ? results.filter((r) => r.event_slug === b.slug).sort((r.race_time) : "",
    };
  });

  return (
    <div className="p-4 lg:p-0 flex flex-wrap gap-4 items-center justify-center">
      {badgeResults.map((badge) => (
        <Link href={`/event/${badge.slug}`} key={badge.slug}>
          <Badge key={badge.slug} badge={badge} />
        </Link>
      ))}
    </div>
  );
};

export default BadgeList;
