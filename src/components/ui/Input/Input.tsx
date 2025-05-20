import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export interface IInput {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input: React.FC<IInput> = ({
  placeholder,
  value,
  onChange,
  className,
  leftElement,
  rightElement,
}) => {
  return (
    <div className="relative flex items-center">
      {/* Left element */}
      {leftElement && (
        <div className="absolute left-0 flex items-center justify-center w-10 h-full pointer-events-none">
          {leftElement}
        </div>
      )}

      {/* Input field */}
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${
          className || ""
        } w-full py-[11px] pr-4 pl-2 border border-neutrals-low bg-neutrals-background-shading text-sm text-neutrals-medium focus:border-neutrals-medium text-ellipsis`}
        style={{
          paddingLeft: leftElement ? "2.5rem" : undefined,
          paddingRight: rightElement ? "2.5rem" : undefined,
        }}
      />

      {/* Right element */}
      {rightElement && (
        <div className="absolute right-0 flex items-center justify-center w-10 h-full pointer-events-none">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default Input;
