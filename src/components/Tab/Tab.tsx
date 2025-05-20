'use client';

import { Tab } from "@/app/types";
import clsx from "clsx";
import { useState } from "react";

interface ITab extends UseTabProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  className?: string;
  tabClassName?: string;
}

interface UseTabProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<ITab> = ({ tabs, activeTab, onTabChange, className, tabClassName }) => {

  return (
    <div className={clsx("flex flex-col", className)}>
      <div className="flex">
        {tabs.map(tab => (
          <div className={clsx(
              "flex gap-x-3 px-4 py-[14px] cursor-pointer grow",
              tabClassName,
              activeTab === tab.value && "body_small_bold border-t-[3px] bg-neutrals-background-surface border-t-brand-primary",
              activeTab !== tab.value && "body_small_regular border-t-[3px] border-t-transparent border-b-[1px] border-b-neutrals-low"
            )}
            key={tab.value}
            onClick={() => {
              onTabChange(tab.value);
            }}
          >
            <p className="text-neutrals-high">{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const useTabs = (props: UseTabProps) => {
  const [activeTab, setActiveTab] = useState(props.defaultTab);

  return { activeTab, setActiveTab };
}