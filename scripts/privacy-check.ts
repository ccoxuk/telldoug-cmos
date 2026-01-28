import superjson from "superjson";
import { handle as registerUser } from "../endpoints/auth/register_POST.js";
import { handle as listJobs } from "../endpoints/jobs/list_GET.js";
import { handle as createJob } from "../endpoints/jobs/create_POST.js";

const BASE_URL = "http://localhost";

const buildRequest = (path: string, init: RequestInit = {}) => {
  return new Request(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
};

const getCookie = (response: Response) => {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) throw new Error("Expected Set-Cookie header");
  return setCookie.split(";")[0];
};

const ensure = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const register = async (email: string) => {
  const response = await registerUser(
    buildRequest("/_api/auth/register", {
      method: "POST",
      body: superjson.stringify({ email, password: "password123" }),
    })
  );
  ensure(response.ok, `Register failed for ${email} (status ${response.status})`);
  return getCookie(response);
};

const listJobsFor = async (cookie?: string) => {
  const response = await listJobs(
    buildRequest("/_api/jobs/list", {
      method: "GET",
      headers: cookie ? { cookie } : undefined,
    })
  );
  return response;
};

const createJobFor = async (cookie: string, title: string) => {
  const response = await createJob(
    buildRequest("/_api/jobs/create", {
      method: "POST",
      headers: { cookie },
      body: superjson.stringify({
        title,
        company: "TestCo",
      }),
    })
  );
  ensure(response.ok, `Create job failed (status ${response.status})`);
};

(async () => {
  // Test 1: unauthenticated list is rejected
  const unauthList = await listJobsFor();
  ensure(unauthList.status === 401, `Expected 401 for unauth list, got ${unauthList.status}`);

  // Test 2: user isolation
  const suffix = Math.random().toString(36).slice(2, 8);
  const userAEmail = `usera_${suffix}@example.com`;
  const userBEmail = `userb_${suffix}@example.com`;
  const jobTitle = `Isolation Job ${suffix}`;

  const cookieA = await register(userAEmail);
  const cookieB = await register(userBEmail);

  await createJobFor(cookieA, jobTitle);

  const listB = await listJobsFor(cookieB);
  ensure(listB.ok, `User B list failed (status ${listB.status})`);

  const listBData = superjson.parse<{ jobs: Array<{ title: string }> }>(await listB.text());
  const leaked = listBData.jobs.some((job) => job.title === jobTitle);
  ensure(!leaked, "User B can see user A job (scoping violation)");

  console.log("privacy-check: ok");
})().catch((error) => {
  console.error("privacy-check: failed", error);
  process.exit(1);
});
