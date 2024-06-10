import Navbar from '@/components/common/Navbar';
import '@app/globals.css';

export default function Home({
    params: { lng },
    }: {
    params: {
        lng: 'fr' | 'en';
    };
    }) {
    return <>
        <Navbar lng={lng} />
        </>;
};