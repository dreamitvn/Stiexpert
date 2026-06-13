"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type SubMenuItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href?: string;
  icon: string;
  adminOnly?: boolean;
  subItems?: SubMenuItem[];
};

const menuItems: MenuItem[] = [
  { label: "Tổng quan", href: "/dashboard", icon: "📊" },
  {
    label: "Hộ chiếu chuyên gia",
    icon: "🪪",
    subItems: [
      { label: "Hồ sơ công khai", href: "/dashboard/profile" },
      { label: "Chỉnh sửa hồ sơ", href: "/dashboard/edit-profile" },
      { label: "Ấn phẩm & Tài liệu", href: "/dashboard/documents" },
    ],
  },
  {
    label: "Sàn giao dịch IP",
    icon: "💎",
    subItems: [
      { label: "Tài sản của tôi", href: "/dashboard/my-assets" },
      { label: "Đúc IP-NFT", href: "/dashboard/mint-ip" },
      { label: "Tạo niêm yết", href: "/dashboard/create-listing" },
      { label: "Lịch sử giao dịch", href: "/dashboard/transactions" },
    ],
  },
  {
    label: "Kết nối",
    icon: "🤝",
    subItems: [
      { label: "Tìm chuyên gia", href: "/dashboard/search" },
      { label: "Yêu cầu đã gửi", href: "/dashboard/connect" },
      { label: "Yêu cầu đến", href: "/dashboard/requests" },
      { label: "Tin nhắn", href: "/dashboard/messages" },
    ],
  },
  {
    label: "Cài đặt",
    icon: "⚙️",
    subItems: [
      { label: "Thiết lập chung", href: "/dashboard/settings" },
      { label: "Đổi mật khẩu", href: "/dashboard/settings/change-password" },
    ],
  },
  {
    label: "Quản trị hệ thống",
    icon: "🔧",
    adminOnly: true,
    subItems: [
      { label: "Duyệt hồ sơ", href: "/dashboard/admin" },
      { label: "CMS Tin tức", href: "/dashboard/admin/news" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
    fetch(`${apiBase}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((data) => {
        const u = data.data || data;
        const cleanUser = { email: u.email, role: u.role };
        localStorage.setItem("user", JSON.stringify(cleanUser));
        setUser(cleanUser);
        if (pathname.startsWith("/dashboard/admin") && !["admin","manager","verification_staff"].includes(u.role)) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        router.push("/auth/login");
      });
  }, [router, pathname]);

  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    let changed = false;
    menuItems.forEach((item) => {
      if (item.subItems?.some(sub => pathname.startsWith(sub.href))) {
        if (!newOpenMenus[item.label]) {
          newOpenMenus[item.label] = true;
          changed = true;
        }
      }
    });
    if (changed) setOpenMenus(newOpenMenus);
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 h-16 px-6 border-b shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src='/logo.svg' alt='STI-Expert' className='h-8 w-auto' />
          </Link>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems
            .filter((item) => !item.adminOnly || ["admin","manager","verification_staff"].includes(user?.role || ""))
            .map((item) => {
              const isActiveLink = item.href && pathname === item.href;
              const hasActiveSub = item.subItems?.some(sub => pathname.startsWith(sub.href));
              const isOpen = openMenus[item.label];

              if (item.subItems) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        hasActiveSub || isOpen
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="pl-10 pr-2 py-1 space-y-1">
                        {item.subItems.map(sub => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm transition ${
                                isSubActive
                                  ? "bg-blue-50 text-blue-700 font-semibold"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActiveLink
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
          })}
        </nav>

        <div className="p-4 border-t shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "User"}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || "expert"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center px-6 sticky top-0 z-30 shrink-0">
          <button
            className="lg:hidden mr-4 text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
