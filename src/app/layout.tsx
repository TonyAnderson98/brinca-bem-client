import type { Metadata } from "next";
import { Overlock, Overlock_SC } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";

const overlock = Overlock({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal"],
  variable: "--font-overlock",
  display: "swap",
});

const overlockSC = Overlock_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-overlock-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brinca Bem",
  description: "Marketplace de doação de brinquedos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${overlock.variable} ${overlockSC.variable} antialiased bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}