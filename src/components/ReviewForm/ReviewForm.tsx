import clsx from "clsx";
import { createSignal, JSX, Show } from "solid-js";

export const ReviewForm = (): JSX.Element => {
  const [text, setText] = createSignal("");
  const [rate, setRate] = createSignal(5);

  const [status, setStatus] = createSignal({
    error: "",
    isLoading: false,
    isSuccess: false,
  });

  const handleSubmit = async () => {
    setStatus({ error: "", isLoading: true, isSuccess: false });

    const response = await fetch("/api/review");
    const result = await response.json();

    setStatus(
      result.error
        ? { error: result.error, isLoading: false, isSuccess: false }
        : { error: "", isLoading: false, isSuccess: true }
    );

    if (!result.error) {
      //
    }
  };

  return (
    <div class="w-full">
      <div class="pb-2">
        To log in, or register. Use the form below to get a magic link to your
        email.
      </div>
      <div>
        <input
          class="input"
          disabled={status().isLoading}
          id="email"
          onChange={(event) => setText(event.currentTarget.value)}
          placeholder="Email"
          type="text"
          value={text()}
        />
        <Show when={status().error} keyed>
          {(error) => <div class="text-sm text-red-400">{error}</div>}
        </Show>
        <Show when={status().isSuccess}>
          <div class="text-sm text-green-600">
            An email should arrive in your inbox shortly
          </div>
        </Show>
      </div>
      <div class="pt-3 relative">
        <button
          disabled={status().isLoading}
          class={clsx("btn btn-primary", { loading: status().isLoading })}
          type="button"
          onClick={handleSubmit}
        >
          Send magic link to your email!
        </button>
      </div>
    </div>
  );
};
