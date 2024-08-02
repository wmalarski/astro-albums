import { Button } from "@components/Button/Button";
import { redirectToYt } from "@utils/redirects";
import type { Component } from "solid-js";

type YtButtonProps = {
  title: string;
  name: string;
};

export const YtButton: Component<YtButtonProps> = (props) => {
  return (
    <Button size="xs" onClick={() => redirectToYt(props.title, props.name)}>
      YT
    </Button>
  );
};
