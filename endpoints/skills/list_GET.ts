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

    let query = db.selectFrom('skills').selectAll();

    query = query.where('skills.userId', '=', userId);

    if (input.search) {
      const searchTerm = `%${input.search.toLowerCase()}%`;
      query = query.where('name', 'ilike', searchTerm);
    }

    if (input.category) {
      query = query.where('category', '=', input.category);
    }

    // Default sort by name
    query = query.orderBy('name', 'asc');

    const skills = await query.execute();

    return new Response(superjson.stringify({ skills } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}