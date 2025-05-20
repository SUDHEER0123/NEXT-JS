'use client';

import Image from "next/image";
import { MultiSelectCheckbox } from "@/components/MultiSelectCheckbox/MultiSelectCheckbox";
import { useState } from "react";
import { ComboboxOptionProps } from "@mantine/core";
import { Select } from "../ui/Select/Select";
import { IFilters, ISelectItem } from "@/app/types";
interface ISearchFilters {
  filters: IFilters[];
  activeFilters?: IFilters[];
  updateActiveFilters: (filter: IFilters, val: ISelectItem, optionProps: ComboboxOptionProps, isMultiSelect?: boolean) => void;
}

export const SearchFilters: React.FC<ISearchFilters> = ({ filters, activeFilters, updateActiveFilters }) => {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center gap-x-6">
          {filters.map((filter, index) => {
            return filter.isMultiSelect ? (
              <MultiSelectCheckbox
                key={index}
                items={(filter?.options ?? []).map((option) => ({ label: option.label?.toString(), value: option.value }))}
                placeholder={filter.label}
                hideValues={true}
                placeholderClassName="text-neutrals-high"
                className="min-w-fit h-[46px]"
                classNames={{
                  dropdown: '!p-0'
                }}
                withIcon={filter.withIcon}
                onOptionSubmit={(val, optionProps) => {
                  updateActiveFilters(filter, filter?.options?.find(o => o.value === val) ?? { label: '', value: '' }, optionProps);
                }}
                value={activeFilters?.find((f) => f.value === filter?.value)?.options?.map(o => o.value) || []}
              />
            ) : (
              <Select
                key={index}
                items={(filter?.options ?? []).map((option) => ({ label: option?.label, value: option?.value }))}
                placeholder={filter.label}
                withDivider={false}
                placeholderClassName="text-neutrals-high"
                hideValue
                noLabel
                customRightSection={
                  <Image src="/icons/arrow_bold.svg" width={20} height={20} alt="arrow" />
                }
                onOptionSubmit={(val, optionProps) => {
                  updateActiveFilters(filter, filter?.options?.find(o => o.label === val) ?? { label: '', value: '' }, optionProps, false);
                }}
                value={activeFilters?.find(a => a.value === filter.value)?.options?.[0]?.value ?? ''}
              />
            )
          })}
        </div>
      </div>
    </>
  );
}