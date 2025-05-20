'use client';

import React, { useState } from "react";
import {
  CheckIcon,
  Combobox,
  ComboboxDropdownProps,
  ComboboxProps,
  Divider,
  Group,
  InputBase,
  ScrollArea,
  TextInput,
  useCombobox,
} from "@mantine/core";
import Image from "next/image";
import clsx from "clsx";
import { ISelectItem } from "@/app/types";
import './Select.css';
import classes from './Select.module.css';

interface ISelect extends ComboboxProps {
  items: ISelectItem[];
  placeholder?: string;
  withIcon?: boolean;
  withDivider?: boolean;
  placeholderClassName?: string;
  hideValue?: boolean;
  customRightSection?: React.ReactNode;
  value?: string;
  onOptionSubmit?: (val: string, optionProps: any) => void;
  noLabel?: boolean;
  hoverplaceholder?: string;
  showIconWhenClosed?: boolean;
  withOptionsDivider?: boolean;
  valueClassName?: string;
  dropdownClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  dropdownProps?: ComboboxDropdownProps;
  showData?: boolean;
  wrapperClassName?: string;
  searchable?: boolean;
  onSearch?: (search: string) => void;
  showLabel?: boolean;
  dropDownHeight?: number
  showSelectOnLabel?: boolean
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
  onOptionSubmit,
  noLabel,
  hoverplaceholder,
  showIconWhenClosed = true,
  withOptionsDivider = false,
  valueClassName,
  dropdownClassName,
  optionsClassName,
  optionClassName,
  dropdownProps,
  showData,
  wrapperClassName,
  searchable = false,
  onSearch,
  dropDownHeight = 200,
  showLabel,
  showSelectOnLabel = false,
  ...props
}) => {
  const [placeholderStr, setPlaceholderStr] = useState(placeholder);

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
        setPlaceholderStr(hoverplaceholder ?? placeholder);
      }
    },
  });

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val, optionProps) => {
        combobox.closeDropdown();

        onOptionSubmit && onOptionSubmit(val, optionProps);
      }}
      classNames={{
        dropdown: "p-0 rounded-none w-full min-w-max",
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
          classNames={{
            root: 'w-full',
            wrapper: clsx('w-full', combobox.dropdownOpened && !showSelectOnLabel&& 'bg-neutrals-background-surface', wrapperClassName),
            input: '!min-w-max h-[40px]',
          }}
          rightSectionProps={{
            className: clsx(
              combobox.dropdownOpened && "rotate-180 transform duration-300",
              !combobox.dropdownOpened && 'rotate-0 transform duration-300'
            ),
          }}
          pointer
        >
          {combobox.dropdownOpened && !hideValue && searchable && (
            <TextInput
              placeholder={placeholderStr}
              variant="unstyled"
              onChange={(event) => {
                onSearch && onSearch(event.currentTarget.value);
                combobox.openDropdown();
              }}
              classNames={{
                input: classes.customInput
              }}
              autoFocus
            />
          )}
          {combobox.dropdownOpened && hideValue && (
            <p className={clsx(
              "text-neutrals-high",
              placeholderClassName,
              'body_small_regular'
            )}>
              {placeholderStr}
            </p>
          )}
          {!hideValue && combobox.dropdownOpened && value && showSelectOnLabel && (
            <div className="flex flex-col">
              <p className={clsx(
                "text-neutrals-high",
                placeholderClassName,
                'body_small_regular',
                combobox.dropdownOpened && value && !hideValue && 'caption_xs_regular',
              )}>
                {placeholderStr}
              </p>
             
                <div className="flex flex-row gap-x-1.5">
                  {showIconWhenClosed && withIcon && (
                    <div className="w-5 h-5">
                      {items.find(item => item.value === value)?.icon}
                    </div>
                  )}
                  <p className={clsx(
                    "body_small_semibold",
                    valueClassName
                  )}>
                    {showLabel ? items.find(item => item.value === value)?.label : value}
                  </p>
                </div>
             
            </div>
          )}
          {!combobox.dropdownOpened && (
            <div className="flex flex-col">
              <p className={clsx(
                "text-neutrals-high",
                placeholderClassName,
                'body_small_regular',
                !combobox.dropdownOpened && value && !hideValue && 'caption_xs_regular',
              )}>
                {placeholderStr}
              </p>
              {!hideValue && (
                <div className="flex flex-row gap-x-1.5">
                  {showIconWhenClosed && withIcon && (
                    <div className="w-5 h-5">
                      {items.find(item => item.value === value)?.icon}
                    </div>
                  )}
                  <p className={clsx(
                    "body_small_semibold",
                    valueClassName
                  )}>
                    {showLabel ? items.find(item => item.value === value)?.label : value}
                  </p>
                </div>
              )}
            </div>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown
        className={clsx(
          "rounded-none border-none shadow-select-shadow min-w-[12rem]",
          dropdownClassName
        )}
        {...dropdownProps}
      >
        <Combobox.Options className={clsx(optionsClassName)}>
          <ScrollArea.Autosize mah={dropDownHeight} type="auto" scrollbarSize={10} classNames={{ thumb: '!rounded-none bg-brand-primary' }}>
            {items?.length ? items?.map((item, index) => (
              <>
                <Combobox.Option
                  key={item.value}
                  value={item.value}
                  className={clsx(
                    "p-2.5 rounded-b-none",
                    index < items.length - 1 && withOptionsDivider && "border-b border-b-neutrals-low",
                    withIcon && value === item.value && "border-l-4 border-l-brand-primary rounded-l-none",
                    optionClassName
                  )}
                  active={value === item.value}
                  onMouseOver={() => combobox.selectOption(index)}
                >
                  <Group gap="xs" justify="space-between" className="!hover:bg-neutrals-low">
                    <span className="flex gap-x-2 items-center text-neutrals-high text-xs">
                      {item.icon}{item.label}
                    </span>
                    <div className="ml-auto">
                      {item.extraRightSection && item.extraRightSection}
                    </div>
                    <Image src={`/icons/${value === item.value ? 'tick' : 'tick-blank'}.svg`} width={18} height={18} alt="tick" />
                  </Group>
                </Combobox.Option>
              </>
            )) : (
              <Combobox.Empty><p className="font-normal text-xs">No results</p></Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
      {showData && Object.entries(items.find(i => i.value === value)?.data ?? {}).map(d => (
        <div className="bg-neutrals-background-surface shadow-vehicle-details" key={d[0]}>
          <p className="caption_xs_regular text-neutrals-high">{d[0]}</p>
          <p className="body_small_semibold text-neutrals-high">{d[1]}</p>
        </div>
      ))}
    </Combobox>
  );
};
