'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionIcon } from "@mantine/core";
import { useOptionAndConfigPDFView } from "./option-and-config-pdf-view";
import { IContact, IOrder, IOrderView, IVehicle } from "@/app/types";
import { useAppDataStore } from "@/app/app.store";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate } from "@/utils/dateFormatter";

interface UseVehicleOverviewProps {
  // model: string;
  // extColor: string;
  // vinNumber: string;
  // licensePlate: string;
  // orderType: string;
  // orderPlaced: string;
  // customerName: string;
  // vehicleStatus: string;
  // estimatedArrival: string;
  vehicle?: IVehicle;
  contacts?: IContact[];
}

interface VehicleOverviewProps extends UseVehicleOverviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const VehicleOverview: React.FC<VehicleOverviewProps> = ({
  isOpen,
  onClose,
  vehicle,
  contacts
}) => {
  const { open: openOptionAndConfigPDF, close: closeOptionAndConfigPDF, modalRef: optionAndConfigPDFModalRef } = useOptionAndConfigPDFView({ pdfUrl: '' });
  const { 
    extColor,
    vinNumber,
    licensePlate,
    status,
    modelTypeUid,
    contactUid,
    uid,
    heroImage
  } = vehicle ?? {};
  const { modelTypes } = useAppDataStore();

  const modelType = modelTypes?.find(m => m.uid === modelTypeUid);

  const { data: vehicleOrder, isLoading: isLoadingVehicleOrder, error: errorGettingVehicleOrder } = useQuery({
    queryKey: ['vehicleOrder', uid],
    queryFn: () => api.get(`/vehicle/detail/order/${uid}`).then(res => res.data as IOrderView),
    enabled: !!uid,
  });

  const { placeddate, type, estimateddeliverydate } = vehicleOrder ?? {};
  
  const customerName = contacts?.find(u => u.uid === contactUid)?.fullNameEN

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
            {optionAndConfigPDFModalRef}
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
                    className="flex flex-col w-[63.75rem] h-[43.75rem] border bg-radial-gradient-2 items-center text-center gap-y-2 pt-6 relative justify-between"
                  >
                    <div className="flex flex-col gap-y-2 items-center">
                      <Image src="/images/logo-white-new.svg" alt="logo" width={95.71} height={40} />
                      <span className="text-base text-neutrals-background-default tracking-[0.01em] font-normal pt-12">Vehicle Overview</span>
                      <span className={clsx(
                        "font-bold text-5xl xl:text-6xl model-txt bg-clip-text text-transparent bg-gradient-3"
                      )}
                      >
                        {modelType?.type ?? 'No data'}
                      </span>
                      <span 
                        className={clsx(
                          "font-bold text-5xl xl:text-6xl model-txt bg-clip-text text-transparent bg-gradient-3"
                        )}
                      >
                        {modelType?.line ?? 'No data'}
                      </span>
                    </div>
                    {heroImage && <Image src={heroImage} alt="logo" width={625} height={384} className="absolute top-1/4 mt-8" layout="auto" />}
                    
                    <div className="flex py-16 px-12 justify-between w-full">
                      {/*Ext Color*/}
                      <div className="flex items-start gap-x-3">
                        <div className={`bg-${extColor?.hexCode} border border-neutrals-low size-[1.125rem]`} />
                        <div className="flex flex-col items-start text-start w-full">
                          <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem] w-full">Ext Color:</span>
                          <span className="text-sm font-medium text-neutrals-background-default w-full">{extColor?.color}</span>
                        </div>
                      </div>

                      {/*Vin Number*/}
                      <div className="flex items-start gap-x-3">
                        <Image src="/images/vin.svg" width={24} height={18} alt="vin" />
                        <div className="flex flex-col items-start text-start">
                          <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">VIN Number:</span>
                          <span className="text-sm font-medium text-neutrals-background-default text-start">{vinNumber}</span>
                        </div>
                      </div>
                      
                      {/*License Plate*/}
                      <div className="flex items-start gap-x-3">
                        <Image src="/images/vin.svg" width={18} height={18} alt="license" />
                        <div className="flex flex-col items-start">
                          <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">License Plate:</span>
                          <span className="text-sm font-medium text-neutrals-background-default text-start">{licensePlate}</span>
                        </div>
                      </div>

                      {/*Warranty Date*/}
                      <div className="flex items-start gap-x-2">
                        <Image src="/images/calendar-04.svg" width={18} height={18} alt="warranty" />
                        <div className="flex flex-col items-start">
                          <span className="text-neutrals-low text-[0.75rem] leading-[1.125rem]">Warranty Date:</span>
                          <span className="text-sm font-medium text-neutrals-background-default text-start">{licensePlate}</span>
                        </div>
                      </div>

                      {/*Option and Configuration Document*/}
                      <div className="flex flex-row gap-x-1 items-start text-start cursor-pointer" onClick={() => openOptionAndConfigPDF()}>
                        <Image src="/icons/download-05.svg" width={20} height={20} alt="download" />
                        <p className="caption_semibold text-neutrals-background-default w-fit underline underline-offset-[5px] !decoration-brand-secondary">Option and Configuration Document</p>
                      </div>
                    </div>

                    {/* Order Type */}
                    <div className="flex flex-col absolute right-[5%] top-1/4 mt-8 items-start">
                      <div className="grid grid-cols-3">
                        <span className="col-span-2 pr-3.5 text-neutrals-low text-xxs">Order Type:</span>
                        <div className="col-span-1 border-r-2 border-r-brand-secondary" />
                      </div>
                      <span className="text-neutrals-background-default text-xs pr-2">{type}</span>
                    </div>

                    {/* Order Placed */}
                    <div className="flex flex-col absolute right-[5%] top-1/4 mt-24 items-start">
                      <div className="flex flex-row gap-x-1">
                        <span className="pr-8 text-neutrals-low text-xxs">Order Placed:</span>
                        <div className="border-r-2 border-r-brand-secondary" />
                      </div>
                      <span className="text-neutrals-background-default text-xs pr-2">{formatDate(placeddate)}</span>
                    </div>

                    <div className="flex flex-col absolute left-12 top-1/4 mt-10 items-start">
                      <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Customer Name:</span>
                      <span className="text-neutrals-background-default text-xs pl-2">{customerName}</span>
                    </div>
                    <div className="flex flex-col absolute left-12 top-1/3 mt-10 items-start">
                      <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Vehicle Status:</span>
                      <span className="text-neutrals-background-default text-xs pl-2">{status}</span>
                    </div>
                    <div className="flex flex-col absolute left-12 top-1/2 items-start">
                      <span className="pl-2 border-l-2 border-l-brand-secondary text-neutrals-low text-xxs">Estimated Arrive:</span>
                      <span className="text-neutrals-background-default text-xs pl-2">{estimateddeliverydate}</span>
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

export default VehicleOverview;


export const useVehicleOverview = (props: UseVehicleOverviewProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <VehicleOverview isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}