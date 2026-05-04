"use client";
import { useSearchParams } from "next/navigation";

export default function PayPage() {
  const params = useSearchParams();
  const orderNo = params.get("orderNo");

  async function pay() {
    await fetch("/api/pay", {
      method: "POST",
      body: JSON.stringify({ orderNo }),
    });
    location.href = "/success";
  }

  return (
    <div>
      <h1>订单号：{orderNo}</h1>
      <button onClick={pay}>模拟支付</button>
    </div>
  );
}
