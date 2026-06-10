"use client";

import { useEffect, useMemo, useState } from "react";

type Expert = {
  id: string;
  slug?: string;
  full_name: string;
  title?: string;
  organization?: string;
  avatar?: string;
  professional_verified?: boolean;
  professional_verification_status?: string;
  identity_verified?: boolean;
  identity_verification_status?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

export default function AdminProfileReviewsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/passport/experts/?limit=300`, {
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setExperts(data.results || data || []);
    } catch (e: any) {
      setError(`Không tải được danh sách chuyên gia: ${e?.message || "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (expert: Expert, action: string) => {
    if (!token) return setError("Chưa đăng nhập");
    setBusy(`${expert.id}-${action}`);
    setError("");
    try {
      const res = await fetch(`${apiBase}/passport/experts/${expert.id}/${action}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note: action.includes("professional") ? "Duyệt chuyên môn từ Admin Panel" : "Duyệt danh tính từ Admin Panel" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
    } catch (e: any) {
      setError(`Thao tác lỗi: ${e?.message || "unknown"}`);
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return experts.filter((e) => [e.full_name, e.title, e.organization].filter(Boolean).join(" ").toLowerCase().includes(s));
  }, [experts, q]);

  const metrics = {
    total: experts.length,
    green: experts.filter((e) => e.professional_verified).length,
    gold: experts.filter((e) => e.identity_verified).length,
    pendingGreen: experts.filter((e) => !e.professional_verified).length,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-blue-800 p-6 text-white shadow-sm">
        <div className="text-sm uppercase tracking-widest text-blue-100">Admin Panel</div>
        <h1 className="mt-2 text-2xl font-bold">Duyệt hồ sơ chuyên gia</h1>
        <p className="mt-1 text-blue-100">Cấp tích xanh chuyên môn + tích vàng danh tính.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card label="Tổng hồ sơ" value={metrics.total} />
        <Card label="Tích xanh" value={metrics.green} tone="emerald" />
        <Card label="Tích vàng" value={metrics.gold} tone="amber" />
        <Card label="Chờ duyệt xanh" value={metrics.pendingGreen} tone="rose" />
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên, chức danh, tổ chức..." className="w-full max-w-lg rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={load} className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">Tải lại</button>
        </div>
        {loading && <div className="py-8 text-center text-slate-500">Đang tải...</div>}
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-slate-600">
                <th className="p-3">Chuyên gia</th>
                <th className="p-3">Tổ chức</th>
                <th className="p-3">Tích xanh</th>
                <th className="p-3">Tích vàng</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {e.avatar ? <img src={e.avatar} className="h-10 w-10 rounded-full object-cover" alt="" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">{e.full_name?.[0] || "E"}</div>}
                      <div>
                        <div className="font-medium text-slate-900">{e.full_name}</div>
                        <div className="text-xs text-slate-500">{e.title || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{e.organization || "—"}</td>
                  <td className="p-3"><Badge ok={!!e.professional_verified} text={e.professional_verified ? "Đã cấp" : e.professional_verification_status || "pending"} color="green" /></td>
                  <td className="p-3"><Badge ok={!!e.identity_verified} text={e.identity_verified ? "Đã cấp" : e.identity_verification_status || "not_submitted"} color="yellow" /></td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button disabled={!!busy} onClick={() => act(e, "approve_professional")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Tích xanh</button>
                      <button disabled={!!busy} onClick={() => act(e, "approve_identity")} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Tích vàng</button>
                      <a href={`/experts/${e.slug || e.id}`} target="_blank" className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50">Xem</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, tone = "blue" }: { label: string; value: number; tone?: string }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-3xl font-bold text-slate-900">{value}</div></div>;
}

function Badge({ ok, text, color }: { ok: boolean; text: string; color: "green" | "yellow" }) {
  const cls = ok
    ? color === "green" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"
    : "bg-slate-50 text-slate-500 ring-slate-200";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}>{ok ? "✓ " : ""}{text}</span>;
}
