import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    // Validate input
    const input = schema.parse(searchParams);

    const userId = requireUserId(request);

    let query = db.selectFrom('interactions')
      .leftJoin('people', 'interactions.personId', 'people.id')
      .leftJoin('projects', 'interactions.projectId', 'projects.id')
      .selectAll('interactions')
      .select([
        'people.name as personName',
        'projects.name as projectName'
      ]);

    query = query.where('interactions.userId', '=', userId);

    if (input.personId) {
      query = query.where('interactions.personId', '=', input.personId);
    }

    if (input.projectId) {
      query = query.where('interactions.projectId', '=', input.projectId);
    }

    if (input.interactionType) {
      query = query.where('interactions.interactionType', '=', input.interactionType);
    }

    // Default sort by date descending (newest first)
    query = query.orderBy('interactions.interactionDate', 'desc');

    const interactions = await query.execute();

    return new Response(superjson.stringify({ interactions } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}