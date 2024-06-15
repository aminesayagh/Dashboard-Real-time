import { Lang } from "@/app/i18n/settings";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
    title: "Faculty Management System",
    description: "Faculty Management System",
  };
  const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
    params: {
        lng,
    }
}: Readonly<{
    children: React.ReactNode;
    params: {
        lng: Lang
    };
}>) {
    return (
        <html lang={lng} dir='ltr' className="light">
            <body className={inter.className}>
                COO
                {children}
            </body>
        </html>
    );
}