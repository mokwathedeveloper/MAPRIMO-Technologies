import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MAPRIMO Technologies | Full-Stack + QA Development",
    template: "%s | MAPRIMO Technologies",
  },
  description: "Full-Stack + QA that ships fast and breaks less. We build MVPs, automate QA, and rescue troubled projects for SMEs and funded startups.",
  metadataBase: new URL("https://maprimo.com"),
  keywords: ["Software Development", "QA Automation", "MVP Build", "Next.js", "Startups", "SME Software"],
  authors: [{ name: "MAPRIMO Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maprimo.com",
    siteName: "MAPRIMO Technologies",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MAPRIMO Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAPRIMO Technologies | Full-Stack + QA Development",
    description: "Full-Stack + QA that ships fast and breaks less.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
