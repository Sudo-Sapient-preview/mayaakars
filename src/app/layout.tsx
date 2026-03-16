import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import RouteTransitionProvider from "@/components/navigation/RouteTransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const SITE_URL = "https://www.mayaakars.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mayaakars | Architecture & Interior Design, Bengaluru",
    template: "%s | Mayaakars",
  },
  description:
    "Mayaakars is a Bengaluru-based architecture and interior design studio crafting timeless residential and commercial spaces with precision and intent.",
  keywords: [
    "interior design Bengaluru",
    "architecture firm Bangalore",
    "luxury interior design",
    "residential interiors",
    "commercial architecture",
    "Mayaakars",
  ],
  authors: [{ name: "Mayaakars", url: SITE_URL }],
  creator: "Mayaakars",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Mayaakars",
    title: "Mayaakars | Architecture & Interior Design, Bengaluru",
    description:
      "Crafting timeless residential and commercial spaces in Bengaluru with architectural precision and design intent.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mayaakars — Architecture & Interior Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayaakars | Architecture & Interior Design",
    description:
      "Crafting timeless residential and commercial spaces in Bengaluru.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <SmoothScroll>
          <RouteTransitionProvider>
            <Navbar />
            <CustomCursor />
            {children}
          </RouteTransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
