'use client';

import { formatDate, formatDateWithTimeZone } from "@/utils/dateFormatter";
import { Text } from "@mantine/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Notification } from "../Notification/Notification";

interface IHeader {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  className?: string;
}

export const Header: React.FC<IHeader> = ({ title, subtitle, children, childrenClassName, className }) => {
  const [date,setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  },[]);

  return (
    <div className={clsx(
      "flex flex-col gap-y-3 w-full px-8 relative bg-white h-54 flex-none",
      className
    )}>
      <div className="flex flex-row justify-between w-full gap-x-2">
        <div className="mt-2">
          <p className="text-neutrals-high font-medium text-2xl">{title}</p>
          <p className="text-brand-primary font-normal text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center gap-x-4 border-l-2 border-l-brand-primary py-3 pl-4 pr-10 bg-gradient-8 absolute right-0 leading-5">
          <div>
            <Text className="text-sm font-medium text-neutrals-medium">{formatDate(date.toISOString(), 'yyyy.MM.dd')}</Text>
            <Text className="text-xs text-neutrals-medium">{formatDateWithTimeZone(date)}</Text>
          </div>
          <Notification />
        </div>
      </div>
      <div className={clsx(
        childrenClassName
      )}>
        {children}
      </div>
    </div>
  )
}