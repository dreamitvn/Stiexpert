"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Request {
  id: string;
  title: string;
  description: string;
  required_fields: string[];
  budget_range: string;
  status: string;
  created_at: string;
  requester_name?: string;
}

export default function IncomingRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { setLoading(false); return; }
    fetch(`${API}/connect/requests/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((data) => setRequests(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">📨 Yêu cầu tư vấn</h1>
        <span className="text-sm text-gray-500">{requests.length} yêu cầu</span>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">Chưa có yêu cầu tư vấn nào.</p>
          <p className="text-sm text-gray-400 mt-2">Khi doanh nghiệp hoặc người dùng gửi yêu cầu, chúng sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="rounded-2xl border bg-white p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{req.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{req.description}</p>
                  {req.required_fields?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {req.required_fields.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-sky-50 text-sky-700 text-xs rounded-md">{f}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {req.budget_range && <span>💰 {req.budget_range}</span>}
                    <span>📅 {new Date(req.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor[req.status] || "bg-gray-100 text-gray-600"}`}>
                  {req.status === "open" ? "Mở" : req.status === "in_progress" ? "Đang xử lý" : req.status === "completed" ? "Hoàn tất" : req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}