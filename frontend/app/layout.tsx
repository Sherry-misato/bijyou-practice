import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import SiteNav from "./components/SiteNav";

export const metadata: Metadata = {
  title: "bijyou（ビジュー）| バレエ上達サポート",
  description:
    "パ辞書・お手本動画・レッスン日記・TODO・クイズで、バレエの学習サイクルを回すWebサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <SiteNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
