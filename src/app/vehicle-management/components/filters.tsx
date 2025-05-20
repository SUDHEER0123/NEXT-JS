'use client';

import {  Button, Group, Pill } from "@mantine/core";
import './common.css'
import { IFilters } from "@/app/types";
import { formatDate } from "@/utils/dateFormatter";

interface IFilter {
  activeFilters: IFilters[];
  onReset: () => void;
  onFilterRemove: (value: string, key: string) => void;
}

export const FiltersActive: React.FC<IFilter> = ({ onReset, onFilterRemove, ...props }) => {
  const pills = props?.activeFilters?.map((activeFilter, index) => {
    return activeFilter?.options?.map(filter => (
      <Pill
        key={filter?.value}
        withRemoveButton
        classNames={{
          root: "bg-neutrals-background-default border border-neutrals-low rounded-full pe-1 py-2 px-4 h-[32px] shadow-filter",
          label: "flex flex-row space-x-1 text-[10px] leading-[15px]",
        }}
        style={{
          fontSize: '12px',
          lineHeight: '15px',
        }}
        size="xl"
        className="flex flex-row space-x-1"
        removeButtonProps={{
          className: "text-neutrals-medium w-4 h-4",
          onClick: () => {
            onFilterRemove(activeFilter.value, filter?.value);
          }
        }}
      >
        <span
          className="text-neutrals-medium"
          key={activeFilter.value}
        >
          {activeFilter.label}:
        </span>
        <span className="text-neutrals-high">
          {/* {activeFilter?.type === 'date' ? (
            activeFilter.dateType === 'range' ? (
              `${formatDate(filter?.split('=')?.[0], 'MM/dd/yyyy')} - ${formatDate(filter?.split('=')?.[1], 'MM/dd/yyyy')}`
            ) : (
              filter
            )
          ) : (
            filter
            )
          } */}
        </span>
      </Pill>
    ));
  });

  return (
    props?.activeFilters?.some(a => (a?.options?.length ?? 0) > 0) && (
      <Group gap="sm">
        <Pill.Group>{pills}</Pill.Group>
        <Button
          variant="transparent"
          classNames={{ root: 'p-0 rounded-b-none' }}
          onClick={() => onReset()}
        >
          <p className="text-neutrals-high font-normal underline decoration-neutrals-medium underline-offset-4">Reset Filter</p>
        </Button>
      </Group> 
    )
  );
}