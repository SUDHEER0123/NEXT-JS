'use client';

import { Tab } from "@/app/types";
import clsx from "clsx";
import { useState } from "react";
import { useContactLifeCycleStore } from "./contact-life-cycle.store";

interface ITab {
  tabs: Tab[];
  activeTab?: string;
  onTabChange: (tab: string) => void;
  count?: number;
}

export const Tabs: React.FC<ITab> = ({ tabs, activeTab, onTabChange, count }) => {
  const { contacts } = useContactLifeCycleStore();

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-2">
        {tabs.map(tab => (
          <div className={clsx(
              "flex gap-x-3 px-4 py-[14px] cursor-pointer",
              activeTab === tab.value && "body_small_bold border-t-[3px] bg-neutrals-background-surface border-t-brand-primary",
              activeTab !== tab.value && "body_small_regular border-t-[3px] border-t-transparent"
            )}
            key={tab.value}
            onClick={() => {
              onTabChange(tab.value);
            }}
          >
            <p className="text-neutrals-high">{tab.label}</p>
            <p className="body_small_regular text-neutrals-medium">{tab.value === 'All Contacts' ? contacts?.length : contacts?.filter(row => row?.type?.includes(tab.value))?.length ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};