/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Locals {
    env: import("@server/serverEnv").ServerEnv;
  }
}
