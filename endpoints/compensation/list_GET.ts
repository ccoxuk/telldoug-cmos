import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    // No input params for now, but we parse to ensure empty object if needed
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    schema.parse(searchParams);

    const userId = requireUserId(request);

    const compensation = await db.selectFrom('compensation')
      .innerJoin('jobs', 'compensation.jobId', 'jobs.id')
      .select([
        'compensation.id',
        'compensation.userId',
        'compensation.jobId',
        'compensation.effectiveDate',
        'compensation.baseSalary',
        'compensation.currency',
        'compensation.bonus',
        'compensation.equityValue',
        'compensation.benefitsNote',
        'compensation.createdAt',
        'compensation.updatedAt',
        'jobs.title as jobTitle',
        'jobs.company as jobCompany'
      ])
      .where('compensation.userId', '=', userId)
      .orderBy('compensation.effectiveDate', 'desc')
      .execute();

    return new Response(superjson.stringify({ compensation } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}
