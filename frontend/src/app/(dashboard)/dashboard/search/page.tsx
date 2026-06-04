"use client";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matching/search/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: query.trim(), limit: 20 }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch { /* */ }
    setLoading(false);
  };

  const sampleFields = [
    "Machine Learning",
    "Vật liệu nano",
    "Công nghệ sinh học",
    "Năng lượng tái tạo",
    "Trí tuệ nhân tạo",
    "Y sinh học",
    "Blockchain",
    "IoT",
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tìm kiếm chuyên gia</h1>
        <p className="text-gray-500 mt-1">
          Tìm kiếm theo ngữ nghĩa — AI sẽ hiểu ý định và khớp nối chính xác
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="VD: Chuyên gia AI xử lý ảnh y tế ung thư phổi..."
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </form>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sampleFields.map((f) => (
          <button
            key={f}
            onClick={() => { setQuery(f); }}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Đang tìm kiếm với AI semantic matching...</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border">
          <span className="text-5xl mb-4 block">🔭</span>
          <p className="text-gray-900 font-medium text-lg">Chưa tìm thấy kết quả</p>
          <p className="text-gray-500 text-sm mt-1">Thử từ khóa khác hoặc mô tả chi tiết hơn</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{results.length} kết quả</p>
          {results.map((expert: any, idx: number) => (
            <div key={idx} className="bg-white rounded-xl border p-5 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold">{expert.full_name?.[0] || "?"}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{expert.full_name}</h3>
                  <p className="text-sm text-gray-500">{expert.title} — {expert.organization}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {expert.fields?.map((f: string) => (
                      <span key={f} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{f}</span>
                    ))}
                  </div>
                  {expert.score && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.round(expert.score * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(expert.score * 100)}% phù hợp</span>
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                  Kết nối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searched && (
        <div className="text-center py-16 bg-white rounded-xl border">
          <span className="text-5xl mb-4 block">🧠</span>
          <p className="text-gray-900 font-medium text-lg">Tìm kiếm bằng AI</p>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Mô tả yêu cầu bằng ngôn ngữ tự nhiên. AI sẽ phân tích ngữ nghĩa và
            khớp nối với chuyên gia phù hợp nhất.
          </p>
        </div>
      )}
    </div>
  );
}