"use client";
import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Lang } from "@i18n/settings";
import Link from "next/link";
import LoginForm from "@form/AuthEmailForm";
import AuthProvider from "@components/common/AuthProvider";
import DividerWithText from "@ui/DividerWithText";
import { generatePageUrl, useTranslation } from "@i18n/client";
import { twMerge as tw } from "tailwind-merge";
import { title, link, text } from "@components/ui/typography/Typo";

export default function Register({
  params: { lng },
}: {
  params: {
    lng: Lang;
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
          {t("auth_signup.title")}
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
            {" "}
            {t("auth_signup.already_account")}
          </p>
          <Link
            href={generatePageUrl(lng, "auth.login")}
            className={link({
              size: "sm",
              weight: "semibold",
              mode: "light",
              degree: "exchanged",
            })}
          >
            {t("auth_signup.login")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
