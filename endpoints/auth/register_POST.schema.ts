import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  user: {
    id: string;
    email: string;
  };
};

export const registerUser = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const result = await fetch("/_api/auth/register", {
    method: "POST",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: superjson.stringify(body),
  });

  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }

  return superjson.parse<OutputType>(await result.text());
};
