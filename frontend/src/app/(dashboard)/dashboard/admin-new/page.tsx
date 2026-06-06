"use client";

import { useEffect } from "react";

// Placeholder for the new dashboard template from Google Drive
// Once you upload the ZIP, we will extract it to /public/admin-new/ and load it here (via iframe or full integration)

export default function NewAdminDashboard() {
  useEffect(() => {
    // When the new assets are available, load their CSS/JS here
    // Example:
    // loadCSS("/admin-new/assets/css/main.css");
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Mới</h1>
          <p className="text-gray-500 mt-2">
            Template mới từ Google Drive (folder bạn vừa gửi).
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Đang chờ file</h3>
          <p className="text-yellow-700 text-sm">
            Tôi không thể tự tải thư mục Google Drive (cần đăng nhập). 
            Vui lòng:
          </p>
          <ol className="list-decimal ml-5 mt-2 text-sm text-yellow-700 space-y-1">
            <li>Vào link Drive → chọn toàn bộ folder</li>
            <li>Nhấn chuột phải → Download (sẽ được nén thành ZIP)</li>
            <li>Upload file ZIP đó vào cuộc trò chuyện này (giống như file template trước)</li>
          </ol>
          <p className="text-xs mt-3 text-yellow-600">
            Sau khi nhận ZIP, tôi sẽ extract vào <code>/public/admin-new/</code> và tích hợp đầy đủ như dashboard cũ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-5">
            <div className="text-2xl mb-3">📊</div>
            <div className="font-semibold">Dashboard</div>
            <div className="text-sm text-gray-500 mt-1">Trang tổng quan mới</div>
          </div>
          <div className="border rounded-xl p-5">
            <div className="text-2xl mb-3">👥</div>
            <div className="font-semibold">Quản lý Chuyên gia</div>
            <div className="text-sm text-gray-500 mt-1">205 records đã import</div>
          </div>
          <div className="border rounded-xl p-5">
            <div className="text-2xl mb-3">🔧</div>
            <div className="font-semibold">Công cụ</div>
            <div className="text-sm text-gray-500 mt-1">Tích hợp từ template</div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          Khi bạn gửi ZIP, tôi sẽ:
          <br />• Extract assets + HTML
          <br />• Tạo trang iframe hoặc chuyển sang React
          <br />• Cập nhật sidebar + logo
          <br />• Kết nối với dữ liệu thật (205 experts + API)
        </div>
      </div>
    </div>
  );
}
