
import { VariantProps,cva } from 'class-variance-authority';
import { twMerge as tw } from 'tailwind-merge';
// import Style from './Typography.module.scss';

const textDefault = 'inline-block align-middle';
const fontFamilyTitle = 'font-sans';
const fontFamilyText = 'font-sans';

export const typographyColorDegree = cva('', {
    variants: {
        mode: {
            dark: '',
            light: '',
        },
        degree: {
            normal: '',
            muted: '',
            faded: '',
            exchanged: '',
        }
    },
    defaultVariants: {
        mode: 'dark',
        degree: 'faded',
    },
    compoundVariants: [
        {
            mode: 'dark',
            degree: 'normal',
            class: 'text-zinc-800',
        },
        {
            mode: 'dark',
            degree: 'muted',
            class: 'text-zinc-700',
        },
        {
            mode: 'dark',
            degree: 'faded',
            class: 'text-zinc-500'
        },
        {
            mode: 'dark',
            degree: 'exchanged',
            class: 'text-zinc-100'
        },
        {
            mode: 'light',
            degree: 'normal',
            class: 'text-zinc-600',
        },
        {
            mode: 'light',
            degree: 'muted',
            class: 'text-zinc-700',
        },
        {
            mode: 'light',
            degree: 'faded',
            class: 'text-zinc-800'
        },
        {
            mode: 'light',
            degree: 'exchanged',
            class: 'text-zinc-900'
        },
    ]
});

export type TypographyColorDegreeProps = VariantProps<typeof typographyColorDegree>;

export const displayStyle = cva([textDefault, fontFamilyTitle], {
    variants: {
        weight: {
            bold: 'font-black',
            semibold: 'font-bold',
            regular: 'font-regular',
        },
    },
    defaultVariants: {
        weight: 'bold'
    }
});

export type DisplayPropsExtended = VariantProps<typeof displayStyle> & TypographyColorDegreeProps;

export const titleStyle = cva([textDefault, fontFamilyTitle, 'title'], {
    variants: {
        weight: {
            bold: 'font-black',
            semibold: 'font-semibold',
            regular: 'font-regular',
        },
        size: {
            h1: 'title_h1',
            h2: 'title_h2',
            h3: 'title_h3',
            h4: 'title_h4',
            h5: 'title_h5',
            h6: 'title_h6',
        }
    },
    defaultVariants: {
        weight: 'semibold',
        size: 'h2'
    }
});

export type TitlePropsExtended = VariantProps<typeof titleStyle> & TypographyColorDegreeProps;

export const textStyle = cva([textDefault, fontFamilyText, 'text'], {
    variants: {
        weight: {
            bold: 'font-bold',
            semibold: 'font-semibold',
            regular: 'font-regular',
        },
        size: {
            lg: 'text_lg',
            md: 'text_md',
            sm: 'text_sm',
            xs: 'text_xs',
        }
    },
    defaultVariants: {
        weight: 'regular',
        size: 'md'
    }
});

export type TextPropsExtended = VariantProps<typeof textStyle> & TypographyColorDegreeProps;

export const title = ({ mode = 'light', degree = 'faded', weight, size }: TitlePropsExtended) => tw(
    titleStyle({ weight, size }),
    typographyColorDegree({ mode, degree }),
);

export const display = ({ mode, degree = 'faded', weight }: DisplayPropsExtended) => tw(
    displayStyle({ weight }),
    typographyColorDegree({ mode, degree }),
);

export const text = ({ mode, degree = 'faded', weight, size }: TextPropsExtended) => tw(
    textStyle({ weight, size }),
    typographyColorDegree({ mode, degree }),
);

export const link = ({ mode, degree = 'faded', weight, size }: TextPropsExtended) => tw(
    text({ mode, degree, weight, size }),
    'cursor-pointer text-primary',
);