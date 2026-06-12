"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("");

  useEffect(() => {
    fetch(`${API}/news/categories/`).then((r) => r.ok ? r.json() : []).then((d) => setCategories(Array.isArray(d) ? d : d.results || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCat ? `${API}/news/articles/?category=${activeCat}` : `${API}/news/articles/`;
    fetch(url)
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((data) => setArticles(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCat]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b pt-12 pb-8 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tin tức & Tri thức</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cập nhật thông tin mới nhất về khoa học công nghệ, chính sách và chia sẻ từ các chuyên gia hàng đầu.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveCat("")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${!activeCat ? "bg-sky-50 text-sky-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                  Tất cả bài viết
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button onClick={() => setActiveCat(c.slug)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${activeCat === c.slug ? "bg-sky-50 text-sky-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    <span>{c.name}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{c.article_count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Đang tải tin tức...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-white border rounded-2xl">
              <span className="text-4xl">📰</span>
              <p className="mt-4 text-gray-500">Chưa có bài viết nào trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((a) => (
                <Link key={a.slug} href={`/news/${a.slug}`} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all flex flex-col">
                  {a.cover_image && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 relative">
                      <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {a.featured && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">Nổi bật</span>}
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{a.category_name}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{new Date(a.published_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition leading-tight line-clamp-2">
                      {a.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {a.summary}
                    </p>
                    <div className="flex items-center justify-between border-t pt-4 mt-auto">
                      <span className="text-sm font-medium text-gray-700">✍️ {a.author_display}</span>
                      <span className="text-sm font-medium text-sky-600 group-hover:underline">Đọc tiếp →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}