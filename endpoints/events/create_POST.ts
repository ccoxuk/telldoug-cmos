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

    const newEvent = await db
      .insertInto('events')
      .values({
        userId,
        id: nanoid(),
        title: input.title,
        description: input.description,
        eventDate: input.eventDate,
        eventEndDate: input.eventEndDate,
        eventType: input.eventType,
        location: input.location,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ event: newEvent } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}