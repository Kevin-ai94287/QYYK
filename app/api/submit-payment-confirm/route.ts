import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  const { orderNo } = await req.json();

  if (!orderNo) {
    return NextResponse.json({ message: "缺少订单号" }, { status: 400 });
  }

  await prisma.order.update({
    where: { orderNo },
    data: {
      status: "pending_confirm",
    },
  });

  return NextResponse.json({ ok: true });
}
