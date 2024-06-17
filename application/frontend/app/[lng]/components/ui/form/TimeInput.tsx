import { TimeInput } from '@nextui-org/react';

import type { TTimeInput } from './types';

const TimeInputUi: TTimeInput = ({ ...props }) => {
    return <TimeInput {...{ size: 'md', radius: 'sm', variant: 'flat', ...props }} />;
}

export default TimeInputUi;