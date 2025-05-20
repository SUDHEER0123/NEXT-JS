'use client';

import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { DropSelectFile, useFileBase64 } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import React, { useEffect } from "react";
import { DateValue } from "@mantine/dates";
import { Slideover } from "@/components/Slideover/Slideover";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { TxtInput } from "@/components/ui/TxtInput/text-input";
import { CreateDocumentPayload, IContact, IVehicle } from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAppDataStore } from "@/app/app.store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';
interface IRegisterVehicle extends DrawerProps {
  vehicleData: IVehicle
}
const schema = z.object({
  registrationDate: z.date({ required_error: "Registration date is required" }),
  registrationOdometer: z.number().min(0, "Odometer reading must be positive"),
  licensePlate: z.string().min(1, "License plate is required"),
  registrationDoc: z.object({
    date: z.date(),
    file: z.instanceof(File),
    name: z.string(),
  })
});
type RegisterVehicleFormData = z.infer<typeof schema>;
export const RegisterVehicle: React.FC<IRegisterVehicle> = ({ opened, onClose, vehicleData }) => {
  const [registrationDate, setRegistrationDate] = React.useState<DateValue>();
  const { modelTypes } = useAppDataStore()
 const queryClient = useQueryClient();
  const { control, handleSubmit, setValue, reset } = useForm<RegisterVehicleFormData>({
    resolver: zodResolver(schema),
  });


  useEffect(() => {
      if(vehicleData.registrationDate) setValue('registrationDate', new Date(vehicleData.registrationDate));
       if(vehicleData.licensePlate)  setValue('licensePlate', vehicleData.licensePlate)
     if(vehicleData.registrationOdometer) setValue('registrationOdometer', vehicleData.registrationOdometer)
  }, [vehicleData,opened])
useEffect(() => {
  if (opened && vehicleData) {
    reset({
      registrationDate: vehicleData.registrationDate
        ? new Date(vehicleData.registrationDate)
        : undefined,
      licensePlate: vehicleData.licensePlate || '',
      registrationOdometer: vehicleData.registrationOdometer || 0,
      registrationDoc: undefined,
    });
  }
}, [vehicleData, opened, reset]);


  const { data: contactData, isLoading: isLoadingContact, error: errorGettingContact } = useQuery({
    queryKey: ['contact', vehicleData?.contactUid],
    queryFn: () =>
      api.get(`/contact/${vehicleData?.contactUid}`).then((res) => res.data as IContact),
    enabled: !!vehicleData?.contactUid,
  });

  function getDisplayNameByUid(uid: string | undefined): string | undefined {
    if (uid === undefined) return '--'
    const found = modelTypes && modelTypes.find(model => model.uid === uid);
    return found?.displayName;
  }
  const { mutateAsync: createDocument, isPending: isCreatingDocument } = useMutation({
    mutationKey: ['createDocument'],
    mutationFn: (data: CreateDocumentPayload) =>
      api.post(`/file-manager/documents`, data),
    onError(error) {
      console.error("Error creating document:", error);
      toast.error('Error uploading document');
    },
  });

  const { mutate: updateVehicle, isPending: isUpdatingVehicle } = useMutation({
    mutationKey: ['updateVehicle'],
    mutationFn: (data: IVehicle) => api.put(`/vehicle`, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle updated successfully.');
      reset();
      onClose();
    },
    onError(error) {
      console.error("Error Updating Vehicle Details:", error);
      toast.error('Error Updating Vehicle Details');
    }
  });

  const { convertToBase64 } = useFileBase64();
  const onSubmit = async (data: RegisterVehicleFormData) => {
    try {
      const file = data.registrationDoc.file;
      const base64 = await convertToBase64(file);
      const base64FileData = base64?.split(',')[1] ?? '';
      const documentResponse = await createDocument({
        base64FileData,
        vehicleUid: vehicleData.uid,
        vin: vehicleData.vinNumber,
        modelTypeUid: vehicleData.modelTypeUid,
        displayName: "Vehicle Register Document",
        name: file.name,
        description: "Vehicle Document",
        mimeType: file.type,
        type: "vehicle",
        status: "active"
      });

      const documentUrl = documentResponse?.data?.url;
      if (!documentUrl) throw new Error("Failed to get document URL");
      const updatedVehicle: IVehicle = {
        ...vehicleData,
        registrationDate: data.registrationDate.toISOString(),
        registrationOdometer: data.registrationOdometer,
        licensePlate: data.licensePlate,
        registrationDocument: documentUrl,
      };
      updateVehicle(updatedVehicle);

    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed");
    }
  };

  return (
    <Slideover
      title="Register Vehicle"
      open={opened}
      onClose={onClose}
      footer={
        <div className="flex w-full overflow-y-hidden">
          <Button className="w-[250px] h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={onClose}>
            <p className="text-neutrals-background-default text-base">
              Cancel
            </p>
          </Button>
          <Button
            className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
            onClick={handleSubmit(onSubmit)}
            variant="transparent"
            disabled={isCreatingDocument}
            loading={isCreatingDocument}
          >
            <p className="text-neutrals-background-default text-base">
              Confirm
            </p>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-y-4 w-full h-full">
        <div className="flex flex-col gap-y-4 grow overflow-y-auto overflow-x-hidden h-full p-2">
          <div className="flex flex-row bg-neutrals-background-surface h-auto w-full items-center gap-x-4 px-2">
            <Image src={vehicleData?.heroImage ?? "/images/car-01.svg"} width={184} height={123} alt="car" />
            <div className="flex flex-col gap-y-3 w-full">
              <p className="text-lg font-medium text-neutrals-high">{getDisplayNameByUid(vehicleData?.modelTypeUid)}</p>
              <div className="w-full flex flex-row gap-x-2">

                <div className="flex flex-col text-[12px] text-nowrap leading-[18px] font-normal text-neutrals-high">
                  <p>Customer Name:</p>
                  <p>VIN: </p>
                </div>
                <div className="flex flex-col text-[12px] text-nowrap leading-[18px] font-normal text-neutrals-medium">
                  <p>{contactData?.fullNameEN}</p>
                  <p>{vehicleData?.vinNumber ?? '--'}</p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} >
            <DrawerCard title="Additional Vehicle Details" icon="car-02">
              <div className="flex flex-col gap-y-4">
                <Controller
                  name="registrationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Registration Date"
                      target={
                        <div className="flex justify-between cursor-pointer border-b pb-2">
                          <span className="text-neutrals-high body_small_regular">Registration Date</span>
                          <Image src="/icons/calendar-04.svg" width={24} height={24} alt="calendar" />
                        </div>
                      }
                      withIcon
                      withBorder
                      inForm
                      type="default"
                    />
                  )}
                />

                <Controller
                  name="registrationOdometer"
                  control={control}
                  render={({ field }) => (
                    <NumInput
                      placeholder="Odometer Reading"
                      value={field.value}
                      onChange={field.onChange}
                      rightSection={<p className="text-neutrals-medium caption_regular">Km</p>}
                    />
                  )}
                />
                <Controller
                  name="licensePlate"
                  control={control}
                  render={({ field }) => (
                    <TxtInput
                      placeholder="License Plate"
                      {...field}
                    />
                  )}
                />
              </div>
            </DrawerCard>

            <DrawerCard title="Upload Registration Document" icon="file-attachment" childrenClassName="!pt-0">
              <Controller
                name="registrationDoc"
                control={control}
                render={({ field }) => (
                  <DropSelectFile
                    subtitle="Upload or drag and drop registration document here"
                    value={field.value ? [field.value] : []}
                    onChange={(files) => field.onChange(files?.[0])}
                    hideViewIcon={true}
                  />
                )}
              />
            </DrawerCard>
          </form>
        </div>
      </div>
    </Slideover>
  );
};

export const useRegisterVehicle = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <RegisterVehicle opened={opened} onClose={close} {...props} vehicleData={props.vehicleData} />
  );

  return { opened, open, close, drawerRef };
};