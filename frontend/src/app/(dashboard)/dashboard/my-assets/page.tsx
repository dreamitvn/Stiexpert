"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface IPA {
  id: string;
  title: string;
  description: string;
  source_type: string;
  category: string;
  is_fractionalized: boolean;
  total_fractions: number;
  available_fractions: number;
  royalty_percentage: string;
  is_confidential: boolean;
  token_id: string;
  minted_at: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  paper: "Công trình KH", patent: "Bằng sáng chế",
  invention: "Giải pháp", research: "Nghiên cứu",
  dataset: "Dữ liệu", software: "Phần mềm", other: "Khác",
};

export default function MyAssetsPage() {
  const [assets, setAssets] = useState<IPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}
    const t = localStorage.getItem("access") || "";
    setToken(t);
    if (!t) { setLoading(false); return; }
    fetch(`${API}/marketplace/ip-assets/my_assets/`, {
      headers: { Authorization: `Bearer ${t}`, Accept: "application/json" },
    }).then((r) => r.ok ? r.json() : []).then(setAssets).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const isVerified = user ? true : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My IP Assets</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý tài sản trí tuệ của bạn</p>
          </div>
          <div className="flex gap-3">
            <a href="/dashboard/transactions" className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              📋 Giao dịch
            </a>
            {isVerified ? (
              <a href="/dashboard/create-listing" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition flex items-center gap-2">
                ➕ Tạo niêm yết
              </a>
            ) : (
              <div className="rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-700 border border-amber-200 flex items-center gap-2">
                ⚠️ Cần Tích xanh/Tích vàng để niêm yết
              </div>
            )}
          </div>
        </div>

        {!token && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-800 mb-3">Vui lòng đăng nhập để quản lý IP Assets.</p>
            <a href="/auth/login" className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700">
              Đăng nhập
            </a>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có IP Asset nào</h2>
            <p className="text-gray-500 mb-6">Mint IP-NFT từ công trình trong Hộ chiếu Tri thức của bạn.</p>
            {isVerified ? (
              <a href="/dashboard/create-listing" className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition">
                Mint IP-NFT đầu tiên
              </a>
            ) : (
              <div className="inline-block bg-gray-100 text-gray-500 px-6 py-3 rounded-lg">
                Cần xác minh Tích xanh/Tích vàng để mint
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-2xl border p-6 flex items-start gap-5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {asset.source_type === "patent" ? "📜" : asset.source_type === "paper" ? "📄" : "🔬"}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="rounded-full bg-blue-50 text-blue-700 text-[11px] px-2.5 py-0.5 font-medium">
                      {TYPE_LABELS[asset.source_type] || asset.source_type}
                    </span>
                    {asset.is_fractionalized && (
                      <span className="rounded-full bg-amber-50 text-amber-700 text-[11px] px-2.5 py-0.5 font-medium">
                        🔹 Fractionalized
                      </span>
                    )}
                    {asset.is_confidential && (
                      <span className="rounded-full bg-gray-100 text-gray-600 text-[11px] px-2.5 py-0.5 font-medium">
                        🔒 Confidential
                      </span>
                    )}
                    {asset.token_id && (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 font-medium">
                        NFT #{asset.token_id}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{asset.title}</h3>
                  {asset.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{asset.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                    {asset.category && <span>📁 {asset.category}</span>}
                    {asset.is_fractionalized && (
                      <span>🔹 {asset.available_fractions}/{asset.total_fractions} fractions</span>
                    )}
                    <span>💰 {asset.royalty_percentage}% royalty</span>
                    {asset.minted_at && <span>🕐 Minted {new Date(asset.minted_at).toLocaleDateString("vi-VN")}</span>}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <a href={`/marketplace/create-listing?asset=${asset.id}`} className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 text-center transition">
                    Niêm yết
                  </a>
                  <a href={`/dashboard/assets/${asset.id}`} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 text-center transition">
                    Chi tiết
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}