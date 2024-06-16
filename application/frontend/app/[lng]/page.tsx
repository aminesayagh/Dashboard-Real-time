"use client";
import "../globals.css";
import Navbar from "@components/common/Navbar";
import HomeSectionIntro from "@components/common/section/HomeSectionIntro";
import HomeSectionFaq from "@components/common/section/HomeSectionFaq";

export default function Home({
  params: { lng },
}: {
  params: {
    lng: "fr" | "en";
  };
}) {
  return (
    <>
      <Navbar lng={lng} />
      <HomeSectionIntro lang={lng} />
      <HomeSectionFaq lang={lng} />
    </>
  );
}
