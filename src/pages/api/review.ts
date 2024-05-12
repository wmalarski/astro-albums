import { invalidRequestError, unauthorizedError } from "@server/errors";
import { deleteReview } from "@server/reviews";
import type { APIRoute } from "astro";
import { object, safeParseAsync, string } from "valibot";

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
