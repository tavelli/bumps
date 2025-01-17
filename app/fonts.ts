import localFont from "next/font/local";

export const uniteaSans = localFont({
  src: [
    {
      path: "../public/fonts/UniteaSans-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../public/fonts/UniteaSans-Bold.woff",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-unitea-sans",
  display: "swap",
});
