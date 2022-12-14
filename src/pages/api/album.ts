import { deleteAlbum, updateAlbum } from "@server/albums";
import { invalidRequestError, unauthorizedError } from "@server/errors";
import { getSessionHeaders, getUser } from "@server/supabase";
import type { AstroApiRequest } from "@server/types";
import { z } from "zod";

export const post = async ({ request }: AstroApiRequest): Promise<Response> => {
  const { user, session } = await getUser(request);

  if (!user) {
    return unauthorizedError();
  }

  const body = await request.json();

  const parsed = z
    .object({
      albumId: z.string(),
      title: z.string().optional(),
      year: z.number().optional(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return invalidRequestError({ session, text: parsed.error.message });
  }

  const result = await updateAlbum({ ...parsed.data, userId: user.id });

  if (result.count === 0) {
    return invalidRequestError({ session });
  }

  return new Response(JSON.stringify({ data: result }), {
    headers: getSessionHeaders(session),
    status: 200,
  });
};

export const del = async ({ request }: AstroApiRequest): Promise<Response> => {
  const { user, session } = await getUser(request);

  if (!user) {
    return unauthorizedError();
  }

  const body = await request.json();

  const parsed = z.object({ albumId: z.string() }).safeParse(body);

  if (!parsed.success) {
    return invalidRequestError({ session, text: parsed.error.message });
  }

  const result = await deleteAlbum({ ...parsed.data, userId: user.id });

  if (result.count === 0) {
    return invalidRequestError({ session });
  }

  return new Response(JSON.stringify({ data: result }), {
    headers: getSessionHeaders(session),
    status: 200,
  });
};
