import type { Metadata } from "next";
import "../globals.css";

import { Inter } from "next/font/google";
import NextUiProvider from "@providers/NextUiProvider";
import SessionProvider from "@providers/SessionProvider";
import { languages } from '@i18n/settings'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

import { dir } from 'i18next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faculty Management System",
  description: "Faculty Management System",
};

export default function RootLayout({
  children,
  params: {
    lng,
  }
}: Readonly<{
  children: React.ReactNode;
  params: {
    lng: 'fr' | 'en';
  };
}>) {
  return (
    <html lang={lng} dir={dir(lng)} className="light">
      <body className={inter.className}>
        <NextUiProvider >
          <SessionProvider>
            <main className='light bg-background text-foreground'>
              {children}
            </main>
          </SessionProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}
