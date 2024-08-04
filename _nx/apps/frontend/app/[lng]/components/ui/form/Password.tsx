'use client';

import { useState } from "react";
import { Input } from ".";
import type { TInput } from "./types";
import { Icon } from "@ui/icon";

const PasswordUi: TInput = ({ ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...{
        type: isVisible ? "text" : "password",
        variant: 'flat',
        endContent: (
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <Icon name="Show" size={20} />
            ) : (
              <Icon name="Hide" size={20} />
            )}
          </button>
        ),
        ...props,
      }}
    />
  );
};

export default PasswordUi;
