import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Hooks } from "./hooks";
import { HookChildrenProp } from "./types/children";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web Tecadi Test",
  description: "Teste fullstack para Tecadi",
};

export default function RootLayout({ children }: HookChildrenProp) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} h-screen`}>
        <Hooks>{children}</Hooks>
      </body>
    </html>
  );
}
