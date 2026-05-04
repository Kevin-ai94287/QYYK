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
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>招生管理后台</h1>
        <AdminClient />
      </div>
    </div>
  );
}
