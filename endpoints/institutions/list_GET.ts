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

    let query = db.selectFrom('institutions').selectAll();

    query = query.where('institutions.userId', '=', userId);

    if (input.type) {
      query = query.where('type', '=', input.type);
    }

    // Default sort by startDate desc
    query = query.orderBy('startDate', 'desc');

    const institutions = await query.execute();

    return new Response(superjson.stringify({ institutions } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}