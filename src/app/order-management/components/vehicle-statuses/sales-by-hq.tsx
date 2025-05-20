import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { DropSelectFile, useFileBase64 } from "@/components/ui/Dropfile/Dropfile";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { TxtInput } from "@/components/ui/TxtInput/text-input";
import { Button } from "@mantine/core";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CreateDocumentPayload, CreateDocumentResponse, IOrder, IVehicle } from "@/app/types";
import api from "@/lib/api";
import { useOrdersStore } from "../../store/orders.store";
import { useState } from "react";
import { toast } from "react-toastify";

interface ISalesByHQ {
  onConfirm: () => void;
  updateOrder: (
    vehicleStatus: string,
    data: Partial<IOrder>
  ) => void;
  vehicle?: IVehicle;
}

const formSchema = z.object({
  wholesaleOrderNo: z.string().min(1, "Order number is required"),
  wholesaleInvoiceAmount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive"),
  wholesaleInvoiceDueDate: z.date({ required_error: "Due date is required" }),
  wholesaleInvoice: z
    .array(z.object({ file: z.instanceof(File), date: z.date(), name: z.string() }))
    .min(1, "Please upload an invoice"),
});

type FormData = z.infer<typeof formSchema>;

export const SalesByHq: React.FC<ISalesByHQ> = ({ onConfirm, updateOrder, vehicle }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { selectedOrder } = useOrdersStore();
  const { orderuid: orderUid, ordernumber, vehicleuid } = selectedOrder;
  const { convertToBase64, base64, loading, error } = useFileBase64();
  const [uploading, setUploading] = useState(false);

  const { mutate: createDocument, isPending: isCreatingDocument } = useMutation({
    mutationKey: ['createDocument', orderUid],
    mutationFn: (data: CreateDocumentPayload) => api.post(`/file-manager/documents`, data),
    onMutate () {
      setUploading(true);
    },
    onSuccess(data, variables, context) {
      const responseData = data.data as CreateDocumentResponse;

      // Update wholesaleInvoiceDocument to uid returned by createDocument API
      updateOrder(
        'Sales Order by HQ',
        {
          wholesaleOrderNumber: getValues().wholesaleOrderNo,
          wholesaleInvoiceAmount: getValues().wholesaleInvoiceAmount,
          wholesaleInvoiceDueDate: new Date(getValues().wholesaleInvoiceDueDate).toISOString(),
          wholesaleInvoiceDocument: responseData?.uid
        }
      );
    },
    onError(error, variables, context) {
      setUploading(false);
      console.error("Error creating document:", error);
      toast.error('Error uploading document');
    },
    onSettled() {
      setUploading(false);
      onConfirm();
    }
  });

  const onSubmit = async (data: FormData) => {
    const invoiceFile = data.wholesaleInvoice[0].file;

    // Call create document to upload wholesaleInvoice
    createDocument({
      base64FileData: (await convertToBase64(invoiceFile))?.split?.(',')?.[1] ?? '',
      name: invoiceFile.name,
      vehicleUid: vehicleuid,
      vin: vehicle?.vinNumber ?? '',
      modelTypeUid: null,
      modelTypeName: null,
      orderUid,
      orderNumber: ordernumber,
      displayName: "Wholesale Invoice Document",
      description: "Wholesale Invoice Document",
      mimeType: "application/pdf",
      type: "invoice",
      status: "active"
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-6 w-full overflow-y-auto items-center min-h-full max-h-[480px]"
    >
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 w-full h-full pt-4">
        <Controller
          name="wholesaleOrderNo"
          control={control}
          render={({ field }) => (
            <TxtInput
              placeholder="Wholesale Order No"
              wrapperClassname="!w-full !items-start"
              inputClassName="!body_small_regular !h-[25px] !min-h-[25px]"
              className="w-full justify-start"
              {...field}
            />
          )}
        />

        <Controller
          name="wholesaleInvoiceAmount"
          control={control}
          render={({ field }) => (
            <NumInput
              placeholder="Wholesale Invoice Amount"
              rightSection={<p className="caption_regular">KRW</p>}
              wrapperClassname="!w-full !items-start"
              className="!items-start"
              value={field.value}
              onChange={(val) => {
                const number = typeof val === 'string' ? parseFloat(val) : val;
                field.onChange(number);
              }}
            />
          )}
        />

        <Controller
          name="wholesaleInvoiceDueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              placeholder="Wholesale Invoice Due Date"
              withIcon
              withBorder
              inForm
              value={field.value}
              onChange={field.onChange}
              hideValue={false}
            />
          )}
        />

        <Controller
          name="wholesaleInvoice"
          control={control}
          render={({ field }) => (
            <DropSelectFile
              title="Upload or drag and drop your Wholesale Invoice"
              maxUploads={1}
              value={field.value}
              onChange={field.onChange}
              accept="application/pdf"
            />
          )}
        />
      </div>

      <div className="pb-4 w-full px-3">
        <Button
          type="submit"
          variant="unstyled"
          className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]"
          loading={loading || uploading}
        >
          <p className="body_regular_semibold text-neutrals-background-default">
            Confirm
          </p>
        </Button>
      </div>
    </form>
  );
};
