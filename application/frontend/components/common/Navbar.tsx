import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import { useSession } from "next-auth/react";
import Logo from "@/components/ui/logo/Logo";
import { text } from '@ui/typography/Typography.style'; 
import { Lang } from "@/app/i18n/settings";

export default function NavbarUi({
    lng
}: {
    lng: Lang;
}) {

    
    return (
        <Navbar isBordered>
            <NavbarBrand className='flex flex-row justify-start items-center gap-4'>
                <Logo size={40} alt='Logo' mode='dark' href='/' />
                <Link className={text({
                    mode: 'dark',
                    degree: 'normal',
                    weight: 'semibold',
                    size: 'xs'
                })} href={`${lng}/`}>
                    Fsac Dashboard
                </Link>
            </NavbarBrand>
            <NavbarContent className='hidden sm:flex gap4' justify="center">

            </NavbarContent>
            <NavbarContent className='flex gap4' justify="end">
                <Button as={Link} color='primary' href={`${lng}/auth/login`} variant='flat'>
                    Inscription
                </Button>
            </NavbarContent>
        </Navbar>
    );
}