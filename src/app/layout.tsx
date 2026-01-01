import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}