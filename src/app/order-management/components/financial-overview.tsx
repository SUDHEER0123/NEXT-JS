'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";;
import { IContract, IOrder, IVehicle } from '@/app/types';
import Image from "next/image";
import { ActionIcon, Button } from "@mantine/core";
import { VehicleStatusMenu } from "./vehicle-status-menu";
import { Carousel } from '@mantine/carousel';
import clsx from "clsx";
import { last } from "lodash-es";
import { formatDate } from "@/utils/dateFormatter";
import classes from './common.module.css';
import { formatNumberWithCommas } from "@/utils/common";
import { SalesByHq } from "./vehicle-statuses/sales-by-hq";
import { CustomerHandover } from "./vehicle-statuses/customer-handover";
import { PtsByHq } from "./vehicle-statuses/pts-by-hq";
import { InTransitByHq } from "./vehicle-statuses/in-transit-by-hq";
import { PortArrival } from "./vehicle-statuses/port-arrival";
import { StorageBeforeCustom } from "./vehicle-statuses/storage-before-custom";
import { StorageAfterCustom } from "./vehicle-statuses/storage-after-custom";
import { UnderPDI } from "./vehicle-statuses/under-pdi";
import { OrderedRetail } from "./vehicle-statuses/ordered-retail";
import { Showroom } from "./vehicle-statuses/showroom";
import { OrderedStock } from "./vehicle-statuses/ordered-stock";
import { StockInventory } from "./vehicle-statuses/stock-inventory";
import { useOrdersStore } from "../store/orders.store";
import { AnalysisTextLinkIcon, ChartLineData02Icon, FileWonIcon } from "@/assets/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAppDataStore } from "@/app/app.store";
import EditableField from "./EditableField";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';

interface UseFinancialOverviewProps {
  order: IOrder;
  vehicle?: IVehicle;
  contract?: IContract;
}

interface FinancialOverviewProps extends UseFinancialOverviewProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Field {
  label: string;
  value: string;
  type?: 'text' | 'number' | 'link' | 'date';
}

interface StatusFields {
  [orderType: string]: {
    [FinancialOverview: string]: {
      icon: string;
      fields: Field[];
      inactiveComponent?: React.ReactNode;
    };
  };
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ isOpen, onClose, order, contract, vehicle }) => {
  const { type, placedDate, uid, vehicleStatus, contractUid, updatedDate, orderInventory, orderNumber } = order ?? {};
  const [openedStatus, setOpenedStatus] = useState<string | null>(null);
  const { updateOrderStatus } = useOrdersStore();
  const [openedVehicle, setOpenedVehicle] = useState(true);
  const [openedTransit, setOpenedTransit] = useState(true);
  const [openedPerformance, setOpenedPerformance] = useState(true);
  const { modelTypes } = useAppDataStore();
  const queryClient = useQueryClient();

  const contractNo = useMemo(() => contract?.contractNumber, [contract]);
  const modelTypeUid = useMemo(() => vehicle?.modelTypeUid, [vehicle]);

  const {
    displayName,
    line
  } = modelTypes?.find(m => m.uid === modelTypeUid) ?? {}


  const updatePrice = ({ key, value }: { key: string; value: number }) => {
    if (!order) {
      toast.error('OrderUID and ContractUID are required.');
      return;
    }

    updateOrderResponse({
      ...order,
      [key]: value,
    });
  }
  const { mutate: updateOrderResponse, isPending: isUpdatingOrder } = useMutation({
    mutationKey: ['updatePrice', order],
    mutationFn: (data: any) => api.put(`/order`, data),
    onMutate: async (data) => {

    },
    onSuccess(data, variables, context) {
      toast.success('Price updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['orderUid', order.uid] });
    },
    onError(error, variables, context) {
      console.error('Error during update', error);
      toast.error('Error during updating price.');
    },
  });

  const wholesaleAmount = order?.wholesaleInvoiceAmount || 0;
  const customerAmount = contract?.value || 0;

  const grossProfit = customerAmount - wholesaleAmount;
  const grossMargin = wholesaleAmount > 0 ? (grossProfit / wholesaleAmount) * 100 : 0;

  const isProfitPositive = grossProfit >= 0;

  

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>

        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-[15px]" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-2">
          <div className="flex flex-row items-center justify-center">
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
                <div className="flex w-[66.75rem] h-[34.5rem]">
                  <div className="flex w-full">
                    <div
                      className="w-1/2 flex flex-col border bg-[#E7E9E2] items-start text-center gap-y-2 p-12 relative"
                    >
                      <div className="flex gap-x-3 items-center">
                        <span className="text-neutrals-medium sub_heading_3_semibold">FINANCIAL OVERVIEW</span>
                        <div className="flex flex-col gap-y-4">
                          <div className={clsx(
                            "flex gap-x-1 w-fit items-center px-1.5 py-[2px] border-[1px] rounded-full bg-brand-secondary_ext_2 border-brand-secondary",
                          )}>
                            <span className={clsx(
                              "rounded-full size-2 border-[1px] border-brand-secondary text-neutrals-high bg-brand-secondary",
                            )} />
                            <span className="text-neutrals-high body_small_semibold">{type}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className="text-neutrals-high font-medium text-[40px] leading-[56px] pt-8"
                      >
                        {displayName}
                      </span>

                      <div className="flex flex-row gap-x-10 items-start justify-start">
                        <div className="flex flex-col gap-y-1 items-start">
                          <span className="text-sm text-neutrals-high font-medium">Order Number</span>
                          <span className="text-sm text-neutrals-high font-medium">Contract Number</span>
                          <span className="text-sm text-neutrals-high font-medium">Vehicle Status</span>
                          <span className="text-sm text-neutrals-high font-medium">Last Updated</span>
                        </div>
                        <div className="flex flex-col gap-y-1 items-start">
                          <span className="text-sm font-normal text-neutrals-high">{orderNumber ?? '--'}</span>
                          <span className="text-sm font-normal text-neutrals-high">{contractNo ?? '--'}</span>
                          <span className="text-sm font-normal text-neutrals-high">{vehicleStatus ?? '--'}</span>
                          <span className="text-sm font-normal text-neutrals-high">{formatDate(updatedDate, 'E, dd MMM yyyy hh:mm a')}</span>
                        </div>
                      </div>
                      <Image src="/images/contract-image.svg" width={361} height={512} alt="contract-image" className="self-center mt-2 absolute bottom-0" />
                      <Image src="/images/halfCarImg.png" width={333} height={190} alt="contract-image" className="self-center mt-2 absolute bottom-0" />
                    </div>
                    <div className="bg-gradient-9 w-1/2 max-h-full flex flex-col gap-[10px]  py-6 px-6 relative">

                      {/* Vehicle Financial Data */}
                      <div className="flex flex-col gap-y-2">
                        {openedVehicle && <Image src="/images/file-won-right.svg" width={60} height={71} className="text-neutrals-medium absolute top-[11.25%] right-[5%]" alt="vehicle" />}
                        <div className="flex gap-x-1 items-center">
                          <FileWonIcon width={20} height={20} className="text-brand-secondary" />
                          <p className="body_small_semibold text-neutrals-background-default">Vehicle Financial Data</p>
                          <ActionIcon
                            variant="transparent"
                            className={
                              clsx(
                                'ml-auto',
                                !openedVehicle && 'rotate-180 transform duration-300',
                                openedVehicle && 'rotate-0 transform duration-300'
                              )
                            }
                            onClick={() => setOpenedVehicle(!openedVehicle)}
                          >
                            <Image src="/icons/chevron.svg" width={24} height={24} alt="chevron" />
                          </ActionIcon>
                        </div>
                        {openedVehicle && (
                          <div className="flex flex-col gap-y-2 px-2 py-3 border-[1px] border-[#999999] shadow-subtle-shadow2 bg-gradient-7">
                            <div className="flex justify-between pr-12">
                              <div className="flex flex-col gap-y-3">
                                <div className="flex flex-col">
                                  <p className="caption_small_regular text-neutrals-low">Base Price</p>
                                  <p className="caption_regular text-neutrals-background-default">{formatNumberWithCommas(order?.orderInventory?.[0]?.vehiclePrice)}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="caption_small_regular text-neutrals-low">Option Price</p>
                                  <p className="caption_regular text-neutrals-background-default">{formatNumberWithCommas(order?.orderInventory?.[0]?.optionPrice)}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="caption_small_regular text-neutrals-low">Discount Amount</p>
                                  <p className="caption_regular text-neutrals-background-default">{formatNumberWithCommas(contract?.discountAmount)}</p>
                                </div>
                              </div>
                              <div className="flex flex-col text-center justify-center text-neutrals-background-default">
                                <p className="body_small_regular">Total Price</p>
                                <p className="body_large_semibold">{formatNumberWithCommas(contract?.value) ?? '--'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Transit and FOREX Financial Data*/}
                      <div className="flex flex-col gap-y-2 relative z-[48]">
                        {openedTransit && <Image src="/images/analysis-text-link-right.svg" width={60} height={71} className="absolute top-[24%] right-[0.1%]" alt="transit" />}
                        <div className="flex gap-x-1 items-center">
                          <AnalysisTextLinkIcon width={20} height={20} className="text-brand-secondary" />
                          <p className="body_small_semibold text-neutrals-background-default">Transit and FOREX Financial Data</p>
                          <ActionIcon
                            variant="transparent"
                            className={
                              clsx(
                                'ml-auto',
                                !openedTransit && 'rotate-180 transform duration-300',
                                openedTransit && 'rotate-0 transform duration-300'
                              )
                            }
                            onClick={() => setOpenedTransit(!openedTransit)}
                          >
                            <Image src="/icons/chevron.svg" width={24} height={24} alt="chevron" />
                          </ActionIcon>
                        </div>
                        {openedTransit && (
                          <div className="flex flex-col px-2 py-3 border-[1px] border-[#999999] shadow-subtle-shadow2 bg-gradient-7">
                            <div>
                            </div>
                            <div className="grid grid-cols-2">
                              <div className="flex flex-col gap-y-3">
                                <EditableField
                                  label="Transportation Cost"
                                  value={order?.customTransportPrice}
                                  onSave={(newVal) => updatePrice({ key: 'customTransportPrice', value: Number(newVal) })}
                                />
                                <EditableField
                                  label="Clearance Cost"
                                  value={order?.customClearancePrice}
                                  onSave={(newVal) => updatePrice({ key: 'customClearancePrice', value: Number(newVal) })}
                                />
                              </div>
                              <div className="flex flex-col gap-y-3">
                                <EditableField
                                  label="FOREX RP Exchange Rate"
                                  value={order?.forexRPCost}
                                  onSave={(newVal) => updatePrice({ key: 'forexRPCost', value: Number(newVal) })}
                                />
                               
                                <EditableField
                                  label="FOREX BL Exchange Rate"
                                  value={order?.forexBLCost}
                                  onSave={(newVal) => updatePrice({ key: 'forexBLCost', value: Number(newVal) })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/*Performance Financial Data*/}
                      <div className="flex flex-col gap-y-2">
                        <div className="flex gap-x-1">
                          <ChartLineData02Icon width={20} height={20} className="text-brand-secondary" />
                          <p className="body_small_semibold text-neutrals-background-default">Performance Financial Data</p>
                          <ActionIcon
                            variant="transparent"
                            className={
                              clsx(
                                'ml-auto',
                                !openedPerformance && 'rotate-180 transform duration-300',
                                openedPerformance && 'rotate-0 transform duration-300'
                              )
                            }
                            onClick={() => setOpenedPerformance(!openedPerformance)}
                          >
                            <Image src="/icons/chevron.svg" width={24} height={24} alt="chevron" />
                          </ActionIcon>
                        </div>
                        {openedPerformance && (
                          <div className="flex flex-col px-2 py-3 border-[1px] border-[#999999] shadow-subtle-shadow2 bg-gradient-7">
                            <div className="flex gap-x-48">
                              <div className="flex flex-col gap-y-3">
                                <div className="flex flex-col">
                                  <p className="caption_small_regular text-neutrals-low">Wholesale Invoice Amount</p>
                                  <p className="caption_regular text-neutrals-background-default">{formatNumberWithCommas(order?.wholesaleInvoiceAmount)}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="caption_small_regular text-neutrals-low">Customer Invoice Amount</p>
                                  <p className="caption_regular text-neutrals-background-default">{formatNumberWithCommas(contract?.value)}</p>
                                </div>
                              </div>
                              <div className="flex flex-col text-center items-center justify-start text-neutrals-background-default">
                                <p className="body_small_regular">{isProfitPositive? 'Gross Profit':'Loss'}</p>
                                <p className={`body_large_semibold`}>
                                  {formatNumberWithCommas(grossProfit)}
                                </p>
                                <div
                                  className={`
                                        border-[1px] rounded-full w-fit caption_semibold py-1 px-3
                                        ${isProfitPositive
                                      ? 'bg-indications-bg_success_soft border-brand-primary text-brand-primary'
                                      : 'bg-indications-bg_warning_soft border-red-500 text-red-600'}
                                       `}
                                >
                                  {grossMargin > 0 ? '+' : ''}
                                  {grossMargin.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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

export default FinancialOverview;


export const useFinancialOverview = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <FinancialOverview isOpen={isOpen} onClose={() => setIsOpen(false)} order={props.order} contract={props.contract} vehicle={props.vehicle} />
  );

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}