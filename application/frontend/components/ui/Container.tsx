import { createElement, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { cva, VariantProps } from 'class-variance-authority';

export const containerStyle = cva(['mx-auto w-full max-w-full z-container h-fit max-w-[1240px]'], {
    variants: {
        size: {
            full: '',
            sm: 'max-w-[640px]',
        }
    }
});

interface ContainerProps extends VariantProps<typeof containerStyle> {
    children: React.ReactNode | React.ReactNode[];
    id?: string;
    className?: string;
    as?: 'span' | 'div' | 'section' | 'footer' | 'header';
};

const Container = ({ as = 'div', children, className, ...props }: ContainerProps) => {
    const classNames = useMemo(() => twMerge(
        containerStyle(
            { size: props.size }
        ),
        className
    ), [props.size, className]);
    return (
        <>
            {createElement(as, {
                className: classNames,
                ...props
            }, children)}
        </>
    )
}

export default Container;