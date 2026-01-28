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

    const updatedAchievement = await db
      .updateTable('achievements')
      .set({
        title: input.title,
        description: input.description,
        achievedDate: input.achievedDate,
        category: input.category,
        quantifiableImpact: input.quantifiableImpact,
        evidenceUrl: input.evidenceUrl,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ achievement: updatedAchievement } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}