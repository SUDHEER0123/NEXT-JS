'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { IContact, IContract, ILocation, IOrder, IOrderView, IVehicle } from '@/app/types';
import Image from "next/image";
import { ActionIcon } from "@mantine/core";
import { formatDate } from "@/utils/dateFormatter";
import clsx from "clsx";
import { formatNumberWithCommas } from "@/utils/common";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAppDataStore } from "@/app/app.store";
import { Loader } from "@/components/ui/Loader/Loader";

interface UseOrderOverviewProps {
  orderView?: IOrderView;
  vehicle?: IVehicle;
  contract?: IContract;
  contact?: IContact;
  isLoadingVehicle?: boolean;
  isLoadingContract?: boolean;
  isLoadingContact?: boolean;
}

interface OrderOverviewProps extends UseOrderOverviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ isOpen, onClose, orderView, vehicle, contact, contract, isLoadingContact, isLoadingContract, isLoadingVehicle }) => { 
  const { orderuid, opportunitynumber, type, ordernumber, heroimageicon } = orderView ?? {};
  const { modelTypes } = useAppDataStore();

  const { data: order, isLoading: isLoadingOrder, error: errorGettingOrder } = useQuery({
    queryKey: ['orderView', orderuid],
    queryFn: () => api.get(`/order/view/${orderuid}`).then(res => res.data as IOrderView),
    enabled: !!orderuid,
  });

  const {
    orderUpdatedDate,
    depositAmount,
    placeddate,
    estimateddeliverydate,
    vehiclestatus,
    orderstatus,
    cancelDate,
    heroImage
  } = order ?? {
  };

  const {
    vinNumber,
    licensePlate,
    modelTypeUid,
  } = vehicle ?? {};

  const {
    line,
    type: modelType
  } = modelTypes?.find(m => m.uid === modelTypeUid) ?? {}

  const {
    lastName,
    firstName,
    mobileNo,
  } = contact ?? {};

  const {
    contractNumber,
    value: contractValue,
  } = contract ?? {
    value: 0
  }
  
  const isLoading = useMemo(() => {
    return isLoadingOrder || isLoadingVehicle || isLoadingContract || isLoadingContact;
  }
  , [isLoadingOrder, isLoadingVehicle, isLoadingContract, isLoadingContact]);

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
        {!isLoading ? (
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
                      className={clsx(
                        "flex flex-col xl:w-[60rem] xl:h-[35rem] 2xl:w-[63.75rem] 2xl:h-[43.75rem] items-center text-center gap-y-2 pt-8 relative",
                        orderstatus === 'Order Cancelled' && "bg-radial-gradient-3",
                        orderstatus !== 'Order Cancelled' && "bg-radial-gradient-2",
                      )}
                    >
                      <div className="self-start absolute top-5 left-5">
                        {orderstatus === "Order Cancelled" && (
                          <div className="flex flex-col gap-y-4 pb-2">
                            <div className={clsx(
                              "flex gap-x-1 w-fit items-center px-1.5 py-[2px] border-[0.5px] rounded-full",
                              orderstatus === "Order Cancelled" && "!bg-indications-bg_error_soft border-indications-red",
                            )}>
                              <span className={clsx(
                                "rounded-full size-2 border-[1px] text-neutrals-high",
                                orderstatus === "Order Cancelled" && "bg-indications-red",
                              )}/>
                              <span className="caption_small_semibold">{orderstatus}</span>
                            </div>
                          </div>
                        )}
                        {orderstatus !== "Order Cancelled" && (
                          <div className="flex flex-col gap-y-4 pb-2">
                            <div className={clsx(
                              "flex gap-x-1 w-fit items-center px-1.5 py-[2px] border-[0.5px] rounded-full bg-brand-secondary_ext_2",
                            )}>
                              <span className={clsx(
                                "rounded-full size-2 border-[1px] text-neutrals-high bg-brand-secondary"
                              )}/>
                              <span className="caption_small_semibold">{type}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <Image src="/images/logo-white-new.svg" alt="logo" width={95.71} height={40} />
                      <span className="text-base text-neutrals-background-default tracking-[0.01em] font-normal">Order Overview</span>
                      <span 
                        className={clsx(
                          "font-bold text-7xl w-[35rem] xl:text-5xl xl:w-[25rem]",
                          orderstatus !== 'Order Cancelled' && "model-txt bg-clip-text text-transparent bg-gradient-3",
                          orderstatus === 'Order Cancelled' && "!text-indications-error_soft !text-opacity-50",
                        )}
                      >
                        {modelType ?? 'No data'}
                      </span>
                      <span 
                        className={clsx(
                          "font-bold text-7xl w-[35rem] xl:text-5xl xl:w-[25rem]",
                          orderstatus !== 'Order Cancelled' && "model-txt bg-clip-text text-transparent bg-gradient-3",
                          orderstatus === 'Order Cancelled' && "!text-indications-error_soft !text-opacity-50",
                        )}
                      >
                        {line ?? 'No data'}
                      </span>
                      <div className="xl:w-[30rem] xl:h-[8.75rem] xl:mt-3 2xl:w-[33.75rem] 2xl:h-[26.25rem] absolute top-1/4">
                        {heroImage && <Image src={heroImage} alt="logo" width={562} height={345} layout="auto" />}
                      </div>
                      <div className="flex flex-col gap-y-12 items-center xl:gap-y-6 mt-auto mb-12">
                        <div className="flex flex-row gap-x-6">
                          <div className="flex flex-col">
                            <div className="flex flex-row gap-x-4">
                              <div className="bg-black border border-neutrals-low w-[1.125rem]" />
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">Color:</span>
                            </div>
                            <span className="text-sm font-medium text-neutrals-background-default pl-[2.2rem]">Black</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex flex-row gap-x-4">
                              <Image src="/images/vin.svg" width={18} height={18} alt="vin" />
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">VIN Number:</span>
                            </div>
                            <span className="text-sm font-medium text-neutrals-background-default pl-[2.2rem]">{vinNumber}</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex flex-row gap-x-4">
                              <Image src="/images/vin.svg" width={18} height={18} alt="vin" />
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">License Plate:</span>
                            </div>
                            <span className="text-sm font-medium text-neutrals-background-default pl-[2.2rem]">{licensePlate}</span>
                          </div>
                        </div>
                        <div className="bg-radial-gradient w-[47.313rem] h-[0.5px]"/>
                        <div className="flex flex-row gap-x-36">
                          <div className="flex flex-row gap-x-4">
                            <Image src="/images/profile-02.svg" width={56} height={56} alt="profile" />
                            <div className="flex flex-col items-start">
                              <span className="text-neutrals-background-default text-2xl font-medium">{`${firstName} ${lastName}`}</span>
                              <span className="text-neutrals-low text-sm font-normal">{mobileNo?.phoneNumber}</span>
                            </div>
                          </div>
                          <div className="flex flex-row gap-x-8">
                            <div className="flex flex-col items-start">
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Contract No:</span>
                              <span className="text-neutrals-low text-base font-medium">{contractNumber}</span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Invoice Value:</span>
                              <span className="text-neutrals-low text-base font-medium">{formatNumberWithCommas(contractValue)}</span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Deposit Taken:</span>
                              <span className="text-neutrals-low text-base font-medium">{formatNumberWithCommas(depositAmount ?? 0)}</span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Open Balance:</span>
                              <span className="text-neutrals-low text-base font-medium">{formatNumberWithCommas((contractValue ?? 0) - (depositAmount || 0))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col absolute right-10 top-1/4 items-start">
                        <div className={clsx(orderstatus !== "Order Cancelled" && "grid grid-cols-3", orderstatus === "Order Cancelled" && "flex gap-x-1")}>
                          {orderstatus !== "Order Cancelled" && <span className="col-span-2 pr-2 text-neutrals-low text-xxs">Order Placed:</span>}
                          {orderstatus === "Order Cancelled" && <span className="pr-3 text-neutrals-low text-xxs">Order Cancelation Date:</span>}
                          <div className="col-span-1 border-r-2 border-r-brand-secondary" />
                        </div>
                        <span className="text-neutrals-background-default text-xs pr-2">{formatDate(orderstatus !== "Order Cancelled" ? placeddate : cancelDate ?? '', 'E, dd MMM yyyy')}</span>
                      </div>
                      <div className="flex flex-col absolute right-10 top-1/4 mt-20 items-start">
                        <div className="flex flex-row gap-x-1">
                          {orderstatus !== "Order Cancelled" && <span className="pr-2 text-neutrals-low text-xxs">Order Last Updated:</span>}
                          {orderstatus === "Order Cancelled" && <span className="pr-2 text-neutrals-low text-xxs">Refund Processed Status:</span>}
                          <div className="border-r-2 border-r-brand-secondary" />
                        </div>
                        <span className="text-neutrals-background-default text-xs pr-2">{orderstatus !== "Order Cancelled" ? formatDate(orderUpdatedDate ?? '', 'E, dd MMM yyy') : ''}</span>
                      </div>
                      <div className="flex flex-col absolute left-12 top-1/3 items-start gap-y-8">
                        <div className="flex flex-col items-start">
                          <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Opportunity No:</span>
                          <span className="text-neutrals-background-default text-xs pl-2">{opportunitynumber}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Order No:</span>
                          <span className="text-neutrals-background-default text-xs pl-2">{ordernumber}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Vehicle Status:</span>
                          <span className="text-neutrals-background-default text-xs pl-2">{vehiclestatus}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Estimated Arrive:</span>
                          <span className="text-neutrals-background-default text-xs pl-2">{formatDate(estimateddeliverydate ?? '', 'E, dd MMM yyy')}</span>
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
        ):(
          <Loader />
        )}
      </Dialog>
    </Transition>
  );
};

export default OrderOverview;


export const useOrderOverview = (props: UseOrderOverviewProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <OrderOverview
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      orderView={props.orderView}
      contact={props.contact}
      vehicle={props.vehicle}
      contract={props.contract}
    />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}