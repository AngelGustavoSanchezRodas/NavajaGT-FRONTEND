import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { PublicNavbar } from "@/shared/components/layout/PublicNavbar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NavajaGT | Herramientas Digitales y Acortador de Enlaces",
  description: "Optimiza tu presencia digital con nuestro acortador de URLs, generador de códigos QR y más. Una plataforma de ABA Estudios.",
  keywords: ["acortador de urls", "biolink", "generador qr", "navajagt", "herramientas digitales"],
  openGraph: {
    type: "website",
    locale: "es_GT",
    siteName: "NavajaGT",
  },
  twitter: { 
    card: "summary_large_image", 
    title: "NavajaGT" 
  },
};

import { AuthProvider } from "@/shared/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <PublicNavbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
