"use client";
import { useEffect, useState } from "react";

interface Stats {
  profile_completeness: number;
  publications: number;
  credentials: number;
  connections: number;
  pending_requests: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    profile_completeness: 35,
    publications: 0,
    credentials: 0,
    connections: 0,
    pending_requests: 0,
  });
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch { /* */ }
    }
    // TODO: fetch real stats from API
  }, []);

  const cards = [
    { label: "Hoàn thiện hồ sơ", value: `${stats.profile_completeness}%`, icon: "👤", color: "blue", link: "/dashboard/profile" },
    { label: "Ấn phẩm khoa học", value: stats.publications, icon: "📄", color: "emerald", link: "/dashboard/documents" },
    { label: "Chứng chỉ xác thực", value: stats.credentials, icon: "🏅", color: "amber", link: "/dashboard/documents" },
    { label: "Kết nối", value: stats.connections, icon: "🤝", color: "purple", link: "/dashboard/connections" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào{user?.email ? `, ${user.email}` : ""} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Đây là tổng quan hoạt động của bạn trên STI-Expert
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.link}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${card.color}-50 text-${card.color}-700`}>
                {card.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </a>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bắt đầu nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/dashboard/profile"
            className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition"
          >
            <span className="text-2xl">✏️</span>
            <div>
              <p className="font-medium text-gray-900">Hoàn thiện hồ sơ</p>
              <p className="text-sm text-gray-500">Thêm thông tin học vấn, kinh nghiệm</p>
            </div>
          </a>
          <a
            href="/dashboard/documents"
            className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 transition"
          >
            <span className="text-2xl">📤</span>
            <div>
              <p className="font-medium text-gray-900">Tải lên ấn phẩm</p>
              <p className="text-sm text-gray-500">Upload bài báo, bằng sáng chế</p>
            </div>
          </a>
          <a
            href="/dashboard/search"
            className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition"
          >
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-medium text-gray-900">Tìm chuyên gia</p>
              <p className="text-sm text-gray-500">Tìm kiếm theo lĩnh vực KHCN</p>
            </div>
          </a>
        </div>
      </div>

      {/* Pending requests */}
      {stats.pending_requests > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">
            📋 {stats.pending_requests} yêu cầu đang chờ
          </h2>
          <p className="text-amber-600 text-sm">
            Bạn có yêu cầu kết nối hoặc tư vấn mới chưa xử lý.
          </p>
          <a href="/dashboard/requests" className="inline-block mt-3 text-sm font-medium text-amber-700 hover:text-amber-800">
            Xem tất cả →
          </a>
        </div>
      )}

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
        <div className="text-center py-8 text-gray-400">
          <span className="text-4xl mb-3 block">📭</span>
          <p>Chưa có hoạt động nào</p>
          <p className="text-sm mt-1">Bắt đầu bằng cách hoàn thiện hồ sơ của bạn</p>
        </div>
      </div>
    </div>
  );
}