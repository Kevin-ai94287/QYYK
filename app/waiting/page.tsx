"use client";

import { useEffect, useState } from "react";

export default function WaitingPage() {
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderNo(params.get("orderNo") || "");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#1e293b",
          borderRadius: 16,
          padding: 30,
        }}
      >
        <h1>已提交支付确认</h1>
        <p>订单号：{orderNo}</p>
        <p>工作人员确认收款后，将生成抵扣凭证编号。</p>
        <p>请保存订单号，方便后续查询。</p>
      </div>
    </div>
  );
}
