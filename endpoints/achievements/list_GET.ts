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

    let query = db.selectFrom('achievements').selectAll();

    query = query.where('achievements.userId', '=', userId);

    if (input.category) {
      query = query.where('category', '=', input.category);
    }

    // Default sort by achievedDate desc
    query = query.orderBy('achievedDate', 'desc');

    const achievements = await query.execute();

    return new Response(superjson.stringify({ achievements } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}