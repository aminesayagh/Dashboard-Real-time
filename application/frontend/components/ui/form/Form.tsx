
import React from 'react'

import type { TForm } from './types'

const Form: TForm = ({ ...props }) => {
    return (
        <form {...props}>
            {props.children}
        </form>
    )
}

export default Form;