'use client';

import { ImageIcon } from "@/assets/icons";
import { Slideover } from "@/components/Slideover/Slideover";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { DrawerCard } from "@/components/ui/drawer-card";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { Select } from "@/components/ui/Select/Select";
import api from "@/lib/api";
import { Button, DrawerProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface IAddInventoryVehicle extends DrawerProps {
}

interface StockVehicle {
  id: string;
  value: string;
  vin: string;
  vehicleImage: string;
  exteriorColor: string;
  interiorColor: string;
  vehicleStatus: string;
  location: string;
  icon: React.ReactNode;
  orderStatus?: 'Order Placed' | 'Order Contracted' | 'Order in Production' | 'Order in Transit' | 'Order Arrived' | 'Order Cleared Customs' | 'Order Delivered to Stock' | 'Order Delivered to Dealer' | 'Order Delivered to Customer';
}


interface FormData {
  intakeDate: undefined | Date;
  intakeOdometer: null | number;
  images: {
    description: string;
    mimeType: string;
    name: string;
    status: string;
    type: string;
    url: string;
    createdAt: string;
  }[];
}

export interface IAddVehicle {
  images: {
    imageUrl: string;
    thumbnailImageUrl: string;
  }[];
  intakeDate: string; 
  heroImage: string;
  intakeOdometer: number;
  vinNumber: string;
  locationUid: string
}

const stockVehicles: StockVehicle[] = [{
  id: 'db-12-coupe',
  value: 'DB12 Coupe',
  vin: 'WP0AD2Y13NSA59933',
  vehicleImage: 'db12-coupe',
  exteriorColor: 'Green',
  interiorColor: 'Black',
  vehicleStatus: 'Reserved',
  location: 'Aston Martin Seoul',
  icon: (
    <Image
      src={`/images/db12-coupe.svg`}
      width={60}
      height={40}
      alt={`db-12-coupe`}
    />
  )
},{
  id: 'db-12-volante',
  value: 'DB12 Volante',
  vin: 'WP0AD2Y13NSA59933',
  vehicleImage: 'db12-volante',
  exteriorColor: 'Black',
  interiorColor: 'Black',
  vehicleStatus: 'Reserved',
  location: 'Aston Martin Seoul',
  icon: (
    <Image
      src={`/images/db12-coupe.svg`}
      width={60}
      height={40}
      alt={`db-12-coupe`}
    />
  )
},{
  id: 'vantage',
  value: 'Vantage',
  vin: 'WP0AD2Y13NSA59933',
  vehicleImage: 'vantage',
  exteriorColor: 'Yellow',
  interiorColor: 'Black',
  vehicleStatus: 'Reserved',
  location: 'Aston Martin Seoul',
  icon: (
    <Image
      src={`/images/db12-coupe.svg`}
      width={60}
      height={40}
      alt={`db-12-coupe`}
    />
  )
}]


export const AddInventoryVehicle: React.FC<IAddInventoryVehicle> = ({ opened, onClose }) => {
  const [selectedVehicle, setSelectedVehicle] = React.useState<StockVehicle>();
  const [search, setSearch] = useState<string>('');
  const initialFormData: FormData = {intakeDate: undefined, intakeOdometer: null, images:[]}
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  const stockVehicleList = stockVehicles.map(stockVehicle => (
    {
      value: stockVehicle.value,
      label: (
        <div className="flex flex-col">
          <span className="caption_regular text-neutrals-high">{stockVehicle.value}</span>
          <div className="flex flex-row gap-x-1">
            <span className="caption_small_regular text-neutrals-high">VIN:</span>
            <span className="caption_small_regular text-neutrals-medium">{stockVehicle.vin}</span>
          </div>
        </div>
      ),
      extraRightSection: (
        <div className="flex flex-row gap-x-1 items-center bg-indications-bg_success_soft rounded-full py-1 px-2">
          <Image src="/icons/agreement-brand-primary.svg" width={14} height={14} alt="agreement" />
          <p className="caption_small_semibold text-brand-primary">{stockVehicle.vehicleStatus}</p>
        </div>
      ),
      icon: (
        <Image
          src={`/images/${stockVehicle.vehicleImage}.svg`}
          width={60}
          height={40}
          alt={`${stockVehicle.id}`}
        />
      ),
      data: {
        exteriorColor: stockVehicle.exteriorColor,
        interiorColor: stockVehicle.interiorColor,
        vin: stockVehicle.vin,
        location: stockVehicle.location
      }
    }
  ));

  const filteredStockVehicles = stockVehicleList.filter(stockVehicle => 
    stockVehicle.value.toLowerCase().includes(search.toLowerCase()) ||
    stockVehicle.data?.vin?.toLowerCase().includes(search.toLowerCase())
  );

  const availablePDIImages = [
    '/images/stock-car-01.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
    '/images/car-pic.svg',
  ];

   const { mutate: addVehicle, isPending: isAddingVehicle } = useMutation({
     mutationFn: (data: IAddVehicle) => api.post(`/vehicle`, data),
     onMutate() {},
     onSuccess(data, variables, context) {
       toast.success("Vehicle added successfully");
       onClose();
       setFormData({ ...initialFormData });
     },
     onError(error) {
       console.error("Error adding Vehicle:", error);
       toast.error("Error in adding Vehicle");
     },
   });

   const onConfirm = (data: any) => {
     const { intakeDate, intakeOdometer, images } = data;
     if (!selectedVehicle) {
       toast.error("Please select a vehicle");
       return;
     }
     if (!intakeDate) {
       toast.error("Please select a date of intake");
       return;
     }
     if (!intakeOdometer) {
       toast.error("Please enter a valid odometer reading");
       return;
     }
     if (!images || images.length === 0) {
       toast.error("Please upload at least one image");
       return;
     }
     addVehicle({
       images: images.map((image: any) => ({ imageUrl: image.url })),
       intakeDate,
       heroImage: images[0],
       intakeOdometer,
       vinNumber: selectedVehicle.vin,
       locationUid: selectedVehicle.location,
     });
   };

   const { mutate: uploadImage, isPending: isUploadingImage } = useMutation({
     mutationFn: (data: {
       base64FileData: string;
       mimeType: string;
       type: string;
       status: string;
       name: string;
       description: string;
     }) => api.post(`/file-manager/image`, data),
     onMutate() {},
     onSuccess(response, variables, context) {
       const images = formData.images || [];
       images.push({
         ...variables,
         createdAt: new Date().toDateString(),
         url: response.data,
       });
       formData.images = images;
       setFormData({ ...formData });
     },
     onError(error, variables, context) {
       console.error("Error uploading image:", error);
       toast.error("Error in uploading vehicle image");
     },
   });

  return (
    <Slideover
      title="Add Vehicle to Inventory"
      open={opened}
      onClose={onClose}
      footer={
        <div className="flex w-full overflow-y-hidden">
          <Button
            className="w-[250px] h-auto !bg-neutrals-high rounded-none p-6 font-medium"
            onClick={onClose}
          >
            <p className="text-neutrals-background-default text-base">Cancel</p>
          </Button>
          <Button
            className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
            onClick={() => {
              onConfirm(formData);
            }}
            variant="transparent"
            loading={isAddingVehicle || isUploadingImage}
          >
            <p className="text-neutrals-background-default text-base">
              Confirm
            </p>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-y-4 w-full h-full">
        <div className="flex flex-col gap-y-4 grow overflow-y-auto overflow-x-hidden h-full p-2 mt-2 mb-12">
          <DrawerCard title="Vehicle Details" icon="license-draft">
            <div className="flex flex-col gap-y-4">
              <Select
                placeholder="Search for Stock Purchase Orders"
                key="Stock Vehicle"
                hoverplaceholder="Search for Vehicle by VIN"
                showIconWhenClosed={false}
                items={filteredStockVehicles}
                withOptionsDivider
                placeholderClassName="text-neutrals-high"
                onOptionSubmit={(val) => {
                  setSelectedVehicle(
                    stockVehicles?.find((s) => s.value === val)
                  );
                }}
                onSearch={(val) => setSearch(val)}
                searchable
                value={selectedVehicle?.value}
              />
              {selectedVehicle && (
                <div className="flex flex gap-x-4 bg-gradient-7 p-4 relative">
                  <Image
                    src={`/images/${selectedVehicle?.vehicleImage}.svg`}
                    width={127}
                    height={70}
                    alt={`${selectedVehicle?.id}`}
                  />
                  <div className="absolute bottom-0 right-0">
                    <Image
                      src="/images/pattern-stock-vehicle.svg"
                      width={260}
                      height={158}
                      alt="pattern"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <p className="text-neutrals-high body_small_semibold">
                      {selectedVehicle?.value}
                    </p>
                    <div className="flex gap-x-8">
                      <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col">
                          <span className="caption_small_regular text-neutrals-medium">
                            Exterior Colour
                          </span>
                          <span className="caption_semibold text-neutrals-high">
                            {selectedVehicle?.exteriorColor}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="caption_small_regular text-neutrals-medium">
                            Interior Colour
                          </span>
                          <span className="caption_semibold text-neutrals-high">
                            {selectedVehicle?.interiorColor}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col">
                          <span className="caption_small_regular text-neutrals-medium">
                            VIN
                          </span>
                          <span className="caption_semibold text-neutrals-high">
                            {selectedVehicle?.vin}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="caption_small_regular text-neutrals-medium">
                            Location
                          </span>
                          <span className="caption_semibold text-neutrals-high">
                            {selectedVehicle?.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DrawerCard>
          <DrawerCard title="Stock Intake Details" icon="garage">
            <div className="flex flex-col gap-y-4">
              <DatePicker
                target={
                  <div
                    className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2"
                    onClick={() => open()}
                  >
                    <span className="text-neutrals-high body_small_regular">
                      Date of Intake
                    </span>
                    <Image
                      src="/icons/calendar-04.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />
                  </div>
                }
                placeholder="Date of Intake"
                withIcon
                withBorder
                inForm
                type="default"
                value={formData.intakeDate}
                onChange={(date) => {
                  formData.intakeDate = date as Date | undefined;
                  setFormData({ ...formData });
                }}
              />
              <NumInput
                placeholder="Odometer Reading"
                onChange={(val) => {
                  if (val && Number(val) > 0) {
                    formData.intakeOdometer = Math.abs(Number(val));
                  } else {
                    formData.intakeOdometer = 0;
                  }
                  setFormData({ ...formData });
                }}
                value={formData.intakeOdometer || ""}
                min={0}
                rightSection={
                  <p className="text-neutrals-medium caption_regular">Km</p>
                }
              />
            </div>
          </DrawerCard>
          <DrawerCard
            title="Stock Images"
            icon={
              <ImageIcon
                className="text-brand-primary"
                width={18}
                height={18}
              />
            }
          >
            <div className="flex flex-col gap-y-1">
              <p className="body_small_semibold text-neutrals-high">
                Available PDI Images
              </p>
              <div className="grid grid-cols-5 gap-3 mt-2">
                {availablePDIImages.map((image, index) => (
                  <div key={index}>
                    <Image src={image} width={72} height={72} alt="stock-car" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <DropSelectFile
                subtitle="Drag & Drop PDI Images or upload new vehicle images (up to 8 upload images)"
                imageOnly
                accept={"image/*"}
                maxUploads={8}
                supportedFormats={["jpeg", "jpg", "png"]}
                maxFileSize={"2MB"}
                filesLabel="Selected Vehicle Inventory Images"
                onChange={(files) => {
                  files.forEach((f) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const base64String = e.target?.result as string;
                      const base64FileData = base64String.replace(
                        /^data:image\/\w+;base64,/,
                        ""
                      );
                      uploadImage({
                        base64FileData,
                        mimeType: f.file.type,
                        type: "vehicle",
                        status: "active",
                        name: f.file.name,
                        description: "Vehicle image",
                      });
                    };
                    reader.readAsDataURL(f.file);
                  });
                }}
              />
              {formData.images && formData.images.length > 0 && (
                <div className="flex flex-col gap-y-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div
                      className="flex text-neutrals-medium body_small_regular items-center"
                      key={image.url}
                    >
                      <ImageIcon width={32} height={32} strokeWidth="0.7" />
                      <div className="flex flex-col ml-2">
                        <p>{image.name}</p>
                        <small>Uploaded on {image.createdAt}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useAddInventoryVehicle = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <AddInventoryVehicle opened={opened} onClose={close} {...props} />
  );

  return { opened, open, close, drawerRef };
};