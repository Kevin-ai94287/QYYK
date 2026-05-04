import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { application: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(orders);
}
