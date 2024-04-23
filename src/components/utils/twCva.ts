import { cva, cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const twCva: typeof cva = (...args) => {
  const result = cva(...args);

  return (props) => {
    return twMerge(result(props));
  };
};

export const twCx: typeof cx = (...args) => {
  return twMerge(cx(...args));
};
