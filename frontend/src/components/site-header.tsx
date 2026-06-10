import Link from "next/link";

const navItems = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/experts", label: "Find Experts" },
  { href: "/business", label: "For Business" },
  { href: "/contact", label: "Liên hệ chúng tôi" },
  { href: "/terms", label: "Terms of Service" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="STI-Expert" className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-gray-600 hover:text-gray-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Đăng nhập
          </Link>
          <Link href="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
