import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MAPRIMO Technologies | Full-Stack + QA Development",
  description: "Full-Stack + QA that ships fast and breaks less. We build MVPs, automate QA, and rescue troubled projects for SMEs and funded startups.",
  metadataBase: new URL("https://maprimo.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MAPRIMO Technologies",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
