'use client'
import Link from "next/link";
import { LinkProps } from "next/link";
import SvgResizer from "react-svg-resizer";
import { twMerge as tw } from "tailwind-merge";
import LogoImage from "@public/icons/google.png";


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
      {/* <SvgResizer size={size}>

      </SvgResizer> */}
      Logo Image
    </Link>
  );
};

export default Logo;
