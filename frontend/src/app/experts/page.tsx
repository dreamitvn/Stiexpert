"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Expert {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passport/expert-profiles/?limit=50`, {
          headers: { "Accept": "application/json" }
        });
        if (!res.ok) throw new Error("Failed to load experts");
        const data = await res.json();
        // Map to simple list; real data has more fields but for demo use email or name
        const list: Expert[] = (data.results || data).map((e: any) => ({
          id: e.id || e.user_id,
          email: e.email || e.user?.email || "unknown",
          full_name: e.full_name || e.name || e.user?.email?.split("@")[0],
          role: e.role || "expert",
          is_verified: e.is_verified || true,
          created_at: e.created_at || new Date().toISOString(),
        }));
        setExperts(list);
      } catch (e: any) {
        setError("Không tải được danh sách chuyên gia. Đang dùng dữ liệu demo.");
        // Fallback demo data
        setExperts([
          { id: "1", email: "nguyen-van-a@university.edu.vn", full_name: "Nguyễn Văn A", role: "expert", is_verified: true, created_at: "2025-01-01" },
          { id: "2", email: "tran-thi-b@research.org", full_name: "Trần Thị B", role: "expert", is_verified: true, created_at: "2025-02-01" },
          { id: "3", email: "le-van-c@company.vn", full_name: "Lê Văn C", role: "expert", is_verified: false, created_at: "2025-03-01" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filtered = experts.filter(e =>
    e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Chuyên gia</h1>
            <p className="text-gray-600 mt-1">{filtered.length} chuyên gia (205+ trong DB thực)</p>
          </div>
          <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Tham gia ngay</Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <div className="text-center py-12">Đang tải...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((expert) => (
            <Link key={expert.id} href={`/experts/${expert.id}`} className="block bg-white rounded-2xl border p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl flex-shrink-0">
                  {expert.full_name?.[0] || expert.email[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{expert.full_name || expert.email}</div>
                  <div className="text-sm text-gray-500 truncate">{expert.email}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${expert.is_verified ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      {expert.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                    </span>
                    <span className="text-xs text-gray-400">Chuyên gia</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-blue-600 font-medium">Xem hồ sơ chi tiết →</div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">Không tìm thấy chuyên gia phù hợp.</div>
        )}
      </div>
    </div>
  );
}
