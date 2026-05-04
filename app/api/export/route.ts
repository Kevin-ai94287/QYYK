import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { application: true },
  });

  let csv = "姓名,电话,课程,金额,状态,凭证编号,是否核销\n";

  orders.forEach((o) => {
    csv += `${o.application.name},${o.application.phone},${o.application.course},${o.amount},${o.status},${o.couponCode || ""},${o.couponUsed ? "已核销" : "未核销"}\n`;
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
    },
  });
}
