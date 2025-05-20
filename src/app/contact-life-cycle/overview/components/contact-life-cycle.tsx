import { useEffect, useMemo, useState } from "react";
import { ContactsTable } from "./table";
import { useContactLifeCycleStore } from "./contact-life-cycle.store";
import { ContactsGrid } from "./grid";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { IContact, IFilters } from "@/app/types";
import { Loader } from "@/components/ui/Loader/Loader";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import _flatten from 'lodash-es/flatten';

interface IAllContacts {
  listView: boolean;
  activeTab?: string;
  filters?: IFilters[];
}

const getDateComparison = (value: string) => {
  if(value === 'This Month') {
    return new Date().getMonth() + 1;
  } else if(value === 'Last Month') {
    return new Date().getMonth();
  } else if(value === 'This Year') {
    return new Date().getFullYear();
  } else if(value === 'Last Year') {
    return new Date().getFullYear() - 1;
  }
}

const filterContacts = (contacts: IContact[], filters: IFilters[], searchInput: string) => {
  return contacts.filter((order) => {
    // Check if the order matches the search input
    const matchesSearch = searchInput ? Object.values(order).some((value) => {
      return String(value).toLowerCase().includes(searchInput.toLowerCase());
    }) : true;

    // Check if the order matches the selected filters
    const filtersObject = _flatten(filters?.map(filter => ({
      value: filter.value,
      options: filter?.options?.map(o => o),
      type: filter.type
    })));

    const matchesFilters = filtersObject.length ? filtersObject?.some((filter) => {
      const filterValue = order[filter.value as keyof IContact]?.toString()?.toLowerCase();

      const filterOptions = filter?.options?.map((option) => option?.value?.toLowerCase());

      if(filter.type === 'date') {
        const orderDate = new Date(order[filter?.value as keyof IContact] as string);
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

export const Contacts: React.FC<IAllContacts> = ({ listView, activeTab, filters }) => {
  const { setContacts } = useContactLifeCycleStore();
  const { data: contacts, isLoading: isLoadingContacts, error: errorGettingContacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.get(`/contact`).then(res => res.data as IContact[]),
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<IContact[]>([]);

  useEffect(() => {
    if(isLoadingContacts) return;

    const finalContacts = activeTab === 'All Contacts' ? contacts ?? [] : contacts?.filter(contact => contact.type === activeTab);

    setFilteredContacts(filterContacts(finalContacts ?? [], filters ?? [], searchValue));
    setContacts(contacts ?? []);
  },[contacts, isLoadingContacts, searchValue, activeTab, filters]);

  return (
    <div className="flex flex-col bg-white">
      <div className="w-[400px] px-4 pt-4">
        <SearchInput
          placeholder='Search by name, phone number, etc.'
          onChange={(value) => {
            setSearchValue(value);
          }}
        />
      </div>
      {!isLoadingContacts ? (
        <>
          {listView && (
            <ContactsTable
              data={filteredContacts ?? []}
              groupActive={activeTab}
            />
          )}
          {!listView && (
            <ContactsGrid
              data={filteredContacts ?? []}
            />
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
};