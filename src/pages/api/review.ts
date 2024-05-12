import { invalidRequestError, unauthorizedError } from "@server/errors";
import { createReview, deleteReview, updateReview } from "@server/reviews";
import type { APIRoute } from "astro";
import {
  maxValue,
  minValue,
  number,
  object,
  optional,
  safeParseAsync,
  string,
} from "valibot";

export const PUT: APIRoute = async (context): Promise<Response> => {
  const session = context.locals.session;

  if (!session) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = await safeParseAsync(
    object({
      albumId: string(),
      rate: number([minValue(0), maxValue(10)]),
      text: string(),
    }),
    body,
  );

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.issues[0].message });
  }

  const review = await createReview({
    ...parsed.output,
    userId: session.userId,
  });

  return new Response(JSON.stringify({ data: review }), {
    status: 200,
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  const session = context.locals.session;

  if (!session) {
    return unauthorizedError();
  }

  const body = await context.request.json();

  const parsed = await safeParseAsync(
    object({
      rate: optional(number([minValue(0), maxValue(10)])),
      reviewId: string(),
      text: optional(string()),
    }),
    body,
  );

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.issues[0].message });
  }

  const result = await updateReview(parsed.output);

  // if (result.count === 0) {
  //   return invalidRequestError({});
  // }

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

  const parsed = await safeParseAsync(object({ reviewId: string() }), body);

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.issues[0].message });
  }

  const result = await deleteReview({
    ...parsed.output,
    userId: session.userId,
  });

  // if (result.count === 0) {
  //   return invalidRequestError({});
  // }

  return new Response(JSON.stringify({ data: result }), {
    status: 200,
  });
};
