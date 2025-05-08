import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

// 加载字体并优化子集
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Luna Tech",
    default: "Luna Tech",
  },
  description: "Luna Tech 手机维修店后台管理系统", // 更清晰的描述
};

// 视口配置
export const viewport: Viewport = {
  themeColor: [
    // 根据你的 CSS 变量调整颜色值
    { media: "(prefers-color-scheme: light)", color: "#f8f9fa" }, // 匹配 --background (light)
    { media: "(prefers-color-scheme: dark)", color: "#111827" }, // 匹配 --background (dark) HSL(222 47% 11%)
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${inter.variable} font-sans`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
