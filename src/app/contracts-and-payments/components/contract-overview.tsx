'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionIcon } from "@mantine/core";
import { IContract, IOrder, IOrderView, IVehicle, OrderInventory } from "@/app/types";
import { formatNumberWithCommas } from "@/utils/common";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAppDataStore } from "@/app/app.store";
import { formatDate } from "@/utils/dateFormatter";
import { usePDFView } from "@/components/PdfViewer/PdfViewer";

interface UseContractOverviewProps {
  contract?: IContract;
}

interface ContractOverviewProps extends UseContractOverviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContractOverview: React.FC<ContractOverviewProps> = ({ isOpen, onClose, contract }) => {
  const router = useRouter();
  const { documentUid, value, balance, contractNumber } = contract ?? {};
  const { modelTypes } = useAppDataStore();
  const { open: openContractPDF, close: closeContractPDF, modalRef: contractPdfModalRef } = usePDFView({ pdfUrl: documentUid ?? '' });
  
  // Get orderInventory by uid
  const { data: orderInventory, isLoading: isLoadingOrderInventory, error: errorGettingOrderInventory } = useQuery({
    queryKey: ['orderInventory', contract?.orderInventoryUid],
    queryFn: () => api.get(`/order/inventory/${contract?.orderInventoryUid}`).then(res => res.data as OrderInventory),
    enabled: !!contract?.orderInventoryUid,
  });

  // Get vehicle by uid
  const { data: vehicle, isLoading: isLoadingVehicle, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicle', orderInventory?.vehicleUid],
    queryFn: () => api.get(`/vehicle/${orderInventory?.vehicleUid}`).then(res => res.data as IVehicle),
    enabled: !!orderInventory?.vehicleUid,
  });

  const modelType = modelTypes?.find((model) => model.uid === vehicle?.modelTypeUid);

  // Get order by uid from orderInventoryUid
  const { data: order, isLoading: isLoadingOrder, error: errorGettingOrder } = useQuery({
    queryKey: ['order', orderInventory?.orderUid],
    queryFn: () => api.get(`/order/view/${orderInventory?.orderUid}`).then(res => res.data as IOrderView),
    enabled: !!orderInventory?.orderUid,
  });

  // Details steps
  // 1. Get orderInventory by orderInventoryUid from 
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
                {contractPdfModalRef}
                <div className="flex">
                  <div
                    className="flex flex-col w-[63.75rem] h-[43.75rem] border bg-radial-gradient-2 items-center text-center gap-y-2 pt-6 relative"
                  >
                    <Image src="/images/logo-white-new.svg" alt="logo" width={95.71} height={40} />
                    <div className="flex flex-row gap-x-1 absolute left-12 top-12 cursor-pointer border-b-2 border-b-brand-secondary pb-2">
                      <Image src="/icons/contracts-white.svg" width={20} height={20} alt="contracts" />
                      <span className="body_small_semibold text-white" onClick={() => openContractPDF()}>View PDF Contract</span>
                    </div>
                    <span className="text-base text-neutrals-background-default tracking-[0.01em] font-normal pt-4">Contract Overview</span>
                    <span 
                      className="bg-clip-text text-transparent bg-gradient-3 font-bold text-7xl w-[35rem]"
                    >
                      {modelType?.type}
                    </span>
                    <span 
                      className="bg-clip-text text-transparent bg-gradient-3 font-bold text-7xl w-[35rem]"
                    >
                      {modelType?.line}
                    </span>
                    <Image src={vehicle?.heroImage ?? ''} alt="logo" width={625} height={384} className="absolute top-1/4" layout="auto" />
                    
                    <div className="flex flex-col gap-y-12 items-center py-[12rem]">
                      <div className="flex flex-row gap-x-6">
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-x-4">
                            <div className="bg-black border border-neutrals-low w-[1.125rem]" />
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">Color:</span>
                          </div>
                          <span className="text-sm font-medium text-neutrals-background-default pl-[2.2rem]">{vehicle?.extColor?.color}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-x-4">
                            <Image src="/images/vin.svg" width={18} height={18} alt="vin" />
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">VIN Number:</span>
                          </div>
                          <span className="text-sm font-medium text-neutrals-background-default pl-[2.2rem]">{vehicle?.vinNumber}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-x-4">
                            <Image src="/images/vin.svg" width={18} height={18} alt="vin" />
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">License Plate:</span>
                          </div>
                          <span className="text-sm font-medium text-neutrals-background-default pl-[2.2rem]">{vehicle?.licensePlate}</span>
                        </div>
                      </div>
                      <div className="bg-radial-gradient w-[47.313rem] h-[0.5px]"/>
                      <div className="flex flex-row gap-x-36">
                        <div className="flex flex-row gap-x-4 pb-48">
                          <Image src="/images/profile-02.svg" width={56} height={56} alt="profile" />
                          <div className="flex flex-col items-start">
                            <span className="text-neutrals-background-default text-2xl font-medium">{`${order?.fullnameen ?? 'No data'}`}</span>
                            <span className="text-neutrals-low text-sm font-normal">{order?.primaryPhoneNo?.phoneNumber}</span>
                          </div>
                        </div>
                        <div className="flex flex-row gap-x-8">
                          <div className="flex flex-col items-start">
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Contract No:</span>
                            <span className="text-neutrals-low text-base font-medium">{contractNumber}</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Invoice Value:</span>
                            <span className="text-neutrals-low text-base font-medium">{formatNumberWithCommas(value)}</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Deposit Taken:</span>
                            <span className="text-neutrals-low text-base font-medium">{formatNumberWithCommas(order?.depositAmount)}</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] font-normal">Open Balance:</span>
                            <span className="text-neutrals-low text-base font-medium">{formatNumberWithCommas(balance)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col absolute right-10 top-1/4 items-start">
                      <div className="grid grid-cols-3">
                        <span className="col-span-2 pr-2 text-neutrals-low text-xxs">Order Placed:</span>
                        <div className="col-span-1 border-r-2 border-r-brand-secondary" />
                      </div>
                      <span className="text-neutrals-background-default text-xs pr-2">{formatDate(order?.placeddate)}</span>
                    </div>
                    <div className="flex flex-col absolute right-10 top-1/4 mt-20 items-start">
                      <div className="flex flex-row gap-x-1">
                        <span className="pr-2 text-neutrals-low text-xxs">Order Last Updated:</span>
                        <div className="border-r-2 border-r-brand-secondary" />
                      </div>
                      <span className="text-neutrals-background-default text-xs pr-2">{formatDate(order?.orderUpdatedDate)}</span>
                    </div>
                    <div className="flex flex-col absolute left-12 top-1/3 mt-16 items-start">
                      <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Vehicle Status:</span>
                      <span className="text-neutrals-background-default text-xs pl-2">{order?.vehiclestatus}</span>
                    </div>
                    <div className="flex flex-col absolute left-12 top-1/3 mt-32 items-start">
                      <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Estimated Arrive:</span>
                      <span className="text-neutrals-background-default text-xs pl-2">{formatDate(order?.estimateddeliverydate)}</span>
                    </div>
                  </div>
                  <ActionIcon className="bg-brand-secondary p-1 rounded-none hover:bg-brand-secondary w-[48px] h-[48px]" onClick={onClose}>
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

export default ContractOverview;


export const useContractOverview = (props: UseContractOverviewProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <ContractOverview isOpen={isOpen} onClose={() => setIsOpen(false)} contract={props.contract} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}