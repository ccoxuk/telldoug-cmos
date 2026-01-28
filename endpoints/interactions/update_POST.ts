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

    const updatedInteraction = await db
      .updateTable('interactions')
      .set({
        personId: input.personId,
        projectId: input.projectId,
        interactionDate: input.interactionDate,
        interactionType: input.interactionType,
        tags: input.tags,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ interaction: updatedInteraction } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}