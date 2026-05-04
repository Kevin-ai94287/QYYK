import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClient from "./_client/page";

export default async function Admin() {
  const cookieStore = await cookies();
  const login = cookieStore.get("admin");

  if (!login) {
    redirect("/admin/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>订单后台</h1>
      <a
        href="/api/export"
        target="_blank"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "8px 16px",
          background: "#22c55e",
          color: "#000",
          textDecoration: "none",
          borderRadius: 4,
        }}
      >
        导出名单
      </a>
      <AdminClient />
    </div>
  );
}
