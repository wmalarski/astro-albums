declare module "astro:actions" {
	type Actions = typeof import("C:/Users/wmala/Projects/Projects/astro/astro-albums/src/actions")["server"];

	export const actions: Actions;
}