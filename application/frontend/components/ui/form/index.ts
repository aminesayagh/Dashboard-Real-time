import Form from './Form';
import Input from './Input';
import Password from './Password';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';
import Select, { SelectItemUi as SelectItem } from './Select';
import RadioGroup, { RadioUi as Radio } from './Radio';
import { TForm } from './types';

Form.Input = Input;
Form.Password = Password;
Form.DateInput = DateInput;
Form.TimeInput = TimeInput;
Form.DatePicker = DatePicker;
Form.DateRangePicker = DateRangePicker;
Form.RadioGroup = RadioGroup;
Form.Radio = Radio;
Form.Select = Select;
Form.SelectItem = SelectItem;
Form.Textarea = Form.Textarea;

export { Input };
export default Form as TForm;