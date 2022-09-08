/* eslint-disable jsx-a11y/label-has-associated-control */
import { paths } from "@utils/paths";
import { createEffect, createSignal, JSX } from "solid-js";

type Props = {
  lower?: number;
  query?: string;
  upper?: number;
  order?: "rate" | "createdAt";
};

type Order = Required<Props>["order"];

export const ReviewSearch = (props: Props): JSX.Element => {
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
        <div class="flex gap-2 w-full grow items-center">
          <label for="input" class="label label-text">
            Search
          </label>
          <input
            class="input flex-grow"
            id="input"
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder="Search"
            type="text"
            value={input()}
          />
        </div>
        <div class="flex gap-2 w-full grow items-center">
          <label for="lower" class="label label-text">
            Lower rate
          </label>
          <input
            class="input flex-grow"
            id="lower"
            max={10}
            min={0}
            onChange={(event) => setLower(event.currentTarget.valueAsNumber)}
            placeholder="Lower"
            step={0.1}
            type="number"
            value={lower()}
          />
        </div>
        <div class="flex gap-2 w-full grow items-center">
          <label for="upper" class="label label-text">
            Upper rate
          </label>
          <input
            class="input flex-grow"
            id="upper"
            max={10}
            min={0}
            onChange={(event) => setUpper(event.currentTarget.valueAsNumber)}
            placeholder="Upper"
            step={0.1}
            type="number"
            value={upper()}
          />
        </div>
        <div class="flex gap-2 w-full grow items-center">
          <label for="order" class="label label-text">
            Order by
          </label>
          <select
            class="select"
            id="order"
            value={order()}
            onChange={(event) => setOrder(event.currentTarget.value as Order)}
          >
            <option value="rate">Rate</option>
            <option value="createdAt">Created At</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" type="button" onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};
