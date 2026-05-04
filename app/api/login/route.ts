import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "123456") {
    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin", "1", {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ ok: false });
}
