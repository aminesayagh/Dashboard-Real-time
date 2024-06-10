import { Input } from "@nextui-org/react";

export default function Form() {
    return (
        <form className='flex flex-col gap-4'>
            <Input label='Email' placeholder='Enter your email' />
            <Input label='Password' placeholder='Enter your password' type='password' />
        </form>
    )
}