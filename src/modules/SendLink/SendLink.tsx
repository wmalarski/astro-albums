import { supabase } from "@server/supabase";
import { getBaseUrl } from "@utils/baseUrl";
import clsx from "clsx";
import { Show, createSignal, type JSX } from "solid-js";

export const SendLink = (): JSX.Element => {
  const [email, setEmail] = createSignal("");

  const [isLoading, setIsLoading] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSendLink = async () => {
    setError("");
    setIsLoading(true);
    setIsSuccess(false);

    const redirectTo = `${getBaseUrl()}/magic-link`;

    const result = await supabase.auth.signInWithOtp({
      email: email(),
      options: { emailRedirectTo: redirectTo },
    });

    setError(result?.error?.message || "");
    setIsLoading(false);
    setIsSuccess(!result?.error?.message);
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
            disabled={isLoading()}
            id="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Email"
            type="text"
            value={email()}
          />
          <Show when={error()} keyed>
            {(error) => <div class="text-sm text-red-400">{error}</div>}
          </Show>
          <Show when={isSuccess()}>
            <div class="text-sm text-green-600">
              An email should arrive in your inbox shortly
            </div>
          </Show>
        </div>
        <div class="card-actions pt-3 relative">
          <button
            disabled={isLoading()}
            class={clsx("btn btn-primary w-full", {
              loading: isLoading(),
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
