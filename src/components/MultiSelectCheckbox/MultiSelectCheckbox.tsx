'use client';

import { useEffect, useState } from 'react';
import { Avatar, Checkbox, Combobox, ComboboxOptionProps, ComboboxProps, Group, Input, Pill, PillsInput, ScrollArea, useCombobox } from '@mantine/core';
import Image from 'next/image';
import classNames from 'classnames';
import clsx from 'clsx';
import { ISelectItem } from '@/app/types';

interface IMultiSelectCheckbox extends ComboboxProps {
  items: ISelectItem[];
  placeholder?: string;
  placeholderClassName?: string;
  hideValues?: boolean;
  className?: string;
  value: string[];
  withIcon?: boolean;
  onSelectAll?: () => void;
}

export const MultiSelectCheckbox: React.FC<IMultiSelectCheckbox> = ({ hideValues, placeholderClassName, value, withIcon, onOptionSubmit, ...props }) => {
  const [open, setOpen] = useState(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const handleValueSelect = (val: string, optionProps: ComboboxOptionProps) => {
    if(val === 'All') {
      props.onSelectAll && props.onSelectAll();
    } else {
      onOptionSubmit && onOptionSubmit(val, optionProps);
    }
  }

  const handleValueRemove = (val: string) => onOptionSubmit && onOptionSubmit(val, { active: false, value: val });

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = props.items.map((item) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      active={value.includes(item.value)}
      className={`p-2.5 rounded-b-none ${props.items.find((i, idx) => idx === props.items.length - 1) !== item ? 'border-b border-b-neutrals-low' : ''} ${withIcon && value.includes(item.value) ? 'rounded-l-none':''}`}
      style={{
        fontSize: '0.75rem',
        lineHeight: '1.125rem'
      }}
    >
      <Group gap="sm">
        <Checkbox
          checked={value.includes(item.value)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
          color="#00665E"
          iconColor="white"
          classNames={{
            input: '!border-neutrals-medium rounded-sm'
          }}
        />
        {withIcon && (
          <Avatar size="sm" src={`/images/${item.value}.svg`} alt="checkbox" />
        )}
        <span>{item.label}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(value, optionProps) => handleValueSelect(value, optionProps)}
      withinPortal={false}
      variant="unstyled"
      transitionProps={{ duration: 200, transition: 'fade-down' }}
      {...props}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          pointer
          onClick={() => combobox.toggleDropdown()}
          classNames={{
            input: '!border-none bg-transparent px-0 py-3',
          }}
        >
          <Pill.Group>
            {values.length > 0 && !hideValues ? (
              values
            ) : (
              <Group gap="xs">
                <Input.Placeholder className={clsx(placeholderClassName, 'font-aston')}>{props.placeholder ?? ''}</Input.Placeholder>
                <Image
                  src="/icons/arrow_bold.svg"
                  alt="expand"
                  width={18}
                  height={18}
                  className={classNames({
                    'rotate-180 transform duration-300': combobox.dropdownOpened,
                    'rotate-0 transform duration-300': !combobox.dropdownOpened
                  })}
                />
              </Group>
            )}
            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace') {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown className='rounded-none border-none shadow-select-shadow min-w-[14rem]'>
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="auto" scrollbarSize={10} classNames={{ thumb: '!rounded-none' }}>
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}