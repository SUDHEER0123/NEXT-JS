'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, ScrollArea, ScrollAreaAutosize, Stepper } from "@mantine/core";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { TxtInput } from "./text-input";
import { DropSelectFile, useFileBase64 } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { Slideover } from "@/components/Slideover/Slideover";
import { CreateDocumentPayload, CreateDocumentResponse, IContract, IDocument, IOrder, IOrderView, IPayment, IVehicle, OrderInventory, Payment } from "@/app/types";
import { formatNumberWithCommas } from "@/utils/common";
import { useEffect, useMemo, useState } from "react";
import { Select } from "@/components/ui/Select/Select";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { DateValue } from "@mantine/dates";
import { formatDate } from "@/utils/dateFormatter";
import clsx from "clsx";
import { useOrdersStore } from "../store/orders.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDataStore } from "@/app/app.store";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/AuthContext";
import { doc } from "firebase/firestore";
import { usePDFView } from "@/components/PdfViewer/PdfViewer";
import { Loader } from "@/components/ui/Loader/Loader";

interface UseManagePaymentProps {
  order: IOrderView;
  contract?: IContract;
  onPaymentUpdate: () => void;
}

interface IManagePayments extends UseManagePaymentProps {
  opened: boolean;
  onClose: () => void;
}

// ------------------
// Zod schema
const paymentSchema = z.object({
  paymentType: z.string().min(1, "Payment type is required"),
  paymentAmount: z.number().min(1, "Amount must be greater than 0"),
  paymentDate: z.date({ required_error: "Payment date is required" }),
  // Receipt is a file
  receipt: z
    .array(
      z.object({
        date: z.date(),
        file: z.instanceof(File),
        name: z.string(),
      })
    )
    .min(1, "Please upload a receipt document."),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export const ManagePayment: React.FC<IManagePayments> = ({ opened, onClose, order, contract, onPaymentUpdate }) => {
  const [isAddingNewPayment, setIsAddingNewPayment] = useState(false);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<number>();
  const { modelTypes } = useAppDataStore();
  const { selectedOrder } = useOrdersStore();
  const { user } = useAuth();
  const [receiptUid, setReceiptUid] = useState<string | undefined>(undefined);
  const [paymentToEdit, setPaymentToEdit] = useState<IPayment | undefined>(undefined);

  const { contractnumber, contractvalue, userfirstname, userlastname, contractuid } = selectedOrder ?? {};

  const { depositAmount, orderInventoryUid, documentUid } = contract ?? {};

  const { heroimageicon } = order ?? {};

  const { open: openPdf, modalRef: pdfModalRef } = usePDFView({ pdfUrl: documentUid ?? '' });
  
  const { data: orderInventory, isLoading: isLoadingOrderInventory, error: errorGettingOrderInventory } = useQuery({
    queryKey: ['orderInventory', orderInventoryUid],
    queryFn: () => api.get(`/order/inventory/${orderInventoryUid}`).then(res => res.data as OrderInventory),
    enabled: !!orderInventoryUid,
  });
  
  const { data: vehicle, isLoading: isLoadingVehicle, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get(`/vehicle/${orderInventory?.vehicleUid}`).then(res => res.data as IVehicle),
    enabled: !!orderInventory?.vehicleUid || isLoadingOrderInventory,
  });

  const { mutate: updateContract, isPending: isUpdatingContract } = useMutation({
    mutationKey: ['updateContract', contract?.uid],
    mutationFn: (data: IContract) => api.put(`/contract`, data),
    onMutate () {
    },
    onSuccess(data, variables, context) {
      if(!isAddingNewPayment) {
        setSelectedPaymentIndex(undefined);
        setPaymentToEdit(undefined);
        setReceiptUid(undefined);
        setIsAddingNewPayment(false);
        reset();
        toast.success('Payment updated successfully.');
        onPaymentUpdate();
      } else {
        toast.success('Contract updated successfully.');
        handleClose();
      }
    },
    onError(error, variables, context) {
      console.error("Error updating contract:", error);
      toast.error('Error updating contract');
    }
  });

  const { mutate: uploadReceipt, isPending: isUploadingReceipt } = useMutation({
    mutationFn: (data: CreateDocumentPayload) => api.post(`/file-manager/documents`, data),
    onMutate () {
      console.log('onMutate')
    },
    onSuccess(data, variables, context) {
      updateContract({
        ...contract,
        balance: (contract?.balance ?? 0) - getValues().paymentAmount,
        payments: [
          ...(contract?.payments ?? []),
          {
            uid: null,
            date: getValues().paymentDate.toISOString(),
            amount: getValues().paymentAmount,
            type: getValues().paymentType,
            receipt: (data.data as CreateDocumentResponse).uid,
            recordDate: new Date().toISOString(),
            recordUserUid: user?.uid ?? '',
            contractUid: contract?.uid ?? '',
          }
        ],
      });
    },
    onError(error, variables, context) {
      console.error("Error creating document:", error);
      toast.error('Error uploading document');
    }
  });

  const { data: receipt, isLoading: isLoadingReceipt, error: errorGettingReceipt } = useQuery({
    queryKey: ['documents', receiptUid],
    queryFn: () => api.get(`/file-manager/documents/${receiptUid}`).then(res => res.data as IDocument),
    enabled: !!receiptUid,
  });

  const model = useMemo(() => {
    if(!vehicle || isLoadingVehicle) return '';

    const modelType = modelTypes?.find((modelType) => modelType.uid === vehicle.modelTypeUid);

    if(!modelType) return '';

    return modelType.displayName;
  },[modelTypes, vehicle, isLoadingVehicle]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: undefined,
      paymentAmount: undefined,
      paymentDate: undefined,
      receipt: []
    },
  });
    
  const { convertToBase64 } = useFileBase64();

  const onSubmit = async (data: PaymentFormData) => {
    const receiptFile = data.receipt[0].file;
    
    uploadReceipt({
      base64FileData: (await convertToBase64(receiptFile))?.split(',')[1] ?? '',
      vehicleUid: orderInventory?.vehicleUid,
      vin: vehicle?.vinNumber,
      modelTypeUid: vehicle?.modelTypeUid,
      orderUid: orderInventory?.orderUid,
      orderNumber: order?.ordernumber,
      displayName: "Payment Receipt",
      name: receiptFile.name,
      description: "Receipt",
      mimeType: "application/pdf",
      type: "invoice",
      status: "active"
    });
  };

  const handleClose = () => {
    setIsAddingNewPayment(false);
    setSelectedPaymentIndex(undefined);
    setPaymentToEdit(undefined);
    reset();
    onClose();
  };

  useEffect(() => {
    if(selectedPaymentIndex === undefined || isLoadingReceipt) {
      return;
    }

    setValue('paymentType', contract?.payments?.[selectedPaymentIndex]?.type ?? '');
    setValue('paymentAmount', contract?.payments?.[selectedPaymentIndex]?.amount ?? 0);
    setValue('paymentDate', new Date(contract?.payments?.[selectedPaymentIndex]?.recordDate ?? ''));
    setValue('receipt', receipt ? [{
      file: new File([receipt.url ?? ''], receipt?.name ?? '', { type: receipt?.mimeType }),
      date: new Date(contract?.payments?.[selectedPaymentIndex]?.recordDate ?? ''),
      name: receipt?.name,
    }] : []);
  }, [selectedPaymentIndex, receipt, isLoadingReceipt, contract]);

  useEffect(() => {
    if(isAddingNewPayment) {
      setSelectedPaymentIndex(undefined);
    }
  },[isAddingNewPayment]);
  
  useEffect(() => {
    if(isAddingNewPayment && selectedPaymentIndex === undefined) {
      console.log('Resetting form')
      reset();
    }
  },[isAddingNewPayment, selectedPaymentIndex]);

  useEffect(() => {
    if(paymentToEdit) {
      setValue('paymentType', paymentToEdit.type);
      setValue('paymentAmount', paymentToEdit.amount);
      setValue('paymentDate', new Date(paymentToEdit.date));
      setValue('receipt', receipt ? [{
        file: new File([], receipt.name, { type: receipt.mimeType }),
        date: new Date(paymentToEdit.date),
        name: receipt.name
      }] : []);
      setIsAddingNewPayment(false);
    }
  },[paymentToEdit, receipt]);
  
  return (
    <Slideover
      title="Manage Payments"
      open={opened}
      onClose={handleClose}
      footer={
        <div className="flex w-full overflow-y-hidden">
          <Button
            className="w-[250px] h-auto !bg-neutrals-high rounded-none font-medium"
            onClick={handleClose}
            disabled={isUploadingReceipt || isUpdatingContract}
          >
            <p className="text-neutrals-background-default text-base">
              Cancel
            </p>
          </Button>
          <Button
            className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
            variant="transparent"
            disabled={isUploadingReceipt || isUpdatingContract}
            onClick={handleSubmit(onSubmit)}
          >
            <p className="text-neutrals-background-default text-base">
              Confirm
            </p>
          </Button>
        </div>
      }
    >
      {pdfModalRef}
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
                      <Image src={heroimageicon} width={150} height={100} alt="car" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 items-start">
                  <p className="body_large_semibold text-neutrals-high">{model}</p>
                  <Button className="bg-transparent hover:bg-transparent p-0" onClick={() => openPdf()}>
                    <div className="flex gap-x-1 items-center border-b border-b-brand-primary pb-1">
                      <p>
                        <Image src="/icons/contracts-primary.svg" width={18} height={18} alt="IOrder" />
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
                  <p className="text-sm font-normal text-neutrals-high">{contractnumber}</p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/mentoring.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Assigned Sales Consultant</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{`${userfirstname} ${userlastname}`}</p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/invoice-04.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Contract Value</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{formatNumberWithCommas(contract?.value ?? 0)}</p>
                </div>
              </div>  
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/money-03-primary.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Open Balance</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{formatNumberWithCommas(contract?.balance)}</p>
                </div>
              </div>
            </div>
          </DrawerCard>
          <DrawerCard title="Payment History" icon="money-receive-03" childrenClassName="!pb-1">
            {(!contract?.payments ) && !isAddingNewPayment ? (
              <div className="flex flex-col items-center gap-y-4 p-10 border border-dashed border-neutrals-low bg-neutrals-background-surface caption_regular text-neutrals-medium">
                <Image src="/icons/money-add-primary.svg" width={56} height={56} alt="money-add" />
                <div>
                  <p>Tab on "+ New Payment" to</p>
                  <p>record a Deposit or Payment</p>
                </div>
                <Button
                  className="bg-brand-primary hover:bg-brand-primary p-2 mt-2 rounded-none"
                  onClick={() => {
                    reset();
                    setIsAddingNewPayment(true);
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
                {(contract?.payments ?? []).length > 0 ? (
                  <ScrollArea w={420} h="auto" classNames={{ thumb: "!bg-brand-primary rounded-none" }} scrollbarSize={12} type="auto" offsetScrollbars={true} >
                    <div className="flex gap-x-8 w-full relative !mb-2">
                      <div className="bg-brand-primary w-full h-[2px] rounded-none absolute top-2" />
                      <div className={clsx(
                        "bg-neutrals-background-surface border border-dashed border-neutrals-low rounded-none min-w-min cursor-pointer mt-6 relative",
                        isAddingNewPayment && selectedPaymentIndex === undefined && "!border-brand-secondary !bg-brand-secondary_ext_2"
                      )}>
                        <div className={clsx(
                          "flex items-center border-[0.5px] border-brand-primary p-1 size-[16px] rounded-full absolute z-50 -top-6 left-1/2 mr-auto bg-white",
                          isAddingNewPayment && selectedPaymentIndex === undefined && "!border-brand-secondary"
                        )}>
                          <div className={clsx(
                              "rounded-full bg-brand-primary_ext_1 size-[6px]",
                              isAddingNewPayment && selectedPaymentIndex === undefined && "!bg-brand-secondary"
                            )}
                          />
                        </div>
                        <div
                          className="flex h-[73px] py-2.5 px-[14px] w-full justify-center items-center gap-x-2 !min-w-[200px]"
                          onClick={() => {
                            reset();
                            setIsAddingNewPayment(true);
                          }}
                        >
                          <Image src={`/icons/${isAddingNewPayment ? 'add-01-secondary':'add-01'}.svg`} width={24} height={24} alt="money-add" />
                          <p className="text-neutrals-high">New Payment</p>
                        </div>
                      </div>
                      {contract?.payments?.map((payment,idx) => {
                        const isSelected = idx === selectedPaymentIndex;

                        return (
                          <div
                            className={clsx(
                              "flex gap-x-2 bg-neutrals-background-surface border border-neutrals-low shadow-subtle-shadow2 py-2 pl-2 rounded-none min-w-[262px] h-[73px] w-full mt-6 relative",
                              isSelected && "!border-brand-secondary !bg-brand-secondary_ext_2"
                            )}
                            key={idx}
                          >
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
                                  <div
                                    className="text-brand-primary caption_semibold cursor-pointer justify-self-end"
                                    onClick={() => {
                                      setSelectedPaymentIndex((prev) => prev === idx ? undefined : idx);
                                      setIsAddingNewPayment(false);
                                      setPaymentToEdit(undefined);

                                      if(!isSelected)
                                        setReceiptUid(payment?.receipt)
                                    }}
                                  >
                                    {isSelected ? 'Hide Details':'View Details'}
                                  </div>
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
                {selectedPaymentIndex !== undefined && !isAddingNewPayment && (
                  <div className="flex flex-col gap-y-4">
                    {!paymentToEdit && (
                      <div className="flex flex-col gap-y-4 bg-neutrals-background-surface border-[1px] border-neutrals-low p-4">
                        <div className="flex flex-col">
                          <span className="body_small_regular text-neutrals-medium">Payment Type</span>
                          <span className="body_small_semibold text-neutrals-high">{contract?.payments?.[selectedPaymentIndex]?.type}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="body_small_regular text-neutrals-medium">Payment Amount</span>
                          <span className="body_small_semibold text-neutrals-high">{formatNumberWithCommas(contract?.payments?.[selectedPaymentIndex]?.amount)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="body_small_regular text-neutrals-medium">Payment Date</span>
                          <span className="body_small_semibold text-neutrals-high">{formatDate(contract?.payments?.[selectedPaymentIndex]?.date)}</span>
                        </div>
                      </div>
                    )}
                    {!isLoadingReceipt ? 
                      receipt && (
                        <div className="bg-neutrals-background-surface border-[1px] border-neutrals-low p-4">
                          <Controller
                            name="receipt"
                            control={control}
                            render={({ field }) => (
                              <DropSelectFile
                                subtitle="Upload or drag and drop your receipt here"
                                customImage="/images/invoice-03.svg"
                                label=""
                                value={field.value}
                                onChange={field.onChange}
                                maxUploads={1}
                                supportedFormats={['pdf', 'jpg', 'jpeg', 'png']}
                                maxFileSize="5MB"
                                uploadDisabled={!isAddingNewPayment}
                              />
                            )}
                          />
                        </div>
                      ):(
                        <></>
                      )}
                    {isLoadingReceipt && (
                      <div className="flex justify-center items-center w-full h-[200px]">
                        <Loader />
                      </div>
                    )}
                    {selectedPaymentIndex !== undefined && !paymentToEdit && (
                      <Button
                        className="bg-neutrals-background-surface hover:bg-neutrals-background-surface p-2 rounded-none w-fit h-auto border-neutrals-low px-4 py-3"
                        leftSection={
                          <Image src="/icons/pencil-edit-01-primary.svg" width={16} height={16} alt="edit" />
                        }
                        onClick={() => {
                          setPaymentToEdit(contract?.payments?.[selectedPaymentIndex]);
                        }}
                      >
                        <p className="caption_semibold text-neutrals-high">Edit Information</p>
                      </Button>
                    )}
                  </div>
                )}
                {(isAddingNewPayment || paymentToEdit) && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={`flex flex-col gap-y-4`}>
                      <Controller
                        name="paymentType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            placeholder="Payment Type"
                            items={[
                              { value: 'Deposit', label: 'Deposit' },
                              { value: 'Installment', label: 'Installment' },
                              { value: 'Full Payment', label: 'Full Payment' },
                              { value: 'Refund', label: 'Refund' },
                            ]}
                            value={field.value}
                            onOptionSubmit={field.onChange}
                          />
                        )}
                      />
                      <Controller
                        name="paymentAmount"
                        control={control}
                        render={({ field }) => (
                          <NumInput
                            placeholder="Payment Amount"
                            rightSection={<p className="caption_regular">KRW</p>}
                            value={field.value}
                            onChange={(val) => field.onChange(parseFloat(val.toString()))}
                          />
                        )}
                      />
                      <Controller
                        name="paymentDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            placeholder="Payment Date"
                            withIcon
                            withBorder
                            inForm
                            value={field.value}
                            onChange={(date) => field.onChange(date as Date)}
                          />
                        )}
                      />
                      <Controller
                        name="receipt"
                        control={control}
                        render={({ field }) => (
                          <DropSelectFile
                            subtitle="Upload or drag and drop receipt here"
                            value={field.value}
                            onChange={field.onChange}
                            maxUploads={5}
                            supportedFormats={['jpg', 'jpeg', 'png', 'pdf']}
                            maxFileSize="5MB"
                          />
                        )}
                      />
                      {selectedPaymentIndex !== undefined && paymentToEdit && (
                        <Button
                          className="h-auto w-fit bg-brand-primary rounded-none font-medium hover:bg-brand-primary py-3 px-6"
                          variant="transparent"
                          disabled={isUploadingReceipt || isUpdatingContract}
                          onClick={handleSubmit(onSubmit)}
                        >
                          <p className="text-neutrals-background-default caption_semibold">
                            Save Changes
                          </p>
                        </Button>
                      )}
                    </div>
                  </form>
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
    <ManagePayment opened={opened} onClose={close} {...props} />
  );

  return { opened, open, close, drawerRef };
};