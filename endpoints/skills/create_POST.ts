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

    const newSkill = await db
      .insertInto('skills')
      .values({
        userId,
        id: nanoid(),
        name: input.name,
        category: input.category,
        proficiency: input.proficiency,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ skill: newSkill } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}