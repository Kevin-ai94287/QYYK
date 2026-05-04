import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function generateCode() {
  return "QY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  const { orderNo } = await req.json();

  const code = generateCode();

  await prisma.order.update({
    where: { orderNo },
    data: {
      status: "paid",
      paidAt: new Date(),
      couponCode: code,
    },
  });

  return NextResponse.json({ ok: true });
}
