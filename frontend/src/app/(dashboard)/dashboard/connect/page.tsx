"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

export default function MyConnectionsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", required_fields: "", budget_range: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = () => {
    const token = localStorage.getItem("access");
    if (!token) { setLoading(false); return; }
    fetch(`${API}/connect/requests/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((data) => setRequests(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRequests(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("access");
    try {
      const res = await fetch(`${API}/connect/requests/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          required_fields: form.required_fields.split(",").map(s => s.trim()).filter(Boolean),
          budget_range: form.budget_range,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", description: "", required_fields: "", budget_range: "" });
        loadRequests();
      }
    } catch {}
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🔗 Kết nối chuyên gia</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition">
          + Tạo yêu cầu mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold text-lg">Tạo yêu cầu tìm chuyên gia</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="VD: Tìm chuyên gia Blockchain cho dự án DeFi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="Mô tả yêu cầu cụ thể, mục tiêu dự án..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực cần (phân cách bằng dấu phẩy)</label>
            <input value={form.required_fields} onChange={e => setForm({...form, required_fields: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="VD: Blockchain, Smart Contract, DeFi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngân sách dự kiến</label>
            <input value={form.budget_range} onChange={e => setForm({...form, budget_range: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="VD: 10-50 triệu VNĐ" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:opacity-50 transition">
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50 transition">Hủy</button>
          </div>
        </form>
      )}

      {requests.length === 0 && !showForm ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-4">🤝</div>
          <p className="text-gray-500">Chưa có yêu cầu kết nối nào.</p>
          <p className="text-sm text-gray-400 mt-2">Tạo yêu cầu để tìm chuyên gia phù hợp với nhu cầu của bạn.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="rounded-2xl border bg-white p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{req.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{req.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {req.budget_range && <span>💰 {req.budget_range}</span>}
                    <span>📅 {new Date(req.created_at).toLocaleDateString("vi-VN")}</span>
                    <span>🔗 {req.connections?.length || 0} kết nối</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {req.status === "open" ? "Mở" : req.status === "in_progress" ? "Đang xử lý" : "Hoàn tất"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}