'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionIcon, Button, Textarea } from "@mantine/core";
import { IOrder, Order } from "@/app/types";
import { differenceInDays } from "date-fns";
import './common.css';
import { useOrdersStore } from "../store/orders.store";
import { formatNumberWithCommas } from "@/utils/common";
interface UseCancelOrderProps {
  order: Order;
  onCancelOrder: (order: IOrder) => void;
}

interface CancelOrderProps extends UseCancelOrderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CancelOrder: React.FC<CancelOrderProps> = ({ isOpen, onClose, order, onCancelOrder }) => {
  const orderOlderThan7Days = order?.orderDate ? differenceInDays(new Date(), new Date(order?.orderDate)) > 7 : false;
  const { cancelOrder } = useOrdersStore();
  const [cancellationReason, setCancellationReason] = useState('');

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-[15px]" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-2">
          <div className="flex flex-row">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel>
                <div className="flex">
                  <div
                  className="flex flex-col w-[548px] border bg-white items-center text-center gap-y-6 pt-12 cancel-order-modal-bg"
                >
                  <Image src="/icons/alert-02.svg" alt="info" width={56} height={56} />
                  <div className="flex flex-col gap-y-3 w-full">
                    <span className="text-neutrals-high text-[18px] leading-[28px] font-medium w-full">
                      Do you want to Cancel the Order?
                    </span>
                    {orderOlderThan7Days ? (
                      <span className="body_large_regular text-neutrals-high">
                        <p>The order data is older than 7 days. If the order</p>
                        <p>is cancelled the deposit of <span className="text-indications-red body_large_bold">{formatNumberWithCommas(order?.depositAmount)}</span></p>
                        <p>will not be refunded</p>
                      </span>
                    ):(
                      <span className="body_regular_regular text-neutrals-high">
                        <p>If the order is cancelled, the deposit of</p>
                        <p><span className="text-indications-red body_large_bold">{formatNumberWithCommas(order?.depositAmount)}</span> must be refunded</p>
                      </span>
                    )}
                    <div className="border-[1px] border-neutrals-low mt-4 mx-4">
                      <Textarea
                        variant="unstyled"
                        placeholder="Cancellation Reason..."
                        className="h-[80px] p-2 body_small_regular text-neutrals-medium bg-neutrals-background-surface"
                        classNames={{
                          input: 'text-neutrals-medium'
                        }}
                        onChange={(e) => setCancellationReason(e.currentTarget.value)}
                        value={cancellationReason}
                      />
                    </div>
                    <div className="flex flex-row w-full h-fit">
                      <Button className="w-full h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={onClose}>
                        <p className="text-neutrals-background-default text-base">
                          Go Back
                        </p>
                      </Button>
                      <Button
                        className="w-full h-auto bg-indications-red rounded-none p-6 font-medium hover:bg-indications-red"
                        onClick={() => {
                          cancelOrder(order);
                          onClose();
                        }}
                        disabled={!cancellationReason?.length}
                      >
                        <p className="text-neutrals-background-default text-base">
                          Cancel Order
                        </p>
                      </Button>
                    </div>
                  </div>
                  </div>
                  <ActionIcon className="bg-brand-secondary p-1 rounded-none hover:bg-brand-secondary size-[48px]" onClick={onClose}>
                    <Image src="/icons/cancel-01.svg" width={24} height={24} alt="close" />
                  </ActionIcon>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CancelOrder;


export const useCancelOrder = (props: any) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <CancelOrder isOpen={isOpen} onClose={() => setIsOpen(false)} order={props.order} {...props} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}