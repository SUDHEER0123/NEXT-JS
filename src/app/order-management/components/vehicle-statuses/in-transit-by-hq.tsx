import { TxtInput } from '@/components/ui/TxtInput/text-input';
import { Button } from '@mantine/core';
import { NumInput } from '../num-input';
import { Select } from '@/components/ui/Select/Select';
import { DropSelectFile, useFileBase64 } from '@/components/ui/Dropfile/Dropfile';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrdersStore } from '../../store/orders.store';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CreateDocumentPayload, CreateDocumentResponse, IOrder, IVehicle } from '@/app/types';
import api from '@/lib/api';
import { toast } from 'react-toastify';

interface IInTransitByHq {
  onConfirm: (transitType: string, vesselName: string, vesselTrackingNumber: string, vesselTrackingUrl: string, billOfLandingDocument: string) => void;
  updateOrder?: (vehicleStatus: string, data: Partial<IOrder>) => void;
  vehicle?: IVehicle;
}

const schema = z.object({
  transitType: z.string().min(1, 'Transit type is required'),
  vesselName: z.string().min(1, 'Vessel name is required'),
  vesselTrackingNumber: z.string().min(1, 'Tracking number is required'),
  vesselTrackingUrl: z.string().url('Invalid URL'),
  billOfLandingDocument: z.array(z.object({ file: z.instanceof(File), date: z.date(), name: z.string() })).min(1, 'Please upload BL Landing Document:'),
});

type FormData = z.infer<typeof schema>;

export const InTransitByHq: React.FC<IInTransitByHq> = ({ onConfirm, updateOrder, vehicle }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { selectedOrder } = useOrdersStore();
  const { orderuid: orderUid, ordernumber, vehicleuid } = selectedOrder;
  const { convertToBase64, base64, loading, error } = useFileBase64();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: FormData) => {
    const invoiceFile = data.billOfLandingDocument[0].file;

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
      displayName: 'BL Landing Document',
      description: 'BL Landing Document',
      mimeType: 'application/pdf',
      type: 'vehicle',
      status: 'active',
    });
  };

  const { mutate: createDocument, isPending: isCreatingDocument } = useMutation({
    mutationKey: ['createDocument', orderUid],
    mutationFn: (data: CreateDocumentPayload) => api.post(`/file-manager/documents`, data),
    onMutate() {
      setUploading(true);
    },
    onSuccess(data, variables, context) {
      const responseData = data.data as CreateDocumentResponse;
      onConfirm(getValues().transitType, getValues().vesselName, getValues().vesselTrackingNumber, getValues().vesselTrackingUrl, responseData?.uid);
    },
    onError(error, variables, context) {
      setUploading(false);
      console.error('Error creating document:', error);
      toast.error('Error uploading document');
    },
    onSettled() {
      setUploading(false);
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6 w-full overflow-y-hidden items-start max-h-[450px] !w-full">
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 !w-full items-start">
        <Controller
          name="transitType"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="Transit Type"
              items={[
                { label: 'Air', value: 'Air' },
                { label: 'Sea', value: 'Sea' },
              ]}
              onOptionSubmit={field.onChange}
              value={field.value}
            />
          )}
        />

        <Controller name="vesselName" control={control} render={({ field }) => <TxtInput placeholder="Vessel Name" wrapperClassname="w-full items-start" className="w-full" {...field} />} />

        <Controller
          name="vesselTrackingNumber"
          control={control}
          render={({ field }) => (
            <NumInput
              placeholder="Vessel Tracking Number"
              className="w-full"
              wrapperClassname="w-full items-start"
              rightSection={<></>}
              value={field.value}
              onChange={val => field.onChange(val.toString())}
            />
          )}
        />

        <Controller
          name="vesselTrackingUrl"
          control={control}
          render={({ field }) => <TxtInput placeholder="Vessel Tracking URL" wrapperClassname="w-full items-start" className="w-full" {...field} />}
        />

        <Controller
          name="billOfLandingDocument"
          control={control}
          render={({ field }) => <DropSelectFile title="Upload or drag and drop your BL Landing Document:" maxUploads={1} value={field.value} onChange={field.onChange} accept="application/pdf" />}
        />
      </div>

      <div className="pb-4 w-full px-3">
        <Button type="submit" variant="unstyled" className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]" loading={loading || uploading}>
          <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
        </Button>
      </div>
    </form>
  );
};
