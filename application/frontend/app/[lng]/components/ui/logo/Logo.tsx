'use client'
import Link, { LinkProps } from "next/link";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import LogoImage from "@public/logo.svg";

type TLogoMode = "dark" | "light";
interface LogoProps extends Omit<LinkProps, "size" | "degree" | "children"> {
  alt: string;
  size: number;
  mode: TLogoMode;
}

const Logo = ({ alt, mode, size, ...props }: LogoProps) => {
  return (
    <Link
      className={
        twMerge("flex flex-row items-center justify-center gap-2") as string
      }
      {...props}
    >
      <Image
        className="w-20"
        src={LogoImage}
        alt={alt}
        width={size}
        height={size}
      />
    </Link>
  );
};

export default Logo;
