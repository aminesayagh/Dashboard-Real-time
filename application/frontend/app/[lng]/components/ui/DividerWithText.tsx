'use client';
import { Divider } from "@nextui-org/divider";
import { twMerge as tw } from "tailwind-merge";
import { text } from "./typography/Typography.style";
export default function DividerWithText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-between items-center py-6">
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
