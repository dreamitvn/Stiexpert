"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [experts, setExperts] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, assets: 0, listings: 0, fields: 22 });

  useEffect(() => {
    fetch(`${API}/passport/experts/?limit=3`)
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((data) => setExperts(data.results || data))
      .catch(() => {});
    fetch(`${API}/passport/experts/stats/`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(s => ({ ...s, users: data.total_experts, fields: data.fields_count || 22 })); })
      .catch(() => {});
    fetch(`${API}/marketplace/ip-assets/stats/`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(s => ({ ...s, assets: data.total_assets, listings: data.total_listings })); })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/experts?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            STI-Expert v2.0 - Tích hợp Blockchain & AI
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Nền tảng Kết nối <span className="text-sky-600">Chuyên gia</span>
            <br />
            Khoa học & Công nghệ
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Mạng lưới hơn {stats.users > 0 ? stats.users.toLocaleString() : "6,800"}+ chuyên gia, trí thức và nhà khoa học hàng đầu.
            Tìm kiếm, trao đổi tri thức và giao dịch tài sản sở hữu trí tuệ một cách minh bạch.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-sky-100 flex items-center mb-10 border border-gray-100">
            <span className="pl-4 pr-2 text-2xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, lĩnh vực (VD: Blockchain, Nông nghiệp, Tài chính)..."
              className="flex-1 py-3 px-2 focus:outline-none text-gray-700 bg-transparent"
            />
            <button type="submit" className="bg-sky-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-sky-700 transition">
              Tìm kiếm
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition shadow-lg text-lg">
              Trở thành chuyên gia
            </Link>
            <Link href="/marketplace" className="px-8 py-3 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition border-2 border-sky-100 text-lg">
              Sàn giao dịch IP
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-t border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-1">{stats.users.toLocaleString()}+</div>
              <div className="text-gray-500 font-medium">Chuyên gia</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-1">{stats.fields}</div>
              <div className="text-gray-500 font-medium">Lĩnh vực chuyên môn</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-1">{stats.assets || 5}</div>
              <div className="text-gray-500 font-medium">Tài sản IP đã đúc</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-1">Blockchain</div>
              <div className="text-gray-500 font-medium">Xác thực DID/VC</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EXPERTS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Chuyên gia nổi bật</h2>
              <p className="text-gray-600">Những bộ óc hàng đầu được xác thực danh tính bởi STI-Expert.</p>
            </div>
            <Link href="/experts" className="hidden sm:inline-block text-sky-600 hover:text-sky-700 font-medium">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {experts.map((exp, idx) => (
              <Link href={`/experts/${exp.slug}`} key={idx} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-sky-200 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  {exp.avatar ? (
                    <img src={String(exp.avatar).startsWith("http") ? String(exp.avatar) : `https://v2.stiexpert.com${exp.avatar}`} className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100" alt="Avatar" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xl font-bold">
                      {(exp.full_name || "C")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-sky-600 transition">
                      {exp.full_name || "Chuyên gia"}
                      {exp.professional_verified && <span title="Tích xanh" className="ml-1 text-sm">✅</span>}
                      {exp.identity_verified && <span title="Tích vàng" className="ml-1 text-sm">🟡</span>}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{exp.bio || exp.title || exp.main_field || "Chuyên gia KHCN"}</p>
                  </div>
                </div>
                {exp.fields && exp.fields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.fields.slice(0, 3).map((f: any, i: number) => {
                      const label = typeof f === "string" ? f : f?.name;
                      return label ? (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{label}</span>
                      ) : null;
                    })}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
             <Link href="/experts" className="text-sky-600 font-medium hover:underline">Xem tất cả chuyên gia →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}