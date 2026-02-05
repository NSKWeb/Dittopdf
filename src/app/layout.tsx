import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dittopdf",
  description: "Complete PDF tool suite for modern teams"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-slate-100">
        <div className="min-h-screen flex flex-col">
          <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-accent">Dittopdf</span>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Phase 1 MVP</span>
            </div>
            <nav className="flex gap-6 text-sm text-slate-300">
              <a className="hover:text-white" href="/">Tools</a>
              <a className="hover:text-white" href="/dashboard">Dashboard</a>
              <a className="hover:text-white" href="/auth/login">Sign In</a>
            </nav>
          </header>
          <div className="px-6 py-4 bg-panel/40">
            <AdSlot position="header" />
          </div>
          <main className="flex-1">{children}</main>
          <footer className="px-6 py-6 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>© 2024 Dittopdf. All rights reserved.</span>
              <span>Ads by Google AdSense · Premium removes ads.</span>
            </div>
            <div className="mt-4">
              <AdSlot position="footer" />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
