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

    const newGoal = await db
      .insertInto('goals')
      .values({
        userId,
        id: nanoid(),
        title: input.title,
        description: input.description,
        targetDate: input.targetDate,
        goalType: input.goalType,
        status: input.status,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ goal: newGoal } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}