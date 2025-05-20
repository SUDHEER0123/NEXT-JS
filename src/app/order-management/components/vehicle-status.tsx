'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";;
import { CreateDocumentPayload, IOrder, IOrderView, IVehicle, OrderInventory, OrderTracker } from '@/app/types';
import Image from "next/image";
import { ActionIcon, Button } from "@mantine/core";
import { VehicleStatusMenu } from "./vehicle-status-menu";
import { Carousel } from '@mantine/carousel';
import clsx from "clsx";
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
import { Under2ndPDI } from "./vehicle-statuses/under-2nd-pdi";
import { ArrowIcon } from "@/assets/icons";
import { useImageGallery } from "@/components/ImageGallery/ImageGallery";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { toast } from 'react-toastify';
import { formatDate } from "@/utils/dateFormatter";
import axios from "axios";
import { OrderStandby } from "./vehicle-statuses/order-standby";
import { useFileBase64 } from "@/components/ui/Dropfile/Dropfile";
import { useAppDataStore } from "@/app/app.store";
interface UseVehicleStatusProps {
}

interface VehicleStatusProps extends UseVehicleStatusProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Field {
  label: string;
  value: string;
  type?: 'text' | 'number' | 'link' | 'date' | 'images';
}

interface StatusFields {
  [orderType: string]: {
    [vehicleStatus: string]: {
      icon: string;
      fields: Field[];
      inactiveComponent?: React.ReactNode;
    };
  };
}

const VehicleStatus: React.FC<VehicleStatusProps> = ({ isOpen, onClose }) => {
  const [openedStatus, setOpenedStatus] = useState<string | null>(null);
  const { selectedOrder } = useOrdersStore();
  const { imageGalleryRef, openGallery, closeGallery } = useImageGallery({ items: [
    { original: '/images/car-01.png', thumbnail: '/images/car-01-alt.png' },
    { original: '/images/car-02.png', thumbnail: '/images/car-02-alt.png' },
    { original: '/images/car-01.png', thumbnail: '/images/car-01-alt.png' },
    { original: '/images/car-01.png', thumbnail: '/images/car-01-alt.png' }
  ]});
  const { orderuid: orderUid, ordernumber, placeddate, opportunitynumber, type, model, heroImage, vehicleuid, vehiclestatus, contractnumber, locationuid } = selectedOrder;
  const { user } = useAuth();
  const { locations } = useAppDataStore();

  const {  refetch: refetchOrderView } = useQuery({
    queryKey: ['orderViews'],
    queryFn: () => api.get('/order/view').then(res => res.data as IOrderView[]),
  });

  const { mutate: updateOrderMutation, isPending: isUpdatingOrder } = useMutation({
    mutationKey: ['updateOrder', orderUid],
    mutationFn: (data: Partial<IOrder>) => api.put(`/order`, data ),
    onSuccess(data, variables, context) {
      createOrderTracker({
        orderUid,
        vehicleStatus: openedStatus ?? '',
      });
      refetchTrackers();
    },
    onError(error, variables, context) {
      console.error('Error updating order: ', error);
      toast.error('Error updating order.'); 
    },
    onSettled(data, error, variables, context) {
      setOpenedStatus(null);
    },
  });
  
  const { data: order, isLoading: isLoadingOrder, error: errorGettingOrder } = useQuery({
    queryKey: ['orderview', orderUid],
    queryFn: () => api.get(`/order/view/${orderUid}`).then(res => res.data as IOrder),
  });

  const trackerApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    headers: {
      'Content-Type': 'application/json',
      'ecosystemUid': 'AstonMartin',
      'orderUid': orderUid
    },
  });

  const { data: trackers, isLoading: isLoadingTrackers, error: errorGettingTrackers, refetch: refetchTrackers } = useQuery({
    queryKey: ['trackers', orderUid],
    queryFn: () => trackerApi.get(`/order/tracker`).then(res => res.data as OrderTracker[]),
    enabled: !!orderUid
  });

  const { data: vehicle, isLoading: isLoadingVehicle, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicle', vehicleuid],
    queryFn: () => api.get(`/vehicle/${vehicleuid}`).then(res => res.data as IVehicle),
    enabled: !!vehicleuid
  });

  const updateOrder = (vehicleStatus: string, data?: Partial<IOrder>) => {
    if (openedStatus) {

      const { orderInventory, orderTracker, stock, ...rest } = order ?? {};

      updateOrderMutation({
        ...rest,
        ...data,
        uid: orderUid,
        vehicleStatus,
        customClearancePrice: order?.customClearancePrice ? parseFloat(order?.customClearancePrice.toString()) : null,
        customTransportPrice: order?.customTransportPrice ? parseFloat(order?.customTransportPrice.toString()) : null,
      });
    }
  }

  const updateVehicle = (vehicleUid: string, data: Partial<IVehicle>) => {
    if (openedStatus) {

      updateVehicleMutation({
        ...vehicle,
        ...data,
        uid: vehicleUid,
      });
    }
  }

  const { mutate: createOrderTracker, isPending: isCreatingOrderTracker } = useMutation({
    mutationKey: ['updateOrder', orderUid],
    mutationFn: (data: {
      orderUid: string;
      vehicleStatus: string;
    },
    ) => api.post(`/order/tracker`, {
      ...data,
      createdDate: new Date().toISOString(),
      changedByUserId: user?.uid,
      updatedDate: new Date().toISOString(),
      orderStatus: "Open"
    }),
    onSuccess(data, variables, context) {
      toast.success('Status updated successfully.');
      refetchTrackers();
    },
    onError(error, variables, context) {
      toast.error('Error updating status.');
    }
  });

  const { mutate: updateVehicleMutation, isPending: isUpdatingVehicle } = useMutation({
    mutationKey: ['updateVehicle', vehicleuid],
    mutationFn: (data: Partial<IVehicle>) => api.put(`/vehicle`, data ),
    onMutate: async (data) => {
    },
    onSuccess(data, variables, context) {
      createOrderTracker({
        orderUid,
        vehicleStatus: openedStatus ?? '',
      });
      refetchOrderView();
      refetchTrackers();
    },
    onError(error, variables, context) {
      console.error('Error updating order: ', error);
      toast.error('Error updating order.'); 
    },
  });

  const updatedDate = useMemo(() => order?.updatedDate ?? '',[order]);

  const orderData: Partial<IOrder> = useMemo(() => ({
    updatedDate,
    orderInventory: order?.orderInventory,
    showroomDestination: order?.vehicleStatus?.includes('Showroom') ? order?.vehicleStatus?.split(' ')[1] : undefined,
  }), [updatedDate, order]);

  const orderTrackers = useMemo(() => {
    if (!trackers) return [];

    const orderTrackers = trackers.filter((tracker) => tracker.orderUid === orderUid);

    return orderTrackers;
  },[trackers, isLoadingTrackers]);

  const fields: StatusFields = {
    "Stock Purchase": {
      "Order Standby": {
        "icon": "standby",
        "fields": [
          { label: "Order Date", value: "placeddate", type: "date" },
          { label: "Customer Name", value: "fullnameen" },
          { label: "Sales Consultant", value: "salesConsultant" },
          { label: "Collected Deposit", value: "depositAmount", type: "number" }
        ],
        inactiveComponent: (
          <OrderStandby
            onConfirm={() => updateOrder('Order Standby')}
          />
        )
      },
      "Ordered Retail": {
        "icon": "ordered_retail",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Order No", value: "ordernumber" },
        ],
        inactiveComponent: (
          <OrderedRetail
            onConfirm={(orderNumber) => updateOrder('Ordered Retail', { orderNumber })}
          />
        )
      },
      "Sales Order by HQ": {
        "icon": "sales_order",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Wholesale Order No.", value: "wholesaleOrderNumber" },
          { label: "Wholesale Invoice", value: "wholesaleInvoice", type: 'link' }
        ],
        inactiveComponent: (
          <SalesByHq
            onConfirm={() => {
            }}
            updateOrder={updateOrder}
            vehicle={vehicle}
          />
        )
      },
      "PTS by HQ": {
        "icon": "user-multiple-02",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "VIN", value: "vinnumber" }
        ],
        inactiveComponent: (
          <PtsByHq
            onConfirm={(vin) => {
              updateVehicle(vehicleuid, { vinNumber: vin });
            }}
          />
        )
      },
      "In Transit by HQ": {
        "icon": "in_transit",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Transit Type", value: "orderInventory.transitType" },
          { label: "Vessel Name", value: "orderInventory.vesselName" },
          { label: "Vessel Tracking Number", value: "orderInventory.vesselTrackingNumber" },
          { label: "BL Landing Document", value: "billOfLandingDocument", type: 'link' }
        ],
        inactiveComponent: (
          <InTransitByHq
            onConfirm={(transitType, vesselName, vesselTrackingNumber, vesselUrl, billOfLandingDocument) => {
              updateOrder(
                'In Transit by HQ',
                {
                  orderInventory: [
                    {
                      ...order?.orderInventory?.[0],
                      transitType,
                      vesselName,
                      vesselTrackingNumber,
                      vesselUrl,
                    }
                  ]
                });
            }}
          />
        )
      },
      "Port Arrival": {
        "icon": "arrival",
        "fields": [
          { label: "Customer Name", value: "fullnameen" }
        ],
        inactiveComponent: (
          <PortArrival 
            onConfirm={() => {
              updateOrder('Port Arrival', {});
            }}
          />
        )
      },
      "Storage in PDC before Custom": {
        "icon": "pdc_before",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Est Clearance Date", value: "estClearanceDate", type: "date" },
          { label: "BL Landing Document", value: "blLandingDocument", type: 'link' }
        ],
        inactiveComponent: (
          <StorageBeforeCustom
            onConfirm={() => {
              updateOrder('Storage in PDC before Custom', {});
            }}
          />
        )
      },
      "Storage in PDC after Custom": {
        "icon": "pdc_after",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Custom Clearance Date", value: "customClearanceDate", type: "date" },
          { label: "Customs Clearance Cost", value: "customClearancePrice", type: 'number' },
          { label: "Custom Transport Cost", value: "customTransportPrice", type: 'number' }
        ],
        inactiveComponent: (
          <StorageAfterCustom
            onConfirm={(customClearanceDate, customClearancePrice, customTransportPrice) => {
              updateOrder(
                'Storage in PDC after Custom',
                {
                  customClearanceDate: customClearanceDate?.toString(),
                  customClearancePrice: parseFloat(customClearancePrice as string),
                  customTransportPrice: parseFloat(customTransportPrice as string)
                }
              );
            }}
          />
        )
      },
      "Under PDI": {
        "icon": "check-list",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "PDI Images", value: "pdiImages", type: "images" }
        ],
        inactiveComponent: (
          <UnderPDI
            onConfirm={() => {
              updateOrder('Under PDI', {});
            }}
          />
        )
      }
    },
    "Retail Order": {
      "Order Standby": {
        "icon": "standby",
        "fields": [
          { label: "Order Date", value: "orderDate", type: "date" },
          { label: "Customer Name", value: "fullnameen" },
          { label: "Sales Consultant", value: "salesConsultant" },
          { label: "Collected Deposit", value: "depositAmount", type: "number" }
        ],
        inactiveComponent: (
          <OrderStandby
            onConfirm={() => updateOrder('Order Standby')}
          />
        )
      },
      "Ordered Retail": {
        "icon": "ordered_retail",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Order No", value: "orderNumber" }
        ],
        inactiveComponent: (
          <OrderedRetail
            orderNumber={selectedOrder?.ordernumber}
            onConfirm={(orderNumber) => {
              updateOrder('Ordered Retail', { orderNumber });
            }
          }/>
        )
      },
      "Sales Order by HQ": {
        "icon": "sales_order",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Wholesale Order No.", value: "wholesaleOrderNumber" },
          { label: "Wholesale Invoice", value: "wholesaleInvoice", type: 'link' }
        ],
        inactiveComponent: (
          <SalesByHq
            onConfirm={() => {
            }}
            updateOrder={updateOrder}
            vehicle={vehicle}
          />
        )
      },
      "PTS by HQ": {
        "icon": "user-multiple-02",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "VIN", value: "vinnumber" }
        ],
        inactiveComponent: (
          <PtsByHq
            onConfirm={(vin) => {
              updateVehicle(vehicleuid, { vinNumber: vin });
            }}
          />
        )
      },
      "In Transit by HQ": {
        "icon": "in_transit",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Transit Type", value: "orderInventory.transitType" },
          { label: "Vessel Name", value: "orderInventory.vesselName" },
          { label: "Vessel Tracking Number", value: "orderInventory.vesselTrackingNumber" },
          { label: "BL Landing Document", value: "billOfLandingDocument", type: 'link' }
        ],
        inactiveComponent: (
          <InTransitByHq
            onConfirm={(transitType, vesselName, vesselTrackingNumber, vesselUrl, billOfLandingDocument) => {
              updateOrder(
                'In Transit by HQ',
                {
                  orderInventory: [
                    {
                      ...order?.orderInventory?.[0],
                      transitType,
                      vesselName,
                      vesselTrackingNumber,
                      vesselUrl,
                    }
                  ],
                  billOfLandingDocument
                });
            }}
            updateOrder={updateOrder}
            vehicle={vehicle}
          />
        )
      },
      "Port Arrival": {
        "icon": "arrival",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
        ],
        inactiveComponent: (
          <PortArrival 
            onConfirm={() => {
              updateOrder('Port Arrival', {});
            }}
          />
        )
      },
      "Storage in PDC before Custom": {
        "icon": "pdc_before",
        "fields": [
          { label: "Customer Name", value: "fullnameen" }
        ],
        inactiveComponent: (
          <StorageBeforeCustom
            onConfirm={() => {
              updateOrder('Storage in PDC before Custom', {});
            }}
          />
        )
      },
      "Storage in PDC after Custom": {
        "icon": "pdc_after",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Custom Clearance Date", value: "actClearanceDate", type: "date" },
          { label: "Customs Clearance Cost", value: "customsClearanceCost", type: "number" }
        ],
        inactiveComponent: (
          <StorageAfterCustom
            onConfirm={(customClearanceDate, customClearancePrice, customTransportPrice) => {
              updateOrder(
                'Storage in PDC after Custom',
                {
                  customClearanceDate: customClearanceDate?.toString(),
                  customClearancePrice: parseFloat(customClearancePrice as string),
                  customTransportPrice: parseFloat(customTransportPrice as string)
                }
              );
            }}
          />
        )
      },
      "Under PDI": {
        "icon": "check-list",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "PDI Images", value: "pdiImages", type: "images" }
        ],
        inactiveComponent: (
          <UnderPDI
            onConfirm={() => {
              updateOrder('Under PDI', {});
            }}
          />
        )
      },
      "Showroom": {
        "icon": "showroom",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Showroom Destination", value: "showroomDestination" }
        ],
        inactiveComponent: (
          <Showroom
            onConfirm={(val) => {
              updateOrder(`Showroom ${val}`, {});
            }}
          />
        )
      },
      "Under 2nd PDI": {
        "icon": "check-list",
        "fields": [
          { label: "Customer Name", value: "fullnameen" }
        ],
        inactiveComponent: (
          <Under2ndPDI
            onConfirm={() => {
              updateOrder('Under 2nd PDI', {});
            }}
          />
        )
      },
      "Customer Handover": {
        "icon": "agreement-brand-primary",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Handover Document", value: "handoverDocument", type: 'link' }
        ],
        inactiveComponent: (
          <CustomerHandover
            onConfirm={() => {
              updateOrder('Customer Handover', {});
            }}
          />
        )
      }
    },
    "Stock Order": {
      "Order Standby": {
        "icon": "standby",
        "fields": [
          { label: "Order Date", value: "orderDate", type: "date" },
          { label: "Sales Manager", value: "salesManager" },
        ],
        inactiveComponent: (
          <OrderStandby
            onConfirm={() => updateOrder('Order Standby')}
          />
        )
      },
      "Ordered Stock": {
        "icon": "ordered_stock",
        "fields": [
          { label: "Contract No", value: "fullnameen" },
          { label: "InventoryLocation", value: "inventoryLocation" }
        ],
        inactiveComponent: <OrderedStock onConfirm={(e) => updateOrder('Ordered Stock', { orderNumber: e })} contractNo={contractnumber ?? ''} inventoryLocation={locations?.find(loc => loc.uid === locationuid)?.name ?? ''} />
      },
      "Sales Order by HQ": {
        "icon": "sales_order",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Wholesale Order No.", value: "wholesaleOrderNumber" },
          { label: "Wholesale Invoice", value: "wholesaleInvoice", type: 'link' }
        ],
        inactiveComponent: (
          <SalesByHq
            onConfirm={() => {
            }}
            updateOrder={updateOrder}
            vehicle={vehicle}
          />
        )
      },
      "PTS by HQ": {
        "icon": "user-multiple-02",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "VIN", value: "vinnumber" }
        ],
        inactiveComponent: (
          <PtsByHq
            onConfirm={(vin) => {
              updateVehicle(vehicleuid, { vinNumber: vin });
            }}
          />
        )
      },
      "In Transit by HQ": {
        "icon": "in_transit",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Transit Type", value: "orderInventory.transitType" },
          { label: "Vessel Name", value: "orderInventory.vesselName" },
          { label: "Vessel Tracking Number", value: "orderInventory.vesselTrackingNumber" },
        ],
        inactiveComponent: (
          <InTransitByHq
            onConfirm={(transitType, vesselName, vesselTrackingNumber, vesselUrl) => {
              updateOrder(
                'In Transit by HQ',
                {
                  orderInventory: [
                    {
                      ...order?.orderInventory?.[0],
                      transitType,
                      vesselName,
                      vesselTrackingNumber,
                      vesselUrl,
                    }
                  ]
                });
            }}
          />
        )
      },
      "Port Arrival": {
        "icon": "arrival",
        "fields": [
          { label: "Customer Name", value: "fullnameen" }
        ],
        inactiveComponent: (
          <PortArrival 
            onConfirm={() => {
              updateOrder('Port Arrival', {});
            }}
          />
        )
      },
      "Storage in PDC before Custom": {
        "icon": "pdc_before",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Est Clearance Date", value: "estClearanceDate", type: "date" },
          { label: "BL Landing Document", value: "blLandingDocument", type: 'link' }
        ],
        inactiveComponent: (
          <StorageBeforeCustom
            onConfirm={() => {
              updateOrder('Storage in PDC before Custom', {});
            }}
          />
        )
      },
      "Storage in PDC after Custom": {
        "icon": "pdc_after",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "Act Clearance Date", value: "actClearanceDate", type: "date" },
          { label: "Customs Clearance Cost", value: "customsClearanceCost", type: 'number' },
          { label: "Transportation Cost", value: "transportationCost", type: 'number' }
        ],
        inactiveComponent: (
          <StorageAfterCustom
            onConfirm={(customClearanceDate, customClearancePrice, customTransportPrice) => {
              updateOrder(
                'Storage in PDC after Custom',
                {
                  customClearanceDate: customClearanceDate?.toString(),
                  customClearancePrice: parseFloat(customClearancePrice as string),
                  customTransportPrice: parseFloat(customTransportPrice as string)
                }
              );
            }}
          />
        )
      },
      "Under PDI": {
        "icon": "check-list",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
          { label: "PDI Images", value: "pdiImages", type: "images" }
        ],
        inactiveComponent: (
          <UnderPDI
            onConfirm={() => {
              updateOrder('Under PDI', {});
            }}
          />
        )
      },
      "Stock Inventory": {
        "icon": "garage",
        "fields": [
          { label: "Customer Name", value: "fullnameen" },
        ],
        inactiveComponent: <StockInventory />
      }
    }
  };

  if(isLoadingOrder)
    return;
  
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
        <div className="fixed inset-0 flex items-center justify-center p-2 lg:scale-90 xl:scale-90 2xl:scale-100">
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
                {imageGalleryRef}
                <div className="flex">
                  <div
                    className="flex flex-col w-[1260px] h-[40.625rem] border bg-[#E7E9E2] items-start text-center gap-y-2 p-8 relative"
                  >
                    <div className="flex gap-x-2 items-center">
                      <span className="text-base text-neutrals-medium font-medium">VEHICLE AND ORDER TRACKER</span>
                      <div className="flex flex-col gap-y-4">
                        <div className={clsx(
                          "flex gap-x-1 w-fit items-center px-1.5 py-[2px] border-[1px] rounded-full bg-brand-secondary_ext_2 border-brand-secondary",
                        )}>
                          <span className={clsx(
                            "rounded-full size-2 border-[1px] text-neutrals-high bg-brand-secondary",
                          )}/>
                          <span className="caption_small_semibold">{type}</span>
                        </div>
                      </div>
                    </div>

                    <span 
                      className="text-neutrals-high font-medium text-[40px] leading-[56px] pt-8"
                    >
                      {model}
                    </span>
                    
                    <div className="flex flex-col gap-y-2 items-start justify-start">
                      <div className="flex gap-x-12 justify-between w-full">
                        <span className="text-sm text-neutrals-high font-medium">Opportunity No</span>
                        <span className="text-sm font-normal text-neutrals-high">{opportunitynumber ?? 'No data'}</span>
                      </div>
                      <div className="flex gap-x-12 justify-between w-full">
                        <span className="text-sm text-neutrals-high font-medium">Order No</span>
                        <span className="text-sm font-normal text-neutrals-high">{ordernumber ?? 'No data'}</span>
                      </div>
                      <div className="flex gap-x-12 justify-between w-full">
                        <span className="text-sm text-neutrals-high font-medium">Vehicle Status</span>
                        <span className="text-sm font-normal text-neutrals-high">{vehiclestatus}</span>
                      </div>
                      <div className="flex gap-x-12 justify-between w-full">
                        <span className="text-sm text-neutrals-high font-medium">Exterior Color</span>
                        <span className="text-sm font-normal text-neutrals-high">{vehicle?.extColor?.color ?? 'No data'}</span>
                      </div>
                      <div className="flex gap-x-12 justify-between w-full">
                        <span className="text-sm text-neutrals-high font-medium">VIN</span>
                        <span className="text-sm font-normal text-neutrals-high">{vehicle?.vinNumber ?? 'No data'}</span>
                      </div>
                      <div className="flex gap-x-12 justify-between w-full">
                        <span className="text-sm text-neutrals-high font-medium">Last Updated</span>
                        <span className="text-sm font-normal text-neutrals-high">{formatDate(orderTrackers?.[orderTrackers?.length - 1]?.updatedDate, 'E, dd MMM yyyy hh:mm a')}</span>
                      </div>
                    </div>

                    <Image src={order?.heroImage ?? ''} alt="logo" width={567} height={324} className="absolute top-10 right-10" layout="auto" />
                    
                    <div className="absolute bottom-10 w-[calc(100%-4rem)] border-b-4 border-b-neutrals-background-shading">
                      <Carousel
                        height='fit-content'
                        slideSize='25%'
                        align="start"
                        slideGap='xl'
                        slidesToScroll={1}
                        controlsOffset={0}
                        className="mt-auto w-full absolute top-0 "
                        classNames={classes}
                        draggable={false}
                        nextControlIcon={
                          <ActionIcon className="bg-neutrals-high rounded-full w-[52px] h-[52px] hover:bg-neutrals-high">
                            <Image src="/icons/chevron-right.svg" alt="chevron" width={40} height={40} />
                          </ActionIcon>
                        }
                        previousControlIcon={
                          <ActionIcon className="bg-neutrals-high rounded-full w-[52px] h-[52px] hover:bg-neutrals-high">
                            <Image src="/icons/chevron-left.svg" alt="chevron" width={40} height={40} />
                          </ActionIcon>
                        }
                        containScroll="trimSnaps"
                      >
                        {Object.entries(fields[type] ?? {}).map((o,idx) => {
                          const orderTracker = orderTrackers?.find(orderT => orderT.vehicleStatus === o?.[0]);
                          const { createdDate } = orderTracker ?? {};
                          const status = o[0];
                          const statusData = o[1];

                          // Status is finished if the status' index is less than the current status' index
                          const statusIndex = Object.keys(fields[type]).indexOf(status);
                          const vehicleStatusIndex = vehiclestatus.includes('Showroom') ? Object.keys(fields[type]).indexOf(vehiclestatus.split(' ')[0]) : Object.keys(fields[type]).indexOf(vehiclestatus);
                          const isFinished = vehicleStatusIndex >= statusIndex;
                          const isActive = vehiclestatus === status.toString();
                          const isNext = vehicleStatusIndex + 1 === statusIndex;

                          return (
                            <Carousel.Slide className="self-end" key={status.toString()}>
                              <div className="flex flex-row items-center gap-x-3 w-full" key={status.toString()}>
                                {openedStatus !== status.toString() && (
                                  <div className={clsx(
                                    "bg-white flex flex-col items-center justify-center w-[52px] h-[44px]",
                                    isActive && "!bg-brand-secondary"  
                                  )}
                                  >
                                    <Image src={`/icons/${statusData.icon}.svg`} alt="car" width={24} height={24} />
                                  </div>
                                )}

                                <div className="flex flex-row justify-between w-full">
                                  <div className="flex flex-col items-start">
                                    {<span className="font-medium text-[12px] leading-[18px] tracking-[0.02em] text-neutrals-high">{formatDate(createdDate, 'E, dd MMM yyyy-hh:mm a').split('-')[0]}</span>}
                                    {<span className="text-neutrals-medium text-sm font-normal">{formatDate(createdDate, 'E, dd MMM yyyy-hh:mm a').split('-')[1]}</span>}
                                  </div>
                                  {openedStatus !== status.toString() && <VehicleStatusMenu vehicleStatusMenuItems={[]} />}
                                </div>
                              </div>

                              <div className={clsx(
                                "flex flex-col items-start gap-y-4 relative w-full min-w-[320px]",
                                isActive && "text-white border-b-4 border-b-brand-secondary bg-neutrals-high",
                                !isActive && "bg-white",
                                openedStatus !== status.toString() && "p-4",
                              )}>

                                <div className={clsx(
                                  openedStatus === status.toString() && "flex items-center gap-x-4 body_small_semibold bg-neutrals-background-surface p-3 w-full",
                                )}>
                                  {openedStatus === status.toString() && <Image src={`/icons/${statusData.icon}.svg`} alt="car" width={24} height={24} />}
                                  
                                  <span 
                                    className={clsx(
                                      "text-lg font-medium",
                                      openedStatus === status.toString() && "body_small_semibold",
                                      isActive && "!text-white"
                                    )}
                                  >
                                    {status.toString()}
                                  </span>

                                  {openedStatus === status.toString() && (
                                    <ActionIcon variant="transparent" className="!cursor-pointer ml-auto z-50" onClick={() => setOpenedStatus(null)}>
                                      <Image src="/icons/cancel-01.svg" alt="close" width={24} height={24} className="!cursor-pointer" />
                                    </ActionIcon>
                                  )}

                                </div>

                                {openedStatus !== status.toString() &&
                                  <div className="absolute top-0 right-0">
                                    <Image src="/images/pattern.svg" width={180} height={80} alt="pattern" />
                                  </div>
                                }

                                {/*Field label and values */}
                                {/* To be shown only if finished */}
                                {isFinished && (
                                  <div className="flex flex-col items-start w-full">
                                    {statusData.fields.map(field => {
                                      const isDotNotation = field.value.includes('.');
                                      const fieldName = isDotNotation ? field.value.split('.')?.[0] : field.value;
                                      const fieldValue = isDotNotation ? field.value.split('.')?.[1] : field.value;
                                      const isOrderInventory = fieldName === 'orderInventory';

                                      const val = isOrderInventory ? (
                                          order?.orderInventory?.[0]?.[fieldValue as keyof OrderInventory]
                                        ) 
                                        : (
                                          orderData?.[field.value as keyof IOrder] ?? selectedOrder?.[field.value as keyof IOrderView]
                                        )

                                      return (
                                        <div className="flex justify-between w-full" key={field.value}>
                                          <div className="body_xs_regular">{field.label}:</div>
                                          <div className={clsx(
                                              "text-neutrals-medium body_xs_regular",
                                              isActive && "!text-neutrals-low"
                                            )}>
                                              {field.type === 'number' && (
                                                <p>{formatNumberWithCommas(val as number)}</p>
                                              )}
                                              {field.type === 'date' && val && (
                                                formatDate(val?.toString(), 'E, dd MMM yyyy')
                                              )}
                                              {(field.type === 'text' || !field.type) && (
                                                <span>{val?.toString()}</span>
                                              )}
                                              {field.type === 'images' && (
                                                <div className={clsx(
                                                  "flex border-b-[1px] cursor-pointer",
                                                  !isActive && "border-b-brand-primary",
                                                  isActive && "border-b-white"
                                                )}>
                                                  <p className={clsx(
                                                    "body_xs_regular",
                                                    isActive && "text-white border-b-white",
                                                    !isActive && "text-brand-primary"
                                                  )}
                                                    onClick={() => {
                                                      openGallery();
                                                    }}
                                                  >
                                                    View Images
                                                  </p>
                                                  <ArrowIcon
                                                    className={clsx(
                                                      "body_xs_regular",
                                                      isActive && "text-white border-b-white",
                                                      !isActive && "text-brand-primary"
                                                    )}
                                                  />
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {isNext && openedStatus !== status && (
                                  <div className="flex items-center w-full">
                                    <Button
                                      className="bg-brand-primary text-white py-[14px] px-[22px] w-full h-auto rounded-none hover:bg-brand-primary disabled:bg-gray-200"
                                      variant="unstyled"
                                      leftSection={<Image src="/icons/car-update-secondary.svg" alt="chevron" width={16} height={16} />}
                                      onClick={() => {
                                        setOpenedStatus(status.toString());
                                      }}
                                      disabled={false}
                                    >
                                      <p className="caption_semibold">Update Status</p>
                                    </Button>
                                  </div>
                                )}

                                {openedStatus === status.toString() && 
                                  statusData?.inactiveComponent
                                }
                              </div>
                            </Carousel.Slide>
                          );
                        })}
                      </Carousel>
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

export default VehicleStatus;


export const useVehicleStatus = (props: any) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <VehicleStatus isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}