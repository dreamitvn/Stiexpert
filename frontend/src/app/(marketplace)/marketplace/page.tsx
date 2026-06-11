"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Stats {
  total_assets: number;
  total_listings: number;
  total_transactions: number;
  total_volume: string;
}

interface Listing {
  id: string;
  price: string;
  license_type: string;
  license_terms: string;
  license_duration_months: number | null;
  status: string;
  featured: boolean;
  view_count: number;
  created_at: string;
  ip_asset_detail: {
    id: string;
    title: string;
    description: string;
    abstract: string;
    keywords: string[];
    category: string;
    source_type: string;
    is_fractionalized: boolean;
    total_fractions: number;
    available_fractions: number;
    fraction_price: string;
    royalty_percentage: string;
    is_confidential: boolean;
    owner_name: string;
    owner_sti_id: string;
    owner_verified: { professional: boolean; identity: boolean };
    thumbnail: string;
  };
  seller_name: string;
}

const TYPE_LABELS: Record<string, string> = {
  paper: "Công trình KH",
  patent: "Bằng sáng chế",
  invention: "Giải pháp",
  research: "Nghiên cứu",
  dataset: "Dữ liệu",
  software: "Phần mềm",
  other: "Khác",
};

const LICENSE_LABELS: Record<string, string> = {
  exclusive: "Độc quyền",
  non_exclusive: "Không độc quyền",
  transfer: "Chuyển nhượng",
  research_only: "Nghiên cứu",
  commercial: "Thương mại",
};

function formatVND(amount: string) {
  const n = parseFloat(amount);
  if (!n) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("vi-VN");
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const headers: HeadersInit = { Accept: "application/json" };

    Promise.all([
      fetch(`${API}/marketplace/listings/?limit=50`, { headers }).then((r) => r.ok ? r.json() : { results: [] }),
      fetch(`${API}/marketplace/ip-assets/stats/`, { headers }).then((r) => r.ok ? r.json() : null),
    ]).then(([listingsData, statsData]) => {
      const rows = Array.isArray(listingsData)
        ? listingsData
        : Array.isArray(listingsData?.results)
          ? listingsData.results
          : [];
      setListings(rows);
      setStats(statsData);
    }).catch(() => {
      setListings([]);
      setStats(null);
    }).finally(() => setLoading(false));
  }, []);

  const safeListings = Array.isArray(listings) ? listings : [];
  const filtered = safeListings
    .filter((l) => {
      if (search && !l.ip_asset_detail.title.toLowerCase().includes(search.toLowerCase()) &&
          !l.ip_asset_detail.description?.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter && l.ip_asset_detail.source_type !== typeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "price_high") return parseFloat(b.price) - parseFloat(a.price);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">
            🏛️ Sàn Giao dịch Sở hữu Trí tuệ
          </h1>
          <p className="text-sky-100 text-lg max-w-2xl">
            Mua bán, cấp phép và giao dịch tài sản trí tuệ từ các chuyên gia hàng đầu Việt Nam.
            Bảo vệ bằng Blockchain và Zero-Knowledge Proofs.
          </p>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold">{stats.total_assets}</div>
                <div className="text-xs text-sky-200">IP Assets</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold">{stats.total_listings}</div>
                <div className="text-xs text-sky-200">Đang niêm yết</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold">{stats.total_transactions}</div>
                <div className="text-xs text-sky-200">Giao dịch</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold font-mono">
                  {parseFloat(stats.total_volume) > 0
                    ? (parseFloat(stats.total_volume) / 1e6).toFixed(1) + "M"
                    : "—"}
                </div>
                <div className="text-xs text-sky-200">Tổng giá trị (VND)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tài sản IP..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="">Tất cả loại</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_low">Giá thấp → cao</option>
            <option value="price_high">Giá cao → thấp</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải sàn giao dịch...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 mb-4">Chưa có tài sản nào được niêm yết.</p>
            <a href="/dashboard/my-assets" className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition">
              Mint IP-NFT đầu tiên
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((listing) => {
              const ip = listing.ip_asset_detail;
              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  {/* Thumbnail */}
                  {ip.thumbnail ? (
                    <img src={ip.thumbnail} alt={ip.title} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-5xl">
                      {ip.source_type === "patent" ? "📜" : ip.source_type === "paper" ? "📄" : "🔬"}
                    </div>
                  )}

                  <div className="p-5">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="rounded-full bg-blue-50 text-blue-700 text-[11px] px-2.5 py-0.5 font-medium">
                        {TYPE_LABELS[ip.source_type] || ip.source_type}
                      </span>
                      <span className="rounded-full bg-purple-50 text-purple-700 text-[11px] px-2.5 py-0.5 font-medium">
                        {LICENSE_LABELS[listing.license_type] || listing.license_type}
                      </span>
                      {ip.is_fractionalized && (
                        <span className="rounded-full bg-amber-50 text-amber-700 text-[11px] px-2.5 py-0.5 font-medium">
                          🔹 Fractionalized
                        </span>
                      )}
                      {ip.owner_verified.professional && (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 font-medium">
                          ✓ Tích xanh
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{ip.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {ip.owner_name} · {ip.category || "—"}
                    </p>

                    {/* Description */}
                    {(ip.description || ip.abstract) && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {ip.abstract || ip.description}
                      </p>
                    )}

                    {/* Keywords */}
                    {ip.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {ip.keywords.slice(0, 4).map((kw, i) => (
                          <span key={i} className="rounded bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price + Action */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-lg font-bold text-sky-700">
                          {formatVND(listing.price)}
                        </div>
                        {ip.is_fractionalized && (
                          <div className="text-xs text-gray-500">
                            {ip.available_fractions}/{ip.total_fractions} fractions ·{" "}
                            {formatVND(ip.fraction_price)}/phần
                          </div>
                        )}
                      </div>
                      <a
                        href={`/marketplace/${listing.id}`}
                        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
                      >
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}