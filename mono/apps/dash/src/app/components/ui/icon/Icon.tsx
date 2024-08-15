// components/Icon.tsx
import React, { 
  SVGAttributes,
  FC
} from "react";
import SvgResizer from "react-svg-resizer";

import ListIconComponents, {
  IconNames,
  IconProps as DefaultIconProps,
} from "./IconsList";

interface IconProps extends SVGAttributes<SVGElement>, DefaultIconProps {
  name: IconNames;
  className?: string;
  size?: number | string;
}

const Icon: FC<IconProps> = ({
  name,
  size = 24,
  className,
  ...props
}) => {
  const IconComponent = ListIconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon with name ${name} does not exist.`);
    return null;
  }

  return (
    <SvgResizer size={parseInt(size.toString(), 10)}>
      <IconComponent
        color="inherit"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        height={100} width={100}
        {...props}
      />
    </SvgResizer>
  );
};

export default React.memo(Icon);
