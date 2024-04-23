import { Button } from "@components/Button/Button";
import { redirectToYt } from "@utils/redirects";
import type { JSX } from "solid-js";

type Props = {
  title: string;
  name: string;
};

export const YtButton = (props: Props): JSX.Element => {
  return (
    <Button size="xs" onClick={() => redirectToYt(props.title, props.name)}>
      YT
    </Button>
  );
};
