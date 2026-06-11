import Link from "next/link";

const platformLinks = [
  { href: "/experts", label: "Tìm chuyên gia" },
  { href: "/news", label: "Tin tức KHCN" },
  { href: "/auth/register", label: "Đăng ký tài khoản" },
  { href: "/auth/login", label: "Đăng nhập" },
];

const aboutLinks = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/terms", label: "Điều khoản sử dụng" },
  { href: "/privacy", label: "Chính sách bảo mật" },
  { href: "/contact", label: "Liên hệ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#0ea5e9" />
                <text x="16" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="system-ui">S</text>
              </svg>
              <span className="text-lg font-bold text-white">
                STI Expert
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Hệ điều hành Thị trường Tri thức Khoa học Công nghệ — Kết nối chuyên gia hàng đầu Việt Nam với doanh nghiệp.
            </p>
            {/* Social icons */}
            <div className="mt-5 flex gap-3">
              <a href="https://facebook.com/stiexpert" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-sky-600 hover:text-white transition" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://zalo.me/stiexpert" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white transition" aria-label="Zalo">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.163c-.18.432-.75.795-1.242.915-.33.078-.762.138-2.214-.474-1.857-.783-3.054-2.672-3.147-2.795-.093-.123-.75-1.002-.75-1.911s.474-1.356.642-1.542c.168-.186.366-.231.489-.231.123 0 .246 0 .354.006.114.006.267-.042.417.321.156.372.528 1.293.573 1.386.048.093.078.201.015.324-.06.123-.093.201-.186.309-.093.108-.195.243-.279.324-.093.093-.189.195-.081.381.108.186.48.795.999 1.281.672.63 1.236.825 1.422.915.186.093.294.078.402-.048.108-.123.465-.54.588-.723.123-.186.246-.156.417-.093.168.06 1.083.51 1.269.603.186.093.309.138.354.216.048.078.048.453-.132.885z"/></svg>
              </a>
              <a href="mailto:contact@stiexpert.com" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition" aria-label="Email">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Nền tảng</h3>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Thông tin</h3>
            <ul className="space-y-2.5 text-sm">
              {aboutLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Tầng 6, 145-147 Trường Chinh, Phương Liệt, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="flex gap-2">
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <a href="tel:0868144913" className="hover:text-white transition">0868 144 913</a>
              </li>
              <li className="flex gap-2">
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:contact@stiexpert.com" className="hover:text-white transition">contact@stiexpert.com</a>
              </li>
              <li className="flex gap-2">
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                <a href="https://stiexpert.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">www.stiexpert.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} STI Expert. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Powered by <span className="text-sky-400">VKAC DLT</span> · Blockchain Verified Knowledge Assets
          </p>
        </div>
      </div>
    </footer>
  );
}
