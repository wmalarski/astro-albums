/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@components/Button/Button";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "@components/TextField/TextField";
import { paths } from "@utils/paths";
import { createEffect, createSignal, type JSX } from "solid-js";

type ReviewSearchProps = {
  lower?: number;
  query?: string;
  upper?: number;
  order?: "rate" | "createdAt";
};

type Order = Required<ReviewSearchProps>["order"];

export const ReviewSearch = (props: ReviewSearchProps): JSX.Element => {
  const [input, setInput] = createSignal("");
  const [lower, setLower] = createSignal(0);
  const [upper, setUpper] = createSignal(10);
  const [order, setOrder] = createSignal<Order>("createdAt");

  createEffect(() => {
    setInput((current) => props.query || current);
    setLower((current) => props.lower || current);
    setUpper((current) => props.upper || current);
    setOrder((current) => props.order || current);
  });

  const handleSubmit = () => {
    const path = paths.reviews({
      lower: lower(),
      page: 0,
      query: input(),
      upper: upper(),
    });
    window.location.replace(path);
  };

  return (
    <div class="w-full flex flex-row gap-2">
      <div class="flex flex-col gap-2 w-full">
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
        <TextFieldRoot>
          <TextFieldLabel for="lower">
            <TextFieldLabelText>Lower rate</TextFieldLabelText>
          </TextFieldLabel>
          <TextFieldInput
            id="lower"
            max={10}
            min={0}
            onChange={(event) => setLower(event.currentTarget.valueAsNumber)}
            placeholder="Lower"
            step={0.1}
            type="number"
            value={lower()}
          />
        </TextFieldRoot>
        <TextFieldRoot>
          <TextFieldLabel for="upper">
            <TextFieldLabelText>Upper rate</TextFieldLabelText>
          </TextFieldLabel>
          <TextFieldInput
            id="upper"
            max={10}
            min={0}
            onChange={(event) => setUpper(event.currentTarget.valueAsNumber)}
            placeholder="Upper"
            step={0.1}
            type="number"
            value={upper()}
          />
        </TextFieldRoot>
        <TextFieldRoot>
          <TextFieldLabel for="order">
            <TextFieldLabelText>Order by</TextFieldLabelText>
          </TextFieldLabel>
          <select
            class="select"
            id="order"
            value={order()}
            onChange={(event) => setOrder(event.currentTarget.value as Order)}
          >
            <option value="rate">Rate</option>
            <option value="createdAt">Created At</option>
          </select>
        </TextFieldRoot>
      </div>
      <Button color="primary" type="button" onClick={handleSubmit}>
        Search
      </Button>
    </div>
  );
};
