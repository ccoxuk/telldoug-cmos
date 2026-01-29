import "./loadEnv.js";
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server';

const app = new Hono();

app.get("_api/health", (c) => {
  const version = process.env.APP_VERSION ?? process.env.npm_package_version ?? "unknown";
  return c.json({
    ok: true,
    uptimeSec: Math.floor(process.uptime()),
    version,
  });
});

app.post('_api/auth/register',async c => {
  try {
    const { handle } = await import("./endpoints/auth/register_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/auth/login',async c => {
  try {
    const { handle } = await import("./endpoints/auth/login_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/auth/session',async c => {
  try {
    const { handle } = await import("./endpoints/auth/session_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/auth/logout',async c => {
  try {
    const { handle } = await import("./endpoints/auth/logout_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})

app.post('_api/ai/chat',async c => {
  try {
    const { handle } = await import("./endpoints/ai/chat_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/jobs/list',async c => {
  try {
    const { handle } = await import("./endpoints/jobs/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/goals/list',async c => {
  try {
    const { handle } = await import("./endpoints/goals/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/events/list',async c => {
  try {
    const { handle } = await import("./endpoints/events/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/people/list',async c => {
  try {
    const { handle } = await import("./endpoints/people/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/skills/list',async c => {
  try {
    const { handle } = await import("./endpoints/skills/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/content/list',async c => {
  try {
    const { handle } = await import("./endpoints/content/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/jobs/create',async c => {
  try {
    const { handle } = await import("./endpoints/jobs/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/jobs/delete',async c => {
  try {
    const { handle } = await import("./endpoints/jobs/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/jobs/update',async c => {
  try {
    const { handle } = await import("./endpoints/jobs/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/feedback/list',async c => {
  try {
    const { handle } = await import("./endpoints/feedback/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/goals/create',async c => {
  try {
    const { handle } = await import("./endpoints/goals/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/goals/delete',async c => {
  try {
    const { handle } = await import("./endpoints/goals/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/goals/update',async c => {
  try {
    const { handle } = await import("./endpoints/goals/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/learning/list',async c => {
  try {
    const { handle } = await import("./endpoints/learning/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/projects/list',async c => {
  try {
    const { handle } = await import("./endpoints/projects/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/search/global',async c => {
  try {
    const { handle } = await import("./endpoints/search/global_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/tell-doug/query',async c => {
  try {
    const { handle } = await import("./endpoints/tell-doug/query_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/timeline/data',async c => {
  try {
    const { handle } = await import("./endpoints/timeline/data_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/events/create',async c => {
  try {
    const { handle } = await import("./endpoints/events/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/events/delete',async c => {
  try {
    const { handle } = await import("./endpoints/events/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/events/update',async c => {
  try {
    const { handle } = await import("./endpoints/events/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/people/create',async c => {
  try {
    const { handle } = await import("./endpoints/people/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/people/delete',async c => {
  try {
    const { handle } = await import("./endpoints/people/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/people/update',async c => {
  try {
    const { handle } = await import("./endpoints/people/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/skills/create',async c => {
  try {
    const { handle } = await import("./endpoints/skills/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/skills/delete',async c => {
  try {
    const { handle } = await import("./endpoints/skills/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/skills/update',async c => {
  try {
    const { handle } = await import("./endpoints/skills/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/content/create',async c => {
  try {
    const { handle } = await import("./endpoints/content/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/content/delete',async c => {
  try {
    const { handle } = await import("./endpoints/content/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/content/update',async c => {
  try {
    const { handle } = await import("./endpoints/content/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/dashboard/stats',async c => {
  try {
    const { handle } = await import("./endpoints/dashboard/stats_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/feedback/create',async c => {
  try {
    const { handle } = await import("./endpoints/feedback/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/feedback/delete',async c => {
  try {
    const { handle } = await import("./endpoints/feedback/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/feedback/update',async c => {
  try {
    const { handle } = await import("./endpoints/feedback/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/import/linkedin',async c => {
  try {
    const { handle } = await import("./endpoints/import/linkedin_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/learning/create',async c => {
  try {
    const { handle } = await import("./endpoints/learning/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/learning/delete',async c => {
  try {
    const { handle } = await import("./endpoints/learning/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/learning/update',async c => {
  try {
    const { handle } = await import("./endpoints/learning/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/projects/create',async c => {
  try {
    const { handle } = await import("./endpoints/projects/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/projects/delete',async c => {
  try {
    const { handle } = await import("./endpoints/projects/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/projects/update',async c => {
  try {
    const { handle } = await import("./endpoints/projects/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/achievements/list',async c => {
  try {
    const { handle } = await import("./endpoints/achievements/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/ai/draft-content',async c => {
  try {
    const { handle } = await import("./endpoints/ai/draft-content_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/ai/meeting-brief',async c => {
  try {
    const { handle } = await import("./endpoints/ai/meeting-brief_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/compensation/list',async c => {
  try {
    const { handle } = await import("./endpoints/compensation/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/institutions/list',async c => {
  try {
    const { handle } = await import("./endpoints/institutions/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/interactions/list',async c => {
  try {
    const { handle } = await import("./endpoints/interactions/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.get('_api/relationships/list',async c => {
  try {
    const { handle } = await import("./endpoints/relationships/list_GET.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/achievements/create',async c => {
  try {
    const { handle } = await import("./endpoints/achievements/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/achievements/delete',async c => {
  try {
    const { handle } = await import("./endpoints/achievements/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/achievements/update',async c => {
  try {
    const { handle } = await import("./endpoints/achievements/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/ai/career-narrative',async c => {
  try {
    const { handle } = await import("./endpoints/ai/career-narrative_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/compensation/create',async c => {
  try {
    const { handle } = await import("./endpoints/compensation/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/compensation/delete',async c => {
  try {
    const { handle } = await import("./endpoints/compensation/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/compensation/update',async c => {
  try {
    const { handle } = await import("./endpoints/compensation/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/institutions/create',async c => {
  try {
    const { handle } = await import("./endpoints/institutions/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/institutions/delete',async c => {
  try {
    const { handle } = await import("./endpoints/institutions/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/institutions/update',async c => {
  try {
    const { handle } = await import("./endpoints/institutions/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/interactions/create',async c => {
  try {
    const { handle } = await import("./endpoints/interactions/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/interactions/delete',async c => {
  try {
    const { handle } = await import("./endpoints/interactions/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/interactions/update',async c => {
  try {
    const { handle } = await import("./endpoints/interactions/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/relationships/create',async c => {
  try {
    const { handle } = await import("./endpoints/relationships/create_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/relationships/delete',async c => {
  try {
    const { handle } = await import("./endpoints/relationships/delete_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.post('_api/relationships/update',async c => {
  try {
    const { handle } = await import("./endpoints/relationships/update_POST.js");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response)) {
      return c.text("Invalid response format. handle should always return a Response object.", 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + (e instanceof Error ? e.message : String(e)), 500)
  }
})
app.use("/*", serveStatic({ root: "./static" }));
app.use('/*', serveStatic({ root: './dist' }))
app.get("*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/_api")) {
    return next();
  }
  return serveStatic({ path: "./dist/index.html" })(c, next);
});
const port = Number(process.env.PORT) || 3333;
serve({ fetch: app.fetch, port });
console.log(`Running at http://localhost:${port}`)
      
