'use client';

import { RouteSettingPath ,Lang } from '@i18n/settings';
import React, { Suspense } from 'react';
import Authenticated from './Authenticated';
import Loading from '@ui/Loading';
import { Session } from '@/types/auth';
import WrapperReactQuery from './WrapperReactQuery';


function WrapperProfiled({ session, children }: {
    session: Session,
    children: (session: Session, profile: any) => JSX.Element
}) {
    return <WrapperReactQuery query={{
        queryKey: ['profile'],
        queryFn: async () => {
            
        }
    }}>
        {({ data }) => {
            return children(session, data);
        }}
    </WrapperReactQuery>;
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