import localFont from "next/font/local";
import {Unbounded} from "next/font/google";

export const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

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
