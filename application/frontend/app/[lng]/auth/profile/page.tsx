"use client";
import "@app/globals.css";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Container from "@/app/[lng]/components/ui/Container";
import Link from "next/link";

export default function Home({
    params: { lng },
    }: {
    params: {
        lng: "fr" | "en";
    };
    }) {
    return (
        <Container size='xs' className='py-24 flex flex-col gap-4 justify-start'>
        <Card>
            <CardBody>
            Error message
            </CardBody>
        </Card>
        </Container>
    );
}