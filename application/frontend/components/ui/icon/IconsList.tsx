import { SVGAttributes } from "react";

export interface IconProps extends SVGAttributes<SVGElement> {
  color?: string;
  size?: number | string;
}

const ListIconComponents = {} as const;

export type IconNames = keyof typeof ListIconComponents;

export default ListIconComponents as { [key in IconNames]: (props: IconProps) => JSX.Element };