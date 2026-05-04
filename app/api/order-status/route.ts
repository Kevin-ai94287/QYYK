import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNo = searchParams.get("orderNo");

  const order = await prisma.order.findUnique({
    where: { orderNo: orderNo || undefined },
    include: { application: true },
  });

  return Response.json({
    status: order?.status,
    couponCode: order?.couponCode,
  });
}
