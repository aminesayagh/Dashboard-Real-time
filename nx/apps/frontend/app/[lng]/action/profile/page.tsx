import { auth } from '@auth';

export default async function ActionProfile() {
    const session = await auth();

    console.log(session?.user);
    return (
        <div></div>
    )
}