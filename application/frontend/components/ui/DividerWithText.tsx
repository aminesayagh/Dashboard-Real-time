import { Divider } from '@nextui-org/divider';

export default function DividerWithText({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='flex flex-row gap-4 items-center'>
            <Divider />
            <span>{children}</span>
            <Divider />
        </div>
    );
}