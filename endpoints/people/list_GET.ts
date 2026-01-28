import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    // Validate input (search query)
    const input = schema.parse(searchParams);

    const userId = requireUserId(request);

    let query = db.selectFrom('people').selectAll();

    query = query.where('people.userId', '=', userId);

    if (input.search) {
      const searchTerm = `%${input.search.toLowerCase()}%`;
      query = query.where((eb) => eb.or([
        eb('name', 'ilike', searchTerm),
        eb('company', 'ilike', searchTerm),
        eb('role', 'ilike', searchTerm),
        eb('email', 'ilike', searchTerm)
      ]));
    }

    // Default sort by name
    query = query.orderBy('name', 'asc');

    const people = await query.execute();

    return new Response(superjson.stringify({ people } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}