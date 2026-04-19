import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Todo List App",
  description: "Track tasks by status and priority.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex flex-col`}
      >
        <main className="flex-1 flex flex-col">
          <AuthProvider>{children}</AuthProvider>
        </main>
        <footer className="border-t border-white/60 bg-white/70 px-4 py-3 text-right text-sm text-slate-500 backdrop-blur">
          Individual Project by Napasorn Tevarut 6510545519
        </footer>
      </body>
    </html>
  );
}
