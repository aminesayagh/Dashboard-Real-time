"use client";
import "@app/globals.css";

import { Card, CardBody } from "@nextui-org/react";
import Container from "@/app/[lng]/components/ui/Container";


export default function Home(_: {
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