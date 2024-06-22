"use client";
import "@app/globals.css";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
export default function Error(_: {
  params: {
    lng: "fr" | "en";
  };
}) {
  return (
    <Card className="w-full py-6 px-3">
      <CardHeader>Error</CardHeader>
      <CardBody>Error message</CardBody>
    </Card>
  );
}
