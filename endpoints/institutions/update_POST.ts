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

    const updatedInstitution = await db
      .updateTable('institutions')
      .set({
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
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ institution: updatedInstitution } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}