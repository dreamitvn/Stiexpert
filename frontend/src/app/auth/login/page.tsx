"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
      const res = await fetch(`${apiBase}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.detail || `Đăng nhập thất bại (mã ${res.status})`;
        setError(errMsg);
        console.error("Login error response:", data);
      } else {
        const tokens = data.data || data;
        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        try {
          const payload = JSON.parse(atob(tokens.access.split(".")[1]));
          localStorage.setItem("user", JSON.stringify({
            id: payload.user_id,
            email: payload.email,
            role: payload.role,
          }));
        } catch { /* */ }
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login fetch error (full):", err);
      const msg = err?.message || "Lỗi mạng / không kết nối được server";
      setError(`Lỗi máy chủ: ${msg}. Vui lòng thử lại hoặc kiểm tra console (F12).`);
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
            <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại</h1>
            <p className="text-gray-500 mt-2">Đăng nhập vào tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">
            Nền tảng KHCN đầu tiên tại Việt Nam
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Kết nối chuyên gia khoa học với doanh nghiệp thông qua xác thực Blockchain và khớp nối AI thông minh.
          </p>
          <div className="space-y-4">
            {[
              { label: "Chuyên gia đã đăng ký", value: "2,847+" },
              { label: "Yêu cầu tư vấn", value: "1,203+" },
              { label: "Hồ sơ được xác thực", value: "98%" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full" />
                <span className="text-blue-100">{stat.label}: <strong className="text-white">{stat.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
