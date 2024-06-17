import FormUi from '@ui/form';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler, Controller, useFormContext, FieldError, UseFormStateReturn, FieldValues, Path, ControllerRenderProps, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

type StateController<FV extends FieldValues> = {
    invalid: boolean,   
    isTouched: boolean;
    isDirty: boolean;
    isValidating: boolean;
    formState: UseFormStateReturn<FV>
}
const ControllerForm = <FV extends FieldValues>({ children, name }: {
    children: (props: {
        field: ControllerRenderProps<FV, Path<FV>>,
        error: FieldError | undefined,
        state: StateController<FV>,
    }) => React.ReactElement,
    name: Path<FV>,
}) => {
    const { control, getFieldState, ...rest } = useFormContext<FV>();
    return (
        <Controller<FV>
            name={name}
            control={control}
            render={({ field, fieldState: {
                error, invalid, ...otherState
            }, ...other }) => (
                children({ field, error, state: {invalid, ...otherState, ...other} })
            )}
        />
    )
}



export default function Form() {
    const { t } = useTranslation('form');
    const schema = z.object({
        email: z.string({
            message: t('errors.invalid_format', { field: t('fields.email.label') }),
        }).email({
            message: t('errors.invalid_format', { field: t('fields.email.label') }),
        }),
    });
    type FormValues = z.infer<typeof schema>;
    const methods = useForm<FormValues>({
        resolver: zodResolver(schema),
    });



    const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => console.log(data);
    return (
        <FormProvider {...methods}>
            <FormUi className='flex flex-col gap-4' onSubmit={methods.handleSubmit(onSubmit)} >
                <ControllerForm name='email' >
                    {({ field, error, state }) => (
                        <FormUi.Input 
                            label={t('fields.email.label')} 
                            type='email'
                            placeholder={t('fields.email.placeholder')}
                            defaultValue={t('fields.email.default')}  {...field} {...{
                                errorMessage: error?.message,
                                isInvalid: state.invalid,
                            }}/>
                    )}
                </ControllerForm>
                <Button type='submit' color='primary' size='lg'>
                    {t('buttons.continue_with_email')}
                </Button>
            </FormUi>
        </FormProvider>
    )
}