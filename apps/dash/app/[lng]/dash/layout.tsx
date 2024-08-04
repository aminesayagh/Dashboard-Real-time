import { Lang } from "@i18n/settings";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./Navbar";


export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: {
    lng: Lang;
  };
}>) {
  return (
    <div className="grid grid-cols-12 w-full min-h-screen" >
      <div className="col-start-1 col-span-3 h-full">
        <Sidebar lng={lng} />
      </div>
      <div className="col-start-4 col-span-9">
        <DashboardNavbar lng={lng} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
