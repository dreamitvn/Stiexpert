"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
      const res = await fetch(`${apiBase}/auth/forgot_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">STI-Expert</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h1>
            <p className="text-gray-500 mt-2">
              Nhập email để nhận link đặt lại mật khẩu
            </p>
          </div>

          {sent ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-semibold text-lg mb-2">Đã gửi email!</h3>
                <p className="text-sm">
                  Nếu email <strong>{email}</strong> tồn tại trong hệ thống,
                  bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Link sẽ hết hạn sau 30 phút. Kiểm tra cả thư mục Spam.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="block text-center w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email đăng ký
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Đã nhớ mật khẩu?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Đăng nhập
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Right - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-pink-500 to-rose-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">🔑 Đặt lại mật khẩu</h2>
          <p className="text-pink-100 text-lg mb-6">
            Chúng tôi sẽ gửi cho bạn một link bảo mật qua email để đặt lại mật khẩu.
            Link có hiệu lực trong 30 phút.
          </p>
          <div className="space-y-4">
            {[
              "Nhập email đăng ký",
              "Kiểm tra hộp thư (và Spam)",
              "Nhấn vào link để đặt mật khẩu mới",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <span className="text-pink-100">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}