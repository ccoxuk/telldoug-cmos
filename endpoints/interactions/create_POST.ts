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

    const newInteraction = await db
      .insertInto('interactions')
      .values({
        userId,
        id: nanoid(),
        personId: input.personId,
        projectId: input.projectId,
        interactionDate: input.interactionDate,
        interactionType: input.interactionType,
        tags: input.tags,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ interaction: newInteraction } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}