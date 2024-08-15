'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { Session } from '../../../types/auth';
import { signOut } from '../../../utils/auth/helpers';
import Loading from '../components/ui/Loading';
import Error from '../components/ui/Error';
import { Lang } from '../../i18n/settings';
import { NonNullableType } from '@org/shared-ts';
import DefaultRedirect, { RedirectComponent } from './DefaultRedirect';
export type ValidatedSession = NonNullableType<Session<true>>;


export default function Authenticated({ children, Redirect = DefaultRedirect, lng }: {
    children: (session: ValidatedSession) => JSX.Element,
    Redirect: RedirectComponent,
    lng: Lang
}) {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            Redirect({ link: 'auth.login', lng });
        }
    }, [status, router, lng, Redirect]);

    

    if (status === "loading") {
        return <Loading size='md' lang={lng} />;
    }

    if (status === 'unauthenticated') {
        return Redirect({ link: 'auth.login', lng })
    }

    if (!session) {
        return <Loading size='md' lang={lng} />;
    }

    if (status === 'authenticated' && !session) {
        signOut();
        return <Error lang={lng} message='Authenticated but no data' />
    }

    return children(session as ValidatedSession);
} 