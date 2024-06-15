"use client";
import Navbar from "@/components/common/Navbar";
import "@app/globals.css";
import Container from "@ui/Container";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { title } from "@ui/typography/Typography.style";
import LoginForm from "@form/LoginForm";
import LoginProviderForm from "@form/LoginProviderForm";
import { useTranslation, generatePageUrl } from '@tran/client';
import DividerWithText from "@ui/DividerWithText";
export default function Home({
  params: { lng },
}: {
  params: {
    lng: "fr" | "en";
  };
}) {
  const { t } = useTranslation(lng, "common");

  return (
    <Container>
      <Card>
        <h3
          className={title({
            mode: "light",
            degree: "normal",
            weight: "bold",
            size: "h3",
          })}
        >
          {t("auth_login.title")}
        </h3>
        <LoginForm />
        <DividerWithText>{t("auth_login.or")}</DividerWithText>
        <LoginProviderForm />
        <div className="flex flex-row w-full justify-center gap-1">
          <span>{t("auth_login.no_account")}</span>
          <a href={generatePageUrl(lng, 'register')}>{t("auth_login.register")}</a>
        </div>
      </Card>
    </Container>
  );
}
