import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  const body = await req.json();

  const app = await prisma.application.create({
    data: {
      name: body.name,
      phone: body.phone,
      course: body.course,
      amount: body.amount,
    },
  });

  const orderNo = Date.now().toString();

  await prisma.order.create({
    data: {
      orderNo,
      applicationId: app.id,
      amount: body.amount,
    },
  });

  return NextResponse.json({
    orderNo,
    payUrl: `/pay?orderNo=${orderNo}`,
  });
}
