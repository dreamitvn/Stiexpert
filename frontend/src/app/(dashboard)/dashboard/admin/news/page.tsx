"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Article { id: string; slug: string; title: string; category_name: string; status: string; featured: boolean; views: number; published_at: string; author_display: string; }
interface Category { id: number; name: string; slug: string; }

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", content: "", cover_image: "", category: "", status: "draft", featured: false });

  const loadData = () => {
    const token = localStorage.getItem("access");
    fetch(`${API}/news/articles/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((d) => setArticles(Array.isArray(d) ? d : d.results || []))
      .catch(() => {});
    fetch(`${API}/news/categories/`)
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setCategories(Array.isArray(d) ? d : d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ title: a.title, summary: "", content: "", cover_image: "", category: "", status: a.status, featured: a.featured });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/news/articles/${editing.id}/` : `${API}/news/articles/`;
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bài viết này?")) return;
    const token = localStorage.getItem("access");
    await fetch(`${API}/news/articles/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadData();
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📰 Quản lý Tin tức</h1>
        <button onClick={() => { setEditing(null); setForm({ title: "", summary: "", content: "", cover_image: "", category: "", status: "draft", featured: false }); setShowForm(true); }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition text-sm">
          + Viết bài mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">{editing ? "Sửa bài viết" : "Bài viết mới"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="Nhập tiêu đề bài viết" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
              <textarea value={form.summary} onChange={(e) => setForm({...form, summary: e.target.value})} rows={2} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="Tóm tắt ngắn (hiển thị trong danh sách bài viết)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung (Markdown/Text)</label>
              <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={10} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="Nhập nội dung bài viết... Hỗ trợ Markdown: ## Heading, **bold**, *italic*, - bullet" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh bìa</label>
              <input value={form.cover_image} onChange={(e) => setForm({...form, cover_image: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500">
                  <option value="draft">Nháp</option>
                  <option value="published">Xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="w-5 h-5 accent-blue-600" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">Nổi bật (hiển thị trên trang chủ)</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
              {editing ? "Lưu thay đổi" : "Tạo bài viết"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50">Hủy</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-600">
              <th className="px-6 py-4 font-medium">Tiêu đề</th>
              <th className="px-6 py-4 font-medium">Danh mục</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium">Lượt xem</th>
              <th className="px-6 py-4 font-medium">Ngày đăng</th>
              <th className="px-6 py-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 line-clamp-1">{a.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">/news/{a.slug}</div>
                </td>
                <td className="px-6 py-4"><span className="text-sm text-gray-700">{a.category_name || "—"}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.status === "published" ? "bg-green-100 text-green-700" : a.status === "draft" ? "bg-gray-100 text-gray-600" : "bg-red-50 text-red-500"}`}>
                    {a.status === "published" ? "Đã xuất bản" : a.status === "draft" ? "Nháp" : "Lưu trữ"}
                  </span>
                  {a.featured && <span className="ml-1 px-2 py-1 bg-red-50 text-red-500 rounded-full text-xs">⭐</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{a.views}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{a.published_at ? new Date(a.published_at).toLocaleDateString("vi-VN") : "—"}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(a)} className="text-blue-600 hover:underline text-sm mr-3">Sửa</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline text-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && <div className="p-10 text-center text-gray-500">Chưa có bài viết nào.</div>}
      </div>
    </div>
  );
}