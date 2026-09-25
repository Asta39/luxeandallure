import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Switzer — Indian Type Foundry Free Font License (free for commercial use), self-hosted.
const sans = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "./fonts/switzer/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/switzer/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/switzer/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/switzer/Switzer-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Luxe & Allure Events",
  description:
    "Luxury event decor, planning and rentals in Nairobi — weddings, corporate events, milestones and VIP celebrations.",
  // Staging only: remove before cutover (PRD §11.11).
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
