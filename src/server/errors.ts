export const unauthorizedError = () => {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
  });
};

type InvalidRequestError = {
  text?: string;
};

export const invalidRequestError = ({ text }: InvalidRequestError = {}) => {
  return new Response(JSON.stringify({ error: text || "Invalid Request" }), {
    status: 400,
  });
};
