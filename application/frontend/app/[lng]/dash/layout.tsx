import type { Metadata } from "next";
import '@app/globals.css';
import { Inter } from "next/font/google";
import NextUiProvider from "@providers/NextUiProvider";
import SessionProvider from "@providers/SessionProvider";
import { Lang, languages } from "@i18n/settings";
import Sidebar from "@common/sidebar";
import DashboardNavbar from "@common/dashboardNavbar";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

import { dir } from "i18next";

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
    lng: Lang
  };
}>) {
  return (
    <html lang={lng} dir={dir(lng)} className="light">
      <body className={inter.className}>
        <NextUiProvider>
          <SessionProvider>
            <main className="light bg-background text-foreground grid grid-cols-12 w-full min-h-screen">
              <div className='col-start-1 col-span-3 h-full'>
                <Sidebar lng={lng} />
              </div>
              <div className='col-start-4 col-span-9'>
                <DashboardNavbar lng={lng} /> 
                <div className="p-6">
                {children}

                </div>
            </div>
            </main>
          </SessionProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}
