'use client';
import { Input } from "@nextui-org/react";
import type { TInput } from "./types";

const InputUi: TInput = ({ ...props }) => {
  return <Input {...{ size: "md", radius: 'sm', variant: 'flat', ...props }} />;
};

export default InputUi;
