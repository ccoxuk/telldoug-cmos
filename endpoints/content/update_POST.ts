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

    const updatedContent = await db
      .updateTable('content')
      .set({
        title: input.title,
        contentType: input.contentType,
        publicationDate: input.publicationDate,
        platform: input.platform,
        url: input.url,
        description: input.description,
        engagementMetrics: input.engagementMetrics,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ content: updatedContent } satisfies OutputType));
  } catch (error) {
    return handleEndpointError(error);
  }
}