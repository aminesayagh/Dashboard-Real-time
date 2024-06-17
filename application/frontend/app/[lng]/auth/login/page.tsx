"use client";
import "@app/globals.css";


import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Container from "@/app/[lng]/components/ui/Container";
import Link from "next/link";
import { title } from "@/app/[lng]/components/ui/typography/Typography.style";
import { twMerge as tw } from "tailwind-merge"; 
import LoginForm from "@/app/[lng]/components/form/AuthEmailForm";
import { generatePageUrl, useTranslation } from '@tran/client';
import AuthProvider from "@/app/[lng]/components/common/AuthProvider";
import DividerWithText from "@/app/[lng]/components/ui/DividerWithText";
import { link, text } from "@/app/[lng]/components/ui/typography/Typography.style";
export default function Home({
  params: { lng },
}: {
  params: {
    lng: "fr" | "en";
  };
}) {
  const { t } = useTranslation(lng, "common");

  return (
    <Container size='xs' className='py-24 flex flex-col gap-4 justify-start items-start' as='div' >
      <Card className='w-full py-6 px-3'>
        <CardHeader>
        <h3 className={tw(title({
          size: 'h4',
          weight: 'semibold',
          mode: 'light',
          degree: 'exchanged'
        }))} >{t('login')}</h3>
        </CardHeader>
        <CardBody>
          <LoginForm />
          <DividerWithText>{t('or')}</DividerWithText>
          <AuthProvider />
        </CardBody>
        <CardFooter>
          <div className='w-full text-center'>
            <p className={tw(text({
              size: 'sm',
              weight: 'regular',
              mode: 'light',
              degree: 'faded',
            }), 'inline pr-1')}> {t('auth_login.no_account')}</p>
            <Link href={generatePageUrl(lng, 'register')} as={`/${lng}/auth/register`} className={link({
              size: 'sm',
              weight: 'semibold',
              mode: 'light',
              degree: 'exchanged',
            })} >
              {t('auth_login.get_account')}
            </Link>
          </div>
        </CardFooter>
      </Card>
      <div className='flex flex-row justify-center w-full items-center py-2 opacity-80'>
        <p className={text({
              size: 'sm',
              weight: 'regular',
              mode: 'light',
              degree: 'faded',
            })}>{t('footer.message')}</p>
      </div>
    </Container>
  );
}

