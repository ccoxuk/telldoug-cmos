import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    // Handle boolean conversion for isCurrent since URL params are strings
    const rawInput = { ...searchParams };
    if (rawInput.isCurrent === 'true') rawInput.isCurrent = true as any;
    if (rawInput.isCurrent === 'false') rawInput.isCurrent = false as any;

    const input = schema.parse(rawInput);
    const userId = requireUserId(request);

    let query = db.selectFrom('jobs').selectAll();

    query = query.where('jobs.userId', '=', userId);

    if (input.isCurrent !== undefined) {
      query = query.where('isCurrent', '=', input.isCurrent);
    }

    // Default sort by startDate desc
    query = query.orderBy('startDate', 'desc');

    const jobs = await query.execute();

    return new Response(superjson.stringify({ jobs } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}
