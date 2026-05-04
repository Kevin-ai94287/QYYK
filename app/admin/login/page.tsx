"use client";
import { useState } from "react";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  async function login() {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username: u, password: p }),
    });

    const data = await res.json();

    if (data.ok) {
      localStorage.setItem("login", "1");
      location.href = "/admin";
    } else {
      alert("登录失败");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>后台登录</h1>
      <input placeholder="账号" onChange={(e) => setU(e.target.value)} />
      <br />
      <input type="password" placeholder="密码" onChange={(e) => setP(e.target.value)} />
      <br />
      <button onClick={login}>登录</button>
    </div>
  );
}
