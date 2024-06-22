import { RadioGroup, Radio } from '@nextui-org/react';
import type { TRadioGroup, TRadio } from './types';

const RadioGroupUi: TRadioGroup = ({ size = 'md',...props }) => {
    return <RadioGroup { ...props } />;
}

export const RadioUi: TRadio = ({ ...props }) => {
    return <Radio { ...props } />;
}

export default RadioGroupUi;