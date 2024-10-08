"use client";
import "@app/global.css";

import { Card, CardBody } from "@nextui-org/react";
import Container from "@ui/Container";


export default function Home(_: {
    params: {
        lng: "fr" | "en";
    };
    }) {
    return (
        <Container size='xs' className='py-24 flex flex-col gap-4 justify-start'>
            <Card>
                <CardBody>
                    <h1>Profile</h1>
                </CardBody>
            </Card>
        </Container>
    );
}