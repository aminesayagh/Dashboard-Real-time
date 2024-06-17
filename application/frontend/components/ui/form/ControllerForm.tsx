import type { FieldValues, UseFormStateReturn, ControllerRenderProps, Path, FieldError } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

type StateController<FV extends FieldValues> = {
  invalid: boolean;
  isTouched: boolean;
  isDirty: boolean;
  isValidating: boolean;
  formState: UseFormStateReturn<FV>;
};

const ControllerForm = <FV extends FieldValues>({
  children,
  name,
}: {
  children: (props: {
    field: ControllerRenderProps<FV, Path<FV>>;
    error: FieldError | undefined;
    state: StateController<FV>;
  }) => React.ReactElement;
  name: Path<FV>;
}) => {
  const { control, getFieldState, ...rest } = useFormContext<FV>();
  return (
    <Controller<FV>
      name={name}
      control={control}
      render={({
        field,
        fieldState: { error, invalid, ...otherState },
        ...other
      }) =>
        children({ field, error, state: { invalid, ...otherState, ...other } })
      }
    />
  );
};

export default ControllerForm;