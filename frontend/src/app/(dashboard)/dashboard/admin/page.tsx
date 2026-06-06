"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  useEffect(() => {
    // Load the full multipurpose Bootstrap template (same as user dashboard)
    const loadCSS = (href: string) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    loadCSS("/admin-theme/assets/css/bootstrap.min.css");
    loadCSS("/admin-theme/assets/css/style.css");
    loadCSS("/admin-theme/assets/css/responsive.css");
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-white flex flex-col">
      {/* STI-Expert Admin Header with Logo */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="STI-Expert" className="h-9 w-auto" />
          </Link>
          <div className="text-sm text-gray-500 hidden md:block">
            Admin Panel — Hệ điều hành Thị trường Tri thức KHCN
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            ADMIN MODE
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-semibold">
              A
            </div>
            <span className="text-sm text-gray-700 hidden md:inline">Admin</span>
          </div>

          <Link href="/dashboard" className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50">User View</Link>
        </div>
      </div>

      {/* Full Template Iframe — same beautiful PVR template as user dashboard */}
      <div className="flex-1 relative">
        <iframe 
          src="/admin-theme/pvr_dashboard_v2.html"
          className="w-full h-full border-0"
          title="STI-Expert Admin Dashboard - Full Template"
        />

        {/* Floating admin widget over the template */}
        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur border shadow-lg rounded-2xl p-4 w-80 hidden lg:block z-40">
          <div className="text-xs text-red-600 font-semibold mb-1">ADMIN — Dữ liệu thật</div>
          <div className="font-semibold text-xl mb-2">205 Chuyên gia + 208 Users</div>
          <div className="text-sm text-gray-600 mb-3">
            Quản lý toàn hệ thống: Expert Profiles, Publications, Credentials, Connections, Matching.
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="flex-1 text-center text-sm bg-red-600 text-white py-2 rounded-xl hover:bg-red-700">
              Django Admin
            </Link>
            <Link href="/dashboard/admin-legacy" className="flex-1 text-center text-sm border py-2 rounded-xl hover:bg-gray-50">
              Legacy PVR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
