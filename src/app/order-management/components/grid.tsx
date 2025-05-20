import React, { useEffect } from "react";
import { OrderTitle } from "./order-title";
import { EmptyOrder } from "./empty-order";
import { Button, ScrollAreaAutosize } from "@mantine/core";
import Image from "next/image";
import { IOrder, IOrderView } from "@/app/types";
import { OrderDetails } from "./order-details";
import { useNewStockPurchase } from "./new-stock-purchase/new-stock-purchase";
import { useNewRetailOrder } from "./new-retail-order/new-retail-order";
import { useNewStockOrder } from "./new-stock-order/new-stock-order";

interface IGrid {
  filteredStockPurchases: IOrderView[];
  filteredRetailOrders: IOrderView[];
  filteredStockOrders: IOrderView[];
  expanded?: boolean;
}

export const Grid: React.FC<IGrid> = ({
  filteredStockPurchases,
  filteredRetailOrders,
  filteredStockOrders,
  expanded
}) => {
  const { open: openNewStockPurchase, drawerRef: newStockPurchaseRef } = useNewStockPurchase();
  const { open: openNewRetailOrder, drawerRef: newRetailOrderRef } = useNewRetailOrder();
  const { open: openNewStockOrder, drawerRef: newStockOrderRef } = useNewStockOrder();

  return (
    <div className="grid grid-cols-3 lg:gap-x-8 xl:gap-x-2 2xl:gap-x-2 h-full pb-4">
      <div className='flex flex-col gap-y-2 border-t-4 shadow-subtle-shadow2 border-t-brand-primary font-medium text-base p-2 bg-white h-full min-h-0'>

        <OrderTitle title="STOCK PURCHASE" count={(filteredStockPurchases ?? []).length} onAddOrder={() => openNewStockPurchase()} />

        <div className="flex flex-col gap-y-2 h-full overflow-y-auto">
          {filteredStockPurchases.length > 0 && filteredStockPurchases.map((stockPurchase, idx) => (
            <OrderDetails orderData={stockPurchase} expanded={expanded} type="Stock Purchase" key={`${stockPurchase.orderuid}-${idx}`} />
          ))}
          {filteredStockPurchases.length === 0 && (
            <div className='flex flex-col items-center py-24'>
              <EmptyOrder
                message="There are no Stock Purchase available. Add one by clicking the button below."
                action={
                  <Button
                    variant="unstyled"
                    onClick={() => openNewStockPurchase()}
                    leftSection={
                      <Image
                        src="/icons/add-01.svg"
                        width={20}
                        height={20}
                        alt="add"
                      />
                    }
                    className='text-brand-primary body_small_semibold hover:text-brand-primary bg-neutrals-background-surface h-[48px] hover:bg-neutrals-background-surface'
                  >
                    New Stock Purchase
                  </Button>
                }
              />
            </div>
          )}
          {newStockPurchaseRef}
        </div>

      </div>
      <div className='flex flex-col gap-y-2 border-t-4 shadow-subtle-shadow2 border-t-brand-secondary font-medium text-base p-2 bg-white h-full min-h-0'>

        <OrderTitle title="RETAIL ORDER" count={(filteredRetailOrders ?? []).length} onAddOrder={() => openNewRetailOrder()} />

        <div className="flex flex-col gap-y-2 h-full overflow-y-auto">
          {filteredRetailOrders.length > 0 && filteredRetailOrders.map((retailOrder, idx) => (
            <OrderDetails orderData={retailOrder} expanded={expanded} type="Retail Order" key={`${retailOrder.orderuid}-${idx}`} />
          ))}
          {filteredRetailOrders.length <= 0 && (
            <div className='flex flex-col items-center py-24'>
              <EmptyOrder
                message="There are no Retail Orders available. Add one by clicking the button below."
                action={
                  <Button
                    variant="unstyled"
                    onClick={() => openNewRetailOrder()}
                    leftSection={
                      <Image
                        src="/icons/add-01.svg"
                        width={20}
                        height={20}
                        alt="add"
                      />
                    }
                    className='text-brand-primary body_small_semibold hover:text-brand-primary bg-neutrals-background-surface h-[48px] hover:bg-neutrals-background-surface'
                  >
                    New Retail Order
                  </Button>
                }
              />
            </div>
          )}
          {newRetailOrderRef}
        </div>

      </div>
      <div className='flex flex-col gap-y-2 border-t-4 shadow-subtle-shadow2 border-t-indications-neutral font-medium text-base p-2 bg-white h-full min-h-0'>

        <OrderTitle title="STOCK ORDER" count={(filteredStockOrders ?? []).length} onAddOrder={() => openNewStockOrder()} />

        <div className="flex flex-col gap-y-2 h-full overflow-y-auto">
          {filteredStockOrders.length > 0 && filteredStockOrders.map((stockOrder, idx) => (
            <OrderDetails orderData={stockOrder} expanded={expanded} type="Stock Order" key={`${stockOrder.orderuid}-${idx}`} />
          ))}
          {filteredStockOrders.length === 0 && (
            <div className='flex flex-col items-center py-24'>
              <EmptyOrder
                message="There are no Stock Orders available. Add one by clicking the button below."
                action={
                  <Button
                    variant="unstyled"
                    onClick={() => openNewStockOrder()}
                    leftSection={
                      <Image
                        src="/icons/add-01.svg"
                        width={20}
                        height={20}
                        alt="add"
                      />
                    }
                    className='text-brand-primary body_small_semibold hover:text-brand-primary bg-neutrals-background-surface h-[48px] hover:bg-neutrals-background-surface'
                  >
                    New Stock Order
                  </Button>
                }
              />
            </div>
          )}
          {newStockOrderRef}
        </div>
        
      </div>
    </div>
  )
}