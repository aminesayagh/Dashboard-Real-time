'use client';
import {Textarea} from "@nextui-org/react";
import type { TTextarea } from "./types";

const TextareaUi: TTextarea = ({ ...props }) => {
    return <Textarea {...{ size: "md", radius: 'sm', variant: 'flat', ...props }} />;
}

export default TextareaUi;