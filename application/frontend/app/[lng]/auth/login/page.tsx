'use client';
import Navbar from "@/components/common/Navbar";
import "@app/globals.css";
import Container from "@ui/Container";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { title } from "@ui/typography/Typography.style";
import LoginForm from "@/components/form/LoginForm";
export default function Home({
  params: { lng },
}: {
  params: {
    lng: "fr" | "en";
  };
}) {
  return (
    <>
      <Navbar lng={lng} />
      <Container as="section" size="sm" className='h-screen'>
        <div>

        </div>
        <Card className='py-4'>
            <CardHeader className=''>
                <h3 className={title({
                    mode: 'light',
                    degree: 'normal',
                    weight: 'bold',
                    size: 'h3'
                })} >
                    Login
                </h3>
            </CardHeader>
            <CardBody>
                <LoginForm />
            </CardBody>
        </Card>
      </Container>
    </>
  );
}
