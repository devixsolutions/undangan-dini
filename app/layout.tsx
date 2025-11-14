import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/bottomnav";
import { InvitationProvider } from "@/components/invitation-context";
import MusicToggle from "@/components/music";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yanto & Dini Wedding Invitation",
  description: "Yanto & Dini Wedding Invitation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${playfair.variable} antialiased`}
      >
        <InvitationProvider>
          {children}
          <MusicToggle />
          <BottomNav />
        </InvitationProvider>
      </body>
    </html>
  );
}
