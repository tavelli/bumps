import "@/styles/globals.css";
import type {Metadata} from "next";
import {unbounded, uniteaSans} from "@/app/fonts";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bike Up the Mountain Point Series (BUMPS)",
  description:
    "A yearlong competition featuring some of the most challenging and well-established cycling hill climb events in the United States.",
  openGraph: {
    title: "Bike Up the Mountain Point Series (BUMPS)",
    description: "A yearlong contest featuring premier U.S. hill climb races.",
    type: "website",
    url: "https://bumpshillclimb.com/",
    images: [
      {
        url: "https://bumpshillclimb.com/bumps-social-card.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bike Up the Mountain Point Series (BUMPS)",
    description: "A yearlong contest featuring premier U.S. hill climb races.",
    images: ["https://bumpshillclimb.com/bumps-social-card.jpg"],
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#da532c",
    "theme-color": "#0f0101",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="full-height" data-scroll-behavior="smooth">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#0f0101" />
      </head>
      <body
        className={`full-height ${uniteaSans.variable} ${unbounded.variable}`}
      >
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-68R4PHKHGQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-68R4PHKHGQ');
          `}
        </Script>
      </body>
    </html>
  );
}
