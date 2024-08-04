'use client'
import { Lang } from "@/app/i18n/settings";
import { Navbar as NavbarUi, NavbarContent } from '@nextui-org/react';
import SwitchLanguage from "@ui/SwitchLanguage";

export default function Navbar({ lng }: { lng: Lang }) {
    return <NavbarUi isBordered maxWidth='full' shouldHideOnScroll>
    <NavbarContent className='' justify='start' >
        <h4>Title</h4>
    </NavbarContent>
    <NavbarContent className='' justify='end' >
        <SwitchLanguage lng={lng} />
    </NavbarContent>
</NavbarUi>
}