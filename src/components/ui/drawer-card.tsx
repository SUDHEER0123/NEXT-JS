import { Group } from "@mantine/core";
import Image from "next/image";
import clsx from 'clsx';

export interface IDrawerCard {
  title: string;
  children: React.ReactNode;
  icon?: string | React.ReactNode;
  childrenClassName?: string;
}

export const DrawerCard: React.FC<IDrawerCard> = ({ title, children, icon, childrenClassName }) => {
  return (
    <div className="flex flex-col gap-4 shadow-drawer-card">
      <div className="bg-gradient-8 text-neutrals-background-default py-[14px] px-3">
        <Group gap="sm" >
          {typeof icon === 'string' ? (
            <Image src={`/icons/${icon}.svg`} width={20} height={20} alt="user" />
          ) : icon}
          <p className="text-neutrals-high text-sm font-medium">{title}</p>
        </Group>
      </div>
      <div className={clsx(
          "bg-neutrals-background-default text-neutrals-background-default pb-4 px-4 gap-6",
          childrenClassName
        )}>
        {children}
      </div>
    </div>
  )
};