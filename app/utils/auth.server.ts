import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "remix";

import { db } from "./db.server";

type LoginForm = {
  email: string;
  password: string;
};

export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return { id: user.id, email };
}

export async function signup({ email, password }: LoginForm) {
  const newUser = await db.user.create({
    data: {
      email,
      passwordHash: bcrypt.hashSync(password),
      name: email,
    },
  });

  return newUser;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();

  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null;

  return userId;
}

export async function getUserInfo(request: Request) {
  const userId = await getUserId(request);

  const targetUser = userId
    ? await db.user.findUnique({
        where: {
          id: userId,
        },
      })
    : null;

  return targetUser;
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`);
  }

  return userId;
}

export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
