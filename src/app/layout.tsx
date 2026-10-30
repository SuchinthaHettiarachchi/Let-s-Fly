import type { Metadata, Viewport } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { PageTransition } from "@/components/layout/PageTransition";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import "./globals.css";

// Headings in Plus Jakarta Sans, everything else in DM Sans (the Walkers Tours body font).
const heading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets env(safe-area-inset-*) work on notched iPhones
  themeColor: "#0b2545", // browser bar matches the navy header strip
};

export const metadata: Metadata = {
  title: {
    default: "Sri Lanka Travel Agency | Flights, Tours & Visas | Let's Fly",
    template: "%s | Let's Fly",
  },
  description:
    "SLTDA-registered travel agency in Colombo, Sri Lanka. Book air tickets, holiday packages, visas, hotels and transfers. Pay later with KOKO.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior lets Next jump straight to the top on route changes; in-page anchors keep smooth scrolling.
    <html lang="en" data-scroll-behavior="smooth" className={`${heading.variable} ${body.variable} antialiased`}>
      <head>
        {/* Icon font: variable axes so FILL can be toggled per icon.
            display=block keeps ligature names ("arrow_forward") from flashing before it loads. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/google-font-display, @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
        />
      </head>
      <body className="min-h-screen bg-surface">
        <InquiryProvider>
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <WhatsAppFab />
          <Footer />
          <RouteTransition />
        </InquiryProvider>
      </body>
    </html>
  );
}
