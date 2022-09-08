import { createSignal, JSX, Show } from "solid-js";
import { AlbumForm, AlbumFormData } from "./AlbumForm/AlbumForm";

type Props = {
  albumId: string;
  header: string;
  title: string;
  year: number;
};

export const EditAlbumButton = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (data: AlbumFormData) => {
    setError("");
    setIsLoading(true);

    const body = JSON.stringify({ albumId: props.albumId, ...data });
    const response = await fetch("/api/album", { body, method: "POST" });
    const result = await response.json();

    setError(result.error || "");
    setIsLoading(false);
    setIsOpen(false);
  };

  const initial = () => {
    return {
      title: props.title,
      year: props.year,
    };
  };

  return (
    <>
      <button class="btn btn-xs" onClick={() => setIsOpen(true)}>
        Edit
      </button>
      <Show when={isOpen()}>
        <div class="absolute inset-0 bg-base-300 p-8 flex flex-col gap-4">
          <h3 class="text-xl font-semibold truncate">{`Edit ${props.header}`}</h3>
          <AlbumForm
            error={error()}
            isLoading={isLoading()}
            onSubmit={handleSubmit}
            initial={initial()}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </Show>
    </>
  );
};
