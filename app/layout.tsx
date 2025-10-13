import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import BackgroundOrbits from "./components/BackgroundOrbits";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ensemble",
  description: "A minimal, luxury-tech platform experience by Ensemble.",
  metadataBase: new URL("https://ensemble.example.com"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ensemble",
    description: "AI agents for instant, reliable product feedback.",
    url: "https://ensemble.example.com",
    siteName: "Ensemble",
    images: [
      { url: "/vercel.svg", width: 1200, height: 630, alt: "Ensemble" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ensemble",
    description: "AI agents for instant, reliable product feedback.",
    images: ["/vercel.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-offwhite text-slate-800`}>        
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] rounded bg-slate-800 text-offwhite px-3 py-2">Skip to content</a>
        {/* Gentle global background gradient + persistent orbits */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-tan-200/20 via-transparent to-tan-200/15 animate-[bgloop_10s_ease-in-out_infinite]" />
          <BackgroundOrbits />
        </div>
        {/* Header */}
        <header className="sticky top-0 z-50 glass">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="text-xl font-serif tracking-tight">Ensemble</Link>
              <nav className="hidden md:flex items-center gap-8 text-sm">
                <Link href="/#how" className="hover:opacity-80">How it works</Link>
                <Link href="/#features" className="hover:opacity-80">Features</Link>
                <Link href="/#use-cases" className="hover:opacity-80">Use cases</Link>
                <Link href="/blog" className="hover:opacity-80">Blog</Link>
                <Link href="/contact" className="hover:opacity-80">Contact</Link>
                <Link href="/#waitlist" className="ml-2 rounded-full px-4 py-2 bg-slate-800 text-offwhite hover:bg-slate-700 transition-colors">Join waitlist</Link>
              </nav>
              <Link href="/#waitlist" className="md:hidden rounded-full px-4 py-2 bg-slate-800 text-offwhite text-sm">Join</Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <Providers>
          <main>{children}</main>
        </Providers>

        {/* Footer */}
        <footer className="mt-24">
          <div className="glass">
            <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm">© {new Date().getFullYear()} Ensemble. All rights reserved.</p>
              <div className="flex items-center gap-6 text-sm">
                <a href="/blog" className="hover:opacity-80">Blog</a>
                <a href="/contact" className="hover:opacity-80">Contact</a>
                <a href="#" className="hover:opacity-80">Privacy</a>
                <a href="#" className="hover:opacity-80">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
