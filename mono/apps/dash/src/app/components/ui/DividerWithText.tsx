'use client';
import { Divider } from "@nextui-org/react";
import { twMerge as tw } from "tailwind-merge";
import { text } from "./typography/Typo";

export default function DividerWithText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center justify-between py-6">
      <Divider as="div" className="flex-1" />
      <span className={tw("px-4 uppercase select-none", text({
        size: 'sm',
        weight: 'regular',
        mode: 'light',
        degree: 'exchanged'
      }))}>{children}</span>
      <Divider as="div" className="flex-1" />
    </div>
  );
}
