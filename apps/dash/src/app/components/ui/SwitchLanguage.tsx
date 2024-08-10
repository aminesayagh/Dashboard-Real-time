"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";
import { languages, Lang } from "@i18n/settings";

import { useTranslation, useSwitchLanguage } from "@i18n/client";

const AvatarFlag = ({ alt, src }: { alt: string; src: string }) => {
  return <Avatar alt={alt} src={src} className="w-5 h-5 mr-1" />;
};

export default function SwitchLanguage({ lng }: { lng: Lang }) {
  const { t, i18n } = useTranslation(lng, "common");
  const {switchLanguage } = useSwitchLanguage();

  return (
    <Select labelPlacement='outside' size='md' className="w-20" selectedKeys={[
        i18n.language as Lang
    ]} onChange={(event) => {
        switchLanguage(event.target.value as Lang);
    }} renderValue={(items) => {
        const key = items[0]?.key as Lang;
        
        return (
            <AvatarFlag
                alt={t(`lang.list.${languages.indexOf(key)}.name`)}
                src={`https://flagcdn.com/${t(`lang.list.${languages.indexOf(key)}.flag`)}.svg`}
            />
        );
    }} >
      {languages.map((lang, index) => {
        return (
          <SelectItem
            key={lang}
            className='text-black dark:text-white min-w-36'
            startContent={
              <AvatarFlag 
                alt={lang}
                src={`https://flagcdn.com/${t(`lang.list.${index}.flag`)}.svg`}
              />
            }
          >
            {t(`lang.list.${index}.name`)}
          </SelectItem>
        );
      })}
    </Select>
  );
}
