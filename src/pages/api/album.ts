import { deleteAlbum, updateAlbum } from "@server/albums";
import { invalidRequestError, unauthorizedError } from "@server/errors";
import type { APIRoute } from "astro";
import { number, object, optional, safeParseAsync, string } from "valibot";

export const POST: APIRoute = async (context): Promise<Response> => {
  const session = context.locals.session;

  if (!session) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = await safeParseAsync(
    object({
      albumId: string(),
      title: optional(string()),
      year: optional(number()),
    }),
    body,
  );

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.error.message });
  }

  const result = await updateAlbum({ ...parsed.data, userId: session.user.id });

  if (result.count === 0) {
    return invalidRequestError({});
  }

  return new Response(JSON.stringify({ data: result }), {
    status: 200,
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  const session = context.locals.session;

  if (!session) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = await safeParseAsync(object({ albumId: string() }), body);

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.error.message });
  }

  const result = await deleteAlbum({ ...parsed.data, userId: session.user.id });

  if (result.count === 0) {
    return invalidRequestError({});
  }

  return new Response(JSON.stringify({ data: result }), {
    status: 200,
  });
};
