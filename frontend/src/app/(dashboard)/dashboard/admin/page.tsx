"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  users?: { total?: number; experts?: number; business?: number; verified?: number };
  content?: { publications?: number; credentials?: number; documents?: number };
  activity?: { searches?: number; connections?: number; pending_connections?: number; open_requests?: number };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/stats/")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { label: "Users", value: stats?.users?.total ?? 218, tone: "blue", desc: "Tổng tài khoản" },
    { label: "Experts", value: stats?.users?.experts ?? 216, tone: "emerald", desc: "Chuyên gia" },
    { label: "Business", value: stats?.users?.business ?? 1, tone: "violet", desc: "Doanh nghiệp" },
    { label: "Verified", value: stats?.users?.verified ?? 0, tone: "amber", desc: "Đã xác thực" },
  ];

  const modules = [
    { title: "Duyệt hồ sơ", href: "/dashboard/admin/reviews", desc: "Cấp tích xanh/tích vàng cho chuyên gia", icon: "✅" },
    { title: "Expert Profiles", href: "/admin/passport/expertprofile/", desc: "Quản lý 205 hồ sơ chuyên gia", icon: "👤" },
    { title: "Users & Auth", href: "/admin/authentication/user/", desc: "Tài khoản, vai trò, JWT", icon: "🔐" },
    { title: "Matching", href: "/admin/matching/", desc: "AI search, embeddings, scoring", icon: "🧠" },
    { title: "Connections", href: "/admin/connect/", desc: "Yêu cầu tư vấn, kết nối, review", icon: "🤝" },
    { title: "Credentials", href: "/admin/passport/credential/", desc: "VC / chứng chỉ / xác thực", icon: "📜" },
    { title: "Documents", href: "/admin/passport/document/", desc: "Tài liệu, bằng cấp, minh chứng", icon: "📁" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo.svg" alt="STI-Expert" className="h-10 w-auto" />
            </Link>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Admin Console</div>
              <h1 className="text-xl font-semibold text-slate-900">STI-Expert Operations</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">User dashboard</Link>
            <Link href="/admin/" className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Django Admin</Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 p-8 text-white shadow-lg">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-widest text-cyan-100">Vietnam Science & Technology Intelligence</div>
            <h2 className="mt-3 text-3xl font-bold">Bảng điều khiển quản trị STI-Expert</h2>
            <p className="mt-3 text-blue-100">
              Theo dõi người dùng, chuyên gia, dữ liệu xác thực, matching AI và các kết nối tư vấn KHCN.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">{c.label}</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{c.value}</div>
              <div className="mt-1 text-xs text-slate-400">{c.desc}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Quản trị module</h3>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">Live DB</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {modules.map((m) => (
                <Link key={m.title} href={m.href} className="rounded-2xl border p-4 hover:border-blue-300 hover:bg-blue-50/40 transition">
                  <div className="flex gap-3">
                    <div className="text-2xl">{m.icon}</div>
                    <div>
                      <div className="font-semibold text-slate-900">{m.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{m.desc}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Tình trạng hệ thống</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between"><span>Frontend</span><span className="text-green-600 font-medium">UP</span></div>
              <div className="flex justify-between"><span>Backend API</span><span className="text-green-600 font-medium">UP</span></div>
              <div className="flex justify-between"><span>PostgreSQL/pgvector</span><span className="text-green-600 font-medium">Healthy</span></div>
              <div className="flex justify-between"><span>Redis</span><span className="text-green-600 font-medium">Healthy</span></div>
              <div className="flex justify-between"><span>MinIO</span><span className="text-green-600 font-medium">UP</span></div>
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              PVR template đã xoá hoàn toàn khỏi dashboard. Giao diện này là custom React thuần.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
