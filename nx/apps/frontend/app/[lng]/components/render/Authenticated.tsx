'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { Session } from '@/types/auth';
import { signOut } from '@auth/helpers';
import Loading from '@ui/Loading';
import Error from '@ui/Error';
import { Lang, RouteSettingPath, generatePageUrl } from '@i18n/settings';
import { NonNullableType } from '@/utils/types/non-nullable';
export type ValidatedSession = NonNullableType<Session<true>>;
export default function Authenticated({ children, redirect, lng }: {
    children: (session: ValidatedSession) => JSX.Element,
    redirect: RouteSettingPath,
    lng: Lang
}) {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(generatePageUrl(lng, redirect));
        }
    }, [status, router, lng, redirect]);

    

    if (status === "loading") {
        return <Loading size='md' lang={lng} />;
    }

    if (status === 'unauthenticated') {
        router.push(generatePageUrl(lng, redirect));
        return <Error lang={lng} message='unauthenticated' />
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