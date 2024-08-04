'use client'
import Loading from '@ui/Loading';
import { Lang } from '@i18n/settings';
import { TStateUserRole } from '@/types/data';
import Profiled from './Profiled';
import { RedirectComponent } from './DefaultRedirect';

const hasRight = (rights: TStateUserRole[], userRights: TStateUserRole[]): boolean => rights.some(right => userRights.includes(right)); 

export function Authorized({ children, Redirect, lng, rights }: {
    children: JSX.Element,
    Redirect: RedirectComponent,
    lng: Lang,
    rights: TStateUserRole[],
}) {
    return (
        <Profiled redirect={Redirect} lng={lng}>
            {(session, profile) => {
                if (!session) return <Loading size='md' lang={lng} />;
                if (!hasRight(rights, profile?.rights)) {
                    return Redirect({
                        link: 'auth.login',
                        lng
                    });
                }
                return children;
            }}
        </Profiled>
    )
}