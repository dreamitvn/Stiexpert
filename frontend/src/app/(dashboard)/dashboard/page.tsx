"use client";
import { useEffect, useState } from "react";

interface DashboardStats {
  profile_completeness: number;
  publications: number;
  credentials: number;
  connections: number;
  pending_requests: number;
  recent_requests: any[];
  recent_activity: any[];
  user: any;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passport/profile/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Get user from localStorage
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        
        // Mock stats until API is fully ready
        setStats({
          profile_completeness: 0,
          publications: 0,
          credentials: 0,
          connections: 0,
          pending_requests: 0,
          recent_requests: [],
          recent_activity: [],
          user,
        });
      } catch { /* */ }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const user = stats?.user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {user?.full_name || user?.email?.split("@")[0] || "User"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Đây là tổng quan hoạt động của bạn trên STI-Expert
          {user?.role === "expert" && " — Chế độ Chuyên gia"}
          {user?.role === "business" && " — Chế độ Doanh nghiệp"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Hoàn thiện hồ sơ"
          value={stats?.profile_completeness ?? 0}
          unit="%"
          icon="👤"
          color="blue"
          href="/dashboard/profile"
        />
        <StatCard
          label="Ấn phẩm KH"
          value={stats?.publications ?? 0}
          icon="📄"
          color="emerald"
          href="/dashboard/documents"
        />
        <StatCard
          label="Chứng chỉ"
          value={stats?.credentials ?? 0}
          icon="🏅"
          color="amber"
          href="/dashboard/documents"
        />
        <StatCard
          label="Kết nối"
          value={stats?.connections ?? 0}
          icon="🤝"
          color="purple"
          href="/dashboard/connections"
        />
      </div>

      {/* Yêu cầu pending */}
      {(stats?.pending_requests ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-800">
                📋 {stats?.pending_requests} yêu cầu đang chờ
              </h3>
              <p className="text-amber-600 text-sm mt-1">
                Bạn có yêu cầu kết nối hoặc tư vấn mới cần xử lý
              </p>
            </div>
            <a
              href="/dashboard/requests"
              className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition"
            >
              Xem ngay
            </a>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Bắt đầu nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/dashboard/profile"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition"
          >
            <span className="text-2xl">✏️</span>
            <div>
              <p className="font-medium text-gray-900">Hoàn thiện hồ sơ</p>
              <p className="text-sm text-gray-500">Thêm thông tin học vấn, kinh nghiệm</p>
            </div>
          </a>
          <a
            href="/dashboard/documents"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 transition"
          >
            <span className="text-2xl">📤</span>
            <div>
              <p className="font-medium text-gray-900">Tải lên ấn phẩm</p>
              <p className="text-sm text-gray-500">Upload bài báo, bằng sáng chế</p>
            </div>
          </a>
          <a
            href="/dashboard/search"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition"
          >
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-medium text-gray-900">Tìm chuyên gia</p>
              <p className="text-sm text-gray-500">AI semantic search</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent activity + requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📋 Yêu cầu gần đây</h2>
            <a href="/dashboard/requests" className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả →</a>
          </div>
          <RequestList requests={stats?.recent_requests || []} />
        </div>

        {/* Recent connections */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">🤝 Kết nối mới</h2>
            <a href="/dashboard/connections" className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả →</a>
          </div>
          <ConnectionList />
        </div>
      </div>

      {/* System status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🔔 Trạng thái hệ thống</h2>
        <div className="space-y-3">
          {[
            { label: "Dịch vụ Backend API", status: "operational", color: "emerald" },
            { label: "AI Matching Engine", status: "operational", color: "emerald" },
            { label: "Hệ thống xác thực Blockchain", status: "operational", color: "emerald" },
            { label: "Lưu trữ tài liệu (MinIO)", status: "operational", color: "emerald" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Hoạt động
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, color, href }: {
  label: string; value: number; unit?: string; icon: string; color: string; href: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-600" },
  };
  const c = colorMap[color] || colorMap.blue;
  
  return (
    <a href={href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`${c.bg} ${c.text} text-xs font-medium px-2 py-1 rounded-full`}>
          {label}
        </span>
      </div>
      <div className="flex items-end gap-1">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {unit && <p className="text-lg text-gray-500 mb-1">{unit}</p>}
      </div>
      {color === "blue" && typeof value === "number" && value <= 100 && (
        <div className="mt-3">
          <div className="w-full h-1.5 bg-gray-100 rounded-full">
            <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${value}%` }} />
          </div>
        </div>
      )}
    </a>
  );
}

function RequestList({ requests }: { requests: any[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <span className="text-3xl mb-2 block">📭</span>
        <p className="text-sm">Chưa có yêu cầu nào</p>
        <a href="/dashboard/requests/new" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
          Tạo yêu cầu đầu tiên
        </a>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900 text-sm">{req.title}</p>
            <p className="text-xs text-gray-500">{req.status} • {req.created_at}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            req.status === "open" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}>
            {req.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConnectionList() {
  return (
    <div className="text-center py-8 text-gray-400">
      <span className="text-3xl mb-2 block">🤝</span>
      <p className="text-sm">Chưa có kết nối nào</p>
      <a href="/dashboard/search" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
        Tìm và kết nối với chuyên gia
      </a>
    </div>
  );
}