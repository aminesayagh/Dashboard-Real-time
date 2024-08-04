"use client";

import Link from "next/link";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

import { generatePageUrl, useTranslation } from "@i18n/client";

import DividerWithText from "@ui/DividerWithText";
import { link, text } from "@ui/typography/Typography.style";
import { title } from "@ui/typography/Typography.style";
import { twMerge as tw } from "tailwind-merge";
import LoginForm from "@form/AuthEmailForm";
import AuthProvider from "@components/common/AuthProvider";

export default function Home({
  params: { lng },
}: {
  params: {
    lng: "fr" | "en";
  };
}) {
  const { t } = useTranslation(lng, "common");

  return (
    <Card className="w-full py-6 px-3">
      <CardHeader>
        <h3
          className={tw(
            title({
              size: "h4",
              weight: "semibold",
              mode: "light",
              degree: "exchanged",
            })
          )}
        >
          {t("auth_login.title")}
        </h3>
      </CardHeader>
      <CardBody>
        <LoginForm />
        <DividerWithText>{t("or")}</DividerWithText>
        <AuthProvider lng={lng} />
      </CardBody>
      <CardFooter>
        <div className="w-full text-center">
          <p
            className={tw(
              text({
                size: "sm",
                weight: "regular",
                mode: "light",
                degree: "faded",
              }),
              "inline pr-1"
            )}
          >
            {t("auth_login.no_account")}
          </p>
          <Link
            href={generatePageUrl(lng, "auth.register")}
            as={`/${lng}/auth/register`}
            className={link({
              size: "sm",
              weight: "semibold",
              mode: "light",
              degree: "exchanged",
            })}
          >
            {t("auth_login.get_account")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
