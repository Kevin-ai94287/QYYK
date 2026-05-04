import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  const body = await req.json();

  const app = await prisma.application.create({
    data: {
      name: body.studentName,
      phone: body.contactPhone,
      studentName: body.studentName,
      studentPhone: body.studentPhone || "",
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactRelation: body.contactRelation,
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
