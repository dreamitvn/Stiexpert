"use client";
import { useState } from "react";

interface ExpertiseRequest {
  id: string;
  title: string;
  description: string;
  budget_range: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  fields: string[];
  created_at: string;
  responses_count: number;
}

const mockRequests: ExpertiseRequest[] = [];

export default function RequestsPage() {
  const [requests, setRequests] = useState<ExpertiseRequest[]>(mockRequests);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    fields: [] as string[],
    budget_range: "",
    deadline: "",
  });
  const [newField, setNewField] = useState("");

  const handleCreate = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests([data, ...requests]);
        setShowCreate(false);
        setForm({ title: "", description: "", fields: [], budget_range: "", deadline: "" });
      }
    } catch { /* */ }
    setCreating(false);
  };

  const addField = () => {
    if (newField.trim() && !form.fields.includes(newField.trim())) {
      setForm({ ...form, fields: [...form.fields, newField.trim()] });
      setNewField("");
    }
  };

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    open: { label: "Đang mở", color: "bg-blue-50 text-blue-700", icon: "🟢" },
    in_progress: { label: "Đang xử lý", color: "bg-amber-50 text-amber-700", icon: "🟡" },
    completed: { label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700", icon: "✅" },
    cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-500", icon: "⛔" },
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 Yêu cầu tư vấn</h1>
          <p className="text-gray-500 mt-1">Đăng yêu cầu để tìm kiếm chuyên gia phù hợp</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Tạo yêu cầu
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-in">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tạo yêu cầu mới</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề yêu cầu *</label>
              <input
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Tư vấn ứng dụng AI trong kiểm tra chất lượng sản phẩm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả chi tiết *</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Mô tả rõ vấn đề, mục tiêu và kỳ vọng của bạn..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngân sách dự kiến</label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.budget_range}
                  onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
                >
                  <option value="">Chọn khoảng ngân sách</option>
                  <option value="under_5m">Dưới 5 triệu VNĐ</option>
                  <option value="5m_20m">5 - 20 triệu VNĐ</option>
                  <option value="20m_50m">20 - 50 triệu VNĐ</option>
                  <option value="50m_100m">50 - 100 triệu VNĐ</option>
                  <option value="over_100m">Trên 100 triệu VNĐ</option>
                  <option value="negotiable">Thỏa thuận</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hạn nộp</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lĩnh vực liên quan</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: AI, IoT, Vật liệu..."
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addField())}
                />
                <button onClick={addField} className="px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Thêm</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.fields.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {f}
                    <button onClick={() => setForm({ ...form, fields: form.fields.filter((x) => x !== f) })} className="text-blue-400 hover:text-blue-600">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !form.title.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {creating ? "Đang tạo..." : "Đăng yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests list */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => {
            const s = statusConfig[req.status] || statusConfig.open;
            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{s.icon}</span>
                      <h3 className="font-semibold text-gray-900">{req.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{req.description}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                      {req.budget_range && (
                        <span className="text-xs text-gray-500">💰 {req.budget_range}</span>
                      )}
                      <span className="text-xs text-gray-500">📅 {new Date(req.created_at).toLocaleDateString("vi-VN")}</span>
                      <span className="text-xs text-gray-500">💬 {req.responses_count} phản hồi</span>
                    </div>
                    {req.fields.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {req.fields.map((f) => (
                          <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                    Chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-5xl mb-4 block">📋</span>
          <p className="text-gray-900 font-medium text-lg">Chưa có yêu cầu nào</p>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Đăng yêu cầu tư vấn để AI khớp nối với chuyên gia phù hợp nhất. Chuyên gia sẽ nhận thông báo tự động.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            + Tạo yêu cầu đầu tiên
          </button>
        </div>
      )}
    </div>
  );
}