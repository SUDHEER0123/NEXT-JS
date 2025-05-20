import { IOrder, IOrderView, Order } from '@/app/types';
import { create } from 'zustand'

interface OrdersState {
  orders: Order[];
  selectedOrder: IOrderView;
  setSelectedOrder: (order: IOrderView) => void;
  addOrder: (order: Order) => void;
  cancelOrder: (order: Order) => void;
  removeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: string, data: Record<string, any>) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  selectedOrder: {} as IOrderView,
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  cancelOrder: (order) => set((state) => ({
    orders: state.orders.map((o) => (o.id === order.id ? { ...o, status: 'Order Cancelled', orderCancelDate: new Date().toISOString() } : o)),
  })),
  removeOrder: (order) => set((state) => ({
    orders: state.orders.filter((o) => o.id !== order.id),
  })),
  updateOrderStatus: (orderId, status, data) => set((state) => ({
    orders: state.orders.map((o) => {
      return o.id === orderId ?
        {
          ...o,
          status: status,
          orderStatusData: [
            ...o?.orderStatusData ?? [],
            {
              status: status,
              date: new Date().toISOString(),
              data: data || {}
            }
          ]
        } as Order
        : o
      }),
  })),
}));