import { createElement, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { cva, VariantProps } from 'class-variance-authority';

export const containerStyle = cva(['mx-auto w-full max-w-full z-container h-fit'], {
    variants: {
        size: {
            xl: 'max-w-[1280px] px-2 px-6 xl:px-12',
            sm: 'max-w-[940px] px-2 px-6',
            xs: 'max-w-[640px] px-2 px-6',
        }
    },
    defaultVariants: {
        size: 'xl'
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