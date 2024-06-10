import React from 'react';
import { Input, InputProps } from '@nextui-org/react'
import Icon from '@ui/icon';

export default function InputUi({
    ...props
}: InputProps ) {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);


    return (
        <Input variant='bordered' endContent={
            <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                {isVisible ? <Icon name='eye-off' size={20} /> : <Icon name='eye' size={20} /> }
            </button>
        }
        type={isVisible ? 'text' : 'password'}
        className='max-w-xs'
        {...props} />
    )
}