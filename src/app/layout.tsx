import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeFAI Rewards",
  description: "First Agentic Bank of DeFAI Optimizing Yield Across Generations",
  icons: {
    icon: [
      { url: "/favicon.ico" }
    ],
    apple: [
      { url: "/icon.png" }
    ],
    shortcut: [
      { url: "/icon.png" }
    ]
  },
  openGraph: {
    title: "DeFAI Rewards",
    description: "First Agentic Bank of DeFAI Optimizing Yield Across Generations",
    images: [
      {
        url: "/defaibanner.png",
        width: 1200,
        height: 630,
        alt: "DeFAI Rewards Banner",
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
