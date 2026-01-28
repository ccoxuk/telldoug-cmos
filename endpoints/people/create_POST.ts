import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { nanoid } from "nanoid";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const userId = requireUserId(request);

    const newPerson = await db
      .insertInto('people')
      .values({
        userId,
        id: nanoid(),
        name: input.name,
        email: input.email,
        company: input.company,
        role: input.role,
        notes: input.notes,
        relationshipType: input.relationshipType,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ person: newPerson } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}