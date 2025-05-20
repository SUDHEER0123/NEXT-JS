'use client';

import { Button, ComboboxOptionProps } from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react';
import clsx from "clsx";
import { useDebouncedCallback } from '@mantine/hooks';
import { Grid } from './grid';
import { OrdersTable } from './table';
import { CollapseIcon, ExpandIcon, GridViewIcon, ListViewIcon } from '@/assets/icons';
import { IFilters, IOrderView, ISelectItem } from '@/app/types';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import _flatten from 'lodash-es/flatten';
import { useAppDataStore } from '@/app/app.store';
import { Loader } from '@/components/ui/Loader/Loader';
import { toast } from 'react-toastify';
import { SearchFilters } from '@/components/SearchFilters/SearchFilters';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { FiltersActive } from '@/components/SearchFilters/FiltersActive';
import { ORDER_STATUSES, VEHICLE_STATUSES } from '@/utils/common';

interface IOrders {}

// Filter function to filter orders based on the selected filters, search input, and group
const filterOrders = (orders: IOrderView[], filters: IFilters[], searchInput: string) => {
  return orders.filter((order) => {
    // Check if the order matches the search input
    const matchesSearch = order?.model?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      order?.fullnameen?.toLowerCase()?.includes(searchInput?.toLowerCase());

    // Check if the order matches the selected filters
    const filtersObject = _flatten(filters?.map(filter => ({
      value: filter.value,
      options: filter?.options?.map(o => o),
      type: filter.type
    })));
    
    const matchesFilters = filtersObject.length ? filtersObject?.every((filter) => {
    const filterValue = order[filter.value as keyof IOrderView]?.toString()?.toLowerCase();

    const filterOptions = filter?.options?.map((option) => option?.value?.toLowerCase());

    if(filter.type === 'date') {
      const orderDate = new Date(order[filter?.value as keyof IOrderView] as string);
      const now = new Date();
      const dateFilterType = filter.options?.[0]?.value;

      if (dateFilterType === 'This Month') {
        return orderDate.getUTCMonth() === now.getUTCMonth() && orderDate.getUTCFullYear() === now.getUTCFullYear();
      } else if (dateFilterType === 'Last Month') {
        const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1));
        return orderDate.getUTCMonth() === lastMonth.getUTCMonth() && orderDate.getUTCFullYear() === lastMonth.getUTCFullYear();
      } else if (dateFilterType === 'This Year') {
        return orderDate.getUTCFullYear() === now.getUTCFullYear();
      } else if (dateFilterType === 'Last Year') {
        return orderDate.getUTCFullYear() === now.getUTCFullYear() - 1;
      } else if (dateFilterType === 'This Week') {
        return orderDate.getUTCFullYear() === now.getUTCFullYear() && orderDate.getUTCMonth() === now.getUTCMonth() && Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)) < 7;
      } else if (dateFilterType === 'Last Week') {
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        return orderDate.getUTCFullYear() === lastWeek.getUTCFullYear() && orderDate.getUTCMonth() === lastWeek.getUTCMonth() && Math.floor((lastWeek.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)) < 7;
      } else if(dateFilterType === 'This Quarter') {
        const currentQuarter = Math.floor((now.getUTCMonth() + 3) / 3);
        const orderQuarter = Math.floor((orderDate.getUTCMonth() + 3) / 3);
        return orderQuarter === currentQuarter && orderDate.getUTCFullYear() === now.getUTCFullYear();
      } else if(dateFilterType === 'Last Quarter') {
        const lastQuarter = Math.floor((now.getUTCMonth() + 3) / 3) - 1;
        const orderQuarter = Math.floor((orderDate.getUTCMonth() + 3) / 3);
        return orderQuarter === lastQuarter && orderDate.getUTCFullYear() === now.getUTCFullYear();
      } else if(dateFilterType === 'Custom') {
        const customDate = new Date(filter.value);
        return orderDate.getUTCFullYear() === customDate.getUTCFullYear() && orderDate.getUTCMonth() === customDate.getUTCMonth();
      } else {
        return false;
      }
    } else {
      return filterOptions?.includes(filterValue ?? '');
    }
  }) : true;

  if(!searchInput && filters.length === 0) {
    return true;
  } else if(searchInput && filters.length === 0) {
    return matchesSearch;
  } else if(!searchInput && filters.length > 0) {
    return matchesFilters;
  } else if(searchInput && filters.length > 0) {
    return matchesSearch && matchesFilters;
  }
  });
}

export const Orders: React.FC<IOrders> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [listView, setListView] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchInput(value);
  }, {
    delay: 10
  });
  const [groupActive, setGroupActive] = useState('all');
  const [activeFilters, setActiveFilters] = useState<IFilters[]>([]);
  const { modelTypes, locations, users } = useAppDataStore();

  const { data: orderViews, isLoading: isLoadingOrderViews, error: errorGettingOrderViews } = useQuery({
    queryKey: ['orderViews'],
    queryFn: () => api.get('/order/view').then(res => res.data as IOrderView[]),
    retry: false,
    refetchOnMount: false,
    retryOnMount: false,
    refetchOnWindowFocus: false
  });

  const modelTypesOptions = useMemo(() => {
    const uniqueModelTypes = Array.from(new Set(modelTypes?.map((modelType) => modelType.type)));
    
    return uniqueModelTypes.map((modelType) => ({
      value: modelTypes?.find(m => m.type === modelType)?.uid ?? modelType,
      label: modelType
    }));
  }, [modelTypes]);

  const locationsOptions = useMemo(() => {
    return Array.from(
      new Set(
        locations?.map(
          ({ name, uid }) => ({
            label: name,
            value: uid
          })
        )
      )
    );
  }, [locations]);

  const salesConsultants = useMemo(() => {
    return Array.from(new Set(users?.map(({ lastName, firstName, avatar, uid }) => ({
      label: `${firstName} ${lastName}`,
      value: uid,
      avatar
    }))));
  }, [users]);

  const filters: IFilters[] = [
    { label: "Model Type", value: "modeltypeuid", options: modelTypesOptions, isMultiSelect: true },
    { label: "Order Date", value: "placeddate", options: ["This Week","Last Week","This Month","Last Month","This Quarter","Last Quarter","This Year"].map(d => ({ value: d, label: d })), isMultiSelect: false, type: 'date' },
    { label: "Dealer Location", value: "locationuid", options: locationsOptions, isMultiSelect: true },
    { label: "Sales Consultant", value: "consultantuid", withIcon: true, options: salesConsultants, isMultiSelect: true },
    { label: "Vehicle Status", value: "vehiclestatus", options: ["All", ...VEHICLE_STATUSES].map(d => ({ value: d, label: d })), isMultiSelect: true },
    { label: "Order Status", value: "orderstatus", options: ["All",...ORDER_STATUSES].map(d => ({ value: d, label: d })), isMultiSelect: true },
  ];

  const approvedOrders = useMemo(() => {
    return orderViews?.map(o => ({
      ...o,
      salesConsultant: `${o.userfirstname} ${o.userlastname}`,
    }))
    .filter(o => o.orderstatus !== 'Order Awaiting Approval');
  },[orderViews]);

  const filteredStockPurchases = useMemo(() => filterOrders(approvedOrders?.filter(o => o.type === "Stock Purchase") ?? [], activeFilters, searchInput), [approvedOrders, activeFilters, searchInput]);
  const filteredRetailOrders = useMemo(() => filterOrders(approvedOrders?.filter(o => o.type === "Retail Order") ?? [], activeFilters, searchInput), [approvedOrders, activeFilters, searchInput]);
  const filteredStockOrders = useMemo(() => filterOrders(approvedOrders?.filter(o => o.type === "Stock Order") ?? [], activeFilters, searchInput), [approvedOrders, activeFilters, searchInput]);

  const groupValues = [{
    label: 'All',
    value: 'all',
  },{
    label: 'Order Type',
    value: 'type',
  },{
    label: 'Order Status',
    value: 'orderstatus',
  },{
    label: 'Vehicle Status',
    value: 'vehiclestatus'
  }];

  useEffect(() => {
    if (errorGettingOrderViews) {
     toast.error('Error getting orders.'); 
    }
  }, [errorGettingOrderViews]);

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

  const filteredOrderViews = useMemo(() => {
    return filterOrders(approvedOrders ?? [], activeFilters, searchInput);
  }
  , [approvedOrders, activeFilters, searchInput]);

  return (
    <div className="flex flex-col gap-y-4 h-full select-none">
      <div className='flex justify-between items-center'>
        <div className='w-[500px]'>
          <SearchInput
            placeholder='Search by Customer Name, Phone Number or Model Type'
            onChange={handleSearch}
          />
        </div>
        <SearchFilters
          filters={filters}
          activeFilters={activeFilters}
          updateActiveFilters={updateActiveFilters}
        />
      </div>
    
      <div className='flex gap-x-4'>
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
        
        {!listView && (
          <div>
          <Button
            leftSection={
              <div
                className={clsx(
                  expanded && 'text-brand-secondary',
                  !expanded && 'text-neutrals-high'
                )}>
                  <ExpandIcon />
              </div>
            }
            variant="default"
            className={clsx(
              "rounded-none w-[120px] h-[42px] transition ease-in-out duration-500",
              "border-neutrals-low border-r-transparent hover:bg-neutrals-low",
              expanded && "!bg-neutrals-high border-neutrals-low text-white rounded-none hover:text-white",
            )}
            onClick={() => setExpanded(true)}
          >
            <p className="font-normal">Expand</p>
          </Button>
          <Button
            leftSection={
              <div
                className={clsx(
                  !expanded && 'text-brand-secondary',
                  expanded && 'text-neutrals-high'
                )}>
                  <CollapseIcon />
              </div>
            }
            variant="transparent"
            className={clsx(
              "rounded-none w-[120px] h-[42px] transition ease-in-out duration-500 border-neutrals-low",
              !expanded && "bg-neutrals-high border-neutrals-low text-white  hover:bg-neutrals-high hover:text-white",
              expanded && "bg-white border-l-transparent !text-neutrals-high hover:bg-neutrals-low",
            )}
            onClick={() => setExpanded(false)}
          >
            <p className="font-medium">Collapse</p>
          </Button>
          </div>
        )}
        
        {listView && (
          <div className="flex gap-x-4 items-center pl-8 pb-4 ml-auto">
            <span className="body_small_semibold">Grouped by:</span>
            <div className="flex border border-neutrals-low border-r-transparent">
            {groupValues.map(({ label, value }) => (
              <span
                className={clsx(
                  'text-neutrals-high caption_regular border-r py-2 px-4 cursor-pointer',
                  groupActive === value && 'bg-neutrals-high text-white'
                )}
                onClick={() => setGroupActive(value)}
              >
                {label}
              </span>
            ))}
            </div>
          </div>
        )}
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

      {!isLoadingOrderViews ? (
        <>
          {!listView && (
            <Grid
              filteredStockPurchases={filteredStockPurchases}
              filteredRetailOrders={filteredRetailOrders}
              filteredStockOrders={filteredStockOrders}
              expanded={expanded}
            />
          )}
          {listView && (
            <OrdersTable
              data={filteredOrderViews ?? []}
              groupActive={groupActive}
            />
          )}
        </>
      ):(
        <Loader />
      )}
    </div>
  );
};