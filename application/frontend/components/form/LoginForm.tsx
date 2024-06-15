import FormUi from '@ui/form';


export default function Form() {
    return (
        <FormUi className='flex flex-col gap-4'>
            <FormUi.Input label='Email' placeholder='Enter your email' />
            <FormUi.Input label='Password' placeholder='Enter your password' type='password' />
        </FormUi>
    )
}