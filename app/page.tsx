"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    course: "",
    amount: 100,
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    location.href = data.payUrl;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 30,
          background: "#1e293b",
          borderRadius: 10,
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>清元艺考报名</h1>

        <input
          placeholder="姓名"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="手机号"
          style={{ width: "100%", marginBottom: 10 }}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="">请选择课程</option>
          <option value="音乐">音乐</option>
          <option value="美术">美术</option>
          <option value="舞蹈">舞蹈</option>
        </select>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>学费定金：¥100</p>
          <p style={{ color: "#22c55e" }}>
            到校交全款时可抵扣2000元
          </p>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: loading ? "#166534" : "#22c55e",
            color: "#000",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 16,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "正在锁定名额..." : "立即锁定名额（100元定金）"}
        </button>
      </div>
    </div>
  );
}
