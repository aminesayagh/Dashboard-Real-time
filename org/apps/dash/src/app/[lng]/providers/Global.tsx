import { Lang } from "../../i18n/settings";
import "@app/globals.css";
import { dir } from 'i18next';
import { Inter } from "next/font/google";
import NextUiProvider from "../providers/NextUiProvider";
import SessionProvider from "../providers/SessionProvider";
import { twMerge as tw } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

export default function Global({
    lng,
    className = '',
    children,
}: {
    lng: Lang;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <html lang={lng} dir={dir(lng)} className='light' >
            <body className={inter.className}>
                <NextUiProvider>
                    <SessionProvider>
                        <div className={tw('light bg-background text-foreground', className)}>
                            {children}
                        </div>
                    </SessionProvider>
                </NextUiProvider>
            </body>
        </html>
    );
}