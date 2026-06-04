"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirm: "",
    role: "expert" as "expert" | "business",
    full_name: "",
    organization: "",
    agree_terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirm) {
      setError("Mật khẩu không khớp");
      return;
    }
    if (!form.agree_terms) {
      setError("Vui lòng đồng ý điều khoản sử dụng");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role,
          full_name: form.full_name,
          organization: form.organization,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || data.email?.[0] || "Đăng ký thất bại");
      } else {
        router.push("/auth/login?registered=true");
      }
    } catch {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-800 to-blue-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">
            Tham gia cộng đồng KHCN Việt Nam
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Tạo Hộ chiếu Tri thức Số — hồ sơ học thuật được xác thực bằng Blockchain, không thể giả mạo.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🔬", title: "Chuyên gia", desc: "Tạo hồ sơ, nhận matching tự động" },
              { icon: "🏢", title: "Doanh nghiệp", desc: "Tìm chuyên gia phù hợp ngay" },
              { icon: "🔒", title: "Bảo mật", desc: "DID/VC chuẩn W3C quốc tế" },
              { icon: "🤖", title: "AI Matching", desc: "PhoBERT phân tích ngữ nghĩa" },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-xl p-4">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-semibold mt-2">{item.title}</h3>
                <p className="text-blue-200 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">STI-Expert</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
            <p className="text-gray-500 mt-2">Bắt đầu hành trình kết nối tri thức</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`h-1 flex-1 rounded ${step >= 1 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`h-1 flex-1 rounded ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                {/* Role selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "expert" })}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      form.role === "expert"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">🔬</span>
                    <p className="font-semibold mt-2 text-gray-900">Chuyên gia</p>
                    <p className="text-xs text-gray-500 mt-1">Nhà nghiên cứu, giảng viên</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "business" })}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      form.role === "business"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">🏢</span>
                    <p className="font-semibold mt-2 text-gray-900">Doanh nghiệp</p>
                    <p className="text-xs text-gray-500 mt-1">Tìm kiếm chuyên gia</p>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Nguyễn Văn A"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tổ chức</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Đại học Bách Khoa Hà Nội"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Tiếp tục
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Ít nhất 8 ký tự"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Nhập lại mật khẩu"
                    value={form.password_confirm}
                    onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
                  />
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={form.agree_terms}
                    onChange={(e) => setForm({ ...form, agree_terms: e.target.checked })}
                  />
                  <span className="text-sm text-gray-600">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">Điều khoản sử dụng</Link>
                    {" "}và{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</Link>
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {loading ? "Đang tạo..." : "Đăng ký"}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}