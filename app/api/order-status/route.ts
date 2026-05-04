import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNo = searchParams.get("orderNo");

  const order = await prisma.order.findUnique({
    where: { orderNo: orderNo || undefined },
  });

  return Response.json({
    status: order?.status,
    couponCode: order?.couponCode,
  });
}
