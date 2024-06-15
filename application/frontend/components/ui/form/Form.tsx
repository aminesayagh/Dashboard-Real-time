
import React from 'react'

import { TForm } from './types'

const Form = ({ ...props }) => {
    return (
        <form {...props}>
            {props.children}
        </form>
    )
}

export default Form as TForm;