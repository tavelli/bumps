import React, {FunctionComponent} from "react";
import {formatRaceTime} from "../lib/bumps/utils";

type Props = {
  time: string;
};

export const Racetime: FunctionComponent<Props> = ({time}) => {
  const formatted = formatRaceTime(time);

  // Remove leading zero specifically at the start of the string
  // Use .replace(/^0/, "") to only strip the very first character if it's a zero
  const trimmed = formatted.replace(/^0/, "");

  const [main, ms] = trimmed.split(".");

  return (
    <span className="font-mono font-bold">
      {main}
      {ms && <span className="text-xs opacity-60">.{ms}</span>}
    </span>
  );
};
