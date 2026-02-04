import React, {FunctionComponent} from "react";
import {formatRaceTime} from "../lib/bumps/utils";

type Props = {
  time: string;
};

export const Racetime: FunctionComponent<Props> = ({time}) => {
  const formatted = formatRaceTime(time);
  const [main, ms] = formatted.split(".");
  return (
    <span className="font-mono font-bold">
      {main}
      <span className="text-xs opacity-60">.{ms}</span>
    </span>
  );
};
