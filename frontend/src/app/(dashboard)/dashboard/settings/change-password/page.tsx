"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.new_password.length < 8) {
      setError("Mật khẩu mới phải ít nhất 8 ký tự.");
      return;
    }
    if (form.new_password !== form.new_password_confirm) {
      setError("Mật khẩu mới xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const access = localStorage.getItem("access") || "";
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
      const res = await fetch(`${apiBase}/auth/change_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        setError(data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        setSuccess(true);
        setForm({ old_password: "", new_password: "", new_password_confirm: "" });
        // Clear tokens — user must re-login with new password
        setTimeout(() => {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          router.push("/auth/login");
        }, 3000);
      }
    } catch {
      setError("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "old_password", label: "Mật khẩu hiện tại", placeholder: "Nhập mật khẩu hiện tại" },
    { key: "new_password", label: "Mật khẩu mới", placeholder: "Ít nhất 8 ký tự" },
    { key: "new_password_confirm", label: "Xác nhận mật khẩu mới", placeholder: "Nhập lại mật khẩu mới" },
  ] as const;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Sau khi đổi thành công, bạn sẽ được đăng xuất và đăng nhập lại.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-6 rounded-xl text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold text-lg mb-2">Đổi mật khẩu thành công!</h3>
            <p className="text-sm">
              Đang đăng xuất và chuyển về trang đăng nhập...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security tips */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-6 py-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Mẹo bảo mật</h4>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Sử dụng ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số</li>
          <li>Không chia sẻ mật khẩu với bất kỳ ai</li>
          <li>Thay đổi mật khẩu định kỳ mỗi 3–6 tháng</li>
          <li>Không dùng lại mật khẩu từ các tài khoản khác</li>
        </ul>
      </div>
    </div>
  );
}