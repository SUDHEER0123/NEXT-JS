'use client';

import { DrawerCard } from "../../order-management/components/drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { DropSelectFile, useFileBase64 } from "@/components/ui/Dropfile/Dropfile";
import { CreateDocumentPayload, CreateDocumentResponse, IContract, IOrderView, OrderInventory } from "@/app/types";
import { Slideover } from "@/components/Slideover/Slideover";
import Image from "next/image";
import { ContractsIcon, FileIcon, Money03Icon } from "@/assets/icons";
import { formatNumberWithCommas } from "@/utils/common";
import { useAppDataStore } from "@/app/app.store";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { usePDFView } from "@/components/PdfViewer/PdfViewer";

interface IManageContracts extends UseManageContractsProps, DrawerProps {}

interface UseManageContractsProps {
  contract?: IContract;
  orderView?: IOrderView;
  onClose: () => void;
}

// Zod schema for physical contract upload
const schema = z.object({
  physicalContract: z
    .array(
      z.object({
        date: z.date(),
        file: z.instanceof(File),
        name: z.string(),
      })
    )
    .min(1, "Please upload a Physical Contract document."),
});

type FormData = z.infer<typeof schema>;

export const ManageContracts: React.FC<IManageContracts> = ({ opened, onClose, contract, orderView }) => {
  const { modelTypes } = useAppDataStore();
  const modelType = modelTypes?.find((model) => model.uid === orderView?.modeltypeuid);
  const { open: openContractPDF, modalRef: contractPdfModalRef } = usePDFView({ pdfUrl: contract?.documentUid ?? '' });

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      physicalContract: [],
    },
  });
  
  const { convertToBase64 } = useFileBase64();

  const { mutate: updateContract, isPending: isUpdatingContract } = useMutation({
    mutationKey: ['updateContract', orderView?.contractuid],
    mutationFn: (data: IContract) => api.put(`/contract`, data),
    onMutate () {
    },
    onSuccess(data, variables, context) {
      toast.success('Contract updated successfully.');

      reset();
      onClose();
    },
    onError(error, variables, context) {
      console.error("Error creating document:", error);
      toast.error('Error uploading document');
    }
  });

  const { mutate: createDocument, isPending: isCreatingDocument } = useMutation({
    mutationKey: ['createDocument', orderView?.orderuid],
    mutationFn: (data: CreateDocumentPayload) => api.post(`/file-manager/documents`, data),
    onMutate () {
    },
    onSuccess(data, variables, context) {
      updateContract({
        ...contract,
        documentUid: (data.data as CreateDocumentResponse).url
      });
    },
    onError(error, variables, context) {
      console.error("Error creating document:", error);
      toast.error('Error uploading document');
    }
  });

  const onSubmit = async (data: FormData) => {
    const contractFile = data.physicalContract[0].file;

    // Call create document to upload wholesaleInvoice
    createDocument({
      base64FileData: (await convertToBase64(contractFile))?.split(',')[1] ?? '',
      vehicleUid: orderView?.vehicleuid,
      vin: orderView?.vinnumber,
      modelTypeName: orderView?.modeltypeuid,
      modelTypeUid: orderView?.modeltypeuid,
      orderUid: orderView?.orderuid,
      orderNumber: orderView?.ordernumber,
      displayName: "Contract Document",
      name: contractFile.name,
      description: "Contract Document",
      mimeType: "application/pdf",
      type: "contract",
      status: "active"
    });
  };

  return (
    <>
      {contractPdfModalRef}
      <Slideover
        title="Manage Customer Contracts"
        open={opened}
        onClose={onClose}
        footer={
          <div className="flex w-full overflow-y-hidden">
            <Button className="w-[250px] h-auto !bg-neutrals-high rounded-none font-medium" onClick={onClose}>
              <p className="text-neutrals-background-default text-base">Cancel</p>
            </Button>
            <Button
              className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
              variant="transparent"
              onClick={handleSubmit(onSubmit)}
              disabled={isCreatingDocument}
              loading={isCreatingDocument}
            >
              <p className="text-neutrals-background-default text-base">Confirm</p>
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 h-full">
          <div className="flex flex-col gap-y-4 grow px-1 py-3 overflow-y-auto">
            <DrawerCard title="Order Details" icon="contracts-02">
              <div className="flex flex-col gap-y-4 items-start">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-1">
                      <Image src="/icons/car-02.svg" width={20} height={20} alt="car-02" />
                      <p className="body_small_semibold text-neutrals-high">Vehicle</p>
                    </div>
                    <div className="flex flex-col gap-y-1 items-start w-full">
                      <p className="body_large_semibold text-neutrals-high">{modelType?.displayName}</p>
                    </div>
                  </div>
                  {orderView?.heroimageicon && (
                    <Image src={orderView?.heroimageicon} width={150} height={100} alt="car" />
                  )}
                </div>
                <div className="bg-neutrals-low h-[0.5px] w-full mt-4" />
                <div className="flex flex-col gap-y-4 w-full">
                  <div className="flex justify-between items-center text-brand-primary">
                    <div className="flex gap-x-2 items-center w-full">
                      <FileIcon width={20} height={20} />
                      <p className="body_small_semibold text-neutrals-high">Order Number</p>
                    </div>
                    <p className="text-neutrals-high body_small_regular text-right w-full">{orderView?.ordernumber}</p>
                  </div>

                  <div className="flex justify-between items-center text-brand-primary">
                    <div className="flex gap-x-2 items-center w-full">
                      <ContractsIcon width={20} height={20} />
                      <p className="body_small_semibold text-neutrals-high">Contract Number</p>
                    </div>
                    <p className="text-neutrals-high body_small_regular text-right w-full">{orderView?.contractnumber}</p>
                  </div>

                  <div className="flex justify-between items-center text-brand-primary">
                    <div className="flex gap-x-2 items-center w-full">
                      <Money03Icon width={20} height={20} />
                      <p className="body_small_semibold text-neutrals-high">Open Balance</p>
                    </div>
                    <p className="text-neutrals-high body_small_regular text-right w-full">{formatNumberWithCommas(contract?.balance)}</p>
                  </div>
                </div>
              </div>
            </DrawerCard>

            <DrawerCard title="Contract Documents" icon="invoice-04">
              <div className="flex flex-col gap-y-2">
                <>
                  <p className="body_small_semibold text-neutrals-high">Digital Contract</p>
                  <div className="flex gap-x-12 bg-neutrals-background-shading p-4 items-center">
                    <Image src="/images/digital-contract.svg" width={200} height={84} alt="digital-contract" />
                    <Button
                      className="bg-brand-primary hover:bg-brand-primary text-neutrals-background-default hover:text-neutrals-background-default rounded-none py-2.5 px-4 h-full"
                      variant="unstyled"
                      onClick={openContractPDF}
                      disabled={!contract?.documentUid}
                    >
                      <p className="caption_semibold">View Contract</p>
                    </Button>
                  </div>
                </>
                <div className="pt-2">
                  <Controller
                    name="physicalContract"
                    control={control}
                    render={({ field }) => (
                      <DropSelectFile
                        subtitle="Upload or drag and drop your Physical Contract here"
                        customImage="/images/invoice-03.svg"
                        label="Physical Contract"
                        value={field.value}
                        onChange={field.onChange}
                        supportedFormats={['pdf', 'jpg', 'jpeg', 'png']}
                        maxFileSize="5MB"
                      />
                    )}
                  />
                </div>
              </div>
            </DrawerCard>
          </div>
        </form>
      </Slideover>
    </>
  );
};

export const useManageContracts = (props: UseManageContractsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <ManageContracts opened={opened} onClose={close} contract={props.contract} orderView={props.orderView} />
  );

  return { opened, open, close, drawerRef };
};
