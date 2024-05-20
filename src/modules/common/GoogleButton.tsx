import { Button } from "@components/Button/Button";
import { redirectToGoogle } from "@utils/redirects";
import type { JSX } from "solid-js";

type Props = {
  title: string;
  name: string;
};

export const GoogleButton = (props: Props): JSX.Element => {
  return (
    <Button size="xs" onClick={() => redirectToGoogle(props.title, props.name)}>
      Google
    </Button>
  );
};
