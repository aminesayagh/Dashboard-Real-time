import React, { SVGAttributes } from "react";

// import * as LocalIcons from "@public/icons/IconsList";
import * as LocalIcons from '../../../../../../public/icons/IconsList';

export interface IconProps extends SVGAttributes<SVGElement> {
  color?: string;
  size?: number | string;
}
import { objectKeys } from '@org/shared-ts';

const ListIconComponents: Record<keyof typeof LocalIcons, React.FC<IconProps>> = objectKeys(LocalIcons).reduce((acc, key) => {
  const IconComponent = (LocalIcons as Record<keyof typeof LocalIcons, React.FC<IconProps>>)[key];
  return { ...acc, [key]: IconComponent };
}, {}) as Record<keyof typeof LocalIcons, React.FC<IconProps>>;




export type IconNames = keyof typeof ListIconComponents;

export default ListIconComponents as {
  [key in IconNames]: React.FC<IconProps>;
};