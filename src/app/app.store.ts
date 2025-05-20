// stores/useAppDataStore.ts
import { create } from 'zustand';
import { IModelType, ILocation, IUser } from './types';

interface AppDataStore {
  modelTypes: IModelType[] | null;
  locations: ILocation[] | null;
  users: IUser[] | null;
  setModelTypes: (data: IModelType[]) => void;
  setLocations: (data: ILocation[]) => void;
  setUsers: (data: IUser[]) => void;
}

export const useAppDataStore = create<AppDataStore>((set) => ({
  modelTypes: null,
  locations: null,
  users: null,
  setModelTypes: (data) => set({ modelTypes: data }),
  setLocations: (data) => set({ locations: data }),
  setUsers: (data) => set({ users: data }),
}));
