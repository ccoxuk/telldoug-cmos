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

    const newFeedback = await db
      .insertInto('feedback')
      .values({
        userId,
        id: nanoid(),
        personId: input.personId,
        feedbackDate: input.feedbackDate,
        feedbackType: input.feedbackType,
        context: input.context,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ feedback: newFeedback } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}