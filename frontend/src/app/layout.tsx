import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STI-Expert | Hệ điều hành Thị trường Tri thức KHCN",
  description: "Nền tảng kết nối chuyên gia khoa học công nghệ Việt Nam với doanh nghiệp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
