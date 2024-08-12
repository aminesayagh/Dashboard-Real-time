"use client";
import React from "react";
import { useTranslation } from "@i18n/client";
import { Lang } from "@i18n/settings";
import { text } from "@ui/typography/Typography.style";

export default function AuthFooter({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "common");
  return (
    <div className="flex flex-row justify-center w-full items-center py-2 opacity-80">
      <p
        className={text({
          size: "sm",
          weight: "regular",
          mode: "light",
          degree: "faded",
        })}
      >
        {t("footer.message")}
      </p>
    </div>
  );
}
