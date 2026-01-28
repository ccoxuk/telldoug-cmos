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

    let query = db.selectFrom('feedback')
      .innerJoin('people', 'feedback.personId', 'people.id')
      .select([
        'feedback.id',
        'feedback.userId',
        'feedback.personId',
        'feedback.feedbackDate',
        'feedback.feedbackType',
        'feedback.context',
        'feedback.notes',
        'feedback.createdAt',
        'feedback.updatedAt',
        'people.name as personName'
      ]);

    query = query.where('feedback.userId', '=', userId);

    if (input.feedbackType) {
      query = query.where('feedback.feedbackType', '=', input.feedbackType);
    }

    if (input.personId) {
      query = query.where('feedback.personId', '=', input.personId);
    }

    // Default sort by feedbackDate desc
    query = query.orderBy('feedback.feedbackDate', 'desc');

    const feedback = await query.execute();

    return new Response(superjson.stringify({ feedback } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}
