import {Candal, Caveat} from "next/font/google";

export const candal = Candal({
  weight: "400",
  subsets: ['latin'],
  variable: ["--candal"],
  display: "swap",
})

export const caveat = Caveat({
  subsets: ["latin"],
  variable: ["--caveat"],
  display: "swap",
})