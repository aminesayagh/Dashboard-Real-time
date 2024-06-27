'use client';

import React from 'react'

import { TForm, TFormComponent } from './types';
import { FormProvider } from 'react-hook-form';

const Form: TFormComponent = ({ methods,...props }) => {
    if (!!methods) {
        return (
            <FormProvider {...methods}>
                <form {...props} >
                    {props.children}
                </form>
            </FormProvider>
        )
    }
    return (
        <form {...props}>
            {props.children}
        </form>
    )
}

export default Form as TForm;