'use client';

import { RouteSettingPath ,Lang } from '@i18n/settings';
import React, { Suspense } from 'react';
import Authenticated from './Authenticated';
import Loading from '@ui/Loading';
import { Session } from '@/types/auth';

function WrapperProfiled({ session, children }: {
    session: Session,
    children: (session: Session, profile: any) => JSX.Element
}) {
    const profile = useProfile({ user_id: session.user.id });
    return children(session, {});
}

export default function Profiled({ children, redirect, lng }: {
    children: (session: Session ,profile: any) => JSX.Element,
    redirect: RouteSettingPath,
    lng: Lang
}) {
    return <Suspense fallback={<Loading size='md' lang={lng} />}>
        <Authenticated redirect={redirect} lng={lng}>
            {(session) => {
                return <WrapperProfiled session={session}>{children}</WrapperProfiled>;
            }}
        </Authenticated>
    </Suspense>
}