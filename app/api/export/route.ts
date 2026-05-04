import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { application: true },
  });

  function getStatusText(status: string) {
    if (status === "unpaid") return "未支付";
    if (status === "pending_confirm") return "待人工确认";
    if (status === "paid") return "已确认支付";
    return status;
  }

  let csv = "订单号,下单时间,学生姓名,学生电话,联系人姓名,联系人电话,联系人身份,课程,金额,状态,凭证编号,是否核销\n";

  orders.forEach((o) => {
    const a = o.application;
    csv += `${o.orderNo},${new Date(o.createdAt).toLocaleString("zh-CN")},${a.studentName || a.name},${a.studentPhone || ""},${a.contactName || a.name},${a.contactPhone || a.phone},${a.contactRelation || ""},${a.course},${o.amount},${getStatusText(o.status)},${o.couponCode || ""},${o.couponUsed ? "已核销" : "未核销"}\n`;
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
    },
  });
}
