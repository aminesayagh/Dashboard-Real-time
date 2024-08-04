'use client';

import { Lang } from '@i18n/settings';
import React, { Suspense } from 'react';
import Authenticated from './Authenticated';
import Loading from '@ui/Loading';
import { Session } from '@/types/auth';
import WrapperReactQuery from './WrapperReactQuery';
import f from '@/helpers/fetchApi';
import { UserAggregate } from '@/types/Models';
import DefaultRedirect, { RedirectComponent } from './DefaultRedirect';


function WrapperProfiled({ session, children }: {
    session: Session,
    children: (session: Session, profile: any) => JSX.Element
}) {
    return <WrapperReactQuery query={{
        queryKey: ['profile', session?.user?.id],
        queryFn: async () => {
            const response = await f<UserAggregate>('GET', `/users/${session?.user?.id}`, {
                id: session?.user?.id
            });
            return response;
        },
        
    }}>
        {({ data }) => {
            return children(session, data);
        }}
    </WrapperReactQuery>;
}

export default function Profiled({ children, redirect = DefaultRedirect, lng }: {
    children: (session: Session ,profile: any) => JSX.Element,
    redirect: RedirectComponent,
    lng: Lang
}) {
    return <Suspense fallback={<Loading size='md' lang={lng} />}>
        <Authenticated Redirect={redirect} lng={lng}>
            {(session) => {
                return <WrapperProfiled session={session}>{children}</WrapperProfiled>;
            }}
        </Authenticated>
    </Suspense>
}