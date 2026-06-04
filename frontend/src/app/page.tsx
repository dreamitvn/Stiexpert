import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">STI-Expert</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/experts" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Chuyên gia
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Tính năng
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Giới thiệu
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2"
            >
              Đăng nhập
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Nền tảng KHCN đầu tiên tại Việt Nam
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Hệ điều hành{" "}
            <span className="text-blue-600">Thị trường Tri thức</span>
            <br />
            KHCN Việt Nam
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Kết nối chuyên gia khoa học với doanh nghiệp thông qua xác thực Blockchain
            và khớp nối AI thông minh. Biến nghiên cứu thành giá trị thương mại.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 text-lg"
            >
              Bắt đầu miễn phí →
            </Link>
            <Link
              href="/experts"
              className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-lg"
            >
              Khám phá chuyên gia
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ba trụ cột cốt lõi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kết hợp Blockchain, AI và Marketplace tạo nên vòng lặp giá trị cộng hưởng
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Trust */}
            <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-white">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust — Tin cậy</h3>
              <p className="text-gray-600 leading-relaxed">
                Hộ chiếu Tri thức Số được xác thực bằng Blockchain. Verifiable Credentials
                biến mọi tuyên bố thành bằng chứng mật mã không thể giả mạo.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">SpruceID</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">DID/VC</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">Blockchain</span>
              </div>
            </div>

            {/* Intelligence */}
            <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-white">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligence — Thông minh</h3>
              <p className="text-gray-600 leading-relaxed">
                AI phân tích ngữ nghĩa bài báo, xây dựng đồ thị tri thức, khớp nối
                chuyên gia với doanh nghiệp tự động — vượt xa tìm kiếm từ khóa.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">PhoBERT</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">PaperQA2</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">AI Matching</span>
              </div>
            </div>

            {/* Marketplace */}
            <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-white">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Marketplace — Giao dịch</h3>
              <p className="text-gray-600 leading-relaxed">
                Sàn giao dịch tài sản trí tuệ với Zero-Knowledge Proofs. Chuyên gia
                chứng minh quyền sở hữu mà không lộ nội dung sáng chế.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">IP-NFT</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">ZK-Proofs</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Smart Contract</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">22</div>
              <div className="text-blue-200 text-sm">Trường dữ liệu Hộ chiếu</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">768</div>
              <div className="text-blue-200 text-sm">Chiều vector AI</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">W3C</div>
              <div className="text-blue-200 text-sm">Chuẩn DID/VC quốc tế</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">&lt;2s</div>
              <div className="text-blue-200 text-sm">Thời gian matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-white font-semibold">STI-Expert</span>
          </div>
          <p className="text-sm">Hệ điều hành Thị trường Tri thức KHCN Việt Nam</p>
          <p className="text-xs mt-4">© 2026 STI-Expert. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
