import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "./providers/ThemeProvider";
import "./globals.css";
import "../utils/dayjs-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "行向Next.js应用",
  description: "行向Next.js面试辅助应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.variable}>
        <ThemeProvider>
          {/* <Navbar /> */}
          <main className="main-content">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
