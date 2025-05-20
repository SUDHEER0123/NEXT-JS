import { Contact, IContact } from '@/app/types';
import { create } from 'zustand'

interface ContactLifeCycleState {
  rowData: IContact[];
  setRowData: (data: IContact[]) => void;
  rowsSelected: IContact[];
  setRowsSelected: (rows: IContact[]) => void;
  contacts: IContact[];
  setContacts: (contacts: IContact[]) => void;
}

export const useContactLifeCycleStore = create<ContactLifeCycleState>((set) => ({
  rowsSelected: [],
  setRowsSelected: (rows) => set({ rowsSelected: rows }),
  rowData: [],
  setRowData: (data) => set({ rowData: data }),
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
}));