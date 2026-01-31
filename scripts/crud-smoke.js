#!/usr/bin/env node
import superjson from "superjson";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3333";
const email = `smoke+${Date.now()}@example.com`;
const password = "SmokeTest!2345";
const emailB = `smoke-b+${Date.now()}@example.com`;

const fail = (label, details = "") => {
  console.error(`FAIL: ${label}`);
  if (details) {
    console.error(details);
  }
  process.exit(1);
};

const pass = (label) => {
  console.log(`PASS: ${label}`);
};

const parseBody = (text) => {
  if (!text) return null;
  try {
    return superjson.parse(text);
  } catch {
    return null;
  }
};

const getCookieValue = (setCookie) => {
  if (!setCookie) return "";
  return setCookie.split(";")[0] ?? "";
};

const requestJson = async (path, body, cookie) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: superjson.stringify(body),
  });
  const text = await res.text();
  return { res, text, data: parseBody(text) };
};

const getJson = async (path, cookie) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });
  const text = await res.text();
  return { res, text, data: parseBody(text) };
};

const expectOk = (label, res, text) => {
  if (!res.ok) {
    fail(label, `${res.status} ${text}`);
  }
};

const assertInList = (label, list, id) => {
  if (!Array.isArray(list) || !list.some((item) => item?.id === id)) {
    fail(label, `Expected id ${id} to be present`);
  }
  pass(label);
};

const assertNotInList = (label, list, id) => {
  if (Array.isArray(list) && list.some((item) => item?.id === id)) {
    fail(label, `Expected id ${id} to be removed`);
  }
  pass(label);
};

console.log(`Running CRUD smoke against: ${baseUrl}`);

// Register
{
  const { res, text } = await requestJson("/_api/auth/register", { email, password });
  expectOk("register", res, text);
  pass("register");
}

// Login
let sessionCookie = "";
{
  const { res, text } = await requestJson("/_api/auth/login", { email, password });
  expectOk("login", res, text);
  sessionCookie = getCookieValue(res.headers.get("set-cookie") || "");
  if (!sessionCookie) {
    fail("login set-cookie", "missing Set-Cookie header");
  }
  pass("login");
}

// Session
{
  const { res, text } = await getJson("/_api/auth/session", sessionCookie);
  expectOk("session", res, text);
  pass("session");
}

const now = new Date();
const later = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

// Create Institution
const institutionInput = {
  name: `Smoke Institution ${Date.now()}`,
  type: "university",
  location: "Test City",
  notes: "Smoke test institution",
};
const institution = {
  id: "",
};
{
  const { res, text, data } = await requestJson("/_api/institutions/create", institutionInput, sessionCookie);
  expectOk("create institution", res, text);
  institution.id = data?.institution?.id;
  if (!institution.id) {
    fail("create institution id", text);
  }
  pass("create institution");
}

// Create Job
const jobInput = {
  title: "Smoke Job",
  company: "Smoke Co",
  description: "Smoke test job",
  startDate: now,
  endDate: null,
  isCurrent: false,
  location: "Remote",
  notes: "Smoke test notes",
};
const job = { id: "" };
{
  const { res, text, data } = await requestJson("/_api/jobs/create", jobInput, sessionCookie);
  expectOk("create job", res, text);
  job.id = data?.job?.id;
  if (!job.id) {
    fail("create job id", text);
  }
  pass("create job");
}

// Cross-user isolation check (user B should not see user A's job)
let sessionCookieB = "";
{
  const { res, text } = await requestJson("/_api/auth/register", { email: emailB, password }, undefined);
  expectOk("register user B", res, text);
  pass("register user B");
}
{
  const { res, text } = await requestJson("/_api/auth/login", { email: emailB, password }, undefined);
  expectOk("login user B", res, text);
  sessionCookieB = getCookieValue(res.headers.get("set-cookie") || "");
  if (!sessionCookieB) {
    fail("login user B set-cookie", "missing Set-Cookie header");
  }
  pass("login user B");
}
{
  const { res, text, data } = await getJson("/_api/jobs/list", sessionCookieB);
  expectOk("user B list jobs", res, text);
  assertNotInList("user B cannot see user A job", data?.jobs, job.id);
}

// Create Project
const projectInput = {
  name: "Smoke Project",
  description: "Smoke test project",
  status: "planning",
  startDate: now,
  endDate: later,
};
const project = { id: "" };
{
  const { res, text, data } = await requestJson("/_api/projects/create", projectInput, sessionCookie);
  expectOk("create project", res, text);
  project.id = data?.project?.id;
  if (!project.id) {
    fail("create project id", text);
  }
  pass("create project");
}

// Create Skill
const skillInput = {
  name: "Smoke Skill",
  category: "Frontend",
  proficiency: "beginner",
  notes: "Smoke test skill",
};
const skill = { id: "" };
{
  const { res, text, data } = await requestJson("/_api/skills/create", skillInput, sessionCookie);
  expectOk("create skill", res, text);
  skill.id = data?.skill?.id;
  if (!skill.id) {
    fail("create skill id", text);
  }
  pass("create skill");
}

// Create Person
const personInput = {
  name: "Smoke Person",
  email: `person+${Date.now()}@example.com`,
  company: "Smoke Co",
  role: "Manager",
  notes: "Smoke test person",
  relationshipType: "manager",
};
const person = { id: "" };
{
  const { res, text, data } = await requestJson("/_api/people/create", personInput, sessionCookie);
  expectOk("create person", res, text);
  person.id = data?.person?.id;
  if (!person.id) {
    fail("create person id", text);
  }
  pass("create person");
}

// Create Event
const eventInput = {
  title: "Smoke Event",
  description: "Smoke test event",
  eventDate: now,
  eventEndDate: later,
  eventType: "other",
  location: "Test City",
  notes: "Smoke test event",
};
const event = { id: "" };
{
  const { res, text, data } = await requestJson("/_api/events/create", eventInput, sessionCookie);
  expectOk("create event", res, text);
  event.id = data?.event?.id;
  if (!event.id) {
    fail("create event id", text);
  }
  pass("create event");
}

// Create Relationship (person -> project)
const relationshipInput = {
  sourceType: "person",
  sourceId: person.id,
  targetType: "project",
  targetId: project.id,
  relationshipLabel: "Worked on",
  notes: "Smoke test relationship",
};
const relationship = { id: "" };
{
  const { res, text, data } = await requestJson("/_api/relationships/create", relationshipInput, sessionCookie);
  expectOk("create relationship", res, text);
  relationship.id = data?.relationship?.id;
  if (!relationship.id) {
    fail("create relationship id", text);
  }
  pass("create relationship");
}

// List checks
{
  const { res, text, data } = await getJson("/_api/institutions/list", sessionCookie);
  expectOk("list institutions", res, text);
  assertInList("list institutions contains id", data?.institutions, institution.id);
}
{
  const { res, text, data } = await getJson("/_api/jobs/list", sessionCookie);
  expectOk("list jobs", res, text);
  assertInList("list jobs contains id", data?.jobs, job.id);
}
{
  const { res, text, data } = await getJson("/_api/projects/list", sessionCookie);
  expectOk("list projects", res, text);
  assertInList("list projects contains id", data?.projects, project.id);
}
{
  const { res, text, data } = await getJson("/_api/skills/list", sessionCookie);
  expectOk("list skills", res, text);
  assertInList("list skills contains id", data?.skills, skill.id);
}
{
  const { res, text, data } = await getJson("/_api/people/list", sessionCookie);
  expectOk("list people", res, text);
  assertInList("list people contains id", data?.people, person.id);
}
{
  const { res, text, data } = await getJson("/_api/events/list", sessionCookie);
  expectOk("list events", res, text);
  assertInList("list events contains id", data?.events, event.id);
}
{
  const { res, text, data } = await getJson("/_api/relationships/list", sessionCookie);
  expectOk("list relationships", res, text);
  assertInList("list relationships contains id", data?.relationships, relationship.id);
}

// Timeline
{
  const { res, text } = await getJson("/_api/timeline/data", sessionCookie);
  expectOk("timeline data", res, text);
  pass("timeline data");
}

// Global search
{
  const { res, text } = await getJson("/_api/search/global?query=Smoke", sessionCookie);
  expectOk("global search", res, text);
  pass("global search");
}

// TellDoug queries
{
  const { res, text } = await requestJson("/_api/tell-doug/query", { message: "show my jobs" }, sessionCookie);
  expectOk("tell-doug jobs", res, text);
}
{
  const { res, text } = await requestJson("/_api/tell-doug/query", { message: "show my skills" }, sessionCookie);
  expectOk("tell-doug skills", res, text);
}
{
  const { res, text } = await requestJson("/_api/tell-doug/query", { message: "what did I do in 2022" }, sessionCookie);
  expectOk("tell-doug 2022", res, text);
}

// Updates
{
  const { res, text } = await requestJson(
    "/_api/institutions/update",
    { ...institutionInput, id: institution.id, notes: "Updated institution" },
    sessionCookie
  );
  expectOk("update institution", res, text);
  pass("update institution");
}
{
  const { res, text } = await requestJson(
    "/_api/jobs/update",
    { ...jobInput, id: job.id, description: "Updated job" },
    sessionCookie
  );
  expectOk("update job", res, text);
  pass("update job");
}
{
  const { res, text } = await requestJson(
    "/_api/projects/update",
    { ...projectInput, id: project.id, description: "Updated project" },
    sessionCookie
  );
  expectOk("update project", res, text);
  pass("update project");
}
{
  const { res, text } = await requestJson(
    "/_api/skills/update",
    { ...skillInput, id: skill.id, notes: "Updated skill" },
    sessionCookie
  );
  expectOk("update skill", res, text);
  pass("update skill");
}
{
  const { res, text } = await requestJson(
    "/_api/people/update",
    { ...personInput, id: person.id, notes: "Updated person" },
    sessionCookie
  );
  expectOk("update person", res, text);
  pass("update person");
}
{
  const { res, text } = await requestJson(
    "/_api/events/update",
    { ...eventInput, id: event.id, description: "Updated event" },
    sessionCookie
  );
  expectOk("update event", res, text);
  pass("update event");
}
{
  const { res, text } = await requestJson(
    "/_api/relationships/update",
    { id: relationship.id, relationshipLabel: "Worked on", notes: "Updated relationship" },
    sessionCookie
  );
  expectOk("update relationship", res, text);
  pass("update relationship");
}

// Deletes (relationship first)
{
  const { res, text } = await requestJson("/_api/relationships/delete", { id: relationship.id }, sessionCookie);
  expectOk("delete relationship", res, text);
  pass("delete relationship");
}
{
  const { res, text } = await requestJson("/_api/events/delete", { id: event.id }, sessionCookie);
  expectOk("delete event", res, text);
  pass("delete event");
}
{
  const { res, text } = await requestJson("/_api/skills/delete", { id: skill.id }, sessionCookie);
  expectOk("delete skill", res, text);
  pass("delete skill");
}
{
  const { res, text } = await requestJson("/_api/projects/delete", { id: project.id }, sessionCookie);
  expectOk("delete project", res, text);
  pass("delete project");
}
{
  const { res, text } = await requestJson("/_api/people/delete", { id: person.id }, sessionCookie);
  expectOk("delete person", res, text);
  pass("delete person");
}
{
  const { res, text } = await requestJson("/_api/jobs/delete", { id: job.id }, sessionCookie);
  expectOk("delete job", res, text);
  pass("delete job");
}
{
  const { res, text } = await requestJson("/_api/institutions/delete", { id: institution.id }, sessionCookie);
  expectOk("delete institution", res, text);
  pass("delete institution");
}

// Post-delete list checks
{
  const { res, text, data } = await getJson("/_api/institutions/list", sessionCookie);
  expectOk("list institutions after delete", res, text);
  assertNotInList("institution removed", data?.institutions, institution.id);
}
{
  const { res, text, data } = await getJson("/_api/jobs/list", sessionCookie);
  expectOk("list jobs after delete", res, text);
  assertNotInList("job removed", data?.jobs, job.id);
}
{
  const { res, text, data } = await getJson("/_api/projects/list", sessionCookie);
  expectOk("list projects after delete", res, text);
  assertNotInList("project removed", data?.projects, project.id);
}
{
  const { res, text, data } = await getJson("/_api/skills/list", sessionCookie);
  expectOk("list skills after delete", res, text);
  assertNotInList("skill removed", data?.skills, skill.id);
}
{
  const { res, text, data } = await getJson("/_api/people/list", sessionCookie);
  expectOk("list people after delete", res, text);
  assertNotInList("person removed", data?.people, person.id);
}
{
  const { res, text, data } = await getJson("/_api/events/list", sessionCookie);
  expectOk("list events after delete", res, text);
  assertNotInList("event removed", data?.events, event.id);
}
{
  const { res, text, data } = await getJson("/_api/relationships/list", sessionCookie);
  expectOk("list relationships after delete", res, text);
  assertNotInList("relationship removed", data?.relationships, relationship.id);
}

console.log("CRUD smoke: PASS");
