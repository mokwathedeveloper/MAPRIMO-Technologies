import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "MAPRIMO Technologies",
    "image": "https://maprimo.com/og-image.png",
    "@id": "https://maprimo.com",
    "url": "https://maprimo.com",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Remote",
      "addressRegion": "EST",
      "postalCode": "",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 0,
      "longitude": 0
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://twitter.com/maprimo",
      "https://linkedin.com/company/maprimo"
    ]
  };

  return (
    <html lang="en" className={roboto.variable}>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
