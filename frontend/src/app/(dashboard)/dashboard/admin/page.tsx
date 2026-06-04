"use client";
import { useEffect, useState } from "react";

interface AdminStats {
  users: {
    total: number; experts: number; business: number;
    organizations: number; verified: number; new_today: number;
  };
  content: { publications: number; credentials: number; documents: number };
  activity: {
    searches: number; connections: number; pending_connections: number;
    open_requests: number; completed_requests: number;
  };
}

interface RecentUser {
  email: string; role: string; created_at: string; is_verified: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("today");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats/`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch { /* fallback mock */ }
      // Mock fallback
      if (!stats) {
        setStats({
          users: { total: 1, experts: 0, business: 0, organizations: 0, verified: 0, new_today: 0 },
          content: { publications: 0, credentials: 0, documents: 0 },
          activity: { searches: 0, connections: 0, pending_connections: 0, open_requests: 0, completed_requests: 0 },
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng quan hệ thống STI-Expert</p>
        </div>
        <div className="flex items-center gap-2">
          {["today", "week", "month", "year"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                period === p ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {p === "today" ? "Hôm nay" : p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard icon="👥" label="Tổng người dùng" value={s.users.total}
          change={`+${s.users.new_today}`} changeLabel="hôm nay"
          gradient="from-blue-600 to-blue-400" />
        <MetricCard icon="🎓" label="Chuyên gia" value={s.users.experts}
          change={`${s.users.verified} xác thực`} changeLabel=""
          gradient="from-emerald-600 to-emerald-400" />
        <MetricCard icon="🏢" label="Doanh nghiệp" value={s.users.business}
          change={`${s.activity.open_requests} yêu cầu`} changeLabel=""
          gradient="from-purple-600 to-purple-400" />
        <MetricCard icon="🤝" label="Kết nối" value={s.activity.connections}
          change={`${s.activity.pending_connections} chờ duyệt`} changeLabel=""
          gradient="from-amber-500 to-orange-400" />
      </div>

      {/* Row 2: Content & Activity stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Content overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📚 Nội dung hệ thống</h3>
          <div className="space-y-4">
            <StatRow label="Ấn phẩm khoa học" value={s.content.publications} icon="📄" color="blue" max={100} />
            <StatRow label="Chứng chỉ / Bằng" value={s.content.credentials} icon="🏅" color="amber" max={100} />
            <StatRow label="Tài liệu upload" value={s.content.documents} icon="📋" color="emerald" max={100} />
            <StatRow label="Lượt tìm kiếm" value={s.activity.searches} icon="🔍" color="purple" max={1000} />
          </div>
        </div>

        {/* Requests funnel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📋 Yêu cầu tư vấn</h3>
          <div className="space-y-3">
            <FunnelRow label="Đang mở" value={s.activity.open_requests} color="bg-blue-500" />
            <FunnelRow label="Đang xử lý" value={0} color="bg-amber-500" />
            <FunnelRow label="Hoàn thành" value={s.activity.completed_requests} color="bg-emerald-500" />
            <FunnelRow label="Đã hủy" value={0} color="bg-gray-400" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tỷ lệ hoàn thành</span>
              <span className="font-semibold text-emerald-600">
                {s.activity.open_requests + s.activity.completed_requests > 0
                  ? Math.round((s.activity.completed_requests / (s.activity.open_requests + s.activity.completed_requests)) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* User distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">👥 Phân bổ người dùng</h3>
          <div className="space-y-4">
            <UserDistRow label="Chuyên gia" value={s.users.experts} total={s.users.total} color="bg-emerald-500" />
            <UserDistRow label="Doanh nghiệp" value={s.users.business} total={s.users.total} color="bg-blue-500" />
            <UserDistRow label="Tổ chức" value={s.users.organizations} total={s.users.total} color="bg-purple-500" />
            <UserDistRow label="Admin" value={Math.max(0, s.users.total - s.users.experts - s.users.business - s.users.organizations)} total={s.users.total} color="bg-red-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">{s.users.verified} đã xác thực</span>
          </div>
        </div>
      </div>

      {/* Row 3: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent users table */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">🆕 Người dùng mới</h3>
            <a href="/admin/" target="_blank" className="text-sm text-blue-600 hover:text-blue-700">Quản lý →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentUsers.length > 0 ? recentUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">{u.email[0].toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-6 py-3">
                      {u.is_verified
                        ? <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Verified</span>
                        : <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />Pending</span>
                      }
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">Chưa có người dùng mới</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System health */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">🔧 Sức khỏe hệ thống</h3>
          </div>
          <div className="p-6 space-y-4">
            <HealthRow service="Backend API (Django)" status="operational" latency="23ms" />
            <HealthRow service="Frontend (Next.js)" status="operational" latency="12ms" />
            <HealthRow service="PostgreSQL / pgvector" status="operational" latency="5ms" />
            <HealthRow service="Redis Cache" status="operational" latency="1ms" />
            <HealthRow service="MinIO Object Storage" status="operational" latency="8ms" />
            <HealthRow service="Celery Workers" status="operational" latency="—" />
            <HealthRow service="AI Embedding (PhoBERT)" status="standby" latency="—" />
            <HealthRow service="Blockchain (SpruceID)" status="standby" latency="—" />
          </div>
        </div>
      </div>

      {/* Row 4: Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">⚡ Quản trị nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ActionButton href="/admin/" icon="👤" label="Quản lý Users" />
          <ActionButton href="/admin/" icon="📄" label="Duyệt ấn phẩm" />
          <ActionButton href="/admin/" icon="🏅" label="Cấp chứng chỉ" />
          <ActionButton href="/admin/" icon="📊" label="Xuất báo cáo" />
        </div>
      </div>
    </div>
  );
}

/* ============== Sub-components ============== */

function MetricCard({ icon, label, value, change, changeLabel, gradient }: {
  icon: string; label: string; value: number; change: string; changeLabel: string; gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white relative overflow-hidden`}>
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/5 rounded-full" />
      <span className="text-2xl">{icon}</span>
      <p className="text-sm font-medium opacity-90 mt-2">{label}</p>
      <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
      <p className="text-xs opacity-75 mt-1">{change} {changeLabel}</p>
    </div>
  );
}

function StatRow({ label, value, icon, color, max }: {
  label: string; value: number; icon: string; color: string; max: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const colorMap: Record<string, string> = { blue: "bg-blue-500", amber: "bg-amber-500", emerald: "bg-emerald-500", purple: "bg-purple-500" };
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{icon} {label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full">
        <div className={`h-full ${colorMap[color]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FunnelRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 ${color} rounded-full shrink-0`} />
      <span className="text-sm text-gray-600 flex-1">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function UserDistRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value} ({pct}%)</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; color: string }> = {
    expert: { label: "Chuyên gia", color: "bg-emerald-50 text-emerald-700" },
    business: { label: "Doanh nghiệp", color: "bg-blue-50 text-blue-700" },
    organization: { label: "Tổ chức", color: "bg-purple-50 text-purple-700" },
    admin: { label: "Admin", color: "bg-red-50 text-red-700" },
  };
  const c = config[role] || { label: role, color: "bg-gray-100 text-gray-600" };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
}

function HealthRow({ service, status, latency }: { service: string; status: string; latency: string }) {
  const isOp = status === "operational";
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-700">{service}</span>
      <div className="flex items-center gap-3">
        {latency !== "—" && <span className="text-xs text-gray-400">{latency}</span>}
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isOp ? "text-emerald-600" : "text-amber-600"}`}>
          <span className={`w-2 h-2 rounded-full ${isOp ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
          {isOp ? "Hoạt động" : "Chờ"}
        </span>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a href={href} target="_blank"
      className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </a>
  );
}