"use client";
import React from "react";
import { title, text, link } from "@ui/typography/Typography.style";
import { Lang } from "@/app/i18n/settings";
import { useTranslation } from "@i18n/client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem as NextDropdownItem,
  DropdownItemProps,
  Avatar,
  ScrollShadow,
  Listbox,
  ListboxSection,
} from "@nextui-org/react";
import { Icon } from "@ui/icon";

function SideBarAvatar({
  img,
  name,
  field,
}: {
  img: string;
  name: string;
  field: string;
}) {
  return (
    <div>
      <Avatar
        isBordered
        as="button"
        className="transition-transform transform hover:scale-105"
        src={img}
      />
      <div className="flex flex-col gap-1">
        <h4
          className={title({
            size: "h5",
            weight: "semibold",
            mode: "light",
            degree: "exchanged",
          })}
        >
          {name}
        </h4>
        <p
          className={text({
            size: "sm",
            weight: "regular",
            mode: "light",
            degree: "faded",
          })}
        >
          {field}
        </p>
      </div>
    </div>
  );
}
function SidebarAvatarDropdown({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "dash");
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform transform hover:scale-105"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <NextDropdownItem key="profile">
          <SideBarAvatar
            img="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            name="John Doe"
            field="Software Engineer"
          />
        </NextDropdownItem>
        <NextDropdownItem key="dashboard">{t("nav.dashboard")}</NextDropdownItem>
        <NextDropdownItem key="settings">{t("nav.settings")}</NextDropdownItem>
        <NextDropdownItem key="profile">{t("nav.profile")}</NextDropdownItem>
        <NextDropdownItem key="logout">{t("nav.logout")}</NextDropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function SidebarHeader({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "dash");
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-2 justify-start items-center">
        <Avatar src="" />
        <div className="">
          <h4
            className={title({
              size: "h5",
              weight: "semibold",
              mode: "light",
              degree: "exchanged",
            })}
          >
            {t("sidebar.title")}
          </h4>
        </div>
      </div>
      <div className="">
        <SidebarAvatarDropdown lng={lng} />
      </div>
    </div>
  );
}

function DropdownItem({ children, ...props }: DropdownItemProps) {
  return (
    <NextDropdownItem color="primary" variant="flat" {...props}>
      {children}
    </NextDropdownItem>
  );
}

export default function Sidebar({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "dash");
  return (
    <div className="flex flex-col gap-4 border-r-small border-divider h-full p-6">
      <div className="relative flex flex-col gap-4">
        <SidebarHeader lng={lng} />
      </div>
      <ScrollShadow>
        <Listbox variant="light" aria-label="Listbox sidebar dashboard">
          <ListboxSection title={t("nav_sections.navbar_action")} showDivider>
            <DropdownItem
              key="dashboard"
              startContent={<Icon name="EyeSlashFilledIcon" size="24" />}
              description={t("nav.dashboard_description")}
            >
              {t("nav.dashboard")}
            </DropdownItem>
            <DropdownItem
              key="department"
              startContent={<Icon name="EyeSlashFilledIcon" size="24" />}
              description={t("nav.department_description")}
            >
              {t("nav.department")}
            </DropdownItem>
            <DropdownItem
              key="Analytics"
              startContent={<Icon name="EyeSlashFilledIcon" size="24" />}
              description={t("nav.analysis_description")}
            >
              {t("nav.analytics")}
            </DropdownItem>
            <DropdownItem key="settings">{t("nav.settings")}</DropdownItem>
          </ListboxSection>
          <ListboxSection title={t("nav_sections.taxonomies")} showDivider>
            <DropdownItem
              key="category"
              startContent={<Icon name="EyeSlashFilledIcon" size="24" />}
              description={t("nav.category_description")}
            >
              {t("nav.category")}
            </DropdownItem>
          </ListboxSection>
          <ListboxSection title={t("nav_sections.account")} showDivider>
            <DropdownItem
              key="profile"
              color="primary"
              startContent={<Icon name="EyeSlashFilledIcon" size="24" />}
              description={t("nav.profile_description")}
            >
              {t("nav.profile")}
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              startContent={<Icon name="EyeSlashFilledIcon" size="24" />}
              description={t("nav.logout_description")}
            >
              {t("nav.logout")}
            </DropdownItem>
          </ListboxSection>
        </Listbox>
      </ScrollShadow>
    </div>
  );
}
