// components/Icon.tsx
import React from "react";
import ListIconComponents, {
  IconNames,
  IconProps as DefaultIconProps,
} from "./IconsList";
import SvgResizer from "react-svg-resizer";

interface IconProps extends React.SVGAttributes<SVGElement>, DefaultIconProps {
  name: IconNames;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({
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
    <SvgResizer size={size}>
      <IconComponent
        color="inherit"
        preserveAspectRatio="xMidYMid meet"
        className={className}
        height='100' width='100'
        {...props}
      />
    </SvgResizer>
  );
};

export default React.memo(Icon);
