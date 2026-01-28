import superjson from "superjson";
import { clearSessionCookie } from "../../helpers/auth";
import { OutputType } from "./logout_POST.schema";
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(_request: Request) {
  try {
    const headers = new Headers({ "Set-Cookie": clearSessionCookie() });
    return new Response(superjson.stringify({ success: true } satisfies OutputType), { headers });
  } catch (error) {
    return handleEndpointError(error);
  }
}
