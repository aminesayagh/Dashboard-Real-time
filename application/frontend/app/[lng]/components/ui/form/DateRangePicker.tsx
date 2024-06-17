import { DateRangePicker } from '@nextui-org/react';
import type { TDateRangePickerInput } from './types';

const DateRangePickerUi: TDateRangePickerInput = ({ ...props }) => {
  return <DateRangePicker {...{ size: 'md', radius: 'sm', variant: 'flat', ...props }} />;
};

export default DateRangePickerUi;