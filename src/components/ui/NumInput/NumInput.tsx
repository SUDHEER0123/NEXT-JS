'use client';

import { NumberInput, NumberInputProps } from "@mantine/core";
import clsx from "clsx";
import classes from './NumInput.module.css';

export interface INumberInput extends NumberInputProps {
  wrapperClassname?: string;
}

export const NumInput: React.FC<INumberInput> = ({
  placeholder,
  className,
  wrapperClassname,
  onChange,
  value,
  ...props
}) => {
  const hasValue = value !== undefined && value !== null && value.toString().length > 0;

  return (
    <div
      className={clsx(
        "flex flex-col text-neutrals-high w-full",
        wrapperClassname
      )}
    >
      {hasValue && (
        <p className="text-[9px] leading-[12px] font-normal !items-start">{placeholder}</p>
      )}
      <NumberInput
        placeholder={placeholder}
        className={clsx(
          "border-b border-b-neutrals-low",
          hasValue ? "pb-1" : "pb-2",
          className
        )}
        classNames={{
          root: "!w-full",
          input: classes.customNumInput
        }}
        thousandSeparator=","
        variant="unstyled"
        onChange={onChange}
        value={value}
        {...props}
      />
    </div>
  );
};
