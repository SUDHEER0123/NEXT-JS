import { useState } from "react";
import { TxtInput } from "../ui/TxtInput/text-input";
import clsx from 'clsx';
import Image from "next/image";

interface ISearchInput {
  placeholder: string;
  onChange: (value: string) => void;
}

export const SearchInput: React.FC<ISearchInput> = ({ placeholder, onChange }) => {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <div>
      <TxtInput
        placeholder={placeholder}
        className={clsx(
          "pt-1 pr-4 pl-2 text-sm text-neutrals-medium h-[40px] grow w-full",
          !searchFocus && "!bg-neutrals-background-shading",
          searchFocus && "!bg-white shadow-md"
        )}
        leftSection={<Image src="/icons/search-black.svg" alt="search" width={24} height={24} />}
        classNames={{
          input: 'focus:bg-white'
        }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={() => {
          setSearchFocus(true);
        }}
        onBlur={() => {
          setSearchFocus(false);
        }}
        hideLabel
        inputClassName="!h-[35px]"
      />
    </div>  
  );
}