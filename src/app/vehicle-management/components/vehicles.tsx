'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import { IVehicleTable, VehiclesTable } from './table';
import { IContact, IFilters, ISelectItem, IVehicle } from '@/app/types';
import { SearchFilters } from '@/components/SearchFilters/SearchFilters';
import { ComboboxOptionProps } from '@mantine/core';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { FiltersActive } from '@/components/SearchFilters/FiltersActive';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAppDataStore } from '@/app/app.store';
import { Loader } from '@/components/ui/Loader/Loader';
import _flatten from 'lodash-es/flatten';
import { VEHICLE_STATUSES } from '@/utils/common';

interface IVehicles {}

// Filter function to filter orders based on the selected filters, search input, and group
const filterVehicles = (vehicle: IVehicleTable[], filters: IFilters[], searchInput: string) => {
  return vehicle?.filter((vehicle) => {
    // Check if the order matches the search input
    const matchesSearch = searchInput ? Object.values(vehicle).some((value) => {
      return String(value).toLowerCase().includes(searchInput.toLowerCase());
    }) : true;

    // Check if the order matches the selected filters
    const filtersObject = _flatten(filters?.map(filter => ({
      value: filter.value,
      options: filter?.options?.map(o => o),
      type: filter.type
    })));
    
    const matchesFilters = filtersObject.length ? filtersObject?.some((filter) => {
    const filterValue = [filter.value as keyof IVehicleTable]?.toString()?.toLowerCase();

    const filterOptions = filter?.options?.map((option) => option?.value?.toLowerCase());

    if(filter.type === 'date') {
      const orderDate = new Date(vehicle[filter?.value as keyof IVehicleTable] as string);
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

const filters: IFilters[] = [
  { label: "Registration Date", value: "registrationDate", type: 'date', dateType: 'range', options: [] },
  { label: "Vehicle Status", value: "status", options: ["All",...VEHICLE_STATUSES]?.map(d => ({ value: d, label: d })), isMultiSelect: true },
];

export const Vehicles: React.FC<IVehicles> = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [
    activeFilters, setActiveFilters] = useState<IFilters[]>([]);
  const { modelTypes, locations } = useAppDataStore();

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchInput(value);
  }, {
    delay: 10
  });

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

  const { data: vehicles, isLoading: isLoadingVehicles, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicle').then(res => res.data as IVehicle[])
  });
  
  const { data: contacts, isLoading: isLoadingContacts, error: errorGettingContacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.get(`/contact`).then(res => res.data as IContact[]),
  });
  
  const rowData = useMemo(() => {
    return filterVehicles(vehicles?.map(vehicle => {
      return {
        ...vehicle,
        modelLine: modelTypes?.find(m => m.uid === vehicle.modelTypeUid)?.line ?? '' as string,
        dealerLocation: locations?.find(l => l.uid === vehicle.locationUid)?.name ?? '',
        customerName: contacts?.find(u => u.uid === vehicle.contactUid)?.fullNameEN ?? '',
      }
    }) as IVehicleTable[], activeFilters, searchInput)?.filter(d => d.status !== 'New Order Awaiting Approval');
  },[vehicles, searchInput, activeFilters, modelTypes, locations, contacts]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className='flex justify-between items-center pt-4 px-8'>
        <div className='w-[400px]'>
          <SearchInput
            placeholder='Search by Customer Name, VIN or License Plate...'
            onChange={handleSearch}
          />
        </div>
        <SearchFilters
          filters={filters}
          activeFilters={activeFilters}
          updateActiveFilters={updateActiveFilters}
        />
      </div>

      <div className='px-8'>
        {activeFilters.length > 0 && (
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
        )}
      </div>
      {(isLoadingContacts || isLoadingVehicles) ? (
        <Loader  />
      ):(
        <VehiclesTable data={rowData} contacts={contacts} />
      )}
    </div>
  );
};