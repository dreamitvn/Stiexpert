"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Tx {
  id: string;
  listing_title: string;
  amount: string;
  royalty_amount: string;
  platform_fee: string;
  escrow_amount: string;
  status: string;
  tx_hash: string;
  escrow_contract: string;
  created_at: string;
  completed_at: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  escrow_funded: "Đã ký quỹ",
  delivered: "Đã chuyển giao",
  completed: "Hoàn thành",
  disputed: "Tranh chấp",
  refunded: "Hoàn tiền",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  escrow_funded: "bg-blue-50 text-blue-700",
  delivered: "bg-purple-50 text-purple-700",
  completed: "bg-emerald-50 text-emerald-700",
  disputed: "bg-red-50 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
  cancelled: "bg-gray-100 text-gray-700",
};

function formatVND(amount: string) {
  const n = parseFloat(amount || "0");
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(n);
}

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("access") || "";
    setToken(t);
    if (!t) { setLoading(false); return; }
    fetch(`${API}/marketplace/transactions/my_transactions/`, {
      headers: { Authorization: `Bearer ${t}`, Accept: "application/json" },
    }).then((r) => r.ok ? r.json() : []).then(setTxs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hợp đồng & Giao dịch</h1>
            <p className="text-gray-500 text-sm mt-1">Theo dõi ký quỹ, chuyển giao và phí tác quyền.</p>
          </div>
          <a href="/marketplace" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition">
            🏛️ Marketplace
          </a>
        </div>

        {!token ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            Vui lòng đăng nhập để xem giao dịch.
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : txs.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-lg font-semibold mb-2">Chưa có giao dịch</h2>
            <p className="text-gray-500 mb-6">Các giao dịch ký quỹ IP sẽ hiển thị tại đây.</p>
            <a href="/marketplace" className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition">
              Khám phá Marketplace
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Tài sản</th>
                    <th className="text-left px-5 py-3 font-medium">Số tiền</th>
                    <th className="text-left px-5 py-3 font-medium">Escrow</th>
                    <th className="text-left px-5 py-3 font-medium">Royalty</th>
                    <th className="text-left px-5 py-3 font-medium">Trạng thái</th>
                    <th className="text-left px-5 py-3 font-medium">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {txs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900 max-w-xs truncate">
                        {tx.listing_title}
                      </td>
                      <td className="px-5 py-4 text-gray-700">{formatVND(tx.amount)}</td>
                      <td className="px-5 py-4 text-gray-500">{formatVND(tx.escrow_amount)}</td>
                      <td className="px-5 py-4 text-gray-500">{formatVND(tx.royalty_amount)}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[tx.status] || "bg-gray-100 text-gray-700"}`}>
                          {STATUS_LABELS[tx.status] || tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}