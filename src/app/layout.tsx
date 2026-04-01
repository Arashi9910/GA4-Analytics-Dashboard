import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "GA4 Analytics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
