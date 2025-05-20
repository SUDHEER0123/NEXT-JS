'use client';

import { ActionIcon, Button, Popover } from "@mantine/core";
import {
  DatePickerProps,
  DatesRangeValue,
  DateValue,
  DatePicker as MantineDatePicker,
} from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { formatDate } from "@/utils/dateFormatter";
import './DatePicker.css';

interface IDatePicker extends Omit<DatePickerProps, 'value' | 'onChange'> {
  value?: DateValue | DatesRangeValue | Date[];
  onChange?: (value: DateValue | DatesRangeValue | Date[] | undefined) => void;
  target?: React.ReactNode;
  opened?: boolean;
  footer?: React.ReactNode;
  placeholder?: string;
  inForm?: boolean;
  withIcon?: boolean;
  withBorder?: boolean;
  hideValue?: boolean;
  customIcon?: React.ReactNode;
  className?: string;
  isDropdown?: boolean;
}

export const DatePicker: React.FC<IDatePicker> = ({
  onChange,
  value,
  placeholder,
  withIcon,
  withBorder,
  inForm,
  hideValue,
  customIcon,
  className,
  isDropdown,
  type = "default",
  ...props
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [tempDate, setTempDate] = useState<typeof value>(value);

  const handleConfirm = () => {
    onChange?.(tempDate);
    close();
  };

  const renderValue = useCallback(() => {
    if (!value) return null;
    
    switch (type) {
      case "range":
        const [from, to] = value as DatesRangeValue;
        return `${formatDate(new Date(from ?? ''))} - ${formatDate(new Date(to ?? ''))}`;
      case "multiple":
        return (value as Date[])?.map((d) => formatDate(new Date(d))).join(", ");
      default:
        const dateVal = new Date(value as Date).toISOString();
        return formatDate(dateVal);
    }
  },[value, type]);

  return (
    <Popover
      width={282}
      withArrow
      trapFocus
      opened={opened}
      classNames={{ dropdown: "p-4 rounded-none shadow-date-picker border-none" }}
    >
      <Popover.Target>
        <div
          className={clsx(
            "flex flex-row items-center justify-between gap-x-2 cursor-pointer pb-2",
            withBorder && "border-b border-b-neutrals-low",
            className
          )}
          onClick={opened ? close : open}
        >
          <div className="flex flex-col">
            <span
              className={clsx(
                "text-neutrals-high",
                !value && "body_small_regular",
                value && inForm && "!text-[9px] !leading-[12px]"
              )}
            >
              {placeholder || "Select date"}
            </span>
            {value && !hideValue && (
              <span className="text-neutrals-high body_small_semibold">{renderValue()}</span>
            )}
          </div>
          {withIcon && !customIcon && (
            <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
          )}
          {customIcon}
          {isDropdown && (
            <ActionIcon variant="transparent">
              <Image
                src="/icons/arrow_bold.svg"
                width={20}
                height={20}
                alt="arrow"
                className={clsx(
                  opened && "rotate-180 transform duration-300",
                  !opened && "rotate-0 transform duration-300"
                )}
              />
            </ActionIcon>
          )}
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex flex-col bg-white gap-y-4">
          <MantineDatePicker
            variant="unstyled"
            classNames={{ day: "text-neutrals-high body_small_semibold" }}
            firstDayOfWeek={0}
            type={type}
            onChange={(date) => {
              onChange?.(date); // immediately notify RHF
              close(); // optionally close the popover if desired
            }}
            value={value}
            {...props}
          />
          <div className="flex flex-row items-end gap-x-4 self-end">
            <Button
              variant="unstyled"
              onClick={close}
              className="bg-white text-neutrals-high hover:text-neutrals-high hover:bg-white rounded-none h-[40px] w-auto py-2.5 px-6 border-gray-300 border"
            >
              <p className="body_small_semibold">Cancel</p>
            </Button>
            <Button
              variant="unstyled"
              onClick={handleConfirm}
              className="bg-brand-primary hover:bg-brand-primary rounded-none h-[40px] w-auto py-2.5 px-6"
            >
              <p className="body_small_semibold">Confirm</p>
            </Button>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export const useDatePicker = (props?: IDatePicker) => {
  const [opened, { close, open }] = useDisclosure(false);

  return {
    open,
    close,
    opened,
    DatePicker,
  };
}