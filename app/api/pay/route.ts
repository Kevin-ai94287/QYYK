import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  const { orderNo } = await req.json();

  await prisma.order.update({
    where: { orderNo },
    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
