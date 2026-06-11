"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

const TYPE_LABELS: Record<string, string> = {
  paper: "Công trình KH", patent: "Bằng sáng chế",
  invention: "Giải pháp", research: "Nghiên cứu",
  dataset: "Dữ liệu", software: "Phần mềm", other: "Khác",
};
const LICENSE_LABELS: Record<string, string> = {
  exclusive: "Độc quyền", non_exclusive: "Không độc quyền",
  transfer: "Chuyển nhượng", research_only: "Chỉ nghiên cứu", commercial: "Thương mại",
};

function formatVND(n: number | string) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(n));
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMsg, setBidMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers: HeadersInit = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API}/marketplace/listings/${id}/`, { headers })
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  const placeBid = async () => {
    const token = localStorage.getItem("access");
    if (!token) { setFeedback("Vui lòng đăng nhập"); return; }
    if (!bidAmount) { setFeedback("Nhập số tiền đề xuất"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/marketplace/listings/${id}/place_bid/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: bidAmount, message: bidMsg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi");
      setFeedback("✅ Đã gửi đề xuất thành công!");
      setBidAmount("");
      setBidMsg("");
    } catch (e: any) {
      setFeedback(`❌ ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;
  if (!listing) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-gray-500 mb-4">Không tìm thấy niêm yết này.</p>
      <a href="/marketplace" className="text-sky-600 hover:underline">← Quay lại Marketplace</a>
    </div>
  );

  const ip = listing.ip_asset_detail;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/marketplace" className="hover:text-sky-600">Marketplace</a>
          <span>›</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{ip.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thumbnail */}
            {ip.thumbnail ? (
              <img src={ip.thumbnail} alt={ip.title} className="w-full h-64 object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl flex items-center justify-center text-7xl">
                {ip.source_type === "patent" ? "📜" : ip.source_type === "paper" ? "📄" : "🔬"}
              </div>
            )}

            {/* Title + badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="rounded-full bg-blue-50 text-blue-700 text-xs px-3 py-1 font-medium">
                  {TYPE_LABELS[ip.source_type] || ip.source_type}
                </span>
                <span className="rounded-full bg-purple-50 text-purple-700 text-xs px-3 py-1 font-medium">
                  {LICENSE_LABELS[listing.license_type] || listing.license_type}
                </span>
                {ip.is_fractionalized && (
                  <span className="rounded-full bg-amber-50 text-amber-700 text-xs px-3 py-1 font-medium">🔹 Fractionalized</span>
                )}
                {ip.is_confidential && (
                  <span className="rounded-full bg-gray-100 text-gray-600 text-xs px-3 py-1 font-medium">🔒 Bảo mật ZKP</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{ip.title}</h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-semibold mb-3">Mô tả</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {ip.abstract || ip.description || "Chưa có mô tả."}
              </p>
            </div>

            {/* Keywords */}
            {ip.keywords?.length > 0 && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-lg font-semibold mb-3">Từ khóa</h2>
                <div className="flex flex-wrap gap-2">
                  {ip.keywords.map((kw: string, i: number) => (
                    <span key={i} className="rounded-lg bg-gray-100 text-gray-700 text-sm px-3 py-1">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* License Terms */}
            {listing.license_terms && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-lg font-semibold mb-3">Điều khoản cấp phép</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.license_terms}</p>
              </div>
            )}

            {/* Token Info */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-semibold mb-3">Thông tin Token</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tiêu chuẩn:</span>
                  <p className="font-medium">{ip.token_standard}</p>
                </div>
                <div>
                  <span className="text-gray-500">Royalty:</span>
                  <p className="font-medium">{ip.royalty_percentage}%</p>
                </div>
                {ip.is_fractionalized && (
                  <>
                    <div>
                      <span className="text-gray-500">Tổng fractions:</span>
                      <p className="font-medium">{ip.total_fractions}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Còn lại:</span>
                      <p className="font-medium">{ip.available_fractions}</p>
                    </div>
                  </>
                )}
                {ip.token_id && (
                  <div>
                    <span className="text-gray-500">Token ID:</span>
                    <p className="font-mono font-medium">{ip.token_id}</p>
                  </div>
                )}
                {ip.zkp_proof_hash && (
                  <div className="col-span-2">
                    <span className="text-gray-500">ZKP Proof:</span>
                    <p className="font-mono text-xs text-gray-600 break-all">{ip.zkp_proof_hash}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <div className="text-3xl font-bold text-sky-700 mb-1">{formatVND(listing.price)}</div>
              {ip.is_fractionalized && (
                <p className="text-sm text-gray-500 mb-2">{formatVND(ip.fraction_price)} / fraction</p>
              )}
              {listing.is_negotiable && (
                <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 font-medium mb-4">
                  Có thể thương lượng
                </span>
              )}

              {/* Seller info */}
              <div className="border-t pt-4 mt-4">
                <p className="text-xs text-gray-500 mb-1">Người bán</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{listing.seller_name}</span>
                  {ip.owner_verified?.professional && <span title="Tích xanh">✅</span>}
                  {ip.owner_verified?.identity && <span title="Tích vàng">🟡</span>}
                </div>
                {ip.owner_sti_id && (
                  <p className="text-xs text-gray-400 font-mono mt-1">STI-ID: {ip.owner_sti_id}</p>
                )}
              </div>

              {/* License details */}
              <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Loại cấp phép</span>
                  <span className="font-medium">{LICENSE_LABELS[listing.license_type] || listing.license_type}</span>
                </div>
                {listing.license_duration_months && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thời hạn</span>
                    <span className="font-medium">{listing.license_duration_months} tháng</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Lượt xem</span>
                  <span className="font-medium">{listing.view_count}</span>
                </div>
              </div>

              {/* Bid form */}
              {listing.is_negotiable && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h3 className="font-semibold text-sm">Đặt giá đề xuất</h3>
                  <input
                    type="number"
                    placeholder="Số tiền (VND)"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <textarea
                    placeholder="Lời nhắn (tùy chọn)"
                    value={bidMsg}
                    onChange={(e) => setBidMsg(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    onClick={placeBid}
                    disabled={submitting}
                    className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition disabled:opacity-50"
                  >
                    {submitting ? "Đang gửi..." : "Gửi đề xuất"}
                  </button>
                  {feedback && <p className="text-sm text-gray-600">{feedback}</p>}
                </div>
              )}

              {/* Direct contact */}
              <button className="w-full mt-4 rounded-lg border-2 border-sky-600 text-sky-600 px-4 py-2.5 text-sm font-semibold hover:bg-sky-50 transition">
                💬 Liên hệ người bán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}