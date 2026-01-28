import { db } from "./db";
import { Selectable } from "kysely";
import {
  People,
  Jobs,
  Skills,
  Projects,
  Institutions,
  Events,
  Feedback,
  Achievements,
  Goals,
  Compensation,
  Interactions,
  Relationships,
  Learning,
  Content,
} from "./schema";

export async function assembleUserContext(personId?: string): Promise<string> {
  // If personId is provided, we focus on data related to that person
  // Otherwise, we fetch a broad summary of everything

  let context = "";

  if (personId) {
    context += await assemblePersonContext(personId);
  } else {
    context += await assembleGlobalContext();
  }

  return context;
}

async function assemblePersonContext(personId: string): Promise<string> {
  const person = await db
    .selectFrom("people")
    .selectAll()
    .where("id", "=", personId)
    .executeTakeFirst();

  if (!person) return "Person not found.";

  let context = `FOCUS PERSON CONTEXT:\n`;
  context += `Name: ${person.name}\n`;
  context += `Role: ${person.role || "N/A"}\n`;
  context += `Company: ${person.company || "N/A"}\n`;
  context += `Relationship: ${person.relationshipType || "N/A"}\n`;
  context += `Notes: ${person.notes || "N/A"}\n\n`;

  // Interactions
  const interactions = await db
    .selectFrom("interactions")
    .selectAll()
    .where("personId", "=", personId)
    .orderBy("interactionDate", "desc")
    .limit(10)
    .execute();

  context += `RECENT INTERACTIONS (${interactions.length}):\n`;
  interactions.forEach((i) => {
    context += `- ${i.interactionDate.toString().split("T")[0]} (${i.interactionType}): ${i.notes || "No notes"}\n`;
  });
  context += "\n";

  // Feedback
  const feedback = await db
    .selectFrom("feedback")
    .selectAll()
    .where("personId", "=", personId)
    .orderBy("feedbackDate", "desc")
    .limit(5)
    .execute();

  if (feedback.length > 0) {
    context += `FEEDBACK RECEIVED (${feedback.length}):\n`;
    feedback.forEach((f) => {
      context += `- ${f.feedbackDate.toString().split("T")[0]} (${f.feedbackType}): ${f.notes}\n`;
    });
    context += "\n";
  }

  // Relationships (connections to other entities)
  const relationships = await db
    .selectFrom("relationships")
    .selectAll()
    .where((eb) =>
      eb.or([
        eb("sourceId", "=", personId),
        eb("targetId", "=", personId),
      ])
    )
    .limit(10)
    .execute();

  if (relationships.length > 0) {
    context += `RELATED ENTITIES:\n`;
    for (const r of relationships) {
      const isSource = r.sourceId === personId;
      const otherId = isSource ? r.targetId : r.sourceId;
      const otherType = isSource ? r.targetType : r.sourceType;
      context += `- Connected to ${otherType} (ID: ${otherId}) as "${r.relationshipLabel}"\n`;
    }
  }

  return context;
}

async function assembleGlobalContext(): Promise<string> {
  let context = "FULL CAREER OS CONTEXT:\n\n";

  // 1. Jobs (Current & Past)
  const jobs = await db.selectFrom("jobs").selectAll().orderBy("startDate", "desc").execute();
  context += `JOBS (${jobs.length}):\n`;
  jobs.forEach((j) => {
    const dates = `${j.startDate ? j.startDate.toString().split("T")[0] : "?"} to ${j.endDate ? j.endDate.toString().split("T")[0] : "Present"}`;
    context += `- ${j.title} at ${j.company} (${dates}). ${j.isCurrent ? "[CURRENT]" : ""}\n`;
  });
  context += "\n";

  // 2. Skills
  const skills = await db.selectFrom("skills").selectAll().orderBy("proficiency", "asc").execute(); // asc might group 'advanced' together depending on enum, but good enough
  context += `SKILLS (${skills.length}):\n`;
  skills.forEach((s) => {
    context += `- ${s.name} (${s.proficiency})\n`;
  });
  context += "\n";

  // 3. Projects (Recent 10)
  const projects = await db.selectFrom("projects").selectAll().orderBy("startDate", "desc").limit(10).execute();
  context += `RECENT PROJECTS:\n`;
  projects.forEach((p) => {
    context += `- ${p.name} (${p.status}): ${p.description || "No description"}\n`;
  });
  context += "\n";

  // 4. Goals (Active)
  const goals = await db.selectFrom("goals").selectAll().where("status", "in", ["in_progress", "not_started"]).execute();
  context += `ACTIVE GOALS:\n`;
  goals.forEach((g) => {
    context += `- ${g.title} (${g.goalType}): ${g.status}\n`;
  });
  context += "\n";

  // 5. People (Key contacts - just a summary count and maybe recent ones)
  const peopleCount = await db.selectFrom("people").select(db.fn.count("id").as("count")).executeTakeFirst();
  const recentPeople = await db.selectFrom("people").selectAll().orderBy("createdAt", "desc").limit(5).execute();
  context += `PEOPLE NETWORK: Total ${peopleCount?.count || 0} contacts.\n`;
  context += `Recently added: ${recentPeople.map((p) => p.name).join(", ")}\n\n`;

  // 6. Achievements (Recent 5)
  const achievements = await db.selectFrom("achievements").selectAll().orderBy("achievedDate", "desc").limit(5).execute();
  context += `RECENT ACHIEVEMENTS:\n`;
  achievements.forEach((a) => {
    context += `- ${a.title} (${a.category})\n`;
  });
  context += "\n";

  // 7. Events (Upcoming)
  const now = new Date();
  const upcomingEvents = await db
    .selectFrom("events")
    .selectAll()
    .where("eventDate", ">", now)
    .orderBy("eventDate", "asc")
    .limit(5)
    .execute();
  
  if (upcomingEvents.length > 0) {
    context += `UPCOMING EVENTS:\n`;
    upcomingEvents.forEach((e) => {
    context += `- ${e.eventDate?.toString().split("T")[0]}: ${e.title} (${e.eventType})\n`;
    });
    context += "\n";
  }

  // 8. Learning (Recent/Active)
  const learning = await db.selectFrom("learning").selectAll().orderBy("startDate", "desc").limit(10).execute();
  if (learning.length > 0) {
    context += `LEARNING & DEVELOPMENT:\n`;
    learning.forEach((l) => {
      const dates = `${l.startDate ? l.startDate.toString().split("T")[0] : "?"} to ${l.completionDate ? l.completionDate.toString().split("T")[0] : "..."}`;
      context += `- ${l.title} (${l.learningType}): ${l.status}. Provider: ${l.provider || "N/A"}. Dates: ${dates}. Cost: ${l.cost || "N/A"}. Skills: ${l.skillsGained || "N/A"}. Notes: ${l.notes || ""}\n`;
    });
    context += "\n";
  }

  // 9. Content (Recent)
  const content = await db.selectFrom("content").selectAll().orderBy("publicationDate", "desc").limit(10).execute();
  if (content.length > 0) {
    context += `CONTENT & PUBLICATIONS:\n`;
    content.forEach((c) => {
      context += `- ${c.title} (${c.contentType}) on ${c.platform || "N/A"}. Published: ${c.publicationDate.toString().split("T")[0]}. URL: ${c.url || "N/A"}. Metrics: ${c.engagementMetrics || "N/A"}. Desc: ${c.description || ""}\n`;
    });
    context += "\n";
  }

  return context;
}