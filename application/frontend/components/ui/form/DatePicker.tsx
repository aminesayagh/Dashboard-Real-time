import { DatePicker} from '@nextui-org/react';
import type { TDatePickerInput } from './types';

const DateInputUi: TDatePickerInput = ({ ...props }) => {
  return <DatePicker {...{ size: 'md', radius: 'sm', variant: 'flat', ...props }} />;
};

export default DateInputUi;