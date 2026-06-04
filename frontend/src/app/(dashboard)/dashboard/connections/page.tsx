"use client";
import { useState } from "react";

interface Connection {
  id: string;
  expert_name: string;
  expert_org: string;
  expert_fields: string[];
  status: "pending" | "active" | "rejected";
  created_at: string;
  last_message?: string;
}

export default function ConnectionsPage() {
  const [tab, setTab] = useState<"active" | "pending" | "all">("all");
  const [connections, setConnections] = useState<Connection[]>([]);

  const filtered = connections.filter((c) => {
    if (tab === "all") return true;
    return c.status === tab;
  });

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Chờ chấp nhận", color: "bg-amber-50 text-amber-700" },
    active: { label: "Đang kết nối", color: "bg-emerald-50 text-emerald-700" },
    rejected: { label: "Từ chối", color: "bg-red-50 text-red-600" },
  };

  const handleAccept = async (id: string) => {
    const token = localStorage.getItem("access");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/connections/${id}/accept/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(connections.map((c) => c.id === id ? { ...c, status: "active" as const } : c));
    } catch { /* */ }
  };

  const handleReject = async (id: string) => {
    const token = localStorage.getItem("access");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/connections/${id}/reject/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(connections.map((c) => c.id === id ? { ...c, status: "rejected" as const } : c));
    } catch { /* */ }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🤝 Kết nối</h1>
        <p className="text-gray-500 mt-1">Quản lý kết nối với chuyên gia và doanh nghiệp</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {[
          { key: "all", label: "Tất cả" },
          { key: "active", label: "Đang kết nối" },
          { key: "pending", label: "Chờ duyệt" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.key === "pending" && connections.filter((c) => c.status === "pending").length > 0 && (
              <span className="ml-1.5 w-5 h-5 inline-flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                {connections.filter((c) => c.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Connection list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((conn) => {
            const s = statusConfig[conn.status];
            return (
              <div key={conn.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold text-lg">{conn.expert_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{conn.expert_name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-sm text-gray-500">{conn.expert_org}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {conn.expert_fields.map((f) => (
                        <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{f}</span>
                      ))}
                    </div>
                    {conn.last_message && (
                      <p className="text-sm text-gray-400 mt-1 truncate">💬 {conn.last_message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {conn.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(conn.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                        >
                          Chấp nhận
                        </button>
                        <button
                          onClick={() => handleReject(conn.id)}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {conn.status === "active" && (
                      <a
                        href={`/dashboard/messages?to=${conn.id}`}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        Nhắn tin
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-5xl mb-4 block">🤝</span>
          <p className="text-gray-900 font-medium text-lg">Chưa có kết nối nào</p>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Tìm kiếm chuyên gia phù hợp và gửi yêu cầu kết nối. Hoặc đăng yêu cầu tư vấn để nhận đề xuất tự động.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <a href="/dashboard/search" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              🔍 Tìm chuyên gia
            </a>
            <a href="/dashboard/requests" className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
              📋 Đăng yêu cầu
            </a>
          </div>
        </div>
      )}
    </div>
  );
}