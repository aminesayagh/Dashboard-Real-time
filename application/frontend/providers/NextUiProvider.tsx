'use client'
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider>
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default Providers;
