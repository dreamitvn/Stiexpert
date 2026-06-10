"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";

type Expert = {
  id: string;
  slug?: string;
  full_name: string;
  title?: string;
  organization?: string;
  avatar?: string;
  bio?: string;
  summary?: string;
  orcid?: string;
  google_scholar?: string;
  researchgate?: string;
  linkedin?: string;
  website?: string;
  email?: string;
  phone?: string;
  dob?: string;
  nationality?: string;
  degree?: string;
  main_field?: string;
  fields?: string[];
  professional_verified?: boolean;
  professional_verification_status?: string;
  professional_verification_note?: string;
  identity_verified?: boolean;
  identity_verification_status?: string;
  identity_verification_note?: string;
  vneid_verified?: boolean;
  id_card_verify_waiting?: boolean;
  papers?: { id: string; title: string; year: string; link?: string; cited_by?: string; source?: string }[];
  certificates?: { id: string; name: string; issuing_organization?: string; issue_date?: string }[];
  awards?: { id: string; name: string; org?: string; earn_date?: string }[];
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("access") : null;
}

export default function AdminProfileReviewsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Expert | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<"pro" | "id">("pro");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getToken();
    try {
      const res = await fetch(`${apiBase}/passport/experts/?limit=500`, {
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list: Expert[] = data.results || data || [];
      setExperts(list);
      if (selected) {
        const fresh = list.find((e) => e.id === selected.id);
        if (fresh) setSelected(fresh);
      }
    } catch (e: any) {
      setError(`Không tải được: ${e?.message || "unknown"}`);
    } finally {
      setLoading(false);
    }
  }, [selected?.id]);

  useEffect(() => { load(); }, []);

  const act = async (action: string, customNote?: string) => {
    if (!selected) return;
    const token = getToken();
    if (!token) return setError("Chưa đăng nhập");
    setBusy(action);
    setError("");
    try {
      const res = await fetch(`${apiBase}/passport/experts/${selected.id}/${action}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note: customNote ?? note }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setNote("");
      await load();
    } catch (e: any) {
      setError(`Lỗi: ${e?.message}`);
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return experts
      .filter((e) =>
        [e.full_name, e.title, e.organization].filter(Boolean).join(" ").toLowerCase().includes(s)
      )
      .filter((e) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "approved") return e.professional_verified || e.identity_verified;
        if (filterStatus === "pending") return !e.professional_verified && !e.identity_verified;
        if (filterStatus === "rejected")
          return e.professional_verification_status === "rejected" || e.identity_verification_status === "rejected";
        return true;
      });
  }, [experts, q, filterStatus]);

  const metrics = {
    total: experts.length,
    green: experts.filter((e) => e.professional_verified).length,
    gold: experts.filter((e) => e.identity_verified).length,
    pending: experts.filter((e) => !e.professional_verified && !e.identity_verified).length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-800 p-5 text-white shadow-sm">
        <div className="text-xs uppercase tracking-widest text-blue-100">Admin Panel · Duyệt hồ sơ</div>
        <h1 className="mt-1 text-xl font-bold">Xét duyệt Tích xanh / Tích vàng</h1>
        <p className="mt-0.5 text-sm text-blue-100">Chọn chuyên gia để xem chi tiết & duyệt.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Tổng hồ sơ", value: metrics.total, color: "text-slate-900" },
          { label: "✓ Tích xanh", value: metrics.green, color: "text-emerald-700" },
          { label: "✓ Tích vàng", value: metrics.gold, color: "text-amber-600" },
          { label: "Chờ duyệt", value: metrics.pending, color: "text-rose-600" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">{c.label}</div>
            <div className={`mt-1 text-2xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {/* Split layout */}
      <div className="flex gap-4 min-h-[600px]">
        {/* Left — Expert list */}
        <div className="w-80 flex-shrink-0 rounded-2xl border bg-white shadow-sm flex flex-col">
          <div className="p-3 border-b space-y-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tên, chức danh..."
              className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-1 text-xs">
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`rounded-full px-2.5 py-1 font-medium transition ${
                    filterStatus === f ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "Tất cả" : f === "pending" ? "Chờ" : f === "approved" ? "Đã duyệt" : "Từ chối"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {loading && <div className="p-6 text-center text-sm text-slate-400">Đang tải...</div>}
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => { setSelected(e); setNote(""); }}
                className={`w-full text-left p-3 hover:bg-blue-50 transition flex items-start gap-3 ${
                  selected?.id === e.id ? "bg-blue-50 border-l-2 border-blue-600" : ""
                }`}
              >
                {e.avatar ? (
                  <img src={e.avatar} className="h-9 w-9 rounded-full object-cover flex-shrink-0" alt="" />
                ) : (
                  <div className="flex h-9 w-9 rounded-full bg-blue-100 items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                    {e.full_name?.[0] || "E"}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{e.full_name}</div>
                  <div className="text-xs text-slate-500 truncate">{e.title || e.organization || "—"}</div>
                  <div className="mt-1 flex gap-1">
                    {e.professional_verified && (
                      <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">✓ Xanh</span>
                    )}
                    {e.identity_verified && (
                      <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-200">✓ Vàng</span>
                    )}
                    {!e.professional_verified && !e.identity_verified && (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">Chờ duyệt</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-400">Không tìm thấy chuyên gia.</div>
            )}
          </div>
        </div>

        {/* Right — Detail panel */}
        {selected ? (
          <div className="flex-1 rounded-2xl border bg-white shadow-sm overflow-auto">
            {/* Expert header */}
            <div className="p-5 border-b flex items-start gap-4">
              {selected.avatar ? (
                <img src={selected.avatar} className="h-16 w-16 rounded-full object-cover border-2 border-white shadow" alt="" />
              ) : (
                <div className="flex h-16 w-16 rounded-full bg-blue-100 items-center justify-center text-blue-700 text-2xl font-bold">
                  {selected.full_name?.[0] || "E"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900">{selected.full_name}</h2>
                  {selected.professional_verified && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">✓ Tích xanh</span>
                  )}
                  {selected.identity_verified && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">✓ Tích vàng</span>
                  )}
                </div>
                <div className="text-sm text-slate-600 mt-0.5">{selected.title} · {selected.organization}</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selected.orcid && (
                    <a href={`https://orcid.org/${selected.orcid}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline">🔗 ORCID</a>
                  )}
                  {selected.google_scholar && (
                    <a href={selected.google_scholar} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline">🎓 Scholar</a>
                  )}
                  {selected.researchgate && (
                    <a href={selected.researchgate} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline">🔬 ResearchGate</a>
                  )}
                  {selected.linkedin && (
                    <a href={selected.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline">💼 LinkedIn</a>
                  )}
                  <Link href={`/experts/${selected.slug || selected.id}`} target="_blank"
                    className="text-xs text-slate-500 hover:text-blue-600">↗ Xem public</Link>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-5">
              {(["pro", "id"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                    tab === t ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}>
                  {t === "pro" ? "🟢 Tích xanh chuyên môn" : "🟡 Tích vàng danh tính"}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-5">
              {tab === "pro" ? (
                <>
                  {/* Split: khai báo vs bằng chứng */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-3">📋 Thông tin chuyên môn khai báo</div>
                      <dl className="space-y-2 text-sm">
                        <Row label="Học vị" value={selected.degree} />
                        <Row label="Lĩnh vực chính" value={selected.main_field} />
                        <Row label="Lĩnh vực" value={selected.fields?.join(", ")} />
                        <Row label="Quốc tịch" value={selected.nationality} />
                        <Row label="Giới thiệu" value={selected.bio || selected.summary} />
                      </dl>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">🔍 Bằng chứng liên kết ngoài</div>
                      <div className="space-y-2">
                        {selected.orcid ? (
                          <a href={`https://orcid.org/${selected.orcid}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-blue-700 hover:bg-blue-50">
                            🔗 ORCID: {selected.orcid}
                          </a>
                        ) : <div className="text-xs text-slate-400">Chưa có ORCID</div>}
                        {selected.google_scholar ? (
                          <a href={selected.google_scholar} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-blue-700 hover:bg-blue-50">
                            🎓 Google Scholar
                          </a>
                        ) : <div className="text-xs text-slate-400">Chưa có Google Scholar</div>}
                        {selected.researchgate ? (
                          <a href={selected.researchgate} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-blue-700 hover:bg-blue-50">
                            🔬 ResearchGate
                          </a>
                        ) : <div className="text-xs text-slate-400">Chưa có ResearchGate</div>}
                      </div>
                    </div>
                  </div>

                  {/* Publications */}
                  {!!selected.papers?.length && (
                    <div className="rounded-xl border p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">📚 Bài báo / Công trình ({selected.papers.length})</div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selected.papers.map((p) => (
                          <div key={p.id} className="flex items-start justify-between gap-2 text-sm rounded-lg bg-slate-50 px-3 py-2">
                            <div>
                              <div className="font-medium text-slate-800 line-clamp-1">{p.title}</div>
                              <div className="text-xs text-slate-500">{p.year} · {p.source} {p.cited_by ? `· cited: ${p.cited_by}` : ""}</div>
                            </div>
                            {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline flex-shrink-0">Xem</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates */}
                  {!!selected.certificates?.length && (
                    <div className="rounded-xl border p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">🏅 Chứng chỉ ({selected.certificates.length})</div>
                      <div className="space-y-1">
                        {selected.certificates.map((c) => (
                          <div key={c.id} className="text-sm rounded-lg bg-slate-50 px-3 py-2">
                            <span className="font-medium">{c.name}</span>
                            {c.issuing_organization && <span className="text-slate-500"> · {c.issuing_organization}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previous note */}
                  {selected.professional_verification_note && (
                    <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3 text-sm text-yellow-800">
                      <div className="font-medium text-xs mb-1">Ghi chú trước đó:</div>
                      {selected.professional_verification_note}
                    </div>
                  )}

                  {/* Action box */}
                  <div className="rounded-xl border p-4 space-y-3">
                    <div className="text-sm font-semibold text-slate-700">Quyết định duyệt tích xanh chuyên môn</div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú lý do (tùy chọn)..."
                      rows={2}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        disabled={!!busy || selected.professional_verified}
                        onClick={() => act("approve_professional")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                      >
                        {busy === "approve_professional" ? "Đang xử lý..." : "✓ Cấp tích xanh"}
                      </button>
                      <button
                        disabled={!!busy}
                        onClick={() => act("reject_professional")}
                        className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 transition"
                      >
                        {busy === "reject_professional" ? "Đang xử lý..." : "✗ Từ chối"}
                      </button>
                      {selected.professional_verified && (
                        <span className="self-center text-xs text-emerald-600 font-medium">✓ Đã cấp tích xanh</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Identity tab */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-3">🪪 Thông tin danh tính khai báo</div>
                      <dl className="space-y-2 text-sm">
                        <Row label="Email" value={selected.email} />
                        <Row label="Điện thoại" value={selected.phone} />
                        <Row label="Ngày sinh" value={selected.dob} />
                        <Row label="Quốc tịch" value={selected.nationality} />
                      </dl>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">🔒 Xác thực danh tính</div>
                      <div className="space-y-2 text-sm">
                        <div className={`rounded-lg px-3 py-2 ${selected.vneid_verified ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          VNeID: {selected.vneid_verified ? "✓ Đã liên kết" : "Chưa liên kết"}
                        </div>
                        <div className={`rounded-lg px-3 py-2 ${selected.id_card_verify_waiting ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                          CCCD: {selected.id_card_verify_waiting ? "⏳ Đang chờ xét duyệt" : "Chưa nộp"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selected.identity_verification_note && (
                    <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3 text-sm text-yellow-800">
                      <div className="font-medium text-xs mb-1">Ghi chú trước đó:</div>
                      {selected.identity_verification_note}
                    </div>
                  )}

                  <div className="rounded-xl border p-4 space-y-3">
                    <div className="text-sm font-semibold text-slate-700">Quyết định cấp tích vàng danh tính</div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú lý do (tùy chọn)..."
                      rows={2}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        disabled={!!busy || selected.identity_verified}
                        onClick={() => act("approve_identity")}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition"
                      >
                        {busy === "approve_identity" ? "Đang xử lý..." : "✓ Cấp tích vàng"}
                      </button>
                      <button
                        disabled={!!busy}
                        onClick={() => act("reject_identity")}
                        className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 transition"
                      >
                        {busy === "reject_identity" ? "Đang xử lý..." : "✗ Từ chối"}
                      </button>
                      {selected.identity_verified && (
                        <span className="self-center text-xs text-amber-600 font-medium">✓ Đã cấp tích vàng</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 rounded-2xl border bg-white shadow-sm flex items-center justify-center text-slate-400 text-sm">
            Chọn một chuyên gia để xem chi tiết và duyệt hồ sơ
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="min-w-[90px] font-medium text-slate-500">{label}:</dt>
      <dd className="text-slate-800 line-clamp-3">{value}</dd>
    </div>
  );
}
