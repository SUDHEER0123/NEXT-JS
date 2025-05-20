'use client';

import { Button } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyboardArrowRightIcon } from "@/assets/icons";

export interface IHomeCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  permission?: boolean;
}

export const HomeCard: React.FC<IHomeCard> = ({ title, description, icon, path, permission }) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <div className={clsx(
        "flex flex-col items-start p-3 border-t-[2px] w-[256px] h-auto",
       !permission && 'border-t-neutrals-medium shadow-subtle-shadow2 cursor-disabled bg-neutrals-background-shading text-neutrals-high',
        permission && 'border-t-brand-secondary cursor-pointer',
        hovered && 'bg-brand-primary text-brand-secondary',
        !hovered && 'bg-neutrals-background-default text-brand-primary'
      )}
      onMouseEnter={() => permission && setHovered(true)}
      onMouseLeave={() => permission && setHovered(false)}
      onClick={() => router.push(path)}
    >
      <div className="!w-[32px] !h-[32px]">
        {icon}
      </div>
      <p className={clsx(
          "body_large_semibold pt-3",
          hovered && 'text-neutrals-background-default',
          !hovered && 'text-neutrals-high',
          !permission && 'text-neutrals-medium'
        )}
      >
        {title}
      </p>
      <p className={clsx(
          "body_small_regular",
          hovered && 'text-neutrals-background-default',
          !hovered && 'text-neutrals-high',
          !permission && 'text-neutrals-medium'
        )}
      >
        {description}
      </p>
      <div className={clsx(
        "mt-8 mb-2 h-[1px] w-full",
        hovered && 'bg-brand-primary_ext_1',
        !hovered && 'bg-neutrals-low'
      )}/>
      {permission && (
        <Button
          variant="unstyled"
          className={clsx(
            "bg-transparent hover:bg-transparent body_small_semibold pl-0",
            hovered && 'text-brand-secondary',
            !hovered && 'text-brand-primary'
          )}
          rightSection={
            <KeyboardArrowRightIcon />
          }
        >
          Granted
        </Button>
      )}
      {!permission && (
        <Image src="/images/locked.svg" width={67} height={22} alt="locked" className="pt-2 pb-1.5" />
      )}
    </div>
  );
}