'use client'
import React from 'react'
import { Lang } from '@i18n/settings';

export default function View({ params }: { params: { lng: Lang } }) {
    return (
        <div>
        <h1>{params.lng} settings page</h1>
        </div>
    );
}