import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import ThemeProvider from "./providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js待办应用",
  description: "一个简单的Next.js待办事项应用，具有日报功能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
