import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Let's Fly.lk — Air tickets, tour packages & visas",
    template: "%s · Let's Fly.lk",
  },
  description:
    "Handpicked holidays, air tickets and visas — planned end-to-end by our Colombo travel team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
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
          <main>{children}</main>
          <WhatsAppFab />
          <Footer />
        </InquiryProvider>
      </body>
    </html>
  );
}
