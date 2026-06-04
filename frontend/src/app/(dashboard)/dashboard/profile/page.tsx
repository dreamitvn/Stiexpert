"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    full_name: "",
    orcid: "",
    organization: "",
    title: "",
    degree: "",
    fields: [] as string[],
    bio: "",
    nationality: "Việt Nam",
  });
  const [newField, setNewField] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addField = () => {
    if (newField.trim() && !form.fields.includes(newField.trim())) {
      setForm({ ...form, fields: [...form.fields, newField.trim()] });
      setNewField("");
    }
  };

  const removeField = (f: string) => {
    setForm({ ...form, fields: form.fields.filter((x) => x !== f) });
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: call API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ chuyên gia</h1>
        <p className="text-gray-500 mt-1">Cập nhật thông tin Hộ chiếu Tri thức Số của bạn</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-3xl text-blue-600 font-bold">
              {form.full_name?.[0] || "?"}
            </span>
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              Thay ảnh đại diện
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG. Tối đa 2MB</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên *</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ORCID</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.orcid}
              onChange={(e) => setForm({ ...form, orcid: e.target.value })}
              placeholder="0000-0002-1825-0097"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tổ chức / Trường</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="Đại học Bách Khoa Hà Nội"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Chức danh</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Phó Giáo sư"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Học vị</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
            >
              <option value="">Chọn học vị</option>
              <option value="bachelor">Cử nhân</option>
              <option value="master">Thạc sĩ</option>
              <option value="phd">Tiến sĩ</option>
              <option value="assoc_prof">Phó Giáo sư</option>
              <option value="prof">Giáo sư</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quốc tịch</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            />
          </div>
        </div>

        {/* Research fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Lĩnh vực nghiên cứu</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addField())}
              placeholder="VD: Machine Learning, Vật liệu nano..."
            />
            <button
              type="button"
              onClick={addField}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.fields.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {f}
                <button onClick={() => removeField(f)} className="text-blue-400 hover:text-blue-600">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới thiệu bản thân</label>
          <textarea
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Mô tả ngắn về chuyên môn và kinh nghiệm nghiên cứu..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          {saved && (
            <span className="text-emerald-600 text-sm font-medium">✓ Đã lưu thành công</span>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </div>
      </div>
    </div>
  );
}