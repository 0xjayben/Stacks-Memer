import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { WalletProviderWrapper } from "@/components/WalletProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stacks Memer – The home of meme coins on Stacks",
  description: "Discover, promote, and vote for the best meme coins on the Stacks ecosystem. Real-time data, live charts, and wallet integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProviderWrapper>
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <div className="hidden md:block shrink-0 h-full">
              <Sidebar />
            </div>
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
              <Navbar />
              <div className="flex-1 overflow-y-auto">
                <main className="p-4 sm:p-8 min-h-full">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </WalletProviderWrapper>
      </body>
    </html>
  );
}
