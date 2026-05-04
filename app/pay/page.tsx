"use client";

import { useEffect, useState } from "react";

export default function PayPage() {
  const [orderNo, setOrderNo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get("orderNo") || "";
    setOrderNo(no);
  }, []);

  async function submitConfirm() {
    setLoading(true);

    const res = await fetch("/api/submit-payment-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo }),
    });

    setLoading(false);

    if (res.ok) {
      location.href = "/waiting?orderNo=" + orderNo;
    } else {
      alert("提交失败，请联系工作人员");
    }
  }

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
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>支付定金</h1>

        <p>订单号：{orderNo}</p>

        <div
          style={{
            margin: "24px 0",
            padding: 20,
            background: "#020617",
            borderRadius: 12,
          }}
        >
          <h2 style={{ fontSize: 24, color: "#22c55e" }}>定金：¥100</h2>
          <p style={{ fontSize: 18 }}>到校报名可抵扣 ¥2000 学费</p>
        </div>

        <div
          style={{
            padding: 20,
            background: "#334155",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <h3>人工收款方式</h3>
          <p>请添加工作人员微信：13529305852</p>
          <p>付款备注：姓名 + 手机号</p>
          <p>支付完成后，点击下方按钮提交确认。</p>
        </div>

        <button
          onClick={submitConfirm}
          disabled={loading || !orderNo}
          style={{
            width: "100%",
            padding: 14,
            background: "#22c55e",
            color: "#000",
            borderRadius: 10,
            fontWeight: "bold",
            border: "none",
          }}
        >
          {loading ? "正在提交..." : "我已支付，提交确认"}
        </button>
      </div>
    </div>
  );
}
