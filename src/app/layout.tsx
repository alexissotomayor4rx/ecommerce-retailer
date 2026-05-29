import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImportStore | Productos Exclusivos",
  description: "Zapatillas y accesorios importados bajo pedido en Ecuador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Espacio para inyectar scripts de analítica (Umami / Vercel Analytics) */}
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
