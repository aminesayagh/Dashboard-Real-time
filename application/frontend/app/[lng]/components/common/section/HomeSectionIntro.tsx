"use strict";

import { Lang } from "@/app/i18n/settings";
import Container from "@/app/[lng]/components/ui/Container";
import { Button } from "@nextui-org/react";
import { title, text } from "@/app/[lng]/components/ui/typography/Typography.style";
import { twMerge as tw } from "tailwind-merge";
import { useTranslation } from '@tran/client';
import Link from "next/link";

export default function Section({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang, "common");

  return (
    <Container as="section" size='sm' className="">
      <div className="flex flex-col gap-16 px-12 py-24 items-center justify-center">
        <div className="flex flex-col gap-8 items-center justify-center">
          <h1
            className={tw(
              title({
                mode: "light",
                degree: "exchanged",
                weight: "bold",
                size: "h1",
              }),
              "text-center"
            )}
          >
            {t("home_title")}
          </h1>
          <p
            className={tw(
              text({
                mode: "light",
                degree: "normal",
                weight: "regular",
                size: "md",
              }),
              "text-center w-10/12"
            )}
          >
            {t("home_body")}
          </p>
        </div>
        <div className="flex flex-row gap-6">
          <Button
            color="primary"
            size="lg"
            variant="shadow"
            as={Link}
            href={`${lang}/auth/login`}
          >
            {t("home_action")}
          </Button>
          <Button
            color="primary"
            size="lg"
            variant="flat"
            as={Link}
            href={`${lang}/auth/register`}
          >
            {t("home_action_secondary")}
          </Button>
        </div>
      </div>
    </Container>
  );
}
