"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Expert {
  id: string;
  slug?: string;
  full_name: string;
  organization?: string;
  title?: string;
  degree?: string;
  fields?: string[];
  bio?: string;
  avatar?: string;
  publications_count?: number;
  credentials_count?: number;
  professional_verified?: boolean;
  identity_verified?: boolean;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      setError("");
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
        const res = await fetch(`${apiBase}/passport/experts/?limit=300`, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: Expert[] = data.results || data;
        setExperts(list);
      } catch (e: any) {
        setError(`Không tải được danh sách chuyên gia: ${e?.message || "unknown error"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return experts.filter((e) =>
      [e.full_name, e.organization, e.title, ...(e.fields || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [experts, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Chuyên gia</h1>
            <p className="text-gray-600 mt-1">{filtered.length} chuyên gia công khai</p>
          </div>
          <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium w-fit">Tham gia ngay</Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm theo tên, tổ chức, lĩnh vực..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <div className="text-center py-12">Đang tải...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((expert) => (
            <Link key={expert.id} href={`/experts/${expert.slug || expert.id}`} className="block bg-white rounded-2xl border p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                {expert.avatar ? (
                  <img
                    src={expert.avatar}
                    alt={expert.full_name}
                    className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl flex-shrink-0">
                    {expert.full_name?.[0] || "E"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 line-clamp-2">{expert.full_name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {expert.professional_verified && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Xanh</span>}
                    {expert.identity_verified && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">✓ Vàng</span>}
                  </div>
                  {expert.title && <div className="text-sm text-gray-600 mt-1 line-clamp-2">{expert.title}</div>}
                  {expert.organization && <div className="text-sm text-gray-500 mt-1 line-clamp-1">{expert.organization}</div>}
                  {!!expert.fields?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {expert.fields.slice(0, 3).map((field) => (
                        <span key={field} className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700">
                          {field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {expert.bio && <p className="mt-4 text-sm text-gray-600 line-clamp-4">{expert.bio}</p>}
              <div className="mt-4 text-sm text-blue-600 font-medium">Xem hộ chiếu tri thức →</div>
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">Không tìm thấy chuyên gia phù hợp.</div>
        )}
      </div>
    </div>
  );
}
