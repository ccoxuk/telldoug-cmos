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

    const newProject = await db
      .insertInto('projects')
      .values({
        userId,
        id: nanoid(),
        name: input.name,
        description: input.description,
        status: input.status,
        startDate: input.startDate,
        endDate: input.endDate,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ project: newProject } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}