import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElderSteady-Private + TinyFish — Privacy-First Elderly Fall Detection",
  description:
    "Privacy-first edge AI elderly fall detection with TinyFish live-context enrichment. Zero video leaves the room; 11 KB actionable context reaches the family.",
  keywords: [
    "Elderly Fall Detection",
    "TinyFish",
    "Privacy First Edge AI",
    "YOLOv8 Pose",
    "SiMa Modalix MLA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased selection:bg-accent/20">
        {children}
      </body>
    </html>
  );
}
