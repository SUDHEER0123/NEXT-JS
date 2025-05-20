// components/AppDataInitializer.tsx
'use client';

import { useAppDataStore } from '@/app/app.store';
import { ILocation, IModelType, IUser } from '@/app/types';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const AppDataInitializer = () => {
  const setModelTypes = useAppDataStore((s) => s.setModelTypes);
  const setLocations = useAppDataStore((s) => s.setLocations);
  const setUsers = useAppDataStore((s) => s.setUsers);

  const { data: modelTypes } = useQuery({
    queryKey: ['modelTypes'],
    queryFn: () => api.get('/vehicle/model').then(res => res.data as IModelType[]),
    staleTime: Infinity
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.get('/location').then(res => res.data as ILocation[]),
    staleTime: Infinity,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/user').then(res => res.data as IUser[]),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (modelTypes) setModelTypes(modelTypes);
  }, [modelTypes, setModelTypes]);

  useEffect(() => {
    if (locations) setLocations(locations);
  }, [locations, setLocations]);

  useEffect(() => {
    if (users) setUsers(users);
  }, [users, setUsers]);

  return null;
};
