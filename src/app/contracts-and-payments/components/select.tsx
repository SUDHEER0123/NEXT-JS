'use client';

import React from "react";
import {
  Combobox,
  ComboboxProps,
  Group,
  InputBase,
  ScrollArea,
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
  placeholderClassName?: string;
  hideValue?: boolean;
  customRightSection?: React.ReactNode;
  value?: string;
}

export const Select: React.FC<ISelect> = ({
  items,
  placeholder,
  withIcon = false,
  withDivider = true,
  placeholderClassName = "",
  hideValue = false,
  customRightSection,
  value,
  ...props
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val, optionProps) => {
        combobox.updateSelectedOptionIndex('active');

        props.onOptionSubmit && props.onOptionSubmit(val, optionProps);
      }}
      classNames={{
        dropdown: "p-0 rounded-none",
      }}
      {...props}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
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
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          variant="unstyled"
          className={clsx(
            withDivider && "border-b border-b-neutrals-low"
          )}
          rightSectionProps={{
            className: clsx(
              combobox.dropdownOpened && "rotate-180 transform duration-300",
              !combobox.dropdownOpened && 'rotate-0 transform duration-300'
            ),
          }}
        >
          {value && !hideValue ? (
            <p className="text-neutrals-high text-xs">{value}</p>
          ) : (
            <p className={clsx(
              "text-neutrals-high text-[12px] leading-[18px] font-normal font-aston",
              placeholderClassName
            )}>
              {placeholder}
            </p>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown className="rounded-none border-none shadow-select-shadow min-w-[12rem]">
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="auto" scrollbarSize={10} classNames={{ thumb: '!rounded-none' }}>
            {items.map((item, index) => (
              <Combobox.Option
                key={item.value}
                value={item.value}
                className={clsx(
                  "p-2.5 rounded-b-none",
                  index < items.length - 1 && "border-b border-b-neutrals-low",
                  withIcon && value === item.value && "border-l-4 border-l-brand-primary rounded-l-none"
                )}
                active={value === item.value}
              >
                <Group gap="xs" justify="space-between">
                  <span className="text-neutrals-high text-xs">{item.label}</span>
                  <Image src={`/icons/${value === item.value ? 'tick':'tick-blank'}.svg`} width={18} height={18} alt="tick" />
                </Group>
              </Combobox.Option>
            ))}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
