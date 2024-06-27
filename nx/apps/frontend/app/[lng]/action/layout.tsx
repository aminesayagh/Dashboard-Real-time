'use client'
import Container from '@ui/Container';
import { Card, CardBody } from '@nextui-org/react';
import Footer from '@common/AuthFooter';

export default function Action({
    children,
    params: { lng },
  }: Readonly<{
    children: React.ReactNode;
    params: {
      lng: "fr" | "en";
    };
  }>) {
    return (
        <Container size='sm' as='section' className="py-24 flex flex-col gap-4 justify-start items-start">
            <Card >
                <CardBody>
                    {children}
                </CardBody>
            </Card>
            <Footer lng={lng} />
        </Container>
    )
}