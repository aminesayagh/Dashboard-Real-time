'use client';
// import { useTranslation } from "../i18n/client";
import '../globals.css';
import Navbar from '@components/common/Navbar';
import Container from '@ui/Container';
import { useTranslation } from '@tran/client';
import { text, title } from '@ui/typography/Typography.style';
import { twMerge as tw } from 'tailwind-merge';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Home({
  params: { lng },
}: {
  params: {
    lng: 'fr' | 'en';
  };
}) {

  const { t } = useTranslation(lng, 'common');

  return <>
    <Navbar lng={lng} />
    <Container as='section' size='full' className='min-h-screen' >
      <div className='flex flex-col gap-8 p-12 items-center justify-center'>
        <div className='flex flex-col gap-4 items-center justify-center'>
          <h1 className={
            tw(
            title({
              mode: 'light',
              degree: 'normal',
              weight: 'bold',
              size: 'h1'
            }), 'text-center')
          }>
            {t('home_title')}
          </h1>
          <p className={tw(text({
            mode: 'light',
            degree: 'normal',
            weight: 'semibold',
            size: 'md'
          }), 'text-center w-10/12')}>
            {t('home_body')}
          </p>
        </div>
        <div className='flex flex-row gap-4'>
          <Button color='primary' size='lg' as={Link} href={`${lng}/auth/login`}>
            {t('home_action')}
          </Button>
          <Button color='primary' size='lg' variant='flat' as={Link} href={`${lng}/auth/register`}>
            {t('home_action_secondary')}
          </Button>
        </div>
      </div>
    </Container>
    </>;
}
