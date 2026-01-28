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

    const newJob = await db
      .insertInto('jobs')
      .values({
        userId,
        id: nanoid(),
        title: input.title,
        company: input.company,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        isCurrent: input.isCurrent,
        location: input.location,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ job: newJob } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}