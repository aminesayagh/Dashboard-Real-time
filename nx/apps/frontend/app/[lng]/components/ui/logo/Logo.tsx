'use client'
import Link, { LinkProps } from "next/link";

import { twMerge as tw } from "tailwind-merge";
import LogoImage from "@public/logo.svg";
import SvgResizer from "react-svg-resizer";


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
        tw("flex flex-row items-center justify-center gap-2") as string
      }
      {...props}
    >
      <SvgResizer size={size}>
        <LogoImage className='' alt={alt} />
      </SvgResizer>
    </Link>
  );
};

export default Logo;
