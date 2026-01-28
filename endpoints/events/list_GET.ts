import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    // Handle date parsing from query params if needed, but schema.parse handles string to date if configured or we pass strings
    // Since GET params are strings, we need to be careful. Zod coerce can help or manual parsing.
    // However, superjson doesn't automatically parse URL search params.
    // Let's manually handle date strings if they exist before parsing with schema if schema expects Date objects.
    // But for GET requests, it's often easier to keep dates as strings in schema input and parse them inside handle.
    // Let's adjust schema to accept strings for dates in input, or use coerce.
    
    const input = schema.parse(searchParams);

    const userId = requireUserId(request);

    let query = db.selectFrom('events').selectAll();

    query = query.where('events.userId', '=', userId);

    if (input.eventType) {
      query = query.where('eventType', '=', input.eventType);
    }

    if (input.startDate) {
      query = query.where('eventDate', '>=', input.startDate);
    }

    if (input.endDate) {
      query = query.where('eventDate', '<=', input.endDate);
    }

    // Default sort by eventDate desc
    query = query.orderBy('eventDate', 'desc');

    const events = await query.execute();

    return new Response(superjson.stringify({ events } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}