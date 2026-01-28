import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "td_session";
const SESSION_TTL_DAYS = 7;

export class AuthError extends Error {
  status: number;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
    this.status = 401;
  }
}

export const isAuthError = (error: unknown): error is AuthError =>
  error instanceof AuthError || (error instanceof Error && error.name === "AuthError");

const getAuthSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
};

const base64UrlEncode = (value: string) => Buffer.from(value).toString("base64url");
const base64UrlDecode = (value: string) => Buffer.from(value, "base64url").toString("utf8");

type SessionPayload = {
  userId: string;
  exp: number;
};

const signPayload = (payload: SessionPayload) => {
  const secret = getAuthSecret();
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};

const verifyPayload = (token: string): SessionPayload | null => {
  const secret = getAuthSecret();
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

export const createSessionToken = (userId: string) => {
  const expiresAt = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  return {
    token: signPayload({ userId, exp: expiresAt }),
    expiresAt,
  };
};

export const buildSessionCookie = (token: string, expiresAt: number) => {
  const maxAge = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
};

export const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export const getUserIdFromRequest = (request: Request) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)td_session=([^;]+)/);
  if (!match) return null;
  const payload = verifyPayload(match[1]);
  return payload?.userId ?? null;
};

export const requireUserId = (request: Request) => {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new AuthError("Unauthorized");
  }
  return userId;
};
