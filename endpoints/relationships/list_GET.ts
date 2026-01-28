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

    let query = db.selectFrom('relationships').selectAll();

    query = query.where('relationships.userId', '=', userId);

    if (input.sourceType && input.sourceId) {
      query = query.where((eb) => eb.and([
        eb('sourceType', '=', input.sourceType!),
        eb('sourceId', '=', input.sourceId!)
      ]));
    } else if (input.targetType && input.targetId) {
      query = query.where((eb) => eb.and([
        eb('targetType', '=', input.targetType!),
        eb('targetId', '=', input.targetId!)
      ]));
    }

    // Default sort by createdAt desc
    query = query.orderBy('createdAt', 'desc');

    const relationships = await query.execute();

    return new Response(superjson.stringify({ relationships } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}