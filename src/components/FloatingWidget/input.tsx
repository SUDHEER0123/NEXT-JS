'use client';

import { ActionIcon, TextInput } from "@mantine/core"
import Image from "next/image"
import { useState } from "react";

interface IUniversalLookupInput {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onClick: () => void;
}

export const UniversalLookupInput: React.FC<IUniversalLookupInput> = ({ value, onChange, onClose, onClick }) => {
  const [val, setValue] = useState(value || '');

  return (
    <div className="relative">
      {!val.length && <label className="absolute left-10 top-[1.4rem] !text-[#C0C1C0] font-normal text-[20px] leading-[30px]">Search by Customer Name, Order Number, Contract Number or VIN</label>}
      <TextInput
        leftSection={<Image src="/icons/search.svg" alt="search" width={24} height={24} />}
        classNames={{
          input: 'text-neutrals-background-default caret-brand-secondary h-full bg-shading-shading text-sub_heading_3-semi-bold rounded-none',
          wrapper: 'w-[900px] h-[76px] border-[3px] border-[#999999] rounded-none',
        }}
        variant="unstyled"
        rightSection={
          <div className="flex flex-col items-center justify-center w-[52px] h-full">
            <ActionIcon variant="unstyled" className="bg-shading-shading hover:bg-shading-shading mr-12 size-[52px] rounded-none" onClick={onClose}>
              <Image src="/icons/universal-cancel.svg" alt="close" width={32} height={32} />
            </ActionIcon>
          </div>
        }
        id="universal-lookup"
        key={`universal-lookup`}
        onChange={(e) => setValue(e.currentTarget.value)}
        value={val}
        onClick={() => onClick()}
      />
    </div>
  )
}