import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/ui/app-toaster";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Almi CV Builder",
  description: "Create professional CVs and matching cover letters with polished templates, live preview, and export-ready structure.",
  icons: {
    icon: "/brand/almi-latest.png",
    apple: "/brand/almi-latest.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
