import { Button } from "@components/Button/Button";
import { redirectToGoogle } from "@utils/redirects";
import type { Component } from "solid-js";

type GoogleButtonProps = {
  title: string;
  name: string;
};

export const GoogleButton: Component<GoogleButtonProps> = (props) => {
  return (
    <Button size="xs" onClick={() => redirectToGoogle(props.title, props.name)}>
      Google
    </Button>
  );
};
