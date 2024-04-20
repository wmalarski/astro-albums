import { getBaseUrl } from "@utils/baseUrl";
import { paths } from "@utils/paths";
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

    const redirectTo = `${getBaseUrl()}/${paths.callback}`;

    // const supabase = await getClientSupabase();

    // const result = await supabase.auth.signInWithOtp({
    //   email: email(),
    //   options: { emailRedirectTo: redirectTo },
    // });

    // setError(result?.error?.message || "");
    setIsLoading(false);
    // setIsSuccess(!result?.error?.message);
  };

  return (
    <div class="card bg-base-300 w-fit">
      <form class="card-body">
        <h3 class="card-title">Login</h3>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label class="pb-2" for="email">
          To log in, or register. Use the form below to get a magic link to your
          email.
        </label>
        <div class="w-full">
          <input
            class="input w-full"
            disabled={isLoading()}
            id="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Email"
            type="email"
            value={email()}
          />
          <Show when={error()} keyed>
            {(error) => (
              <span role="alert" class="text-sm text-red-400">
                {error}
              </span>
            )}
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
      </form>
    </div>
  );
};
