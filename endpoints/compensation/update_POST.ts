import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const userId = requireUserId(request);

    const updatedCompensation = await db
      .updateTable('compensation')
      .set({
        jobId: input.jobId,
        effectiveDate: input.effectiveDate,
        baseSalary: input.baseSalary,
        currency: input.currency,
        bonus: input.bonus,
        equityValue: input.equityValue,
        benefitsNote: input.benefitsNote,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ compensation: updatedCompensation } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}