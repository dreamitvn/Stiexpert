"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
const PAGE_SIZE = 30;

export default function ExpertsPage() {
  return (
    <Suspense fallback={<ExpertsLoading />}>
      <ExpertsContent />
    </Suspense>
  );
}

function ExpertsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpertsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [inputVal, setInputVal] = useState(q);
  const [experts, setExperts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    setQuery(q);
    setInputVal(q);
    setPage(1);
  }, [q]);

  useEffect(() => {
    fetchExperts(query, 1);
  }, [query]);

  async function fetchExperts(search: string, pageNum: number) {
    setLoading(true);
    setPage(pageNum);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String((pageNum - 1) * PAGE_SIZE),
      });
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`${API}/passport/experts/?${params}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 30 },
      });
      if (!res.ok) { setExperts([]); setTotal(0); return; }
      const data = await res.json();
      const items = (data.results || data).filter((e: any) => !e.hide_info);
      setExperts(pageNum === 1 ? items : (prev) => [...prev, ...items]);
      setTotal(data.count || items.length);
    } catch {
      setExperts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (inputVal.trim()) params.q = inputVal.trim();
    const qs = new URLSearchParams(params).toString();
    router.push(qs ? `/experts?${qs}` : "/experts");
  }

  const hasMore = experts.length < total && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header + Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Chuyên gia</h1>
            <p className="text-gray-600 mt-1">{total > 0 ? `${total.toLocaleString()} chuyên gia` : "Tìm kiếm chuyên gia"}</p>
          </div>
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Tìm theo tên, tổ chức, lĩnh vực..."
                className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
                Tìm
              </button>
            </form>
            <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-blue-700 transition">
              Tham gia
            </Link>
          </div>
        </div>

        {/* Badges Legend */}
        <div className="flex gap-4 mb-6 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Tích xanh (chuyên môn)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-600">Tích vàng (VNeID)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-600">Chưa xác minh</span>
          </span>
        </div>

        {/* Expert Grid */}
        {loading && experts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : experts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-gray-500">Không tìm thấy chuyên gia nào.</p>
            <p className="text-gray-400 text-sm mt-2">Thử từ khóa khác hoặc xóa bộ lọc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {experts.map((exp) => (
              <Link
                key={exp.id}
                href={`/experts/${exp.slug || exp.id}`}
                className="block bg-white rounded-2xl border p-6 hover:shadow-lg hover:border-sky-200 transition"
              >
                <div className="flex items-start gap-4">
                  {exp.avatar ? (
                    <img
                      src={exp.avatar}
                      alt={exp.full_name}
                      className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = "none";
                        t.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${exp.avatar ? "hidden" : "bg-sky-100 text-sky-600"}`}>
                    {(exp.full_name || "E")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 line-clamp-2">{exp.full_name || "Chuyên gia"}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {exp.professional_verified && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Tích xanh</span>
                      )}
                      {exp.identity_verified && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">✓ Tích vàng (VNeID)</span>
                      )}
                      {!exp.professional_verified && !exp.identity_verified && (
                        <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-400">Chưa xác minh</span>
                      )}
                    </div>
                    {exp.title && <div className="text-sm text-gray-600 mt-1 line-clamp-2">{exp.title}</div>}
                    {exp.organization && <div className="text-sm text-gray-500 mt-1 line-clamp-1">{exp.organization}</div>}
                    {exp.main_field && (
                      <div className="mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-block">{exp.main_field}</div>
                    )}
                  </div>
                </div>
                {exp.bio && <p className="mt-4 text-sm text-gray-600 line-clamp-3">{exp.bio}</p>}
                <div className="mt-4 text-sm text-sky-600 font-medium">Xem hộ chiếu tri thức →</div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchExperts(query, page + 1)}
              disabled={loading}
              className="px-6 py-3 bg-white border text-sky-600 rounded-lg hover:bg-sky-50 transition disabled:opacity-50"
            >
              {loading ? "Đang tải..." : `Xem thêm (${total - experts.length} còn lại)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}