import superjson from "superjson";
import { ZodError } from "zod";
import { isAuthError } from "./auth";

export const handleEndpointError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error);
  }
  const message = error instanceof Error ? (error.message || error.name || "Unknown error") : "Unknown error";
  const isValidation = error instanceof ZodError || (error instanceof Error && error.name === "ZodError");
  const status = isAuthError(error) ? 401 : isValidation ? 400 : 500;
  return new Response(superjson.stringify({ error: message }), { status });
};
