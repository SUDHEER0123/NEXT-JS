import { ActionIcon, Button, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import { ActionMenu, IActionMenuItem } from "../../../components/ActionMenu/action-menu";
import { useUploadInvoice } from "./upload-invoice";
import { useOrderOverview } from "./order-overview";
import { useVehicleStatus } from "./vehicle-status";
import { useCancelOrder } from "./cancel-order";
import { IContact, IContract, IOrder, IOrderView, IVehicle } from "@/app/types";
import clsx from "clsx";
import { useProcessRefund } from "./process-refund";
import { formatDate } from "@/utils/dateFormatter";
import { useOptionAndConfigPDFView } from "@/app/vehicle-management/components/option-and-config-pdf-view";
import { useManagePayment } from "./manage-payments";
import { CarSearchIcon } from "@/assets/icons";
import { useFinancialOverview } from "./financial-overview";
import { useEffect, useState } from "react";
import { SalesAvatar } from "@/components/SalesAvatar";
import { formatNumberWithCommas } from "@/utils/common";
import { useManageContracts } from "./manage-contracts";
import { useOrdersStore } from "../store/orders.store";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAppDataStore } from "@/app/app.store";
interface IOrderDetails {
  orderData: IOrderView;
  expanded?: boolean;
  type: string;
  hideRefund?: boolean;
  hideFooter?: boolean;
}

const actionMenuItems: IActionMenuItem[] = [
  {
    icon: 'pencil-edit-01',
    icon_alt: 'pencil-edit-02',
    title: 'View Order',
    modal: 'viewOrder'
  },
  {
    icon: 'money-03',
    icon_alt: 'money-03-primary',
    title: 'View Financials',
    hidden: ['Stock Order'],
    orderStatusHidden: ['Order Placed','Order Cancelled']
  },
  {
    icon: 'money-add-02',
    icon_alt: 'money-add-03',
    title: 'Manage Payments',
    modal: 'managePayments',
    hidden: ['Stock Order'],
    orderStatusHidden: ['Order Cancelled','Order Delivered to Customer']
  },
  {
    icon: 'contracts',
    icon_alt: 'contracts-02',
    title: 'Manage Contracts',
    hidden: ['Stock Order'],
    orderStatusHidden: ['Order Cancelled','Order Delivered to Customer']
  },
  {
    icon: 'invoice-03',
    icon_alt: 'invoice-04',
    title: 'Manage Customer Invoice',
    hidden: ['Stock Order'],
    orderStatusHidden: ['Order Cancelled','Order Delivered to Customer']
  },
  {
    icon: 'car-update',
    icon_alt: 'car-update-02',
    title: 'Update Order Tracker',
    orderStatusHidden: ['Order Cancelled', 'Order Delivered to Customer']
  },
  {
    icon: 'file-remove',
    icon_alt: 'file-remove',
    title: 'Cancel Order',
    style: {
      color: '#D60100'
    },
    orderStatusHidden: ['Order Cancelled','Order Delivered to Customer'],
  }
];

export const OrderDetails: React.FC<IOrderDetails> = ({ orderData, expanded, hideRefund, hideFooter }) => {
  const {
    type,
    heroimageicon,
    fullnameen,
    opportunitynumber,
    ordernumber,
    inventoryfinanced,
    contractnumber,
    vinnumber,
    locationname,
    configuratordocumentuid,
    licenseplate,
    contractvalue,
    vehiclestatus,
    orderstatus,
    placeddate,
    userfirstname,
    userlastname,
    useravatar,
    userjobtitle,
    contactuid,
    orderuid,
    vehicleuid,
    contractuid,
    estimateddeliverydate,
    modeltypeuid,
    model
  } = orderData;

  const { setSelectedOrder } = useOrdersStore();
  const [selectedOption, setSelectedOption] = useState<string>();
  const { modelTypes } = useAppDataStore();

  const { data: vehicle, isLoading: isLoadingVehicle, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicle', vehicleuid],
    queryFn: () => api.get(`/vehicle/detail/${vehicleuid}`).then(res => res.data as IVehicle),
    enabled: !!vehicleuid,
  });

  const { data: contract, isLoading: isLoadingContract, error: errorGettingContract, refetch: refetchContract } = useQuery({
    queryKey: ['contract', contractuid],
    queryFn: () => api.get(`/contract/${contractuid}`).then(res => res.data as IContract),
    enabled: !!contractuid,
  });

  const { data: contact, isLoading: isLoadingContact, error: errorGettingContact } = useQuery({
    queryKey: ['contact', contactuid],
    queryFn: () => api.get(`/contact/${contactuid}`).then(res => res.data as IContact),
    enabled: !!contactuid, 
  });

  const { data: uidOrderData, isLoading: isLoadingData, error: errorGettingData } = useQuery({
    queryKey: ['orderUid', orderuid],
    queryFn: () => api.get(`/order/${orderuid}`).then(res => res.data as IOrder),
    enabled: !!orderuid, 
  });

  const { open: openFinancialsOverview, modalRef: financialsOverviewRef } = useFinancialOverview({ order: uidOrderData, contract:contract, vehicle:vehicle });
  const { open: openManagePayments, drawerRef: managePaymentsRef } = useManagePayment({ order: orderData, contract, onPaymentUpdate: () => { refetchContract() } });
  const { open: openUploadContract, drawerRef: uploadContractRef } = useManageContracts({ contract, orderView : orderData, onClose: () => { refetchContract() } });
  const { open: openUploadInvoice, drawerRef: uploadInvoiceRef } = useUploadInvoice();
  const { open: openVehicleStatus, modalRef: updateVehicleStatusRef } = useVehicleStatus({ order: orderData });
  const { open: openCancelOrder, modalRef: cancelOrderRef } = useCancelOrder({
    order: orderData
  });
  const { open: openProcessRefund, drawerRef: processRefundRef } = useProcessRefund({order: orderData });
  const { open: openOptionAndConfigPDF, close: closeOptionAndConfigPDF, modalRef: optionAndConfigPDFModalRef } = useOptionAndConfigPDFView({ pdfUrl: configuratordocumentuid ?? '' });

  const refundStatus = "Refund Processed";

  const { open: openViewOrder, modalRef: viewOrderRef } = useOrderOverview({ orderView: orderData, contact, contract, vehicle, isLoadingContact, isLoadingContract, isLoadingVehicle });

  useEffect(() => {
    if(!orderData || !selectedOption) return;

    if(selectedOption === 'View Order') {
      openViewOrder();
    } else if(selectedOption === 'View Financials') {
      openFinancialsOverview();
    } else if (selectedOption === 'Manage Payments') {
      openManagePayments();
    } else if (selectedOption === 'Manage Contracts') {
      openUploadContract();
    } else if (selectedOption === 'Manage Customer Invoice') {
      openUploadInvoice();
    } else if (selectedOption === 'Update Order Tracker') {
      openVehicleStatus();
    } else if (selectedOption === 'Cancel Order') {
      openCancelOrder();
    }

    if(selectedOption) 
      setSelectedOption(undefined);
  },[selectedOption, orderData]);

  return (
    <div className="flex flex-col border border-neutrals-low space-y-2 shadow-order-card h-fit relative bg-neutrals-background-surface">
      {/*Header*/}
      {viewOrderRef}
      {financialsOverviewRef}
      {uploadContractRef}
      {uploadInvoiceRef}
      {updateVehicleStatusRef}
      {cancelOrderRef}
      {processRefundRef}
      {optionAndConfigPDFModalRef}
      {!isLoadingContract &&  managePaymentsRef}
      <div className="relative">
        {heroimageicon && (
          <div className="p-4 bg-neutrals-background-default border-x-[1px] border-x-neutrals-low shadow-order-card relative bg-neutrals-background-shading relative h-fit">
            <Image src="/images/garage-pattern.svg" alt="garage" width={230} height={74} className="absolute right-0" />
            <Image
              src={heroimageicon}
              alt="car"
              width={100}
              height={66}
            />
            {type !== "Stock Order" && (
              <div className="absolute top-3 right-3 z-10">
                <SalesAvatar firstName={userfirstname ?? 'No data'} lastName={userlastname ?? 'No data'} avatar={useravatar ?? "No data"} jobTitle={userjobtitle ?? "No data"} />
              </div>
            )}
          </div>
        )}
        {(orderstatus === "Order Cancelled" || orderstatus === "Order Delivered to Customer") && (
          <div
            className={
              clsx(
                "absolute inset-0 flex bg-opacity-10 items-center justify-center text-white text-lg !z-[1] border-b-[2px]",
                orderstatus === "Order Cancelled" && "bg-indications-red border-b-indications-red",
                orderstatus === "Order Delivered to Customer" && "bg-brand-primary border-b-brand-primary"
              )
            }
          />
        )}
      </div>
      <div className="flex flex-col space-y-2">
        {/*Body*/}
        <div className="bg-neutrals-background-surface px-2">
          {["Order Cancelled","Order Delivered to Customer"].includes(orderstatus) && (
            <div className="flex flex-col gap-y-4 pb-2">
              <div className={clsx(
                "flex gap-x-1 w-fit items-center px-1.5 py-[2px] border-[0.5px] rounded-full",
                orderstatus === "Order Cancelled" && "!bg-indications-bg_error_soft border-indications-red",
                orderstatus === "Order Delivered to Customer" && "bg-indications-bg_success_soft border-brand-primary",
              )}>
                <span className={clsx(
                  "rounded-full size-2 border-[1px] text-neutrals-high",
                  orderstatus === "Order Cancelled" && "bg-indications-red",
                  orderstatus === "Order Delivered to Customer" && "bg-brand-primary",
                )}/>
                <span className="caption_small_semibold">{orderstatus}</span>
              </div>
            </div>
          )}
          <p className="text-base font-medium">{model}</p>
          <div className="pt-6">
            <div className="flex justify-between gap-x-2 w-full">
              {/*Left Section*/}
              <div className="flex gap-x-4 text-xxs w-full">
                <div className="flex flex-col w-full">

                  {type !== 'Stock Order' && (
                    <div className="flex w-full gap-x-1">
                      <span className="text-gray-custom font-normal text-neutrals-high">Customer Name:</span>
                      {contactuid && fullnameen && (
                        <div className="flex gap-x-1 cursor-pointer" onClick={() => window.open(`/contact-life-cycle/overview/contact-details/${contactuid}`, '_blank')}>
                          <span className="text-neutrals-medium">{`${fullnameen}`}</span>
                          <Image src="/icons/arrow.svg" width={12} height={12} alt="arrow" className="cursor-pointer" />
                        </div>
                      )}
                    </div>
                  )}

                  {type !== 'Stock Order' && (
                    <div className="flex w-full gap-x-1">
                      <span className="text-gray-custom font-normal text-neutrals-high">Opportunity No:</span>
                      <span className="text-neutrals-medium">{opportunitynumber}</span>
                    </div>
                  )}

                  <div className="flex w-full gap-x-1">
                    <span className="text-gray-custom font-normal text-neutrals-high">Order No:</span>
                    {ordernumber ? (
                      <span className="text-neutrals-medium">{ordernumber}</span>
                    ) : (
                      <div className="flex gap-x-1">
                        <span className="text-neutrals-medium">Not assigned</span>
                        <div className="bg-neutrals-low rounded-full p-[2px] w-fit h-fit cursor-pointer"> 
                          <Image src="/icons/pencil-edit-01.svg" width={10} height={10} alt="edit" />
                        </div>
                      </div>
                    )}
                  </div>

                  {type === 'Stock Order' && (
                    <div className="flex w-full gap-x-1">
                      <span className="text-gray-custom font-normal text-neutrals-high">Inventory Financed:</span>
                      <span className="text-neutrals-medium">{inventoryfinanced ? 'Yes':'No'}</span>
                    </div>
                  )}

                </div>
              </div>
              {/*Right Section*/}
              <div className="flex flex-col w-full border border-neutrals-low bg-gradient-7 p-2 text-xxs h-fit">
                <div className="flex w-full">
                  <span className="font-normal bg-gradient-6 bg-clip-text text-transparent w-full">Order Date:</span>
                  <span className="caption_small_regular text-neutrals-high truncate w-full text-end">{formatDate(placeddate, 'E, d MMM yyyy')}</span>
                </div>
                {orderstatus !== "Order Delivered to Customer" && orderstatus !== "Order Cancelled" && (
                  <>
                    <div className="flex w-full">
                      <span className="font-normal bg-gradient-6 bg-clip-text text-transparent w-full">Order Status:</span>
                      <span className="caption_small_regular text-neutrals-high truncate w-full text-end">{orderstatus}</span>
                    </div>
                    <div className="flex w-full">
                      <span className="font-normal bg-gradient-6 bg-clip-text text-transparent w-full">Vehicle Status:</span>
                      <span className="caption_small_regular text-neutrals-high truncate w-full text-end">{vehiclestatus}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {!hideRefund && orderstatus === "Order Cancelled" && (
          <div className={clsx(
            "flex gap-x-2 justify-center items-center mx-2 border-[0.5px] border-neutrals-low py-1 px-[22px]",
            refundStatus === 'Refund Processed' && 'bg-neutrals-background-shading !py-2',
            refundStatus !== 'Refund Processed' && 'bg-neutrals-background-default'
          )}>
            {refundStatus !== "Refund Processed" ? (
              <Button
                variant="transparent"
                className="text-neutrals-high hover:text-neutrals-high bg-neutrals-background-default"
                leftSection={
                  <Image src="/icons/money-exchange-02.svg" width={16} height={16} alt="money-exchange" />
                }
                onClick={() => openProcessRefund()}
              >
                <p className="caption_bold">
                  Process Refund
                </p>
              </Button>
            ) : (
              <div className="flex gap-x-2 items-center">
                <Image src="/icons/money-exchange-02.svg" width={16} height={16} alt="money-exchange" />
                <p className="caption_bold">
                  Refund Processed
                </p>
              </div>
            )}
          </div>
        )}

        {/*Expanded Section*/}
        <div className={`flex flex-col ${expanded ? 'bg-neutrals-background-default':'bg-white'} px-2`}>
          {expanded && orderstatus !== "Order Delivered to Customer" && (
            <div className={clsx(
              "flex flex-row gap-x-12 border-[0.5px] border-neutrals-low shadow-subtle-shadow2 p-2",
              orderstatus === "Order Cancelled" && "bg-neutrals-background-shading"
            )}>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-xxs text-neutrals-medium">Contract No:</p>
                  <p className="text-caption-semi-bold font-caption-semi-bold tracking-caption-semi-bold">{contractnumber ?? 'No data'}</p>
                </div>
                <div>
                  <p className="text-xxs text-neutrals-medium">VIN:</p>
                  <p className="text-caption-semi-bold font-caption-semi-bold tracking-caption-semi-bold">{vinnumber ?? 'No data'}</p>
                </div>
                {type !== 'Stock Purchase' && (
                  <div>
                    <p className="text-xxs text-neutrals-medium">Est. Arrival Date:</p>
                    {<p className="text-caption-semi-bold font-caption-semi-bold tracking-caption-semi-bold">{estimateddeliverydate ? formatDate(estimateddeliverydate ?? '', 'E, dd MMM yyyy') : 'No data'}</p>}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-xxs text-neutrals-medium">Contract Value:</p>
                  <p className="text-caption-semi-bold font-caption-semi-bold tracking-caption-semi-bold">
                    {contractvalue ? formatNumberWithCommas(contractvalue) : 'No data'}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-neutrals-medium">License Plate:</p>
                  <p className="text-caption-semi-bold font-caption-semi-bold tracking-caption-semi-bold">{licenseplate ?? 'No data'}</p>
                </div>
              </div>
            </div>
          )}
          
          {expanded && (
            <div className="flex flex-row gap-x-2 py-2">
              {actionMenuItems.filter(a => !(a.hidden ?? []).find((d) => d === type)).filter(a => {
                return !a.orderStatusHidden?.includes(orderstatus) || a.orderStatusDisplayed?.includes(orderstatus)
              }).map(actionMenuItem => {
                return (
                  <Tooltip arrowSize={10} arrowPosition="center" label={actionMenuItem.title} key={actionMenuItem.title} withArrow className="px-3 py-2 rounded-none" classNames={{ tooltip: 'caption_xs_regular text-neutrals-background-default'}}>
                    <div className="flex items-center rounded-full border border-neutrals-low bg-neutrals-background-default w-[44px] h-[44px] p-2">
                      <ActionIcon
                        variant="transparent"
                        onClick={() => {
                          const option = actionMenuItem.title;

                          if(option === 'View Order') {
                            openViewOrder();
                          } else if(option === 'View Financials') {
                            openFinancialsOverview();
                          } else if (option === 'Manage Payments') {
                            openManagePayments();
                          } else if (option === 'Manage Contracts') {
                            openUploadContract();
                          } else if (option === 'Manage Customer Invoice') {
                            openUploadInvoice();
                          } else if (option === 'Update Order Tracker') {
                            openVehicleStatus();
                          } else if (option === 'Cancel Order') {
                            openCancelOrder();
                          }
                        }}
                      >
                        <Image src={`/icons/${actionMenuItem.icon_alt}.svg`} alt={actionMenuItem.title} width={20} height={20} />
                      </ActionIcon>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {/*Footer*/}
          {!hideFooter && (
            <div className={`flex justify-between border-t border-t-neutrals-low w-full`}>
              {location && type !== "Stock Order" && (
                <div className="flex flex-row items-center space-x-2 py-2 w-full">
                  <Image src="/icons/location-03.svg" alt="location" width={12} height={12} />
                  <Text className="text-neutrals-high text-xxs">{locationname}</Text>
                </div>
              )}
              <div className="flex gap-x-2 justify-between w-full">
                {type !== 'Stock Order' && (
                  <div className={clsx(
                    "flex flex-row items-center gap-x-2",
                    type === "Stock Order" && orderstatus === 'Order Delivered to Customer' && 'mr-auto',
                    type !== 'Stock Order' && 'ml-auto'
                  )}>
                    {configuratordocumentuid && (
                      <Button
                      leftSection={<Image src="/icons/summary.svg" alt="expand" width={12} height={12} />}
                      variant="transparent"
                      className="rounded-full border bg-gradient-8 py-1 px-2 shadow-subtle-shadow h-auto"
                      classNames={{
                        section: 'me-1'
                      }}
                      style={{
                        borderImageSource: 'linear-gradient(90.46deg, rgba(0, 102, 94, 0.1) 0.4%, rgba(240, 255, 15, 0.1) 99.6%)'
                      }}
                      onClick={() => {
                        openOptionAndConfigPDF();
                      }}
                    >
                      <p className="text-xxs bg-gradient-6 bg-clip-text text-transparent font-normal shadow-subtle-shadow">View Configuration</p>
                      </Button>
                    )}
                    {!expanded && (
                      <div className="mr-auto mt-1">
                        <ActionMenu
                          newIcon
                          actionMenuItems={actionMenuItems.filter(a => !(a.hidden ?? []).find((d) => d === type)).filter(a => !a.orderStatusHidden?.includes(orderstatus))}
                          onOptionSubmit={(option) => {
                            setSelectedOrder(orderData);
                            setSelectedOption(option);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {type === "Stock Order" && orderstatus !== 'Order Delivered to Customer' && !configuratordocumentuid && (
                  <div className="flex items-center justify-between w-full">
                    <Button
                      leftSection={<CarSearchIcon width={12} height={12} className="text-brand-primary" />}
                      variant="transparent"
                      className={clsx(
                        "rounded-full border-[1px] bg-neutrals-background-default py-1 px-2 h-fit border-neutrals-background-shading self-center"
                      )}
                      classNames={{
                        section: 'me-1'
                      }}
                      onClick={() => {
                        openOptionAndConfigPDF();
                      }}
                    >
                      <p className="text-neutrals-high caption_small_regular">Explore Stock Vehicle</p>
                    </Button>
                    {!expanded && (
                      <div className="mt-1">
                        <ActionMenu
                          newIcon
                          actionMenuItems={actionMenuItems.filter(a => !(a.hidden ?? []).find((d) => d === type)).filter(a => !a.orderStatusHidden?.includes(orderstatus))}
                          onOptionSubmit={(option) => {
                            setSelectedOrder(orderData);
                            setSelectedOption(option);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {type === "Stock Order" && orderstatus !== 'Order Delivered to Customer' && configuratordocumentuid && (
                  <div className="flex items-center justify-between w-full py-2">
                    <div className={clsx(
                      "flex flex-row items-center gap-x-2 w-full",
                      type === "Stock Order" && orderstatus === 'Order Delivered to Customer' && 'mr-auto',
                      type !== 'Stock Order' && 'ml-auto'
                    )}>
                      <Button
                        leftSection={<Image src="/icons/summary.svg" alt="expand" width={12} height={12} />}
                        variant="transparent"
                        className="rounded-full border bg-gradient-8 py-1 px-2 shadow-subtle-shadow h-auto"
                        classNames={{
                          section: 'me-1'
                        }}
                        style={{
                          borderImageSource: 'linear-gradient(90.46deg, rgba(0, 102, 94, 0.1) 0.4%, rgba(240, 255, 15, 0.1) 99.6%)'
                        }}
                        onClick={() => {
                          openOptionAndConfigPDF();
                        }}
                      >
                        <p className="text-xxs bg-gradient-6 bg-clip-text text-transparent font-normal shadow-subtle-shadow">View Configuration</p>
                      </Button>
                    </div>
                    
                    <div className="flex w-full my-0.5 gap-x-1">
                      <Button
                        leftSection={<CarSearchIcon width={12} height={12} className="text-brand-primary" />}
                        variant="transparent"
                        className={clsx(
                          "rounded-full border-[1px] bg-neutrals-background-default py-1 px-2 h-fit border-neutrals-background-shading ml-auto self-center"
                        )}
                        classNames={{
                          section: 'me-1'
                        }}
                        onClick={() => {
                          openOptionAndConfigPDF();
                        }}
                      >
                        <p className="text-neutrals-high caption_small_regular">Explore Stock Vehicle</p>
                      </Button>
                      {!expanded && (
                        <ActionMenu
                          newIcon
                          actionMenuItems={actionMenuItems.filter(a => !(a.hidden ?? []).find((d) => d === type)).filter(a => !a.orderStatusHidden?.includes(orderstatus))}
                          onOptionSubmit={(option) => {
                            setSelectedOrder(orderData);
                            setSelectedOption(option);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};