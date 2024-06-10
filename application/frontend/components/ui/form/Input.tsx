import { Input, InputProps } from '@nextui-org/react'

export default function InputUi({
    ...props
}: InputProps ) {
    return (
        <Input {...props} />
    )
}