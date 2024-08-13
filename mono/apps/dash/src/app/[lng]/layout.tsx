
import type { Metadata } from "next";
import "@app/global.css";
import { dir } from "i18next";


import { Inter } from "next/font/google";
import { languages } from "../i18n/settings";
import NextUiProvider from "./providers/NextUiProvider";
import SessionProvider from "./providers/SessionProvider";
import QueryClientProvider from "./providers/QueryClientProvider";
import { twMerge as tw } from "tailwind-merge";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faculty Management System",
  description: "Faculty Management System",
};

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: {
    lng: "fr" | "en";
  };
}>) {

  return (
    <html lang={lng} dir={dir(lng)} className="light">
      <body className={inter.className}>
        <SessionProvider>
          <QueryClientProvider>
            <NextUiProvider>
              <main className={tw("light bg-background text-foreground")}>
                {children}
              </main>
            </NextUiProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
