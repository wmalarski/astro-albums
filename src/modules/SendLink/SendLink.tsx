import { supabase } from "@server/supabase";
import { getBaseUrl } from "@utils/baseUrl";
import clsx from "clsx";
import { createSignal, JSX, Show } from "solid-js";

export const SendLink = (): JSX.Element => {
  const [email, setEmail] = createSignal("");

  const [status, setStatus] = createSignal({
    error: "",
    isLoading: false,
    isSuccess: false,
  });

  const handleSendLink = async () => {
    setStatus({ error: "", isLoading: true, isSuccess: false });

    const redirectTo = `${getBaseUrl()}/magic-link`;

    const result = await supabase.auth.signIn(
      { email: email() },
      { redirectTo }
    );

    setStatus(
      result?.error?.message
        ? { error: result.error?.message, isLoading: false, isSuccess: false }
        : { error: "", isLoading: false, isSuccess: true }
    );
  };

  return (
    <div class="card bg-base-300 w-fit">
      <div class="card-body">
        <h3 class="card-title">Login</h3>
        <div class="pb-2">
          To log in, or register. Use the form below to get a magic link to your
          email.
        </div>
        <div class="w-full">
          <input
            class="input w-full"
            disabled={status().isLoading}
            id="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Email"
            type="text"
            value={email()}
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
        <div class="card-actions pt-3 relative">
          <button
            disabled={status().isLoading}
            class={clsx("btn btn-primary w-full", {
              loading: status().isLoading,
            })}
            type="button"
            onClick={handleSendLink}
          >
            Send magic link to your email!
          </button>
        </div>
      </div>
    </div>
  );
};
