'use client'
import Container from '../components/ui/Container';
import { Card, CardBody } from '@nextui-org/react';
import Footer from '../components/common/AuthFooter';

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
        <Container size='sm' as='section' className="flex flex-col items-start justify-start gap-4 py-24">
            <Card >
                <CardBody>
                    {children}
                </CardBody>
            </Card>
            <Footer lng={lng} />
        </Container>
    )
}