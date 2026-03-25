import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoFlows OS — Your Sustainable Living Dashboard",
  description: "AI-powered platform for water conservation, solar energy, and sustainable living in India.",
};

import { LanguageProvider } from "@/components/language-provider";
import { EcoLayout } from "@/components/eco-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          <EcoLayout>
            {children}
          </EcoLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
