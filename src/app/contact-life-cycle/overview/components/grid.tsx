
import { SearchInput } from '@/components/SearchInput/SearchInput';
import React from 'react';
import { ContactCard } from './contact-card';
import { IContact, ILead, IProspect, IVehicle } from '@/app/types';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface IContactsGrid {
  data: IContact[];
}

export const ContactsGrid: React.FC<IContactsGrid> = ({ data }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');

  const { data: vehicles, isLoading: isLoadingVehicles, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicle').then(res => res.data as IVehicle[])
  });

  const { data: leads, isLoading: isLoadingLeads, error: errorGettingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/contact/lead').then(res => res.data as ILead[])
  });

  const { data: prospects, isLoading: isLoadingProspects, error: errorGettingProspects } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/prospect').then(res => res.data as IProspect[])
  });

  return (
    <div className='flex flex-col bg-white pt-2 pb-4 px-4'>
      <div className='grid grid-cols-6 gap-x-3 gap-y-3 py-2 overflow-y-auto overflow-x-hidden'>
        {data?.map(d => <ContactCard contact={d} vehicles={vehicles ?? []} leads={leads ?? []} prospects={prospects ?? []} />)}
      </div>
    </div>
  )
};