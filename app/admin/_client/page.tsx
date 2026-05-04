"use client";
import { useEffect, useState } from "react";

export default function AdminClient() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <>
      {orders.map((o: any) => (
        <div key={o.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
          <p>姓名：{o.application.name}</p>
          <p>电话：{o.application.phone}</p>
          <p>课程：{o.application.course}</p>
          <p>金额：{o.amount}</p>
          <p>状态：{o.status}</p>
          <p>凭证编号：{o.couponCode || "未生成"}</p>
          <p>是否核销：{o.couponUsed ? "已使用" : "未使用"}</p>
        </div>
      ))}
    </>
  );
}
