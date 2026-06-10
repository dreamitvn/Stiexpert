import Link from "next/link";

const quickLinks = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/experts", label: "Find Experts" },
  { href: "/business", label: "For Business" },
  { href: "/contact", label: "Liên hệ chúng tôi" },
  { href: "/terms", label: "Terms of Service" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:px-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">
            Kết nối các doanh nghiệp với những chuyên gia công nghệ hàng đầu tại Việt Nam.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Tầng 6, số nhà 145-147 Đường Trường Chinh, Phường Phương Liệt, TP Hà Nội</li>
            <li>0868144913</li>
            <li>contact@stiexpert.com</li>
            <li>www.stiexpert.com</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
