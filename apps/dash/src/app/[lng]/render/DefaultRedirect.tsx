import { Lang, generatePageUrl, RouteSettingPath } from '../../i18n/settings';
import { useRouter } from 'next/router';

type RedirectProps = {
    link: RouteSettingPath;
    lng: Lang;
}

export type RedirectComponent = (props: RedirectProps) => JSX.Element;

export default function DefaultRedirect({ link, lng }: RedirectProps) {
    const router = useRouter();
    const redirectionLink = generatePageUrl(lng, link);
    router.push(redirectionLink);
    return <></>;
}