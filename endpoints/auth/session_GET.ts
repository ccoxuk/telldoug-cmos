import superjson from "superjson";
import { db } from "../../helpers/db";
import { getUserIdFromRequest } from "../../helpers/auth";
import { OutputType } from "./session_GET.schema";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return new Response(superjson.stringify({ user: null } satisfies OutputType));
    }

    const user = await db
      .selectFrom("users")
      .select(["id", "email"])
      .where("id", "=", userId)
      .executeTakeFirst();

    return new Response(
      superjson.stringify({ user: user ?? null } satisfies OutputType),
    );
  } catch (error) {
    return handleEndpointError(error);
  }
}
