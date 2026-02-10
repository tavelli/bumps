import {FunctionComponent} from "react";

type Props = {
  isLoading: boolean;
  children: any;
  placeholder?: string;
  color?: "dark" | "light";
};

export const LoadingText: FunctionComponent<Props> = ({
  isLoading,
  children,
  placeholder = "0000",
  color = "dark",
}) => {
  return (
    <span className={isLoading ? "relative inline-block" : ""}>
      {isLoading ? (
        <>
          <span className="invisible" aria-hidden="true">
            {placeholder}
          </span>
          <span
            className={`absolute inset-0  animate-pulse rounded-md ${color === "light" ? "bg-gray-200" : "bg-gray-700"}`}
          />
        </>
      ) : (
        children
      )}
    </span>
  );
};
