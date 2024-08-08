import type { Component, ParentProps } from "solid-js";

export const CardGrid: Component<ParentProps> = (props) => {
  return (
    <div
      {...props}
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {props.children}
    </div>
  );
};
