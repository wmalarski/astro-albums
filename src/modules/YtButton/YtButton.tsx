import { redirectToYt } from "@utils/redirects";
import type { JSX } from "solid-js";

type Props = {
  title: string;
  name: string;
};

export const YtButton = (props: Props): JSX.Element => {
  return (
    <button
      class="btn btn-xs"
      onClick={() => redirectToYt(props.title, props.name)}
    >
      YT
    </button>
  );
};
