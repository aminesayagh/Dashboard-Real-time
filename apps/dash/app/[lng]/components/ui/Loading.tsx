"use client";
import React from 'react';
import { Spinner } from "@nextui-org/react";
import { Lang } from '@/app/i18n/settings';


export default function Loading({
    size
}: {
    size: 'sm' | 'md' | 'lg';
    lang: Lang;
}) {
    return <><Spinner size={size} color='primary' /></>
}