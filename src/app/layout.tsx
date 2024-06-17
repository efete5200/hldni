import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "빛나는 삶을 완성하는 고품격 라이프",
  description:
    "사람, 자연, 기술이 조화를 이루는 생활. 생각이 라이프를 만듭니다.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="kr">{children}</html>;
}
