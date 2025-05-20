'use client';

import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, ScrollArea, } from "@mantine/core";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { Slideover } from "@/components/Slideover/Slideover";
import { Contract, IContract, IVehicle, Payment } from "@/app/types";
import { formatNumberWithCommas } from "@/utils/common";
import { useMemo, useState } from "react";
import { Select } from "@/components/ui/Select/Select";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { DateValue } from "@mantine/dates";
import { formatDate } from "@/utils/dateFormatter";
import clsx from "clsx";
import { useContractsStore } from "../store/contracts.store";
import { useAppDataStore } from "@/app/app.store";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { usePDFView } from "@/components/PdfViewer/PdfViewer";

interface UseManagePaymentProps {
  contract?: IContract | null;
}

interface IManagePayments extends UseManagePaymentProps {
  opened: boolean;
  onClose: () => void;
}

export const ManagePayment: React.FC<IManagePayments> = ({ opened, onClose, contract }) => {
  const {
    contactUid,
    contractNumber: contractNo,
    value: contractValue,
    balance: openBalance,
    consultantUserUid: salesConsultant
  } = contract ?? {};
  const { payments, setPayments } = useContractsStore();
  const [isAddingNewPayment, setIsAddingNewPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<string>();
  const [paymentAmount, setPaymentAmount] = useState<number>();
  const [paymentDate, setPaymentDate] = useState<DateValue>();
  const [paymentFiles, setPaymentFiles] = useState<File[]>();
  const [selectedPayment, setSelectedPayment] = useState<Payment>();
  const { open: openContractPDF, close: closeContractPDF, modalRef: contractPdfModalRef } = usePDFView({ pdfUrl: '' });
  const { modelTypes } = useAppDataStore();

  const { data: vehicles, isLoading: isLoadingVehicles, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicle').then(res => res.data as IVehicle[])
  });

  const modelLine = useMemo(() => {
    const modelTypeUid = (vehicles ?? []).find(vehicle => vehicle?.contactUid === contactUid)?.modelTypeUid;
    
    const modelType = modelTypes?.find(model => model?.uid === modelTypeUid);
    const modelLine = modelType?.line;

    return modelLine;
  },[modelTypes, vehicles, contactUid, isLoadingVehicles]);

  return (
    <Slideover
      title="Manage Payments"
      open={opened}
      onClose={onClose}
      footer={
        <div className="flex w-full overflow-y-hidden">
          <Button className="w-[250px] h-auto !bg-neutrals-high rounded-none font-medium" onClick={onClose}>
            <p className="text-neutrals-background-default text-base">
              Cancel
            </p>
          </Button>
          <Button
            className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
            onClick={() => {
              setIsAddingNewPayment(false);
              setPayments([
                ...(payments ?? []), 
                {
                  id: Math.random().toString(),
                  date: new Date(paymentDate ?? '').toISOString(),
                  amount: paymentAmount ?? 0,
                  type: paymentType ?? '',
                  files: paymentFiles ?? []
                }]);
              }
              
              //onClose();
            }
            variant="transparent"
          >
            <p className="text-neutrals-background-default text-base">
              Confirm
            </p>
          </Button>
        </div>
      }
    >
      {contractPdfModalRef}
      <div className="flex flex-col gap-y-4 mt-2 pb-12">
        <div className="flex flex-col gap-y-4 grow overflow-y-auto p-2">
          <DrawerCard title="Contract Details" icon="contracts-02">
            <div className="flex flex-col gap-y-4 pb-2">
              <div className="flex flex-col gap-y-4">
                <div className="flex justify-between">
                  <div className="flex gap-x-1">
                    <Image src="/icons/car-02.svg" width={20} height={20} alt="car" />
                    <p className="text-sm text-neutrals-high font-medium">Vehicle</p>
                    <div className="absolute right-8">
                      <Image src="/images/car-03.svg" width={150} height={100} alt="car" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 items-start">
                  <p className="body_large_semibold text-neutrals-high">{modelLine}</p>
                  <Button className="bg-transparent hover:bg-transparent p-0" onClick={() => openContractPDF()}>
                    <div className="flex gap-x-1 items-center border-b border-b-brand-primary pb-1">
                      <p>
                        <Image src="/icons/contracts-primary.svg" width={18} height={18} alt="contract" />
                      </p>
                      <p className="text-neutrals-high caption_small_regular">View Contract</p>
                    </div>
                  </Button>
                </div>
              </div>
              <Divider />
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/contracts-02.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Contract Number</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{contractNo}</p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/mentoring.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Assigned Sales Consultant</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{salesConsultant}</p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/invoice-04.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Contract Value</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{formatNumberWithCommas(contractValue)}</p>
                </div>
              </div>  
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/money-03-primary.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Open Balance</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{formatNumberWithCommas(openBalance)}</p>
                </div>
              </div>
            </div>
          </DrawerCard>
          <DrawerCard title="Payment History" icon="money-receive-03" childrenClassName="!pb-1">
            {payments?.length === 0 && !isAddingNewPayment ? (
              <div className="flex flex-col items-center gap-y-4 p-10 border border-dashed border-neutrals-low bg-neutrals-background-surface caption_regular text-neutrals-medium">
                <Image src="/icons/money-add-primary.svg" width={56} height={56} alt="money-add" />
                <div>
                  <p>Tab on "+ New Payment" to</p>
                  <p>record a Deposit or Payment</p>
                </div>
                <Button
                  className="bg-brand-primary hover:bg-brand-primary p-2 mt-2 rounded-none"
                  onClick={() => {
                    setIsAddingNewPayment(true);
                    setSelectedPayment(undefined);
                  }}
                  leftSection={
                    <Image src="/icons/add-01-secondary.svg" width={16} height={16} alt="add" />
                  } 
                >
                  <p className="caption_bold">New Payment</p>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-y-4 pb-2">
                {payments?.length > 0 ? (
                  <ScrollArea w={420} h="auto" classNames={{ thumb: "!bg-brand-primary rounded-none" }} scrollbarSize={12} type="auto" offsetScrollbars={true} >
                    <div className="flex gap-x-8 w-full relative !mb-2">
                      <div className="bg-brand-primary w-full h-[2px] rounded-none absolute top-2" />
                      <div className={clsx(
                        "bg-neutrals-background-surface border border-dashed border-neutrals-low rounded-none min-w-min cursor-pointer mt-6 relative",
                        isAddingNewPayment && "!border-brand-secondary !bg-brand-secondary_ext_2"
                      )}>
                        <div className={clsx(
                          "flex items-center border-[0.5px] border-brand-primary p-1 size-[16px] rounded-full absolute z-50 -top-6 left-1/2 mr-auto bg-white",
                          isAddingNewPayment && "!border-brand-secondary"
                        )}>
                          <div className={clsx(
                              "rounded-full bg-brand-primary_ext_1 size-[6px]",
                              isAddingNewPayment && "!bg-brand-secondary"
                            )}
                          />
                        </div>

                        <div className="flex h-[73px] py-2.5 px-[14px] w-full justify-center items-center gap-x-2 !min-w-[200px]" onClick={() => setIsAddingNewPayment(true)}>                          <Image src={`/icons/${isAddingNewPayment ? 'add-01-secondary':'add-01'}.svg`} width={24} height={24} alt="money-add" />
                          <p className="text-neutrals-high">New Payment</p>
                        </div>
                      </div>
                      {payments?.map(payment => {
                        const isSelected = selectedPayment?.id === payment?.id;

                        return (
                          <div className={clsx(
                            "flex gap-x-2 bg-neutrals-background-surface border border-neutrals-low shadow-subtle-shadow2 py-2 pl-2 rounded-none min-w-[262px] h-[73px] w-full mt-6 relative",
                            isSelected && "!border-brand-secondary !bg-brand-secondary_ext_2"
                          )}>
                            <div className="flex items-center border-[0.5px] border-brand-primary p-1 size-[16px] rounded-full absolute z-50 -top-6 left-1/2 mr-auto bg-white">
                              <div className="rounded-full bg-brand-primary_ext_1 size-[6px]"/>
                            </div>
                            <div className="flex gap-x-2 w-full">
                              <div className="flex items-center justify-center bg-neutrals-high py-1.5 px-2.5 h-[56px] w-[60px]">
                                <Image src="/icons/money-receive-02-white.svg" width={24} height={24} alt="money-receive" />
                              </div>
                              <div className="flex flex-col w-full pr-2 ">
                                <p className="caption_regular text-neutrals-high">{payment?.type}</p>
                                <div className="grid grid-cols-2 min-w-max w-full">
                                  <div className="body_small_semibold text-neutrals-high">{formatNumberWithCommas(payment?.amount)}</div>
                                  <div className="text-brand-primary caption_semibold cursor-pointer justify-self-end" onClick={() => setSelectedPayment((current) => current?.id === payment.id ? undefined : payment)}>{isSelected ? 'Hide Details':'View Details'}</div>
                                </div>
                                <div className="flex gap-x-1 items-center">
                                  <Image src="/icons/calendar-04.svg" width={16} height={16} alt="calendar" />
                                  <p className="caption_small_regular text-neutrals-medium mt-1">{formatDate(payment?.date)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                ): null}
                {selectedPayment && (
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4 bg-neutrals-background-surface border-[1px] border-neutrals-low p-4">
                      <div className="flex flex-col">
                        <span className="body_small_regular text-neutrals-medium">Payment Type</span>
                        <span className="body_small_semibold text-neutrals-high">{selectedPayment?.type}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="body_small_regular text-neutrals-medium">Payment Amount</span>
                        <span className="body_small_semibold text-neutrals-high">{selectedPayment?.amount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="body_small_regular text-neutrals-medium">Payment Date</span>
                        <span className="body_small_semibold text-neutrals-high">{formatDate(selectedPayment?.date)}</span>
                      </div>
                    </div>
                    <div className="bg-neutrals-background-surface border-[1px] border-neutrals-low p-4">
                      {/*selectedPayment?.files?.map(file => (
                        <div className="flex flex-row items-center gap-x-2">
                          <Image src="/icons/file-02.svg" width={24} height={24} alt="file" />
                          <p className="caption_regular text-neutrals-high">{file.name}</p>
                        </div>
                      ))*/}
                    </div>
                    <Button
                      className="bg-neutrals-background-surface hover:bg-neutrals-background-surface p-2 rounded-none w-fit h-auto border-neutrals-low px-4 py-3"
                      leftSection={
                        <Image src="/icons/pencil-edit-01-primary.svg" width={16} height={16} alt="edit" />
                      }
                    >
                      <p className="caption_semibold text-neutrals-high">Edit Information</p>
                    </Button>
                  </div>
                )}
                {isAddingNewPayment && (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-4 border-[1px] border-neutrals-low shadow-subtle-shadow2 bg-neutrals-background-default p-4 rounded">
                      <Select
                        placeholder="Payment Type"
                        items={[
                          { value: 'Deposit', label: 'Deposit' },
                          { value: 'Installment', label: "Installment" },
                          { value: 'Full Payment', label: "Full Payment" },
                          { value: 'Refund', label: "Refund" },
                        ]}
                        hideValue
                        onOptionSubmit={(value) => {
                          setPaymentType(value);
                        }}
                      />
                      <NumInput
                        placeholder="Payment Amount"
                        rightSection={
                          <p className="caption_regular">KRW</p>
                        }
                        onChange={(value) => {
                          setPaymentAmount(parseFloat(value.toString()));
                        }}
                      />
                      <DatePicker
                        target={(
                          <div className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2" onClick={() => open()}>
                            <span className="text-neutrals-high body_small_regular">
                              Payment Date
                            </span>
                            <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
                          </div>
                        )}
                        placeholder="Payment Date"
                        withIcon
                        withBorder
                        inForm
                        type="default"
                        onChange={(date) => {
                          setPaymentDate(date as DateValue);
                        }}
                      />
                    </div>
                    <div className="bg-neutrals-background-default shadow-subtle-shadow2 p-4 rounded">
                      <DropSelectFile subtitle="Upload or drag and drop receipt here" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useManagePayment = (props: UseManagePaymentProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <ManagePayment opened={opened} onClose={close} contract={props.contract} />
  );

  return { opened, open, close, drawerRef };
};