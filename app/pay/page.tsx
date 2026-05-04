"use client";

import { useEffect, useState } from "react";

export default function PayPage() {
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get("orderNo") || "";
    setOrderNo(no);
  }, []);

  async function pay() {
    await fetch("/api/pay", {
      method: "POST",
      body: JSON.stringify({ orderNo }),
    });

    location.href = "/success?orderNo=" + orderNo;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>订单号：{orderNo}</h1>

      <button onClick={pay}>模拟支付</button>
    </div>
  );
}
