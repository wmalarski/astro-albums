import { redirectToGoogle } from "@utils/redirects";
import type { JSX } from "solid-js";

type Props = {
  title: string;
  name: string;
};

export const GoogleButton = (props: Props): JSX.Element => {
  return (
    <button
      class="btn btn-xs"
      onClick={() => redirectToGoogle(props.title, props.name)}
    >
      Google
    </button>
  );
};
