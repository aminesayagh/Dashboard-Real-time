
// import { useTranslation } from "../i18n/client";
import '../globals.css';
import Navbar from '@components/common/Navbar';

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
}
