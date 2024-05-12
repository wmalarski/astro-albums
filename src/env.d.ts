/// <reference path="../.astro/actions.d.ts" />
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
