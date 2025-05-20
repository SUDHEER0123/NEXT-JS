import { Payment } from '@/app/types';
import { create } from 'zustand'

interface contractsState {
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
}

export const useContractsStore = create<contractsState>((set) => ({
  payments: [],
  setPayments: (p) => set({ payments: p }),
}))