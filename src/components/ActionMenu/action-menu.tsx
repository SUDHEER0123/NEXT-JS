'use client';

import { Combobox, useCombobox, Group, Button, Divider, ActionIcon, ComboboxProps } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
interface IActionMenu extends ComboboxProps {
  actionMenuItems: IActionMenuItem[];
  newIcon?: boolean;
}
export interface IActionMenuItem {
  icon: string;
  icon_alt?: string;
  title: string;
  style?: React.CSSProperties;
  hidden?: string[];
  modal?: string;
  orderStatusHidden?: string[];
  orderStatusDisplayed?: string[];
}

export const ActionMenu: React.FC<IActionMenu> = ({ actionMenuItems, onOptionSubmit, newIcon, ...props }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = actionMenuItems.map((item) => (
    <Combobox.Option value={item.title} key={item.title} className="h-[38px] p-2.5 border-b-[0.5px] border-b-neutrals-low min-w-max">
      <Group key={item.title} gap="sm" className="flex flex-row items-center">
        <Image src={`/icons/${item.icon}.svg`} alt={item.title} width={18} height={18} />
        <p className="font-normal text-[12px] leading-[18px]" style={item.style}>{item.title}</p>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      width={250}
      position="bottom-start"
      withArrow
      withinPortal={true}
      onOptionSubmit={(val, optProps) => {
        onOptionSubmit && onOptionSubmit(val, optProps);
        combobox.closeDropdown();
      }}
      classNames={{
        dropdown: 'border-[0.5px] border-neutrals-low shadow-action-menu !p-0 !w-auto',
      }}
    >
      <Combobox.Target>
        <ActionIcon
          size={24}
          variant="transparent"
          onClick={() => combobox.dropdownOpened ? combobox.closeDropdown() : combobox.openDropdown()}
          className={clsx(
            newIcon && "bg-neutrals-background-shading rounded-full hover:bg-neutrals-background-shading"
          )}
        >
          <Image src="/icons/more-horizontal-01.svg" alt="expand" width={24} height={24} />
        </ActionIcon>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options className="inline-block whitespace-nowrap">{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};