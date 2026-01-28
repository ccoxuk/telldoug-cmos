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

    const newInstitution = await db
      .insertInto('institutions')
      .values({
        userId,
        id: nanoid(),
        name: input.name,
        type: input.type,
        location: input.location,
        startDate: input.startDate,
        endDate: input.endDate,
        degree: input.degree,
        fieldOfStudy: input.fieldOfStudy,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ institution: newInstitution } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}