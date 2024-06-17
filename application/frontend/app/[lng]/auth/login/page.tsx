"use client";
import "@app/globals.css";
import Container from "@ui/Container";


import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Link from "next/link";
import { title } from "@ui/typography/Typography.style";
import LoginForm from "@form/LoginForm";
import { generatePageUrl, useTranslation } from '@tran/client';
import AuthProvider from "@common/AuthProvider";
import DividerWithText from "@ui/DividerWithText";
import { twMerge as tw } from "tailwind-merge"; 
import { link, text } from "@ui/typography/Typography.style";
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
    </Container>
  );
}

