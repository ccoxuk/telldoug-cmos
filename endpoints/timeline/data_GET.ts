import { OutputType, TimelineItem, TimelineYear } from "./data_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { getYear, isWithinInterval } from "date-fns";
import { requireUserId } from "../../helpers/auth";
import { handleEndpointError } from "../../helpers/endpoint";

const toDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export async function handle(request: Request) {
  try {
    // Fetch all necessary data
    // In a real large-scale app, we would filter by date range, but for a personal OS, fetching all is fine.

    const userId = requireUserId(request);
    
    const [
      jobsRaw,
      institutionsRaw,
      eventsRaw,
      projectsRaw,
      peopleRaw,
      interactionsRaw,
      relationshipsRaw,
      achievementsRaw,
      feedbackRaw,
      goalsRaw,
      compensationRaw,
      learningRaw,
      contentRaw
    ] = await Promise.all([
      db.selectFrom('jobs').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('institutions').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('events').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('projects').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('people').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('interactions').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('relationships').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('achievements').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('feedback').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('goals').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('compensation').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('learning').selectAll().where('userId', '=', userId).execute(),
      db.selectFrom('content').selectAll().where('userId', '=', userId).execute(),
    ]);

    const jobs = jobsRaw.map((job) => ({
      ...job,
      startDate: toDate(job.startDate),
      endDate: toDate(job.endDate),
      createdAt: toDate(job.createdAt),
      updatedAt: toDate(job.updatedAt),
    }));

    const institutions = institutionsRaw.map((inst) => ({
      ...inst,
      startDate: toDate(inst.startDate),
      endDate: toDate(inst.endDate),
      createdAt: toDate(inst.createdAt),
      updatedAt: toDate(inst.updatedAt),
    }));

    const events = eventsRaw.map((evt) => ({
      ...evt,
      eventDate: toDate(evt.eventDate),
      eventEndDate: toDate(evt.eventEndDate),
      createdAt: toDate(evt.createdAt),
      updatedAt: toDate(evt.updatedAt),
    }));

    const projects = projectsRaw.map((proj) => ({
      ...proj,
      startDate: toDate(proj.startDate),
      endDate: toDate(proj.endDate),
      createdAt: toDate(proj.createdAt),
      updatedAt: toDate(proj.updatedAt),
    }));

    const people = peopleRaw.map((person) => ({
      ...person,
      lastContactedAt: toDate(person.lastContactedAt),
      createdAt: toDate(person.createdAt),
      updatedAt: toDate(person.updatedAt),
    }));

    const interactions = interactionsRaw.map((interaction) => ({
      ...interaction,
      interactionDate: toDate(interaction.interactionDate),
      createdAt: toDate(interaction.createdAt),
      updatedAt: toDate(interaction.updatedAt),
    }));

    const relationships = relationshipsRaw.map((relationship) => ({
      ...relationship,
      createdAt: toDate(relationship.createdAt),
      updatedAt: toDate(relationship.updatedAt),
    }));

    const achievements = achievementsRaw.map((achievement) => ({
      ...achievement,
      achievedDate: toDate(achievement.achievedDate),
      createdAt: toDate(achievement.createdAt),
      updatedAt: toDate(achievement.updatedAt),
    }));

    const feedback = feedbackRaw.map((fb) => ({
      ...fb,
      feedbackDate: toDate(fb.feedbackDate),
      createdAt: toDate(fb.createdAt),
      updatedAt: toDate(fb.updatedAt),
    }));

    const goals = goalsRaw.map((goal) => ({
      ...goal,
      targetDate: toDate(goal.targetDate),
      createdAt: toDate(goal.createdAt),
      updatedAt: toDate(goal.updatedAt),
    }));

    const compensation = compensationRaw.map((row) => ({
      ...row,
      effectiveDate: toDate(row.effectiveDate),
      createdAt: toDate(row.createdAt),
      updatedAt: toDate(row.updatedAt),
    }));

    const learning = learningRaw.map((item) => ({
      ...item,
      startDate: toDate(item.startDate),
      completionDate: toDate(item.completionDate),
      createdAt: toDate(item.createdAt),
      updatedAt: toDate(item.updatedAt),
    }));

    const content = contentRaw.map((item) => ({
      ...item,
      publicationDate: toDate(item.publicationDate),
      createdAt: toDate(item.createdAt),
      updatedAt: toDate(item.updatedAt),
    }));

    const items: TimelineItem[] = [];

    // Helper to find linked people
    const getLinkedPeople = (
      entityId: string, 
      entityType: 'job' | 'institution' | 'event' | 'project',
      dateRange?: { start: Date, end: Date }
    ) => {
      const linkedPeopleIds = new Set<string>();

      if (entityType === 'job') {
        // Jobs: people with interactions where they worked at same company
        // We match people.company with job.company
        const job = jobs.find(j => j.id === entityId);
        if (job && job.company) {
          const normalizedCompany = job.company.toLowerCase().trim();
          people.forEach(p => {
            if (p.company && p.company.toLowerCase().trim() === normalizedCompany) {
              linkedPeopleIds.add(p.id);
            }
          });
        }
      } else if (entityType === 'institution') {
        // Institutions: people who attended same institution (based on relationships)
        relationships.forEach(r => {
          if (
            (r.sourceId === entityId && r.sourceType === 'institution' && r.targetType === 'person') ||
            (r.targetId === entityId && r.targetType === 'institution' && r.sourceType === 'person')
          ) {
            linkedPeopleIds.add(r.sourceType === 'person' ? r.sourceId : r.targetId);
          }
        });
      } else if (entityType === 'project') {
        // Projects: people from interactions linked to that project
        interactions.forEach(i => {
          if (i.projectId === entityId) {
            linkedPeopleIds.add(i.personId);
          }
        });
        // Also check relationships
        relationships.forEach(r => {
          if (
            (r.sourceId === entityId && r.sourceType === 'project' && r.targetType === 'person') ||
            (r.targetId === entityId && r.targetType === 'project' && r.sourceType === 'person')
          ) {
            linkedPeopleIds.add(r.sourceType === 'person' ? r.sourceId : r.targetId);
          }
        });
      } else if (entityType === 'event') {
        // Events: people with interactions linked to that event period
        // Or relationships
        
        // Check relationships first
        relationships.forEach(r => {
          if (
            (r.sourceId === entityId && r.sourceType === 'event' && r.targetType === 'person') ||
            (r.targetId === entityId && r.targetType === 'event' && r.sourceType === 'person')
          ) {
            linkedPeopleIds.add(r.sourceType === 'person' ? r.sourceId : r.targetId);
          }
        });

        // Check interactions during event period
        if (dateRange) {
          interactions.forEach(i => {
            if (i.interactionDate && isWithinInterval(i.interactionDate, { start: dateRange.start, end: dateRange.end })) {
              linkedPeopleIds.add(i.personId);
            }
          });
        }
      }

      return Array.from(linkedPeopleIds).map(id => {
        const p = people.find(person => person.id === id);
        return p ? { id: p.id, name: p.name } : null;
      }).filter((p): p is { id: string, name: string } => p !== null);
    };

    // Process Jobs
    jobs.forEach(job => {
      if (!job.startDate) return;
      const linked = getLinkedPeople(job.id, 'job');
      items.push({
        type: 'job',
        id: job.id,
        title: job.title,
        subtitle: job.company,
        startDate: job.startDate,
        endDate: job.endDate,
        linkedPeople: linked,
        linkedPeopleCount: linked.length
      });
    });

    // Process Institutions
    institutions.forEach(inst => {
      if (!inst.startDate) return;
      const linked = getLinkedPeople(inst.id, 'institution');
      items.push({
        type: 'institution',
        id: inst.id,
        title: inst.name,
        subtitle: inst.degree || inst.type,
        startDate: inst.startDate,
        endDate: inst.endDate,
        linkedPeople: linked,
        linkedPeopleCount: linked.length
      });
    });

    // Process Projects
    projects.forEach(proj => {
      if (!proj.startDate) return;
      const linked = getLinkedPeople(proj.id, 'project');
      items.push({
        type: 'project',
        id: proj.id,
        title: proj.name,
        subtitle: proj.status,
        startDate: proj.startDate,
        endDate: proj.endDate,
        linkedPeople: linked,
        linkedPeopleCount: linked.length
      });
    });

    // Process Events
    events.forEach(evt => {
      if (!evt.eventDate) return;
      const endDate = evt.eventEndDate || evt.eventDate;
      const linked = getLinkedPeople(evt.id, 'event', { start: evt.eventDate, end: endDate });
      items.push({
        type: 'event',
        id: evt.id,
        title: evt.title,
        subtitle: evt.eventType,
        startDate: evt.eventDate,
        endDate: evt.eventEndDate,
        linkedPeople: linked,
        linkedPeopleCount: linked.length
      });
    });

    // Process Achievements
    achievements.forEach(achievement => {
      items.push({
        type: 'achievement',
        id: achievement.id,
        title: achievement.title,
        subtitle: achievement.category,
        startDate: achievement.achievedDate,
        endDate: null,
        linkedPeople: [],
        linkedPeopleCount: 0
      });
    });

    // Process Feedback
    feedback.forEach(fb => {
      const person = people.find(p => p.id === fb.personId);
      const linked = person ? [{ id: person.id, name: person.name }] : [];
      // Format feedback type for display
      const formattedType = (fb.feedbackType || "feedback")
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      // Use context or notes preview as subtitle
      const notesText = fb.notes ?? "";
      const notesPreview = notesText.length > 50 ? notesText.substring(0, 50) + '...' : notesText;
      const subtitle = fb.context || notesPreview || "Feedback";
      
      items.push({
        type: 'feedback',
        id: fb.id,
        title: formattedType,
        subtitle: subtitle,
        startDate: fb.feedbackDate,
        endDate: null,
        linkedPeople: linked,
        linkedPeopleCount: linked.length
      });
    });

    // Process Goals
    goals.forEach(goal => {
      // Format status for display
      const formattedStatus = goal.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const subtitle = `${goal.goalType} - ${formattedStatus}`;
      
      items.push({
        type: 'goal',
        id: goal.id,
        title: goal.title,
        subtitle: subtitle,
        startDate: goal.targetDate,
        endDate: null,
        linkedPeople: [],
        linkedPeopleCount: 0
      });
    });

    // Process Compensation
    compensation.forEach(comp => {
      const job = jobs.find(j => j.id === comp.jobId);
      if (!job) return; // Skip if job not found
      
      const title = `Compensation at ${job.title}`;
      // Format salary with currency
      const baseSalaryNumber = Number(comp.baseSalary);
      const formattedSalary = Number.isFinite(baseSalaryNumber)
        ? `${comp.currency} ${baseSalaryNumber.toLocaleString()}`
        : comp.currency
          ? `${comp.currency} (value unavailable)`
          : "Compensation";
      
      // Link people from the job's company
      const linked = getLinkedPeople(job.id, 'job');
      
      items.push({
        type: 'compensation',
        id: comp.id,
        title: title,
        subtitle: formattedSalary,
        startDate: comp.effectiveDate,
        endDate: null,
        linkedPeople: linked,
        linkedPeopleCount: linked.length
      });
    });

    // Process Learning
    learning.forEach(learn => {
      if (!learn.startDate) return;
      // Format learning type for display
      const formattedType = (learn.learningType || "learning")
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      const subtitle = learn.provider ? `${learn.provider} - ${formattedType}` : formattedType;
      
      items.push({
        type: 'learning',
        id: learn.id,
        title: learn.title,
        subtitle: subtitle,
        startDate: learn.startDate,
        endDate: learn.completionDate,
        linkedPeople: [],
        linkedPeopleCount: 0
      });
    });

    // Process Content
    content.forEach(cont => {
      // Format content type for display
      const formattedType = (cont.contentType || "content")
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      const subtitle = cont.platform ? `${formattedType} - ${cont.platform}` : formattedType;
      
      items.push({
        type: 'content',
        id: cont.id,
        title: cont.title,
        subtitle: subtitle,
        startDate: cont.publicationDate,
        endDate: null,
        linkedPeople: [],
        linkedPeopleCount: 0
      });
    });

    // Group by Year
    const yearsMap = new Map<number, TimelineItem[]>();
    
    items.forEach(item => {
      if (!item.startDate) return;
      const year = getYear(item.startDate);
      const currentItems = yearsMap.get(year) || [];
      currentItems.push(item);
      yearsMap.set(year, currentItems);
    });

    const years: TimelineYear[] = Array.from(yearsMap.entries())
      .map(([year, items]) => ({
        year,
        items: items.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      }))
      .sort((a, b) => b.year - a.year);

    const result: OutputType = {
      years,
      allPeople: people.map(p => ({ id: p.id, name: p.name }))
    };

    return new Response(superjson.stringify(result), { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Timeline data error:", error);
    return handleEndpointError(error);
  }
}
