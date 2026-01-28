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

    let query = db.selectFrom('content').selectAll();

    query = query.where('content.userId', '=', userId);

    if (input.search) {
      const searchTerm = `%${input.search.toLowerCase()}%`;
      query = query.where('title', 'ilike', searchTerm);
    }

    if (input.contentType) {
      query = query.where('contentType', '=', input.contentType);
    }

    // Default sort by publicationDate DESC (newest first)
    query = query.orderBy('publicationDate', 'desc').orderBy('createdAt', 'desc');

    const content = await query.execute();

    return new Response(superjson.stringify({ content } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}