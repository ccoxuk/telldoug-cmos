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

    const updatedLearning = await db
      .updateTable('learning')
      .set({
        title: input.title,
        provider: input.provider,
        learningType: input.learningType,
        status: input.status,
        startDate: input.startDate,
        completionDate: input.completionDate,
        cost: input.cost,
        skillsGained: input.skillsGained,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ learning: updatedLearning } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}