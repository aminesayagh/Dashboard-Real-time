'use client'
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { Session } from '@/types/auth';
import { signOut } from '@auth/helpers';
import Loading from '@ui/Loading';
import Error from '@ui/Error';
import { Lang, RouteSettingPath, generatePageUrl } from '@i18n/settings';
import { TStateUserRole } from '@/types/data';
import Authenticated from './Authenticated';
import { ValidatedSession } from './Authenticated';
import Profiled from './Profiled';
import RedirectDefault, { RedirectComponent } from './DefaultRedirect';

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