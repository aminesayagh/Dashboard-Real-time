import { cva } from 'class-variance-authority';
import { cx } from 'class-variance-authority';
import Style from './Typography.module.scss';
import { VariantProps } from 'class-variance-authority';

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
        degree: 'normal',
    },
    compoundVariants: [
        {
            mode: 'dark',
            degree: 'normal',
            class: 'text-black-800',
        },
        {
            mode: 'dark',
            degree: 'muted',
            class: 'text-black-700',
        },
        {
            mode: 'dark',
            degree: 'faded',
            class: 'text-black-500'
        },
        {
            mode: 'dark',
            degree: 'exchanged',
            class: 'text-black-100'
        },
        {
            mode: 'light',
            degree: 'normal',
            class: 'text-white-800',
        },
        {
            mode: 'light',
            degree: 'muted',
            class: 'text-white-700',
        },
        {
            mode: 'light',
            degree: 'faded',
            class: 'text-white-500'
        },
        {
            mode: 'light',
            degree: 'exchanged',
            class: 'text-white-100'
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

export const titleStyle = cva([textDefault, fontFamilyTitle], {
    variants: {
        weight: {
            bold: 'font-black',
            semibold: 'font-semibold',
            regular: 'font-regular',
        },
        size: {
            lg: Style['title_lg'],
            md: Style['title_md'],
            sm: Style['title_sm'],
            xs: Style['title_xs'],
        }
    },
    defaultVariants: {
        weight: 'semibold',
        size: 'md'
    }
});

export type TitlePropsExtended = VariantProps<typeof titleStyle> & TypographyColorDegreeProps;

export const textStyle = cva([textDefault, fontFamilyText, Style['text']], {
    variants: {
        weight: {
            bold: 'font-bold',
            semibold: 'font-semibold',
            regular: 'font-regular',
        },
        size: {
            lg: Style['text_lg'],
            md: Style['text_md'],
            sm: Style['text_sm'],
            xs: Style['text_xs'],
        }
    },
    defaultVariants: {
        weight: 'regular',
        size: 'md'
    }
});

export type TextPropsExtended = VariantProps<typeof textStyle> & TypographyColorDegreeProps;

export const title = ({ mode, degree, weight, size }: TitlePropsExtended) => cx(
    titleStyle({ weight, size }),
    typographyColorDegree({ mode, degree }),
);

export const display = ({ mode, degree, weight }: DisplayPropsExtended) => cx(
    displayStyle({ weight }),
    typographyColorDegree({ mode, degree }),
);

export const text = ({ mode, degree, weight, size }: TextPropsExtended) => cx(
    textStyle({ weight, size }),
    typographyColorDegree({ mode, degree }),
);