import Navbar from "./Navbar";
import HomeSectionIntro from "@common/section/HomeSectionIntro";
import HomeSectionFaq from "@common/section/HomeSectionFaq";
export default async function Home({
  params: { lng },
}: {
  params: {
    lng: "fr" | "en";
  };
}) {
  if (!lng) return null;
  console.log(lng);
  return (
    <>
      <Navbar lng={lng || 'en'} />
      <HomeSectionIntro lang={lng || 'en'} />
      <HomeSectionFaq lang={lng || 'en'} />
    </>
  );
}
