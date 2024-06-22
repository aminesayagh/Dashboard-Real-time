import type { Metadata } from "next";
import "@app/globals.css";

import { Inter } from "next/font/google";
import NextUiProvider from "@providers/NextUiProvider";
import SessionProvider from "@providers/SessionProvider";
import { languages } from "@i18n/settings";
import Container from "@ui/Container";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

import { dir } from "i18next";
import AuthFooter from "../components/common/AuthFooter";

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
    <Container
      size="xs"
      className="py-24 flex flex-col gap-4 justify-start items-start"
      as="section"
    >
      {children}
      <AuthFooter lng={lng} />
    </Container>
  );
}
