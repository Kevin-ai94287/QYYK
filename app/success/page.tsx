"use client";

import { useEffect, useState } from "react";

export default function Success() {
  const [orderNo, setOrderNo] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get("orderNo") || "";
    setOrderNo(no);

    if (no) {
      fetch("/api/order-status?orderNo=" + no)
        .then((res) => res.json())
        .then((data) => {
          setCode(data.couponCode || "");
        });
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>支付成功</h1>

      <p>订单号：{orderNo}</p>

      <h2>抵扣凭证编号</h2>

      <div
        style={{
          fontSize: 28,
          color: "green",
          fontWeight: "bold",
          margin: "20px 0",
        }}
      >
        {code || "生成中..."}
      </div>

      <p>到校出示此编号，可抵扣2000元学费</p>
    </div>
  );
}
