"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

// CKEditor dynamic import (no SSR — requires browser window)
const CKEditorComponent = dynamic(() => import("./CKEditorWrapper"), { ssr: false, loading: () => <div className="h-64 border rounded-xl flex items-center justify-center text-gray-400">Đang tải trình soạn thảo...</div> });

interface Article {
  id: string; slug: string; title: string; summary: string; content: string;
  cover_image: string; category: number | null; category_name: string;
  status: string; featured: boolean; views: number; published_at: string;
}
interface Category {
  id?: number; name: string; slug: string; description: string; order: number;
}

const emptyForm = { title: "", summary: "", content: "", cover_image: "", category: "", status: "draft", featured: false };

export default function AdminNewsPage() {
  const [tab, setTab] = useState<"articles" | "categories">("articles");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [catForm, setCatForm] = useState<Category>({ name: "", slug: "", description: "", order: 0 });
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = localStorage.getItem("access");
    setToken(t);
    setReady(true);
  }, []);

  const loadArticles = () => {
    fetch(`${API}/news/articles/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(async r => {
        if (r.status === 401) { localStorage.removeItem("access"); localStorage.removeItem("refresh"); window.location.href = "/auth/login"; return { results: [] }; }
        return r.ok ? r.json() : { results: [] };
      })
      .then(d => setArticles(Array.isArray(d) ? d : d.results || []))
      .catch(() => setArticles([]));
  };
  const loadCategories = () => {
    // Public endpoint — no auth header
    fetch(`${API}/news/categories/`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setCategories(Array.isArray(d) ? d : d.results || []))
      .catch(() => setCategories([]));
  };
  const loadData = () => { setLoading(true); Promise.all([loadArticles(), loadCategories()]).finally(() => setLoading(false)); };
  useEffect(() => { if (ready) loadData(); }, [ready]);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!token) return null;
    const formData = new FormData();
    formData.append("upload", file);
    try {
      const res = await fetch(`${API}/news/articles/upload_image/`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { const d = await res.json(); return d.url; }
    } catch {}
    return null;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingCover(true);
    const url = await uploadImage(file);
    if (url) setForm(f => ({ ...f, cover_image: url }));
    setUploadingCover(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const payload = { ...form, category: form.category ? Number(form.category) : null };
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/news/articles/${editing.id}/` : `${API}/news/articles/`;
    try {
      const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(payload) });
      if (res.ok) { setShowForm(false); setEditing(null); setForm(emptyForm); loadArticles(); }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bài viết này?")) return;
    await fetch(`${API}/news/articles/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadArticles();
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ title: a.title, summary: a.summary || "", content: a.content || "", cover_image: a.cover_image || "", category: String(a.category || ""), status: a.status, featured: a.featured });
    setShowForm(true);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const method = editingCat?.id ? "PUT" : "POST";
    const url = editingCat?.id ? `${API}/news/categories/${editingCat.id}/` : `${API}/news/categories/`;
    try {
      const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(catForm) });
      if (res.ok) { setShowCatForm(false); setEditingCat(null); setCatForm({ name: "", slug: "", description: "", order: 0 }); loadCategories(); }
    } catch {}
  };

  const handleCatDelete = async (id: number) => {
    if (!confirm("Xóa danh mục này?")) return;
    await fetch(`${API}/news/categories/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadCategories();
  };

  const openCatEdit = (c: Category) => { setEditingCat(c); setCatForm({ name: c.name, slug: c.slug || "", description: c.description || "", order: c.order || 0 }); setShowCatForm(true); };
  const openCatNew = () => { setEditingCat(null); setCatForm({ name: "", slug: "", description: "", order: 0 }); setShowCatForm(true); };

  if (loading || !ready) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📰 Quản lý Tin tức</h1>
        <div className="flex gap-2">
          <button onClick={() => { setTab("articles"); setShowForm(false); setEditing(null); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === "articles" ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>📝 Bài viết</button>
          <button onClick={() => { setTab("categories"); setShowCatForm(false); setEditingCat(null); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === "categories" ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>📂 Danh mục</button>
        </div>
      </div>

      {/* ======= TAB: BÀI VIẾT ======= */}
      {tab === "articles" && (
        <>
          {!showForm && (
            <div className="flex justify-end">
              <button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition text-sm">+ Viết bài mới</button>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold">{editing ? "Sửa bài viết" : "Bài viết mới"}</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="Nhập tiêu đề bài viết" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                  <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} rows={2} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="Tóm tắt ngắn (hiển thị trong danh sách bài viết)" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bài viết</label>
                  <div className="border rounded-xl overflow-hidden">
                    <CKEditorComponent value={form.content} onChange={(v: string) => setForm(f => ({...f, content: v}))} token={token} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleCoverUpload} className="hidden" />
                  {form.cover_image ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border bg-gray-50">
                      <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white/90 px-2 py-1 rounded-lg text-xs hover:bg-white shadow">Đổi ảnh</button>
                        <button type="button" onClick={() => setForm(f => ({...f, cover_image: ""}))} className="bg-white/90 px-2 py-1 rounded-lg text-xs hover:bg-white shadow text-red-500">Xóa</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingCover} className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-sm">{uploadingCover ? "Đang tải..." : "Tải ảnh bìa lên"}</span>
                    </button>
                  )}
                </div>
                <div>
                  <div className="mb-1 block" />
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 text-sm">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 text-sm">
                        <option value="draft">Nháp</option>
                        <option value="published">Xuất bản</option>
                        <option value="archived">Lưu trữ</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 accent-blue-600" />
                    <label htmlFor="featured" className="text-sm text-gray-700">Nổi bật</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">{editing ? "Lưu thay đổi" : "Tạo bài viết"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50">Hủy</button>
              </div>
            </form>
          )}

          <div className="bg-white border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-600">
                  <th className="px-5 py-4 font-medium">Tiêu đề</th>
                  <th className="px-5 py-4 font-medium">Danh mục</th>
                  <th className="px-5 py-4 font-medium">Trạng thái</th>
                  <th className="px-5 py-4 font-medium">Lượt xem</th>
                  <th className="px-5 py-4 font-medium">Ngày đăng</th>
                  <th className="px-5 py-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{a.title}</div>
                      <div className="text-xs text-gray-400">/news/{a.slug}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{a.category_name || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.status === "published" ? "bg-green-100 text-green-700" : a.status === "draft" ? "bg-gray-100 text-gray-600" : "bg-red-50 text-red-500"}`}>
                        {a.status === "published" ? "Đã xuất bản" : a.status === "draft" ? "Nháp" : "Lưu trữ"}
                      </span>
                      {a.featured && <span className="ml-1 px-2 py-0.5 bg-red-50 text-red-500 rounded-full text-xs">⭐</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{a.views}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.published_at ? new Date(a.published_at).toLocaleDateString("vi-VN") : "—"}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(a)} className="text-blue-600 hover:underline text-sm">Sửa</button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline text-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {articles.length === 0 && <div className="p-10 text-center text-gray-500">Chưa có bài viết nào.</div>}
          </div>
        </>
      )}

      {/* ======= TAB: DANH MỤC ======= */}
      {tab === "categories" && (
        <>
          <div className="flex justify-end">
            <button onClick={openCatNew} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition text-sm">+ Thêm danh mục</button>
          </div>

          {showCatForm && (
            <form onSubmit={handleCatSubmit} className="bg-white border rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">{editingCat?.id ? "Sửa danh mục" : "Danh mục mới"}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                  <input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="VD: Công nghệ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={catForm.slug} onChange={e => setCatForm({...catForm, slug: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 text-gray-500" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                  <input type="number" value={catForm.order} onChange={e => setCatForm({...catForm, order: Number(e.target.value)})} min={0} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500" placeholder="Mô tả ngắn cho danh mục" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">{editingCat?.id ? "Lưu thay đổi" : "Tạo danh mục"}</button>
                <button type="button" onClick={() => { setShowCatForm(false); setEditingCat(null); }} className="px-6 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50">Hủy</button>
              </div>
            </form>
          )}

          <div className="bg-white border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-600">
                  <th className="px-5 py-4 font-medium">#</th>
                  <th className="px-5 py-4 font-medium">Tên danh mục</th>
                  <th className="px-5 py-4 font-medium">Slug</th>
                  <th className="px-5 py-4 font-medium">Thứ tự</th>
                  <th className="px-5 py-4 font-medium">Mô tả</th>
                  <th className="px-5 py-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">{c.slug}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{c.order || 0}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 line-clamp-1">{c.description || "—"}</td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button onClick={() => openCatEdit(c)} className="text-blue-600 hover:underline text-sm">Sửa</button>
                      <button onClick={() => c.id && handleCatDelete(c.id)} className="text-red-500 hover:underline text-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && <div className="p-10 text-center text-gray-500">Chưa có danh mục nào.</div>}
          </div>
        </>
      )}
    </div>
  );
}
