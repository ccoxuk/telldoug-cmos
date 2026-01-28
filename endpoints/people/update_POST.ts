import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const userId = requireUserId(request);

    const updatedPerson = await db
      .updateTable('people')
      .set({
        name: input.name,
        email: input.email,
        company: input.company,
        role: input.role,
        notes: input.notes,
        relationshipType: input.relationshipType,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ person: updatedPerson } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}