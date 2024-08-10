'use client';

import { DateInput } from '@nextui-org/react';
import type { TDateInput } from './types';

const DateInputUi: TDateInput = ({ ...props }) => {
  return <DateInput {...{ size: 'md', radius: 'sm', variant: 'flat', ...props }} />;
};

export default DateInputUi;