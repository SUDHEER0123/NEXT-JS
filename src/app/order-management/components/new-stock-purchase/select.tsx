'use client';

import React, { useState } from "react";
import {
  Combobox,
  ComboboxProps,
  Divider,
  InputBase,
  ScrollArea,
  TextInput,
  useCombobox,
} from "@mantine/core";
import Image from "next/image";
import clsx from "clsx";
import { ISelectItem } from "@/app/types";

interface ISelect extends ComboboxProps {
  items: ISelectItem[];
  placeholder: string;
  withIcon?: boolean;
  withDivider?: boolean;
  withOptionsDivider?: boolean;
  placeholderClassName?: string;
  hideValue?: boolean;
  customRightSection?: React.ReactNode;
  hoverplaceholder?: string;
  showIconWhenClosed?: boolean;
}

function getFilteredOptions(data: ISelectItem[], searchQuery: string, limit: number) {
  const result: ISelectItem[] = [];

  for (let i = 0; i < data.length; i += 1) {
    if (result.length === limit) {
      break;
    }

    if (data[i].value.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      result.push(data[i]);
    }
  }

  return result;
}

export const Select: React.FC<ISelect> = ({
  items,
  placeholder,
  withIcon = false,
  withDivider = true,
  withOptionsDivider = false,
  placeholderClassName = "",
  hideValue = false,
  customRightSection,
  hoverplaceholder,
  showIconWhenClosed = true,
  ...props
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setPlaceholderStr(placeholder);
    },
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }

      setIsOpen(true);
      setPlaceholderStr(hoverplaceholder ?? placeholder);
    },
  });

  const [placeholderStr, setPlaceholderStr] = useState(placeholder);
  const [value, setValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = search ? getFilteredOptions(items, search, 10) : items;

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val, optionProps) => {
        setValue(val);

        combobox.updateSelectedOptionIndex('active');

        props.onOptionSubmit && props.onOptionSubmit(val, optionProps);

        setSearch('');
        combobox.closeDropdown();
      }}
      classNames={{
        dropdown: "p-0 rounded-none",
      }}
      {...props}
    >
      <Combobox.Target>
        <InputBase
          component="div"
          rightSection={
            !customRightSection ? (
              <Image
                src="/icons/keyboard_arrow_down.svg"
                width={10}
                height={6}
                alt="arrow"
              />
            ) : customRightSection
          }
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
          }}
          rightSectionPointerEvents="none"
          variant="unstyled"
          className={clsx(
            withDivider && "border-b border-b-neutrals-low",
            combobox.dropdownOpened && "bg-neutrals-background-shading",
          )}
          rightSectionProps={{
            className: clsx(
              combobox.dropdownOpened && "rotate-180 transform duration-300",
              !combobox.dropdownOpened && 'rotate-0 transform duration-300'
            ),
          }}
          classNames={{
            wrapper: withIcon && value ? "py-[0.4rem]":""
          }}
        >
          {value && !hideValue ? (
            <p className="text-neutrals-high text-sm font-semibold !leading-[40px]">{value}</p>
          ) : (
            <div className={clsx(
              "flex flex-col",
              withIcon && "gap-y-1"
            )}>
              {combobox.dropdownOpened && (
                <TextInput
                  placeholder={placeholderStr} 
                  variant="unstyled"
                  onChange={(event) => {
                    setSearch(event.currentTarget.value);
                    combobox.openDropdown();
                  }}
                  className="px-2"
                  autoFocus
                />
              )}
              {!combobox.dropdownOpened && (
                <>
                  <div className="flex flex-col">
                    <p className={clsx(
                      "text-neutrals-high text-[12px] font-normal font-aston",
                      placeholderClassName,
                      !combobox.dropdownOpened && value && 'caption_xs_regular',
                      combobox.dropdownOpened && 'px-2'
                    )}>
                      {placeholderStr}
                    </p>
                  </div>
                  <div className="flex flex-row gap-x-1.5">
                    {showIconWhenClosed && withIcon && (
                      <div className="w-5 h-5">
                        {items.find(item => item.value === value)?.icon}
                      </div>
                      )}
                    <p className="body_small_semibold">{value}</p>
                  </div>
                </>
              )}
            </div>
          )}
      </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown className="rounded-none border-none shadow-select-shadow min-w-[12rem]">
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="auto" scrollbarSize={10} classNames={{ thumb: 'rounded-none' }}>
            {filteredOptions.length ? (
              filteredOptions.map((item, index) => (
                <>
                  <Combobox.Option
                    key={item.value}
                    value={item.value}
                    className={clsx(
                      "pl-2 pr-4 rounded-b-none",
                      withIcon && value === item.value && "py-2.5 rounded-l-none",
                      !withIcon && "py-3"
                    )}
                    active={value === item.value}
                  >
                    <div className="flex flex-col gap-y-2">
                      <div className={clsx(
                        "flex flex-row justify-between items-center"
                      )}>
                        <div className="flex flex-row gap-x-2 items-center">
                          {withIcon && item.icon}
                          <span className={`text-neutrals-high text-xs ${value === item.value ? 'caption_semibold':'caption_regular'}`}>{item.label}</span>
                        </div>
                        <div>
                          <div className="flex gap-x-2">
                            {item.extraRightSection}
                            <Image src={`/icons/${value === item.value ? 'tick':'tick-blank'}.svg`} width={18} height={18} alt="tick" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Combobox.Option>
                  {withOptionsDivider && <Divider />}
                </>
              ))
            ):(
              <Combobox.Empty><p className="font-normal text-xs">No results</p></Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
      {Object.entries(items.find(i => i.value === value)?.data ?? {}).map(d => (
        <div className="bg-neutrals-background-surface shadow-vehicle-details" key={d[0]}>
          <p className="caption_xs_regular text-neutrals-high">{d[0]}</p>
          <p className="body_small_semibold text-neutrals-high">{d[1]}</p>
        </div>
      ))}
    </Combobox>
  );
};
