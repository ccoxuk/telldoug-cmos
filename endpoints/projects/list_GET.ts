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

    let query = db.selectFrom('projects').selectAll();

    query = query.where('projects.userId', '=', userId);

    if (input.status) {
      query = query.where('status', '=', input.status);
    }

    // Default sort by updated at desc
    query = query.orderBy('updatedAt', 'desc');

    const projects = await query.execute();

    return new Response(superjson.stringify({ projects } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}