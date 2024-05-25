import { Show, type Component } from "solid-js";

type CoversCarouselProps = {
  covers?: string[] | undefined;
  header: string;
};

export const CoversCarousel: Component<CoversCarouselProps> = (props) => {
  return (
    <Show when={(props.covers || []).length > 0}>
      <div class="carousel rounded-box">
        {props.covers?.slice(1)?.map((cover) => (
          <div class="carousel-item">
            <img src={cover} alt={props.header} />
          </div>
        ))}
      </div>
    </Show>
  );
};
