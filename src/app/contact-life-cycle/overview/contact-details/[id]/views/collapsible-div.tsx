'use client';

import { ActionIcon } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";

interface ICollapsibleDiv extends React.HTMLProps<HTMLDivElement> {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  customAction?: React.ReactNode;
}

export const CollapsibleDiv: React.FC<ICollapsibleDiv> = ({ icon, title, children, customAction, className }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <div className="flex items-center gap-x-2 bg-about-contact border-l-[5px] border-l-brand-secondary p-2 relative">
        {icon}
        <Image src="/images/about-contact-pattern.svg" width={181} height={48} alt="about-contact-pattern" className="absolute right-0" />
        <div className="flex items-center">
          <div className="flex items-center gap-x-2">
            <p className="body_small_semibold text-neutrals-high">{title}</p>
            <ActionIcon
              variant="transparent"
              onClick={() => setIsExpanded(!isExpanded)}
              className={clsx(
                "h-full w-auto",
                isExpanded && 'rotate-180 transform duration-300',
                !isExpanded && 'rotate-0 transform duration-300'
              )}
            >
              <Image src="/icons/chevron-up.svg" width={20} height={20} alt="collapse-about" />
            </ActionIcon>
          </div>
        </div>
        {customAction}
      </div>

      {isExpanded && (
        <div className={clsx("gap-y-2", className)}>
          {children}
        </div>
      )}
    </div>
  );
}