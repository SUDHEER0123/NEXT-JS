'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import { ContractsAndPaymentsTable } from './table';
import { IContact, IContract, IFilters, ISelectItem, IVehicle } from '@/app/types';
import { useAppDataStore } from '@/app/app.store';
import { ComboboxOptionProps } from '@mantine/core';
import { SearchFilters } from '@/components/SearchFilters/SearchFilters';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import _flatten from 'lodash-es/flatten';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { FiltersActive } from '@/components/SearchFilters/FiltersActive';
import { CONTRACT_STATUSES } from '@/utils/common';

interface IContractsAndPayments {}

export interface IContractsAndPayment {
  id?: string
  vehicleImage?: string;
  model: string;
  exteriorColor: string;
  orderNumber: string;
  name?: string;
  orderStatus: string;
  vehicleStatus: string;
  location?: string;
}

const filterContracts = (contracts: IContract[], filters: IFilters[], searchInput: string) => {
  return contracts.filter((contract) => {
    // Check if the contract matches the search input
    const matchesSearch = searchInput ? Object.values(contract).every((value) => {
      return String(value).toLowerCase().includes(searchInput.toLowerCase());
    }) : true;

    // Check if the order matches the selected filters
    const filtersObject = _flatten(filters?.map(filter => ({
      value: filter.value,
      options: filter?.options?.map(o => o),
      type: filter.type
    })));

    const matchesFilters = filtersObject.length ? filtersObject?.every((filter) => {
      const filterValue = contract[filter.value as keyof IContract]?.toString()?.toLowerCase();

      const filterOptions = filter?.options?.map((option) => option?.value?.toLowerCase());

      if(filter.type === 'date') {
        const orderDate = new Date(contract[filter?.value as keyof IContract] as string);
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

export const ContractsAndPaymentsContent: React.FC<IContractsAndPayments> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { modelTypes, locations, users } = useAppDataStore();
  const [activeFilters, setActiveFilters] = useState<IFilters[]>([]);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchInput(value);
  }, {
    delay: 10
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
    { label: "Model Type", value: "modelLine", options: modelTypesOptions, isMultiSelect: true },
    { label: "Contract Date", value: "contractDate", options: [], type: 'date', isMultiSelect: false },
    { label: "Dealer Location", value: "locationUid", options: locationsOptions, isMultiSelect: true },
    { label: "Sales Consultant", value: "consultantUserUid", withIcon: true, options: salesConsultants, isMultiSelect: true },
    { label: "Contract Status", value: "status", options: ["All", ...CONTRACT_STATUSES].map(d => ({ value: d, label: d })), isMultiSelect: true },
  ];

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

  const { data: contracts, isLoading: isLoadingContracts, error: errorGettingContracts } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => api.get('/contract/all').then(res => res.data as IContract[]),
    retry: false,
    refetchOnMount: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });
    
  const { data: vehicles, isLoading: isLoadingVehicles, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicle').then(res => res.data as IVehicle[])
  });
  
  const { data: contacts, isLoading: isLoadingContacts, error: errorGettingContacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.get(`/contact`).then(res => res.data as IContact[]),
  });

  const filteredContracts = useMemo(() => {
    if(isLoadingContracts || !contracts) return [];

    return filterContracts(contracts, activeFilters, searchInput).map(contract => {
      const vehicle =(vehicles ?? []).find(vehicle => vehicle.contactUid === contract.contactUid);
      const contact = contacts?.find(contact => contact.uid === contract?.contactUid);
      const user = users?.find(user => user.uid === contract?.consultantUserUid);

      return {
        ...contract,
        modelLine: modelTypes?.find(modelType => modelType.uid === vehicle?.modelTypeUid)?.line,
        customerName: contact?.fullNameEN,
        vin: vehicle?.vin,
        salesConsultant: `${user?.firstName} ${user?.lastName}`,
      }
    });
  },[contracts, isLoadingContracts, activeFilters, searchInput, modelTypes, vehicles, contacts, users]);

  return (
    <>
      <div className='flex justify-between px-8 pt-4 w-full'>
        <div className='min-w-[500px]'>
          <SearchInput placeholder='Search by Customer Name, Contract Number or VIN...' onChange={handleSearch}/>
        </div>
        <SearchFilters filters={filters} updateActiveFilters={updateActiveFilters} activeFilters={activeFilters} />
      </div>
      {activeFilters.length > 0 && (
        <div className='px-8'>
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
      <ContractsAndPaymentsTable contracts={filteredContracts} />
    </>
  );
};