import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VLibrasWidget from "@/components/VLibrasWidget"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPECTRA",
  description: "Plataforma de Inclusão e Neurodiversidade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <VLibrasWidget />
      </body>
    </html>
  );
}