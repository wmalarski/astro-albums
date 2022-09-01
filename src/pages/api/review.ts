import { createReview } from "@server/reviews";
import { getUser } from "@server/supabase";
import { z } from "zod";

const schema = z.object({
  albumId: z.string().uuid(),
  rate: z.number().min(0).max(10),
  text: z.string(),
});

export const post = async (request: Request): Promise<Response> => {
  const body = await request.json();

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.message }), {
      status: 400,
    });
  }

  const user = await getUser(request);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
    });
  }

  const review = await createReview({
    ...parsed.data,
    userId: user.id,
  });

  return new Response(JSON.stringify({ data: review }), {
    status: 200,
  });
};
