import { Playfair_Display, Plus_Jakarta_Sans, Kaushan_Script } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const scriptFont = Kaushan_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata = {
  title: "Nasi Goreng Jaya Bintang | Solusi Untuk Lapar Mu",
  description:
    "Nasi Goreng Jaya Bintang di Jl. Sultan Agung, Sumberbaru, Jember. Nasi goreng dan mie goreng dengan cita rasa lezat, harga terjangkau. Pesan langsung via WhatsApp.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
