import superjson from "superjson";

export type OutputType = {
  user: {
    id: string;
    email: string;
  } | null;
};

export const getSession = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch("/_api/auth/session", {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }

  return superjson.parse<OutputType>(await result.text());
};
