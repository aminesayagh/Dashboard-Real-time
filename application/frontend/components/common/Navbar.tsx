'use client';

import React, {  } from "react";
import { Navbar, NavbarBrand, NavbarContent, Link, Button } from '@nextui-org/react';
import Logo from "@/components/ui/logo/Logo";
import { text } from '@ui/typography/Typography.style'; 
import SwitchLanguage from "@ui/SwitchLanguage";
import { Lang } from "@/app/i18n/settings";
import { useTranslation, generatePageUrl } from "@tran/client";

export default function NavbarUi({
    lng
}: {
    lng: Lang;
}) {
    const { t } = useTranslation(lng, 'common');
    return (
        <Navbar isBordered maxWidth="xl"> 
            <NavbarBrand className='flex flex-row justify-start items-center gap-4'>
                <Logo size={40} alt='Logo' mode='dark' href={generatePageUrl(lng, 'home')} />
                <Link className={text({
                    mode: 'light',
                    degree: 'exchanged',
                    weight: 'semibold',
                    size: 'md'
                })} href={generatePageUrl(lng, 'home')}>
                    {t('header.logo')}
                </Link>
            </NavbarBrand>
            <NavbarContent className='hidden sm:flex gap4' justify="center">

            </NavbarContent>
            <NavbarContent className='flex gap4' justify="end">
                <SwitchLanguage lng={lng} />
                <Button as={Link} color='primary' variant='shadow' size='md' href={generatePageUrl(lng, 'login')} >
                    {t('header.login')}
                </Button>
            </NavbarContent>
        </Navbar>
    );
}