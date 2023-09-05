import { invalidRequestError, unauthorizedError } from "@server/errors";
import { createReview, deleteReview, updateReview } from "@server/reviews";
import { getSessionHeaders, getUser } from "@server/session";
import type { APIRoute } from "astro";
import { z } from "zod";

export const PUT: APIRoute = async (context): Promise<Response> => {
  const { user, session } = await getUser(context.request);

  if (!user) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = z
    .object({
      albumId: z.string(),
      rate: z.number().min(0).max(10),
      text: z.string(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return invalidRequestError({ session, text: parsed.error.message });
  }

  const review = await createReview({
    ...parsed.data,
    userId: user.id,
  });

  return new Response(JSON.stringify({ data: review }), {
    headers: getSessionHeaders(session),
    status: 200,
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  const { user, session } = await getUser(context.request);

  if (!user) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = z
    .object({
      rate: z.number().min(0).max(10).optional(),
      reviewId: z.string(),
      text: z.string().optional(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return invalidRequestError({ session, text: parsed.error.message });
  }

  const result = await updateReview({ ...parsed.data, userId: user.id });

  if (result.count === 0) {
    return invalidRequestError({ session });
  }

  return new Response(JSON.stringify({ data: result }), {
    headers: getSessionHeaders(session),
    status: 200,
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  const { user, session } = await getUser(context.request);

  if (!user) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = z.object({ reviewId: z.string() }).safeParse(body);

  if (!parsed.success) {
    return invalidRequestError({ session, text: parsed.error.message });
  }

  const result = await deleteReview({ ...parsed.data, userId: user.id });

  if (result.count === 0) {
    return invalidRequestError({ session });
  }

  return new Response(JSON.stringify({ data: result }), {
    headers: getSessionHeaders(session),
    status: 200,
  });
};
