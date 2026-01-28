import superjson from "superjson";
import { schema } from "./query_POST.schema";
import { db } from "../../helpers/db";
import { format } from "date-fns";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

const fallbackMessage =
  "I don't know how to answer that yet. Try asking about jobs, skills, projects, people, or a specific year.";

const formatMonth = (value?: Date | string | null) =>
  value ? format(new Date(value), "MMM yyyy") : null;

const formatDay = (value?: Date | string | null) =>
  value ? format(new Date(value), "MMM d, yyyy") : null;

const formatRange = (start?: Date | string | null, end?: Date | string | null, isCurrent?: boolean) => {
  const startLabel = formatMonth(start);
  const endLabel = formatMonth(end) || (isCurrent ? "Present" : null);
  if (!startLabel && !endLabel) return "";
  if (startLabel && endLabel) return ` (${startLabel} – ${endLabel})`;
  return startLabel ? ` (${startLabel})` : "";
};

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const { message } = schema.parse(json);
    const userId = requireUserId(request);

    const normalized = message.trim().toLowerCase();
    if (!normalized) {
      return new Response(fallbackMessage, { status: 200, headers: { "Content-Type": "text/plain" } });
    }

    const yearMatch = normalized.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      const year = Number(yearMatch[0]);
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);

      const [jobs, events] = await Promise.all([
        db
          .selectFrom("jobs")
          .select(["id", "title", "company", "startDate", "endDate", "isCurrent"])
          .where("userId", "=", userId)
          .where((eb) =>
            eb.or([
              eb.and([eb("startDate", ">=", start), eb("startDate", "<=", end)]),
              eb.and([eb("endDate", ">=", start), eb("endDate", "<=", end)]),
              eb.and([
                eb("startDate", "<=", end),
                eb.or([
                  eb("endDate", ">=", start),
                  eb("endDate", "is", null),
                  eb("isCurrent", "=", true),
                ]),
              ]),
            ])
          )
          .orderBy("startDate", "desc")
          .execute(),
        db
          .selectFrom("events")
          .select(["id", "title", "eventDate", "eventEndDate", "location"])
          .where("userId", "=", userId)
          .where((eb) =>
            eb.or([
              eb.and([eb("eventDate", ">=", start), eb("eventDate", "<=", end)]),
              eb.and([eb("eventEndDate", ">=", start), eb("eventEndDate", "<=", end)]),
            ])
          )
          .orderBy("eventDate", "desc")
          .execute(),
      ]);

      const lines: string[] = [];
      lines.push(`In ${year}, I found ${jobs.length} job(s) and ${events.length} event(s).`);

      if (jobs.length) {
        lines.push("Jobs:");
        jobs.slice(0, 10).forEach((job) => {
          const range = formatRange(job.startDate, job.endDate, job.isCurrent);
          const company = job.company ? ` @ ${job.company}` : "";
          lines.push(`- ${job.title}${company}${range}`);
        });
      }

      if (events.length) {
        lines.push("Events:");
        events.slice(0, 10).forEach((event) => {
          const dateLabel = formatDay(event.eventDate || event.eventEndDate);
          const location = event.location ? ` • ${event.location}` : "";
          lines.push(`- ${event.title}${dateLabel ? ` (${dateLabel})` : ""}${location}`);
        });
      }

      if (!jobs.length && !events.length) {
        lines.push("No records found for that year yet.");
      }

      return new Response(lines.join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (/(^|\b)(jobs?|roles?|positions?)(\b|$)/.test(normalized)) {
      const companyMatch = normalized.match(/\bat\s+([^?]+)$/);
      const companyFilter = companyMatch?.[1]?.trim();

      let query = db
        .selectFrom("jobs")
        .select(["id", "title", "company", "startDate", "endDate", "isCurrent"])
        .where("userId", "=", userId)
        .orderBy("startDate", "desc");

      if (companyFilter) {
        query = query.where("company", "ilike", `%${companyFilter}%`);
      }

      const jobs = await query.execute();

      if (!jobs.length) {
        const suffix = companyFilter ? ` at ${companyFilter}` : "";
        return new Response(`I couldn't find any jobs${suffix} yet.`, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const lines = jobs.slice(0, 12).map((job) => {
        const range = formatRange(job.startDate, job.endDate, job.isCurrent);
        const company = job.company ? ` @ ${job.company}` : "";
        return `- ${job.title}${company}${range}`;
      });

      const header = companyFilter
        ? `Here are your jobs at ${companyFilter}:`
        : "Here are your jobs:";

      return new Response([header, ...lines].join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (/(^|\b)skills?(\b|$)/.test(normalized)) {
      const skills = await db
        .selectFrom("skills")
        .select(["id", "name", "category", "proficiency"])
        .where("userId", "=", userId)
        .orderBy("name", "asc")
        .execute();

      if (!skills.length) {
        return new Response("No skills yet. Add one to get started.", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const lines = skills.slice(0, 15).map((skill) => {
        const detail = [skill.category, skill.proficiency].filter(Boolean).join(" • ");
        return `- ${skill.name}${detail ? ` (${detail})` : ""}`;
      });

      return new Response(["Here are your skills:", ...lines].join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (/(^|\b)projects?(\b|$)/.test(normalized)) {
      const projects = await db
        .selectFrom("projects")
        .select(["id", "name", "status", "startDate", "endDate"])
        .where("userId", "=", userId)
        .orderBy("startDate", "desc")
        .execute();

      if (!projects.length) {
        return new Response("No projects yet. Add one to get started.", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const lines = projects.slice(0, 12).map((project) => {
        const range = formatRange(project.startDate, project.endDate);
        const status = project.status ? ` • ${project.status.replace(/_/g, " ")}` : "";
        return `- ${project.name}${status}${range}`;
      });

      return new Response(["Here are your projects:", ...lines].join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (/(^|\b)people|contacts|relationships(\b|$)/.test(normalized)) {
      const people = await db
        .selectFrom("people")
        .select(["id", "name", "role", "company"])
        .where("userId", "=", userId)
        .orderBy("name", "asc")
        .execute();

      if (!people.length) {
        return new Response("No people yet. Add a contact to get started.", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const lines = people.slice(0, 12).map((person) => {
        const detail = [person.role, person.company].filter(Boolean).join(" @ ");
        return `- ${person.name}${detail ? ` (${detail})` : ""}`;
      });

      return new Response(["Here are your people:", ...lines].join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response(fallbackMessage, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return handleEndpointError(error);
  }
}
