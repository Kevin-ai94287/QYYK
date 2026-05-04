"use client";
import { useEffect, useState } from "react";

const statusMap: Record<string, string> = {
  unpaid: "未支付",
  pending_confirm: "待人工确认",
  paid: "已确认支付",
};

export default function AdminClient() {
  const [orders, setOrders] = useState<any[]>([]);

  function load() {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmPayment(orderNo: string) {
    const res = await fetch("/api/admin/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo }),
    });
    if (res.ok) {
      load();
    } else {
      alert("确认失败");
    }
  }

  return (
    <>
      {orders.map((o: any) => (
        <div key={o.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10, paddingBottom: 10 }}>
          <p>姓名：{o.application.name}</p>
          <p>电话：{o.application.phone}</p>
          <p>课程：{o.application.course}</p>
          <p>金额：{o.amount}</p>
          <p>状态：{statusMap[o.status] || o.status}</p>
          {o.status === "pending_confirm" && (
            <button
              onClick={() => confirmPayment(o.orderNo)}
              style={{
                padding: "6px 14px",
                background: "#22c55e",
                color: "#000",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              确认已收款
            </button>
          )}
          {o.status === "paid" && (
            <p>凭证编号：{o.couponCode || "未生成"}</p>
          )}
        </div>
      ))}
    </>
  );
}
