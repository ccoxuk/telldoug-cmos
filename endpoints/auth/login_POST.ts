import superjson from "superjson";
import { db } from "../../helpers/db";
import { schema, OutputType } from "./login_POST.schema";
import { verifyPassword, createSessionToken, buildSessionCookie } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);
    const email = input.email.trim().toLowerCase();

    const user = await db
      .selectFrom("users")
      .select(["id", "email", "passwordHash"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return new Response(superjson.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      return new Response(superjson.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const { token, expiresAt } = createSessionToken(user.id);
    const headers = new Headers({ "Set-Cookie": buildSessionCookie(token, expiresAt) });

    return new Response(
      superjson.stringify({ user: { id: user.id, email: user.email } } satisfies OutputType),
      { headers }
    );
  } catch (error) {
    return handleEndpointError(error);
  }
}
