"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = { experts?: number; users?: number };
type CurrentUser = { email?: string; role?: string };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ experts: 205, users: 218 });
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try { setUser(JSON.parse(cachedUser)); } catch {}
    }

    const token = localStorage.getItem("access");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
    if (token) {
      fetch(`${apiBase}/auth/me/`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const u = d?.data || d;
          if (u?.role) setUser({ email: u.email, role: u.role });
        })
        .catch(() => {});
    }

    fetch("/api/v1/admin/stats/")
      .then((r) => r.json())
      .then((d) => setStats({ experts: d?.users?.experts ?? 205, users: d?.users?.total ?? 218 }))
      .catch(() => {});
  }, []);

  const canAccessAdmin = ["admin", "manager", "verification_staff"].includes(user?.role || "");

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="STI-Expert" className="h-10 w-auto" />
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Dashboard</div>
              <h1 className="text-2xl font-semibold text-slate-900">STI-Expert Console</h1>
            </div>
          </div>
          <Link href="/experts" className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Tìm chuyên gia</Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold">Hệ điều hành thị trường tri thức KHCN</h2>
          <p className="mt-3 max-w-2xl text-blue-100">Kết nối chuyên gia, doanh nghiệp, xác thực hồ sơ, matching AI, quản lý yêu cầu tư vấn.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Experts</div><div className="mt-2 text-3xl font-bold">{stats.experts}</div></div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Users</div><div className="mt-2 text-3xl font-bold">{stats.users}</div></div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Requests</div><div className="mt-2 text-3xl font-bold">0</div></div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Verified</div><div className="mt-2 text-3xl font-bold">0</div></div>
        </div>

        <div className={`grid gap-6 ${canAccessAdmin ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          <Link href="/experts" className="rounded-2xl border bg-white p-6 shadow-sm hover:border-blue-300"><div className="text-3xl">🔎</div><h3 className="mt-4 font-semibold">Tìm chuyên gia</h3><p className="mt-2 text-sm text-slate-500">Tra cứu 205 hồ sơ chuyên gia.</p></Link>
          <Link href="/dashboard/profile" className="rounded-2xl border bg-white p-6 shadow-sm hover:border-blue-300"><div className="text-3xl">🪪</div><h3 className="mt-4 font-semibold">Hộ chiếu tri thức</h3><p className="mt-2 text-sm text-slate-500">Xem toàn bộ thông tin hồ sơ.</p></Link>
          <Link href="/dashboard/edit-profile" className="rounded-2xl border bg-white p-6 shadow-sm hover:border-blue-300"><div className="text-3xl">✏️</div><h3 className="mt-4 font-semibold">Chỉnh sửa hồ sơ</h3><p className="mt-2 text-sm text-slate-500">Cập nhật năng lực, học vị, tổ chức.</p></Link>
          {canAccessAdmin && (
            <Link href="/dashboard/admin" className="rounded-2xl border bg-white p-6 shadow-sm hover:border-blue-300"><div className="text-3xl">⚙️</div><h3 className="mt-4 font-semibold">Admin console</h3><p className="mt-2 text-sm text-slate-500">Quản trị hệ thống.</p></Link>
          )}
        </div>
      </main>
    </div>
  );
}
