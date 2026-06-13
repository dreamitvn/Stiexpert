"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ password: "", password_confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu lại.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Mật khẩu phải ít nhất 8 ký tự.");
      return;
    }
    if (form.password !== form.password_confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
      const res = await fetch(`${apiBase}/auth/reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    } catch {
      setError("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-6 rounded-xl text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-semibold text-lg mb-2">Đặt lại mật khẩu thành công!</h3>
        <p className="text-sm">
          Mật khẩu của bạn đã được cập nhật. Đang chuyển đến trang đăng nhập...
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Mật khẩu mới
        </label>
        <input
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Ít nhất 8 ký tự"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={!token}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Xác nhận mật khẩu mới
        </label>
        <input
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Nhập lại mật khẩu mới"
          value={form.password_confirm}
          onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
          disabled={!token}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !token}
        className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
      </button>
      <p className="text-center text-sm text-gray-500">
        <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700">
          Yêu cầu link mới
        </Link>
        {" · "}
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
            <p className="text-gray-500 mt-2">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>
          <Suspense fallback={<div className="text-gray-400 text-sm">Đang tải...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>

      {/* Right - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">🔐 Bảo mật tài khoản</h2>
          <p className="text-blue-100 text-lg mb-6">
            Mật khẩu mạnh giúp bảo vệ hồ sơ chuyên gia và dữ liệu cá nhân của bạn.
          </p>
          <div className="space-y-3">
            {[
              "Ít nhất 8 ký tự",
              "Kết hợp chữ hoa, thường và số",
              "Không dùng thông tin cá nhân",
              "Không tái sử dụng mật khẩu cũ",
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-3">
                <div className="text-blue-300">✓</div>
                <span className="text-blue-100 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}