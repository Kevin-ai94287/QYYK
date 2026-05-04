"use client";
import { useEffect, useState, useMemo } from "react";

const statusMap: Record<string, string> = {
  unpaid: "未支付",
  pending_confirm: "待人工确认",
  paid: "已确认支付",
};

const statusColors: Record<string, string> = {
  unpaid: "#64748b",
  pending_confirm: "#eab308",
  paid: "#22c55e",
};

function getDisplayStatus(o: any): string {
  if (o.couponUsed) return "已核销";
  return statusMap[o.status] || o.status;
}

function getStatusColor(o: any): string {
  if (o.couponUsed) return "#3b82f6";
  return statusColors[o.status] || "#64748b";
}

export default function AdminClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
    if (res.ok) load();
    else alert("确认失败");
  }

  async function useCoupon(orderNo: string) {
    const res = await fetch("/api/admin/use-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo }),
    });
    if (res.ok) load();
    else alert("核销失败");
  }

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pendingConfirm = orders.filter((o) => o.status === "pending_confirm").length;
    const paid = orders.filter((o) => o.status === "paid" && !o.couponUsed).length;
    const used = orders.filter((o) => o.couponUsed).length;
    const depositTotal = orders
      .filter((o) => o.status === "paid")
      .reduce((s, o) => s + o.amount, 0);
    return { total, pendingConfirm, paid, used, depositTotal };
  }, [orders]);

  // Filtered orders
  const filtered = useMemo(() => {
    let list = orders;
    if (filter === "pending_confirm") list = list.filter((o) => o.status === "pending_confirm");
    else if (filter === "paid") list = list.filter((o) => o.status === "paid" && !o.couponUsed);
    else if (filter === "used") list = list.filter((o) => o.couponUsed);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((o) => {
        const a = o.application;
        return (
          o.orderNo.toLowerCase().includes(q) ||
          (a.studentName || a.name || "").toLowerCase().includes(q) ||
          (a.contactPhone || a.phone || "").includes(q) ||
          (o.couponCode || "").toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [orders, search, filter]);

  return (
    <div>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: "总报名数", value: stats.total, color: "#94a3b8" },
          { label: "待人工确认", value: stats.pendingConfirm, color: "#eab308" },
          { label: "已确认支付", value: stats.paid, color: "#22c55e" },
          { label: "已核销", value: stats.used, color: "#3b82f6" },
          { label: "定金合计", value: `¥${stats.depositTotal}`, color: "#a78bfa" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#1e293b",
              borderRadius: 10,
              padding: "16px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: "bold", color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <input
          placeholder="搜索订单号 / 学生姓名 / 电话 / 凭证编号"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
          }}
        />
        {["all", "pending_confirm", "paid", "used"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 14px",
              background: filter === f ? "#334155" : "transparent",
              color: "#fff",
              border: filter === f ? "1px solid #475569" : "1px solid #334155",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {f === "all" ? "全部" : f === "pending_confirm" ? "待确认" : f === "paid" ? "已支付" : "已核销"}
          </button>
        ))}
      </div>

      {/* Export */}
      <div style={{ marginBottom: 16 }}>
        <a
          href="/api/export"
          target="_blank"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "#22c55e",
            color: "#000",
            textDecoration: "none",
            borderRadius: 6,
            fontWeight: "bold",
            fontSize: 13,
          }}
        >
          导出名单
        </a>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#1e293b", textAlign: "left" }}>
              {["订单号", "下单时间", "学生姓名", "联系人电话", "联系人身份", "课程", "金额", "状态", "凭证编号", "操作"].map(
                (h) => (
                  <th key={h} style={{ padding: "10px 8px", color: "#94a3b8", fontWeight: 500, borderBottom: "1px solid #334155" }}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "10px 8px", color: "#22c55e", fontWeight: "bold", whiteSpace: "nowrap" }}>
                  {o.orderNo}
                </td>
                <td style={{ padding: "10px 8px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                  {new Date(o.createdAt).toLocaleString("zh-CN")}
                </td>
                <td style={{ padding: "10px 8px" }}>{o.application.studentName || o.application.name}</td>
                <td style={{ padding: "10px 8px" }}>{o.application.contactPhone || o.application.phone}</td>
                <td style={{ padding: "10px 8px" }}>{o.application.contactRelation || "-"}</td>
                <td style={{ padding: "10px 8px" }}>{o.application.course}</td>
                <td style={{ padding: "10px 8px" }}>¥{o.amount}</td>
                <td style={{ padding: "10px 8px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      background: getStatusColor(o) + "22",
                      color: getStatusColor(o),
                      fontWeight: 600,
                    }}
                  >
                    {getDisplayStatus(o)}
                  </span>
                </td>
                <td style={{ padding: "10px 8px", color: "#94a3b8" }}>{o.couponCode || "-"}</td>
                <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                  {o.status === "pending_confirm" && (
                    <button
                      onClick={() => confirmPayment(o.orderNo)}
                      style={{
                        padding: "4px 12px",
                        background: "#22c55e",
                        color: "#000",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      确认已收款
                    </button>
                  )}
                  {o.status === "paid" && !o.couponUsed && (
                    <button
                      onClick={() => useCoupon(o.orderNo)}
                      style={{
                        padding: "4px 12px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      核销凭证
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>暂无数据</div>
        )}
      </div>
    </div>
  );
}
