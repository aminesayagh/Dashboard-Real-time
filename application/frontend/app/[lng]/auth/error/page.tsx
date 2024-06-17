'use client'
import "@app/globals.css";
import Container from "@/app/[lng]/components/ui/Container";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
export default function Error({
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