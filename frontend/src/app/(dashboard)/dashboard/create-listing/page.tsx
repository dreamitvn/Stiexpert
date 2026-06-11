"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Asset { id: string; title: string; source_type: string; category: string; }

export default function CreateListingPage() {
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    ip_asset_id: "",
    price: "",
    min_bid: "",
    is_negotiable: true,
    license_type: "non_exclusive",
    license_terms: "",
    license_duration_months: "",
  });

  useEffect(() => {
    const t = localStorage.getItem("access") || "";
    setToken(t);
    if (!t) { setLoading(false); return; }
    fetch(`${API}/marketplace/ip-assets/my_assets/`, {
      headers: { Authorization: `Bearer ${t}`, Accept: "application/json" },
    }).then((r) => r.ok ? r.json() : []).then(setAssets).finally(() => setLoading(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Đang tạo niêm yết...");
    try {
      const payload: any = {
        ip_asset_id: form.ip_asset_id,
        price: form.price,
        is_negotiable: form.is_negotiable,
        license_type: form.license_type,
        license_terms: form.license_terms,
      };
      if (form.min_bid) payload.min_bid = form.min_bid;
      if (form.license_duration_months) payload.license_duration_months = Number(form.license_duration_months);

      const res = await fetch(`${API}/marketplace/listings/create_listing/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tạo được niêm yết");
      setMessage("✅ Đã tạo niêm yết thành công");
      setTimeout(() => window.location.href = "/marketplace", 800);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo niêm yết IP</h1>
        <p className="text-gray-500 mb-8">Niêm yết IP-NFT với điều khoản cấp phép linh hoạt.</p>

        {!token ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            Vui lòng đăng nhập để tạo niêm yết.
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải IP Assets...</div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center">
            <div className="text-5xl mb-4">🎨</div>
            <h2 className="text-lg font-semibold mb-2">Bạn chưa có IP Asset</h2>
            <p className="text-gray-500 mb-6">Hãy mint IP-NFT từ công trình hoặc bằng sáng chế trước.</p>
            <a href="/dashboard/my-assets" className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700">
              Đi tới My IP Assets
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-2xl border p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IP Asset *</label>
              <select
                required
                value={form.ip_asset_id}
                onChange={(e) => setForm({ ...form, ip_asset_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Chọn tài sản IP</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá niêm yết (VND) *</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="50000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá đề xuất tối thiểu</label>
                <input
                  type="number"
                  value={form.min_bid}
                  onChange={(e) => setForm({ ...form, min_bid: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="30000000"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại cấp phép *</label>
                <select
                  value={form.license_type}
                  onChange={(e) => setForm({ ...form, license_type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="non_exclusive">Không độc quyền</option>
                  <option value="exclusive">Độc quyền</option>
                  <option value="transfer">Chuyển nhượng hoàn toàn</option>
                  <option value="research_only">Chỉ nghiên cứu</option>
                  <option value="commercial">Thương mại</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời hạn (tháng)</label>
                <input
                  type="number"
                  value={form.license_duration_months}
                  onChange={(e) => setForm({ ...form, license_duration_months: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Để trống = vĩnh viễn"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_negotiable}
                onChange={(e) => setForm({ ...form, is_negotiable: e.target.checked })}
                className="rounded"
              />
              Cho phép thương lượng / đặt giá
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Điều khoản cấp phép</label>
              <textarea
                value={form.license_terms}
                onChange={(e) => setForm({ ...form, license_terms: e.target.value })}
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Mô tả phạm vi sử dụng, quyền thương mại, điều kiện chuyển giao, bảo mật..."
              />
            </div>

            {message && <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{message}</div>}

            <button type="submit" className="w-full rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition">
              Tạo niêm yết
            </button>
          </form>
        )}
      </div>
    </div>
  );
}