'use client'
import React from 'react';
import { title, text, link } from "@ui/typography/Typography.style";

import { Navbar, NavbarContent } from '@nextui-org/react';

import { useTranslation } from '@i18n/client';
import { Lang } from "@i18n/settings";


export default function DashboardNavbar({ lng }: { lng: Lang }) {
    return (
        <Navbar shouldHideOnScroll>
            <NavbarContent className='' justify='start' >

            </NavbarContent>
            <NavbarContent className='' justify='end' >

            </NavbarContent>
        </Navbar>
    )
}