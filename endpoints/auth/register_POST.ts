import superjson from "superjson";
import { nanoid } from "nanoid";
import { db } from "../../helpers/db";
import { schema, OutputType } from "./register_POST.schema";
import { hashPassword, createSessionToken, buildSessionCookie } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);
    const email = input.email.trim().toLowerCase();

    const existing = await db
      .selectFrom("users")
      .select(["id"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (existing) {
      return new Response(superjson.stringify({ error: "Email already registered" }), { status: 409 });
    }

    const passwordHash = await hashPassword(input.password);
    const now = new Date();

    const user = await db
      .insertInto("users")
      .values({
        id: nanoid(),
        email,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      })
      .returning(["id", "email"])
      .executeTakeFirstOrThrow();

    const { token, expiresAt } = createSessionToken(user.id);
    const headers = new Headers({ "Set-Cookie": buildSessionCookie(token, expiresAt) });

    return new Response(superjson.stringify({ user } satisfies OutputType), { headers });
  } catch (error) {
    return handleEndpointError(error);
  }
}
