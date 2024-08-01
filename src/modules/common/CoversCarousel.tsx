import { createMemo, Show, type Component } from "solid-js";

type CoversCarouselProps = {
  covers?: string[] | undefined;
  header: string;
};

export const CoversCarousel: Component<CoversCarouselProps> = (props) => {
  const cover = createMemo(() => {
    return props.covers?.[0];
  });

  return (
    <Show
      when={cover()}
      fallback={
        <div
          class="w-[240px] h-[240px] rounded-box bg-base-200 flex items-center justify-center text-6xl"
          aria-hidden="true"
        >
          🎵
        </div>
      }
    >
      {(cover) => (
        <div class="carousel rounded-box">
          <div class="carousel-item w-[240px]">
            <img src={cover()} alt={props.header} />
          </div>
        </div>
      )}
    </Show>
  );
};
