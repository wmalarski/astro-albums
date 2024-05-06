/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@components/Button/Button";
import { Link } from "@components/Link/Link";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "@components/TextField/TextField";
import { paths } from "@utils/paths";
import { createEffect, createSignal, type JSX } from "solid-js";

type Props = {
  query?: string;
};

export const AlbumSearch = (props: Props): JSX.Element => {
  const [input, setInput] = createSignal("");

  createEffect(() => {
    setInput((current) => props.query || current);
  });

  const handleSubmit = () => {
    window.location.replace(paths.index({ page: 0, query: input() }));
  };

  return (
    <div class="w-full flex flex-row gap-2">
      <TextFieldRoot>
        <TextFieldLabel for="input">
          <TextFieldLabelText>Search</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          id="input"
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="Search"
          type="text"
          value={input()}
        />
      </TextFieldRoot>
      <Button color="primary" type="button" onClick={handleSubmit}>
        Search
      </Button>
      <Link variant="ghost" href={paths.index()}>
        Random
      </Link>
    </div>
  );
};
