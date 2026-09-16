import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import SiteNav from "./components/SiteNav";
import ViewModeToggleBar from "./components/ViewModeToggleBar";
import ViewModeFrame from "./components/ViewModeFrame";

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
          <ViewModeToggleBar />
          <ViewModeFrame>
            <SiteNav />
            <main>{children}</main>
          </ViewModeFrame>
        </Providers>
      </body>
    </html>
  );
}
