import localFont from "next/font/local";

export const uniteaSansRegular = localFont({
  src: "../public/fonts/UniteaSans-Regular.woff2",
  display: "swap",
  weight: "400",
  variable: "--font-unitea-sans-regular",
});

export const uniteaSansBold = localFont({
  src: "../public/fonts/UniteaSans-Bold.woff",
  display: "swap",
  weight: "700",
  variable: "--font-unitea-sans-bold",
});
