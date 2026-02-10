import Link from "next/link";
import React, {FunctionComponent} from "react";

type Props = {
  name: string;
  rider_id: string;
  abbreviated?: boolean;
};

export const RiderName: FunctionComponent<Props> = ({
  name,
  rider_id,
  abbreviated = false,
}) => {
  // split name into first and last and only show first initial and last name
  const parts = name.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  const firstInitial = firstName.charAt(0).toUpperCase();

  const displayName = abbreviated ? `${firstInitial}. ${lastName}` : name;

  return (
    <Link
      href={`/leaderboard/profile/${rider_id}`}
      className="underline"
      prefetch={false}
    >
      {displayName}
    </Link>
  );
};
