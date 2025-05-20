import { TextInput, TextInputProps } from "@mantine/core";
import { useState } from "react";

export interface ITextInput extends TextInputProps {}

export const TxtInput: React.FC<ITextInput> = ({ placeholder, className, classNames, ...props }) => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex flex-col text-neutrals-high !min-h-[20px]">
      {value && <p className="text-[9px] leading-[12px] font-normal">{placeholder}</p>}
      <TextInput
        placeholder={placeholder}
        className="border-b border-b-neutrals-low"
        classNames={{
          wrapper: 'w-full',
          input: `${value ? 'body_small_semibold !h-[20px] !min-h-[20px] py-2 mb-0.5':'body_small_regular'}`
        }}
        variant="unstyled"
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        {...props}
      />
    </div>
  );
};