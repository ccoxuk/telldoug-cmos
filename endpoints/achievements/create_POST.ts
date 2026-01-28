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

    const newAchievement = await db
      .insertInto('achievements')
      .values({
        userId,
        id: nanoid(),
        title: input.title,
        description: input.description,
        achievedDate: input.achievedDate,
        category: input.category,
        quantifiableImpact: input.quantifiableImpact,
        evidenceUrl: input.evidenceUrl,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ achievement: newAchievement } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}