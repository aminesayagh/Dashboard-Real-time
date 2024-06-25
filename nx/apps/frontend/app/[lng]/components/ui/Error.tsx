'use client'
import React from 'react';
import { Lang } from '@i18n/settings';

export default function Error({ lang, message }: {
    lang: Lang,
    message: string
}) {
    return <p>{message}</p>
};