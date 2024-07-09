'use client'
import React, { useEffect, useState } from "react";
import {
  getProviders,
  signIn,
  LiteralUnion,
  useSession,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { useTranslation } from "react-i18next";
import Loading from "@components/ui/Loading";
import Google from "@public/icons/google.png";
import Github from "@public/icons/github.png";
import Image from "next/image";

import { Button } from "@nextui-org/react";
import { Lang } from "@/app/i18n/settings";

const providerImage = {
  google: Google,
  github: Github,
} as const;

type ProviderImage = keyof typeof providerImage;

const Provider = ({
  id,
  name,
  signIn,
}: {
  id: string;
  name: ProviderImage;
  signIn: (provider: string) => void;
}) => {
  const { t } = useTranslation("form");
  return (
    <Button
      onClick={() => signIn(id)}
      variant="bordered"
      size="lg"
      startContent={
        <Image src={providerImage[name.toLocaleLowerCase() as ProviderImage]} alt={name} width={24} height={24} />
      }
    >
      {t(`buttons.continue_with_${name.toLocaleLowerCase()}`)}
    </Button>
  );
};

export default function Providers({ lng }: { lng: Lang }) {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    { id: string; name: string }
  > | null>();
  const { status } = useSession();

  useEffect(() => {
    const setTheProviders = async () => {
      try {
        setProviders(await getProviders());
      } catch (err) {
        console.error(err);
      }
    };
    setTheProviders();
  }, []);
  if (status === "loading") {
    return <Loading size='md' lang={lng} />;
  }
  return (
    <div className='flex flex-col gap-2'>
      {!!providers ? (
        Object.values(providers).map((provider) => (
          provider.name === "Email" ? null : 
          <Provider
            key={provider.name}
            {...{
              id: provider.id,
              name: provider.name as ProviderImage,
              signIn: signIn,
            }}
          />
        ))
      ) : (
        <Loading size='md' lang={lng} />
      )}
    </div>
  );
}