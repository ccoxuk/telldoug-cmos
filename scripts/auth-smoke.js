import superjson from "superjson";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3333";
const email = `smoke+${Date.now()}@example.com`;
const password = "SmokeTest!2345";

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

const requestJson = async (path, body) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: superjson.stringify(body),
  });
  const text = await res.text();
  return { res, text };
};

console.log(`Running auth smoke against: ${baseUrl}`);

// Register
{
  const { res, text } = await requestJson("/_api/auth/register", { email, password });
  if (!res.ok) {
    fail("register", `${res.status} ${text}`);
  }
  const setCookie = res.headers.get("set-cookie") || "";
  if (!setCookie) {
    fail("register set-cookie", "missing Set-Cookie header");
  }
  pass("register");
}

// Login
let sessionCookie = "";
{
  const { res, text } = await requestJson("/_api/auth/login", { email, password });
  if (!res.ok) {
    fail("login", `${res.status} ${text}`);
  }
  sessionCookie = res.headers.get("set-cookie") || "";
  if (!sessionCookie) {
    fail("login set-cookie", "missing Set-Cookie header");
  }
  pass("login");
}

// Session
{
  const res = await fetch(`${baseUrl}/_api/auth/session`, {
    headers: {
      Cookie: sessionCookie,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    fail("session", `${res.status} ${text}`);
  }
  pass("session");
}

// Logout
{
  const res = await fetch(`${baseUrl}/_api/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: sessionCookie,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    fail("logout", `${res.status} ${text}`);
  }
  pass("logout");
}

console.log("Auth smoke: PASS");
