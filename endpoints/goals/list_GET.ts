import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    const input = schema.parse(searchParams);

    const userId = requireUserId(request);

    let query = db.selectFrom('goals').selectAll();

    query = query.where('goals.userId', '=', userId);

    if (input.goalType) {
      query = query.where('goalType', '=', input.goalType);
    }

    if (input.status) {
      query = query.where('status', '=', input.status);
    }

    // Default sort by targetDate asc
    query = query.orderBy('targetDate', 'asc');

    const goals = await query.execute();

    return new Response(superjson.stringify({ goals } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}