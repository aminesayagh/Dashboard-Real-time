
type TFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
import type { InputProps, DateInputProps, TimeInputProps, DateRangePickerProps, RadioGroupProps, RadioProps, SelectProps, SelectItemProps, TextAreaProps } from '@nextui-org/react';
import React from 'react';

export type TInput = React.FC<InputProps>;

export type TDateInput = React.FC<DateInputProps>;

export type TTimeInput = React.FC<TimeInputProps>;

export type TDatePickerInput = React.FC<DateInputProps>;

export type TDateRangePickerInput = React.FC<DateRangePickerProps>;

export type TRadioGroup = React.FC<RadioGroupProps>;
export type TRadio = React.FC<RadioProps>;

export type TSelect = React.FC<SelectProps>;

export type TSelectItem = React.FC<SelectItemProps>;

export type TTextarea = React.FC<TextAreaProps>;

export type TForm = React.FC<TFormProps> & {
    Input: TInput;
    Password: TInput;
    DateInput: TDateInput;
    TimeInput: TTimeInput;
    DatePicker: TDatePickerInput;
    DateRangePicker: TDateRangePickerInput;
    RadioGroup: TRadioGroup;
    Radio: TRadio;
    Select: TSelect;
    SelectItem: TSelectItem;
    Textarea: TTextarea;
}