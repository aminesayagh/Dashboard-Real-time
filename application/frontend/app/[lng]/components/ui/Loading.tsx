"use client";
import React from 'react';
import { Spinner } from "@nextui-org/spinner";


export default function Loading({
    size
}: {
    size: 'sm' | 'md' | 'lg';
}) {
    return <><Spinner size={size} color='primary' /></>
}