import React, {FunctionComponent} from "react";

type Props = {
  rank: number;
};

export const RiderRank: FunctionComponent<Props> = ({rank}) => {
  return (
    <span className={rank <= 3 ? "text-xl bumps-rank-cell" : ""}>
      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
    </span>
  );
};
