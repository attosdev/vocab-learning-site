import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutSimple } from "./layout-simple";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VocabMaster - 스마트한 어휘 학습",
  description: "게임처럼 재미있는 고등학생 필수 어휘 학습 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LayoutSimple>{children}</LayoutSimple>
      </body>
    </html>
  );
}
