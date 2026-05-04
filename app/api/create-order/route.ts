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

  function generateOrderNo() {
    const now = new Date();

    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");

    const HH = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    const random = Math.floor(Math.random() * 900 + 100); // 3位随机数

    return `${YYYY}${MM}${DD}${HH}${mm}${ss}-${random}`;
  }

  const orderNo = generateOrderNo();

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
