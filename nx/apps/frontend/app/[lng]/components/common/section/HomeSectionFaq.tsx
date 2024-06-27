"use client";

import { Lang } from "@/app/i18n/settings";
import Container from "@ui/Container";
import { useTranslation } from "@i18n/client";
import { title } from "@ui/typography/Typography.style";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { text } from "@ui/typography/Typography.style";
import { twMerge as tw } from "tailwind-merge";

const motionProps = {
  variants: {
    enter: {
      y: 0,
      opacity: 1,
      height: "auto",
      transition: {
        height: {
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 1,
        },
        opacity: {
          easings: "ease",
          duration: 1,
        },
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      height: 0,
      transition: {
        height: {
          easings: "ease",
          duration: 0.25,
        },
        opacity: {
          easings: "ease",
          duration: 0.3,
        },
      },
    },
  },
};
export default function Section({ lang }: { lang: Lang }) {
  const { t } = useTranslation(lang, "common");

  return (
    <Container as="section" className="flex flex-col sm:flex-row pt-10 pb-24 gap-12">
      <div className="w-full sm:w-4/12 pt-2">
        <h1
          className={title({
            mode: "light",
            degree: "exchanged",
            weight: "bold",
            size: "h2",
          })}
        >
          {t("home_accordion_title")}
        </h1>
      </div>
      <div className="w-full sm:w-8/12">
        <Accordion className="w-full" variant="light" motionProps={motionProps}>
          {Array.from({ length: 4 }, (_, i) => (
            <AccordionItem
              key={i + 1}
              aria-label={`Accordion ${i + 1}`}
              title={t(`home_accordion_body.${i}.question`)}
              className="pb-2"
            >
              <p
                className={tw(
                  text({
                    mode: "light",
                    degree: "normal",
                    weight: "regular",
                    size: "md",
                  }),
                  "pb-2"
                )}
              >
                {t(`home_accordion_body.${i}.answer`)}
              </p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Container>
  );
}
