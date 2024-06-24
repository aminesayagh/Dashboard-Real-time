'use client'
import { useEffect } from 'react';
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

import { useProfile } from '@query/profile';

export function Profiled({ children, redirect, lng, sessions, rights }: {
    children: (profile: any) => JSX.Element,
    redirect: RouteSettingPath,
    lng: Lang,
    session: ValidatedSession,
    rights: TStateUserRole,
}) {
    const profile = useProfile();
    
    

}

export function Authorized({ children, redirect, lng, rights }: {
    children: (session: Session) => JSX.Element,
    redirect: RouteSettingPath,
    lng: Lang,
    rights: TStateUserRole,
}) {
    return (
        <Authenticated redirect={redirect} lng={lng}>
            {(session) => {
                return children(session);
            }}
        </Authenticated>
    )
}