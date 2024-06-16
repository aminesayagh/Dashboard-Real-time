import React, { useEffect, useState} from 'react';
import { getProviders, signIn, LiteralUnion, ClientSafeProvider, useSession } from 'next-auth/react';
// import GithubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { useTranslation } from 'react-i18next';
import Google from '@public/icons/google.png';
import Github from '@public/icons/github.png';
import Image from 'next/image';

const providerImage = {
    google: Google,
    github: Github
} as const;

type ProviderImage = keyof typeof providerImage;

const Provider = ({ id, name, signIn }: {
    id: string;
    name: ProviderImage;
    signIn: (provider: string) => void;
}) => {
    const { t } = useTranslation('form');
    return (
        <button onClick={() => signIn(id)}>
            <Image src={providerImage[name]} alt={name} width={24} height={24} />
            {t(`buttons.continue_with_${name}`)}
        </button>
    );
};

export default function Providers() {
    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null>();
    const { status } = useSession();

    useEffect(() => {
        const setTheProviders = async () => {
            setProviders(await getProviders());
        }
        setTheProviders();
    }, []);
    if (status === 'loading') {
        return <div>Loading...</div>;
    }
    console.log('Status: ',providers, status);
    return !!providers ? Object.values(providers).map((provider) => 
        <Provider key={provider.name} {...{
            id: provider.id, name: provider.name as ProviderImage, signIn: signIn
        }} />
    ) : <div>No providers</div>;
}