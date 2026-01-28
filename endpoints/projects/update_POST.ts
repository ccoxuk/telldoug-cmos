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

    const updatedProject = await db
      .updateTable('projects')
      .set({
        name: input.name,
        description: input.description,
        status: input.status,
        startDate: input.startDate,
        endDate: input.endDate,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ project: updatedProject } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}