"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    email_requests: true,
    email_messages: true,
    email_news: false,
    push_requests: true,
    push_messages: true,
  });
  const [privacy, setPrivacy] = useState({
    profile_public: true,
    show_email: false,
    show_org: true,
    show_publications: true,
  });

  const handleSave = async () => {
    setSaved(false);
    // TODO: call API
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { key: "profile", label: "Tài khoản", icon: "👤" },
    { key: "security", label: "Bảo mật", icon: "🔐" },
    { key: "notifications", label: "Thông báo", icon: "🔔" },
    { key: "privacy", label: "Quyền riêng tư", icon: "🔒" },
    { key: "api", label: "API Keys", icon: "🔑" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Cài đặt</h1>
        <p className="text-gray-500 mt-1">Quản lý tài khoản, bảo mật và quyền riêng tư</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${
                  section === s.key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-xl border border-red-200 p-4 mt-4">
            <h3 className="font-semibold text-red-600 text-sm mb-2">⚠️ Nguy hiểm</h3>
            <button className="w-full text-left text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition">
              Xóa tài khoản
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {section === "profile" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50" defaultValue="user@stiexpert.com" disabled />
                    <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="+84..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngôn ngữ</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Lưu thay đổi
                  </button>
                  {saved && <span className="ml-3 text-emerald-600 text-sm font-medium">✓ Đã lưu</span>}
                </div>
              </div>
            </div>
          )}

          {section === "security" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔐 Đổi mật khẩu</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                    value={passwordForm.old}
                    onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Cập nhật mật khẩu
                </button>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Xác thực 2 yếu tố (2FA)</h3>
                <p className="text-sm text-gray-500 mb-3">Bảo vệ tài khoản bằng xác thực 2 bước</p>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Thiết lập 2FA →
                </button>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔔 Thông báo</h2>
              <div className="space-y-4">
                {[
                  { key: "email_requests", label: "Yêu cầu kết nối mới", desc: "Nhận email khi có người gửi yêu cầu" },
                  { key: "email_messages", label: "Tin nhắn mới", desc: "Thông báo email khi có tin nhắn" },
                  { key: "email_news", label: "Tin tức & cập nhật", desc: "Nhận newsletter từ STI-Expert" },
                  { key: "push_requests", label: "Push: Yêu cầu mới", desc: "Thông báo đẩy trên trình duyệt" },
                  { key: "push_messages", label: "Push: Tin nhắn", desc: "Thông báo đẩy cho tin nhắn" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mt-2"
                >
                  Lưu thông báo
                </button>
              </div>
            </div>
          )}

          {section === "privacy" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔒 Quyền riêng tư</h2>
              <div className="space-y-4">
                {[
                  { key: "profile_public", label: "Hồ sơ công khai", desc: "Cho phép người khác tìm thấy bạn" },
                  { key: "show_email", label: "Hiển thị email", desc: "Email của bạn hiển thị trên trang công khai" },
                  { key: "show_org", label: "Hiển thị tổ chức", desc: "Hiển thị tổ chức/công ty của bạn" },
                  { key: "show_publications", label: "Hiển thị ấn phẩm", desc: "Cho phép xem ấn phẩm khoa học" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={privacy[item.key as keyof typeof privacy]}
                        onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mt-2"
                >
                  Lưu quyền riêng tư
                </button>
              </div>
            </div>
          )}

          {section === "api" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔑 API Keys</h2>
              <p className="text-sm text-gray-500 mb-4">
                Sử dụng API keys để truy cập STI-Expert API từ ứng dụng bên thứ ba
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">API Key của bạn</p>
                    <p className="text-xs text-gray-400 mt-1">Bearer token cho Authorization header</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    Tạo Key mới
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Hướng dẫn sử dụng API: <a href="https://docs.stiexpert.com" className="text-blue-600 hover:underline">docs.stiexpert.com</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}