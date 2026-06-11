"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface PassportItem {
  id: number | string;
  title?: string;
  name?: string;
  description?: string;
  type: "paper" | "patent" | "research";
}

const SOURCE_LABELS: Record<string, string> = {
  paper: "📄 Công trình khoa học",
  patent: "📜 Bằng sáng chế",
  research: "🔬 Kết quả nghiên cứu",
};

export default function MintIPPage() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState<PassportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PassportItem | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    abstract: "",
    keywords: "",
    category: "",
    is_fractionalized: false,
    total_fractions: "1",
    royalty_percentage: "5.0",
    is_confidential: false,
  });

  useEffect(() => {
    const t = localStorage.getItem("access") || "";
    setToken(t);
    if (!t) { setLoading(false); return; }

    // Fetch passport items (papers, patents, research results)
    Promise.all([
      fetch(`${API}/passport/papers/`, { headers: { Authorization: `Bearer ${t}` } }).then(r => r.ok ? r.json() : []).then(d => (d.results || d || []).map((p: any) => ({ ...p, type: "paper" as const }))),
      fetch(`${API}/passport/patents/`, { headers: { Authorization: `Bearer ${t}` } }).then(r => r.ok ? r.json() : []).then(d => (d.results || d || []).map((p: any) => ({ ...p, type: "patent" as const }))),
      fetch(`${API}/passport/research-results/`, { headers: { Authorization: `Bearer ${t}` } }).then(r => r.ok ? r.json() : []).then(d => (d.results || d || []).map((p: any) => ({ ...p, type: "research" as const }))),
    ]).then(([papers, patents, research]) => {
      setItems([...papers, ...patents, ...research]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const selectItem = (item: PassportItem) => {
    setSelected(item);
    setForm({
      ...form,
      title: item.title || item.name || "",
      description: item.description || "",
    });
  };

  const mint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setFeedback("Đang mint IP-NFT...");

    try {
      const payload = {
        source_type: selected.type,
        source_id: String(selected.id),
        title: form.title,
        description: form.description,
        abstract: form.abstract,
        keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
        category: form.category,
        is_fractionalized: form.is_fractionalized,
        total_fractions: Number(form.total_fractions) || 1,
        royalty_percentage: Number(form.royalty_percentage) || 5.0,
        is_confidential: form.is_confidential,
      };

      const res = await fetch(`${API}/marketplace/ip-assets/mint/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không mint được");
      setFeedback("✅ Đã mint IP-NFT thành công! Chuyển sang My IP Assets...");
      setTimeout(() => window.location.href = "/dashboard/my-assets", 1200);
    } catch (e: any) {
      setFeedback(`❌ ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mint IP-NFT</h1>
        <p className="text-gray-500 mb-8">
          Chuyển đổi công trình khoa học, bằng sáng chế, kết quả nghiên cứu từ Hộ chiếu Tri thức thành IP-NFT (ERC-721/ERC-1155).
        </p>

        {!token ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-800 mb-3">Vui lòng đăng nhập để mint IP-NFT.</p>
            <a href="/auth/login" className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700">Đăng nhập</a>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải hồ sơ năng lực...</div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Step 1: Select source */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">1. Chọn tài sản gốc</h2>
              {items.length === 0 ? (
                <div className="bg-white rounded-2xl border p-6 text-center">
                  <p className="text-gray-500 mb-3">Chưa có công trình nào trong Hộ chiếu Tri thức.</p>
                  <a href="/dashboard/edit-profile" className="text-sky-600 hover:underline text-sm">Thêm công trình</a>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => selectItem(item)}
                      className={`w-full text-left rounded-xl border p-4 transition ${
                        selected?.id === item.id && selected?.type === item.type
                          ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">{SOURCE_LABELS[item.type]}</div>
                      <div className="font-medium text-sm text-gray-900 line-clamp-2">
                        {item.title || item.name || `${item.type} #${item.id}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Configure & Mint */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold mb-4">2. Cấu hình IP-NFT</h2>
              {!selected ? (
                <div className="bg-white rounded-2xl border p-10 text-center text-gray-400">
                  ← Chọn một tài sản từ danh sách bên trái
                </div>
              ) : (
                <form onSubmit={mint} className="bg-white rounded-2xl border p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên IP-NFT *</label>
                    <input
                      required value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt (Abstract)</label>
                    <textarea
                      value={form.abstract}
                      onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
                      <input
                        value={form.keywords}
                        onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                        placeholder="AI, blockchain, KHCN"
                        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <input
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="Khoa học máy tính"
                        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  {/* Fractionalization */}
                  <div className="border-t pt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                      <input
                        type="checkbox"
                        checked={form.is_fractionalized}
                        onChange={(e) => setForm({ ...form, is_fractionalized: e.target.checked })}
                        className="rounded"
                      />
                      <span className="font-medium">Phân mảnh quyền sở hữu (Fractionalization)</span>
                    </label>
                    {form.is_fractionalized && (
                      <div className="ml-6">
                        <label className="block text-sm text-gray-600 mb-1">Số fractions</label>
                        <input
                          type="number" min="2" max="10000"
                          value={form.total_fractions}
                          onChange={(e) => setForm({ ...form, total_fractions: e.target.value })}
                          className="w-40 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Royalty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Royalty (%)</label>
                      <input
                        type="number" step="0.5" min="0" max="50"
                        value={form.royalty_percentage}
                        onChange={(e) => setForm({ ...form, royalty_percentage: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
                        <input
                          type="checkbox"
                          checked={form.is_confidential}
                          onChange={(e) => setForm({ ...form, is_confidential: e.target.checked })}
                          className="rounded"
                        />
                        🔒 Bảo mật ZKP
                      </label>
                    </div>
                  </div>

                  {feedback && <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{feedback}</div>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-3 text-sm font-bold text-white hover:from-sky-700 hover:to-blue-700 transition disabled:opacity-50"
                  >
                    {submitting ? "Đang mint..." : "🎨 Mint IP-NFT"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}