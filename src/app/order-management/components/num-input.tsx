'use client';

import { ClassNames } from "@emotion/react";
import { NumberInput, NumberInputProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import clsx from "clsx";
import { useEffect, useState } from "react";

export interface INumberInput extends NumberInputProps {
  wrapperClassname?: string;
}

export const NumInput: React.FC<INumberInput> = ({ placeholder, value, className, wrapperClassname, ...props }) => {
  const handleChange = useDebouncedCallback((e: string | number) => {
    props.onChange && props.onChange(e.toString());
  },{
    delay: 10
  });

  return (
    <div className={clsx(
      "flex flex-col text-neutrals-high w-full",
      wrapperClassname
    )}>
      {(value?.toString()?.length ?? 0) > 0 ? <p className="text-[9px] leading-[12px] font-normal">{placeholder}</p>:<></>}
      <NumberInput
        placeholder={placeholder}
        className={clsx(
          "border-b border-b-neutrals-low",
          className
        )}
        classNames={{
          root: '!w-full',
          input: `${value ? 'body_small_semibold !h-[20px] !min-h-[20px] py-2 mb-0.5':'body_small_regular'}`
        }}
        thousandSeparator=","
        variant="unstyled"
        onChange={(e) => {
          handleChange(e);
        }}
        value={value}
        {...props}
      />
    </div>
  );
};