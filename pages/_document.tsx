import {unbounded, uniteaSans} from "@/app/fonts";
import {Html, Head, Main, NextScript} from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" className="full-height">
      <Head>
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

        <meta
          property="og:title"
          content="Bike Up the Mountain Point Series (BUMPS)"
        />
        <meta
          property="og:description"
          content="A yearlong contest featuring premier U.S. hill climb races."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bumpshillclimb.com/" />
        <meta
          property="og:image"
          content="https://bumpshillclimb.com/bumps-social-card.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="bumpshillclimb.com" />
        <meta property="twitter:url" content="https://bumpshillclimb.com/" />
        <meta
          name="twitter:title"
          content="Bike Up the Mountain Point Series (BUMPS)"
        />
        <meta
          name="twitter:description"
          content="A yearlong contest featuring premier U.S. hill climb races."
        />
        <meta
          name="twitter:image"
          content="https://bumpshillclimb.com/bumps-social-card.jpg"
        />
      </Head>
      <body
        className={`full-height ${uniteaSans.variable} ${unbounded.variable}`}
      >
        <Main />
        <NextScript />
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
    </Html>
  );
}
