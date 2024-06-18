// components/Icon.tsx
import React from 'react';
import ListIconComponents, { IconNames, IconProps as DefaultIconProps } from './IconsList';

interface IconProps extends React.SVGAttributes<SVGElement>, DefaultIconProps {
  name: IconNames;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = '1em', className, ...props }) => {
  const IconComponent = ListIconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon with name ${name} does not exist.`);
    return null;
  }

  const iconProps = {
    width: size,
    height: size,
    className,
    ...props
  };

  return <span
    style={{
        height: size,
        width: size,
    }} className={className}
  ><IconComponent {...iconProps} preserveAspectRatio="none" size='24' color='inherit' /></span>;
}

export default React.memo(Icon);
