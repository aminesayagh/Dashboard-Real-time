"use client";
import React, { useCallback, Key } from "react";
import { title, text } from "@ui/typography/Typography.style";
import { generatePageUrl, Lang, RouteSettingPath } from "@/app/i18n/settings";
import { useTranslation } from "@i18n/client";
import { useRouter } from "next/navigation";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  ScrollShadow,
  Listbox,
  ListboxSection,
} from "@nextui-org/react";
import type { DropdownItemProps } from "@nextui-org/react";
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
  items: (DropdownItemProps & { iconName: IconNames, link: RouteSettingPath })[];
}

const ITEMS: Items[] = [
  {
    id: "1",
    section: `nav_sections.navbar_action`,
    items: [
      {
        id: "1",
        key: "dashboard",
        iconName: "Chart",
        description: "nav.dashboard_description",
        link: "dash.nav.dashboard",
      },
      {
        id: "2",
        key: "department",
        iconName: "Home_2",
        description: "nav.department_description",
        link: "dash.nav.department",
      },
      {
        id: "3",
        key: "analysis",
        iconName: "Graph",
        description: "nav.analysis_description",
        link: "dash.nav.analysis",
      },
      {
        id: "4",
        key: "settings",
        iconName: "Setting",
        link: "dash.nav.settings",
      },
    ],
  },
  {
    id: "4",
    section: `nav_sections.user`,
    items: [
      {
        id: "1",
        key: "student",
        iconName: "Group_1",
        description: "nav.student_description",
        link: "dash.user.student",
      },
      {
        id: "2",
        key: "teacher",
        iconName: "Education",
        description: "nav.teacher_description",
        link: "dash.user.teacher",
      },
    ],
  },
  {
    id: "2",
    section: `nav_sections.taxonomies`,
    items: [
      {
        id: "1",
        key: "category",
        iconName: "Document_Align_Right_11",
        description: "nav.category_description",
        link: "dash.taxonomies.category",
      },
    ],
  },
  {
    id: "3",
    section: `nav_sections.account`,
    items: [
      {
        id: "1",
        key: "profile",
        description: "nav.profile_description",
        iconName: "Profile_Square",
        color: "primary",
        link: "dash.account.profile",
      },
      {
        id: "2",
        key: "logout",
        description: "nav.logout_description",
        iconName: "Off",
        color: "danger",
        link: "dash.account.logout",
      },
    ],
  },
];

export default function Sidebar({ lng }: { lng: Lang }) {
  const { t } = useTranslation(lng, "dash");
  const router = useRouter();

  
  const getConcernedSubItem = useCallback((key: Key) => {
    for (const item of ITEMS) {
      for (const subItem of item.items) {
        if (subItem.key === key) {
          return subItem;
        }
      }
    }
    console.error("Item not found");
    return null;
  }, []);

  const handleAction = useCallback((key: Key) => {
    const concernedItem = getConcernedSubItem(key);
    if (!concernedItem) {
      return;
    }
    const link = generatePageUrl(lng, concernedItem.link);
    router.push(link);
  }, [lng, getConcernedSubItem, router]);

  return (
    <div className="flex flex-col gap-4 border-r-small border-divider h-full p-6">
      <div className="relative flex flex-col gap-4">
        <SidebarHeader lng={lng} />
      </div>
      <ScrollShadow>
        <Listbox
          variant="light"
          items={ITEMS}
          aria-label="Listbox sidebar dashboard"
          onAction={handleAction}
        >
          {(item: Items) => (
            <ListboxSection title={t(item.section)} showDivider className="">
              {item.items.map((i) => (
                <DropdownItem
                  key={i.key}
                  variant="flat"
                  className="my-1"
                  color={(i?.color as any) || "primary"}
                  startContent={
                    <span className="pr-0 md:mr-2">
                      <Icon name={i.iconName as IconNames} size={20} />
                    </span>
                  }
                  description={
                    typeof i.description == "string"
                      ? t(i.description)
                      : i.description
                  }
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
