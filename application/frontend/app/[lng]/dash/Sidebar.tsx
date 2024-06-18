"use client";
import React from "react";
import { title, text } from "@ui/typography/Typography.style";
import { Lang } from "@/app/i18n/settings";
import { useTranslation } from "@i18n/client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownItemProps,
  Avatar,
  ScrollShadow,
  Listbox,
  ListboxSection,
} from "@nextui-org/react";
import { Icon, IconNames } from "@ui/icon";

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
    <>
      <div className="flex flex-row gap-4 items-center p-1">
        <Avatar
          isBordered
          as="button"
          className="transition-transform transform hover:scale-105"
          src={img}
        />
        <div className="flex flex-col pr-4">
          <h4
            className={title({
              size: "h6",
              weight: "semibold",
              mode: "light",
              degree: "exchanged",
            })}
          >
            {name}
          </h4>
          <p
            className={text({
              size: "xs",
              weight: "regular",
              mode: "light",
              degree: "faded",
            })}
          >
            {field}
          </p>
        </div>
      </div>
    </>
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
      <DropdownMenu aria-label="Profile Actions" className="p-2">
        <DropdownItem key="profile">
          <SideBarAvatar
            img="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            name="John Doe"
            field="Software Engineer"
          />
        </DropdownItem>
        <DropdownItem
          key="dashboard"
          className="text-zinc-900 mt-2"
          color="primary"
          variant="flat"
        >
          {t("nav.dashboard")}
        </DropdownItem>
        <DropdownItem
          key="settings"
          className="text-zinc-900"
          color="primary"
          variant="flat"
        >
          {t("nav.settings")}
        </DropdownItem>
        <DropdownItem
          key="profile"
          className="text-zinc-900"
          color="primary"
          variant="flat"
        >
          {t("nav.profile")}
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-red-600"
          color="danger"
          variant="flat"
        >
          {t("nav.logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function SidebarHeader({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "dash");
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-2 justify-start items-center">
        <Avatar
          as="div"
          className=""
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
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

interface Items {
  id: string;
  section: string;
  items: (DropdownItemProps & { iconName: IconNames })[];
}

export default function Sidebar({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "dash");

  return (
    <div className="flex flex-col gap-4 border-r-small border-divider h-full p-6">
      <div className="relative flex flex-col gap-4">
        <SidebarHeader lng={lng} />
      </div>
      <ScrollShadow>
        <Listbox
          variant="light"
          onSelectionChange={(s) => console.log("List Task: ", s)}
          items={
            [
              {
                id: "1",
                section: t(`nav_sections.navbar_action`),
                items: [
                  {
                    id: "1",
                    key: "dashboard",
                    iconName: "Chart",
                    description: t("nav.dashboard_description"),
                  },
                  {
                    id: "2",
                    key: "department",
                    iconName: "Home_2",
                    description: t("nav.department_description"),
                  },
                  {
                    id: "3",
                    key: "analysis",
                    iconName: "Graph",
                    description: t("nav.analysis_description"),
                  },
                  {
                    id: "4",
                    key: "settings",
                    iconName: "Setting",
                  },
                ],
              },
              {
                id: "4",
                section: t(`nav_sections.user`),
                items: [
                  {
                    id: "1",
                    key: "student",
                    iconName: "Group_1",
                    description: t("nav.student_description"),
                  },
                  {
                    id: "2",
                    key: "teacher",
                    iconName: "Profile_1",
                    description: t("nav.teacher_description"),
                  },
                ],
              },
              {
                id: "2",
                section: t(`nav_sections.taxonomies`),
                items: [
                  {
                    id: "1",
                    key: "category",
                    iconName: "EyeSlashFilledIcon",
                    description: t("nav.category_description"),
                  },
                ],
              },
              {
                id: "3",
                section: t(`nav_sections.account`),
                items: [
                  {
                    id: "1",
                    key: "profile",
                    description: t("nav.profile_description"),
                    iconName: "EyeSlashFilledIcon",
                    color: "primary",
                  },
                  {
                    id: "2",
                    key: "logout",
                    description: t("nav.logout_description"),
                    iconName: "EyeSlashFilledIcon",
                    color: "danger",
                  },
                ],
              },
            ] as Items[]
          }
          aria-label="Listbox sidebar dashboard"
        >
          {(item: Items) => (
            <ListboxSection title={item.section} showDivider>
              {item.items.map((i) => (
                <DropdownItem
                  key={i.key}
                  variant="flat"
                  color={(i?.color as any) || "primary"}
                  startContent={
                    <Icon
                      name={i.iconName as IconNames}
                      className="pr-0 pm:mr-2"
                      size="20"
                    />
                  }
                  description={i.description}
                >
                  {t(`nav.${i.key}`)}
                </DropdownItem>
              ))}
            </ListboxSection>
          )}
        </Listbox>
      </ScrollShadow>
    </div>
  );
}
