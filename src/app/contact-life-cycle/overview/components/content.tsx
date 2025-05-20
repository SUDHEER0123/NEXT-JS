'use client';

import { Header } from "@/components/Header/Header";
import Content from "@/components/Content/Content";
import { Button, ComboboxOptionProps } from "@mantine/core";
import Image from "next/image";
import { useMemo, useState } from "react";
import { IFilters, ISelectItem, Tab } from "../../../types";
import { GridViewIcon, ListViewIcon } from "@/assets/icons";
import clsx from "clsx";
import { SearchFilters } from "@/components/SearchFilters/SearchFilters";
import { FiltersActive } from "@/components/SearchFilters/FiltersActive";
import { Contacts } from "./contact-life-cycle";
import { IActionMenuItem } from "@/components/ActionMenu/action-menu";
import { useTabs } from "@/components/Tab/Tab";
import { Tabs } from "./tab";
import { useAppDataStore } from "@/app/app.store";

export const actionMenuItems: IActionMenuItem[] = [
  {
    icon: 'pencil-edit-01',
    icon_alt: 'pencil-edit-02',
    title: 'Edit / View',
    modal: 'viewContact'
  },
  {
    icon: 'note-edit',
    icon_alt: 'note-edit',
    title: 'Log Note',
    hidden: ['Stock Purchase','Retail Order'],
  },
  {
    icon: 'attachment',
    icon_alt: 'money-add-03',
    title: 'Log Attachment',
    hidden: ['Stock Order'],
    modal: 'recordDeposit'
  },
  {
    icon: 'showroom-black',
    icon_alt: 'money-receive-03',
    title: 'Log Showroom Visit',
    hidden: ['Stock Order'],
  },
  {
    icon: 'steering',
    icon_alt: 'contracts-02',
    title: 'Log Test Drive',
    hidden: ['Stock Order'],
  },
  {
    icon: 'calendar-04',
    icon_alt: 'invoice-04',
    title: 'Log Event Attendance',
    hidden: ['Stock Order']
  },
  {
    icon: 'contracts',
    icon_alt: 'invoice-04',
    title: 'Convert to Contract',
    hidden: ['Stock Purchase','Retail Order']
  },
  {
    icon: 'delete-03',
    icon_alt: 'file-remove',
    title: 'Delete',
    style: {
      color: '#D60100'
    }
  }
];

const tabs: Tab[] = [{
  label: 'All Contacts',
  value: 'All Contacts'
},{
  label: 'Leads',
  value: 'Lead'
},{
  label: 'Prospects',
  value: 'Prospect'
},{
  label: 'Contracted',
  value: 'Contracted'
},{
  label: 'Customers',
  value: 'Customer'
}];

export const ContactLifeCycleContent = () => {
  const [listView, setListView] = useState(false);
  const [activeFilters, setActiveFilters] = useState<IFilters[]>([]);
  const { activeTab, setActiveTab } = useTabs({ tabs, defaultTab: 'All Contacts' });
  const { users } = useAppDataStore();

  const updateActiveFilters = (filter: IFilters, val: ISelectItem, optionProps: ComboboxOptionProps, isMultiSelect = true) => {
    const existingValues = activeFilters.find(activeFilter => activeFilter.value === filter.value)?.options || [];
    const newActiveFilter = {
      ...filter,
      options: !isMultiSelect ? [val] : [...existingValues.filter(e => e.value !== val?.value), existingValues.find(e => e.value === val?.value) ? null : val].filter(Boolean) as ISelectItem[],
    };
  
    setActiveFilters((current) => {
      const otherActiveFilters = current.filter((f) => f.value !== filter.value);

      // If the new active filter has no options, remove it from the active filters
      if (newActiveFilter.options.length === 0) {
        return otherActiveFilters;
      }

      return [...otherActiveFilters, newActiveFilter];
    });
  };

  const salesConsultants = useMemo(() => {
    return Array.from(
      new Set(
        users?.map(
          ({ lastName, firstName, avatar, uid }) => ({
            value: uid, label: `${firstName} ${lastName}`
          })
        )
      )
    );
  }, [users]);

  const filters: IFilters[] = [
    { label: "Contact Owner", value: "ownerUserUid", withIcon: true, options: salesConsultants, isMultiSelect: true },
    { label: "Create Date", value: "createdDate", options: ["This Month","Last Month","This Year","Last Year","Custom"].map(d => ({ value: d, label: d })), type: 'date', isMultiSelect: false },
    { label: "Last Activity", value: "updatedDate", options: ["This Week","Last Week","This Month","Last Month"].map(d => ({ value: d, label: d })), type: 'date', isMultiSelect: false },
  ];

  return (
    <>
      <Header
        title="Contact Life Cycle"
        subtitle="Overview"
        className="border-b-[1px] border-b-neutrals-low"
        childrenClassName="!pb-0 flex flex-col gap-y-10 pt-6 bg-white"
      >
        <div className="flex mr-auto">
          <div className="flex gap-x-2 items-center mr-auto">
            <Button
              className="rounded-none bg-neutrals-background-default border-[1px] border-neutrals-low py-3 px-5 h-full hover:bg-transparent"
              leftSection={
                <Image src="/icons/file-import.svg" width={20} height={20} alt="import" />
              }
            >
              <p className="text-neutrals-high">Import</p>
            </Button>
            <Button
              className="rounded-none bg-brand-primary body_small_semibold text-neutrals-background-default py-3 px-4 h-full hover:bg-brand-primary"
              leftSection={
                <Image src="/icons/add-01-secondary.svg" width={20} height={20} alt="create" />
              }
            >
              <p>Contact</p>
            </Button>
          </div>
        </div>
        <Tabs 
          onTabChange={(tab: string) => setActiveTab(tab)}
          tabs={tabs}
          activeTab={activeTab}
        />
      </Header>

      <Content className="border-t-transparent flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div>
            <Button
              leftSection={
                <div
                  className={clsx(
                    !listView && 'text-brand-secondary',
                    listView && 'text-neutrals-high'
                  )}>
                    <GridViewIcon />
                </div>
              }
              variant="default"
              className={clsx(
                "rounded-none w-auto h-[42px] transition ease-in-out duration-500",
                "border-neutrals-low border-r-transparent hover:bg-neutrals-low",
                !listView && "!bg-neutrals-high border-neutrals-low text-white rounded-none hover:text-white",
              )}
              onClick={() => setListView(false)}
            >
              <p className="font-normal">Grid View</p>
            </Button>
            <Button
              leftSection={
                <div
                  className={clsx(
                    listView && 'text-brand-secondary',
                    !listView && 'text-neutrals-high'
                  )}>
                    <ListViewIcon />
                </div>
              }
              variant="transparent"
              className={clsx(
                "rounded-none w-[120px] h-[42px] transition ease-in-out duration-500 border-neutrals-low",
                listView && "bg-neutrals-high border-neutrals-low text-white  hover:bg-neutrals-high hover:text-white",
                !listView && "bg-white border-l-transparent !text-neutrals-high hover:bg-neutrals-low",
              )}
              onClick={() => setListView(true)}
            >
              <p className="font-medium">List View</p>
            </Button>
          </div>
          <div>
            <SearchFilters
              filters={filters}
              activeFilters={activeFilters}
              updateActiveFilters={updateActiveFilters}
            />
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div>
            <FiltersActive
              activeFilters={activeFilters}
              onReset={() => {
                setActiveFilters([]);
              }}
              onFilterRemove={(value, filter) => {
                setActiveFilters((current) => {
                  const existingFilterObj = current.find(f => f.value === value);
                  
                  if(!existingFilterObj) {
                    const newActiveFilter = {
                      label: filter,
                      value: value,
                      options: [{ value: value, label: filter }],
                      isMultiSelect: true
                    };

                    return [
                      ...current.filter(f => f.value !== filter),
                      newActiveFilter
                    ]
                  } else {
                    const newOptions = existingFilterObj?.options?.filter(o => o.value !== filter);

                    if(newOptions?.length === 0) {
                      return current.filter(f => f.value !== value);
                    } else {
                      return [
                        ...current.filter(f => f.value !== value),
                        {
                          ...existingFilterObj,
                          options: newOptions
                        }
                      ]
                    }
                  }
                })
              }}
            />
          </div>
        )}

        <Contacts
          listView={listView}
          activeTab={activeTab}
          filters={activeFilters}
        />
      </Content>
    </>
  );
};