import { DatePickerInput, DatePickerInputProps, DateValue } from "@mantine/dates";
import React from "react";
import Image from "next/image";
import './DatePicker.css';
import { Button } from "@mantine/core";
interface IDatePicker2 extends DatePickerInputProps {
}

export const DatePicker2: React.FC<IDatePicker2> = ({ placeholder }) => {
  const [date, setDate] = React.useState<DateValue>();

  return (
    <div className="flex flex-col">
      {date && (
        <p className="text-[9px] !leading-[12px] font-normal text-neutrals-high">{placeholder}</p>
      )}
      <DatePickerInput
        rightSection={
          <Image src="/icons/calendar-04.svg" alt="calendar" width={18} height={18} />
        }
        placeholder={placeholder}
        variant="unstyled"
        classNames={{
          day: 'text-neutrals-high body_small_semibold',
          placeholder: 'text-neutrals-high font-normal text-[12px] leading-[18px]',
          input: 'text-neutrals-high body_small_semibold !leading-[1px] !pt-0 !h-[20px] !min-h-[20px] !max-h-[20px]',
        }}
        firstDayOfWeek={0}
        onChange={(value) => {
          setDate(value);
        }}
        value={date}
      />
    </div>
  )
}