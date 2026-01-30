import superjson from "superjson";
import { ZodError } from "zod";
import { isAuthError } from "./auth";

export const handleEndpointError = (error: unknown) => {
  if (error instanceof AggregateError) {
    console.error("AggregateError:", error, "inner:", (error as any).errors);
  } else {
    console.error("Endpoint error:", error);
  }

  const isValidation =
    error instanceof ZodError ||
    (error instanceof Error && error.name === "ZodError");

  const status = isAuthError(error) ? 401 : isValidation ? 400 : 500;

  if (error instanceof AggregateError) {
    const innerErrors = (error as any).errors as unknown[] | undefined;
    const first = innerErrors?.[0];

    const innerMessage =
      first instanceof Error
        ? `${first.name}: ${first.message || "(no message)"}`
        : typeof first === "string"
          ? first
          : first
            ? JSON.stringify(first)
            : "(no inner error)";

    return new Response(
      superjson.stringify({ error: `AggregateError: ${innerMessage}` }),
      { status }
    );
  }

  const message =
    error instanceof Error
      ? (error.message || error.name || "Unknown error")
      : "Unknown error";

  return new Response(superjson.stringify({ error: message }), { status });
};
