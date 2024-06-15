import { RadioGroup, Radio } from '@nextui-org/radio';
import type { TRadioGroup, TRadio } from './types';

const RadioGroupUi: TRadioGroup = ({ ...props }) => {
    return <RadioGroup {...{ size: 'md', ...props }} />;
}

export const RadioUi: TRadio = ({ ...props }) => {
    return <Radio { ...props } />;
}

export default RadioGroupUi;