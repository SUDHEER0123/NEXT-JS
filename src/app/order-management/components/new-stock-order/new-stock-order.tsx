'use client';

import { useAppDataStore } from '@/app/app.store';
import { CreateDocumentPayload, CreateDocumentResponse, IOrderView } from '@/app/types';
import { FileIcon } from '@/assets/icons';
import { Slideover } from '@/components/Slideover/Slideover';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { DropSelectFile } from '@/components/ui/Dropfile/Dropfile';
import Input from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import WideInput from '@/components/ui/WideInput/WideInput';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { ActionIcon, Button, DrawerProps, Progress } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { DrawerCard } from '../drawer-card';
import { formatDate } from '@/utils/dateFormatter';

interface INewStockOrder extends UseNewStockOrderProps, DrawerProps {}
interface UseNewStockOrderProps {
  onClose: () => void;
}
export const NewStockOrder: React.FC<INewStockOrder> = ({ opened, onClose }) => {
  const [location, setLocation] = useState<string>();
  const [modelType, setModelType] = useState<string>();
  const [modelLine, setModelLine] = useState<string>();
  const [exteriorColor, setExteriorColor] = useState<string>();
  const [interiorColor, setInteriorColor] = useState<string>();
  const [configuratorCode, setConfiguratorCode] = useState<string>();
  const [configuratorDocument, setConfiguratorDocument] = useState<CreateDocumentResponse | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<any>(null);
  const [estimatedDeliveryDateValue, setEstimatedDeliveryDateValue] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>();

  const { user } = useAuth();

  const { modelTypes, locations } = useAppDataStore();

  const { refetch } = useQuery({
    queryKey: ['orderViews'],
    queryFn: () => api.get('/order/view').then(res => res.data as IOrderView[]),
  });

  const locationsOptions = useMemo(() => {
    return Array.from(
      new Set(
        locations?.map(({ name, uid }) => ({
          label: name,
          value: uid,
        }))
      )
    );
  }, [locations]);

  const modelTypeOptions = useMemo(() => {
    return Array.from(
      new Set(
        modelTypes?.map(({ displayName, uid }) => ({
          label: displayName,
          value: uid,
        }))
      )
    );
  }, [modelTypes]);

  const modelLineOptions = useMemo(() => {
    if (!modelType) return [];
    return Array.from(
      new Set(
        modelTypes
          ?.filter(m => m.uid === modelType)
          .map(({ line }) => ({
            label: line,
            value: line,
          }))
      )
    );
  }, [modelType, modelTypes]);

  const extColorOptions = useMemo(() => {
    if (!modelType || !modelLine) return [];
    return Array.from(
      new Set(
        modelTypes
          ?.find(m => m.uid === modelType && m.line === modelLine)
          ?.extColor?.map(({ color, hexCode }) => ({
            label: color,
            value: color,
          }))
      )
    );
  }, [modelType, modelTypes, modelLine]);

  const intColorOptions = useMemo(() => {
    if (!modelType || !modelLine) return [];
    return Array.from(
      new Set(
        modelTypes
          ?.find(m => m.uid === modelType && m.line === modelLine)
          ?.intColor?.map(({ color, hexCode }) => ({
            label: color,
            value: color,
          }))
      )
    );
  }, [modelType, modelTypes, modelLine]);

  const { mutate: createDocument, isPending: isCreatingDocument } = useMutation({
    mutationFn: (data: CreateDocumentPayload) => api.post(`/file-manager/documents`, data),
    onMutate() {},
    onSuccess(data, variables, context) {
      setConfiguratorDocument(data?.data as CreateDocumentResponse);
    },
    onError(error, variables, context) {
      console.error('Error creating document:', error);
      toast.error('Error uploading document');
    },
  });

  const { mutate: stockOrder, isPending: isCreatingStockOrder } = useMutation({
    mutationFn: (data: any) => api.post(`/convert/to-stock-order`, data),
    onMutate() {},
    onSuccess(data, variables, context) {
      refetch();
      onClose();
    },
    onError(error, variables, context) {
      console.error('Error creating stock order:', error);
      toast.error('Error in creating stock order');
    },
  });

  const handleSubmit = () => {
    if (!location || !modelType || !modelLine || !exteriorColor || !interiorColor || !estimatedDeliveryDateValue) {
      toast.error('Please fill all the required fields');
      return;
    }

    if (!configuratorDocument?.url) {
      toast.error('Please upload the configurator document');
      return;
    }

    const payload = {
      stock: {
        configuratorCode,
        locationUid: location,
        configuratorDocumentUid: configuratorDocument?.url,
        testDriveVehicle: false,
        inventoryFinanced: false,
      },
      orderTracker: {
        vehicleStatus: 'Order Standby',
        changedByUserUid: user?.uid,
        orderStatus: 'Order Placed & Contracted',
      },
      modelTypeUid: modelType,
      intColor: modelTypes?.find(m => m.uid === modelType)?.intColor?.find(i => i.color === interiorColor),
      extColor: modelTypes?.find(m => m.uid === modelType)?.extColor?.find(i => i.color === exteriorColor),
      locationUid: location,
      type: 'Stock Order',
      orderNumber: selectedOrder,
      placedDate: new Date().toISOString(),
      estimatedDeliveryDate: estimatedDeliveryDateValue?.toISOString(),
    };

    stockOrder(payload);
  };

  return (
    <Slideover
      title="New Stock Order"
      open={opened}
      onClose={onClose}
      footer={
        <div className="flex w-full overflow-y-hidden">
          <Button className="w-[250px] h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={onClose}>
            <p className="text-neutrals-background-default text-base">Cancel</p>
          </Button>
          <Button
            className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
            onClick={() => {
              handleSubmit();
            }}
            variant="transparent"
          >
            <p className="text-neutrals-background-default text-base">Confirm</p>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-y-4 h-full">
        <div className="flex flex-col gap-y-4 grow p-4">
          <DrawerCard title="Order Details" icon="user">
            <div className="flex flex-col gap-y-4">
              <Select
                showLabel
                placeholder="Location"
                hoverplaceholder="Find and select Location"
                items={locationsOptions}
                searchable
                withOptionsDivider
                value={location}
                onOptionSubmit={value => setLocation(value)}
              />
            </div>
            <div className="flex flex-col gap-y-4 mt-2">
              <Input
                className={`h-12 text-black border-0 border-b text bg-transparent focus:outline-none focus:none `}
                placeholder="Enter order number"
                value={selectedOrder}
                onChange={e => setSelectedOrder(e.currentTarget.value)}
              />
            </div>
          </DrawerCard>
          <DrawerCard title="Car Configuration" icon="car-02">
            <p className="text-neutrals-high text-base font-normal tracking-[0.01em]">Please enter vehicle configurator 10 digits code</p>
            <WideInput className="!text-neutrals-high w-full" length={10} onValueChange={value => setConfiguratorCode(value?.join(''))} />
            <div className="pt-4">
              <DropSelectFile
                subtitle="Upload or drag and drop your Car Configurator Document"
                maxUploads={1}
                onChange={files => {
                  files.forEach(f => {
                    const reader = new FileReader();
                    reader.onload = e => {
                      const base64String = e.target?.result as string;
                      let base64FileData = base64String.replace(/^data:application\/\w+;base64,/, '');
                      base64FileData = base64FileData.replace(/^data:image\/\w+;base64,/, '');
                      createDocument({
                        base64FileData,
                        mimeType: f.file.type,
                        type: 'contract',
                        status: 'active',
                        name: f.file.name,
                        description: 'Car Configurator Document',
                      });
                      setUploadingFiles({
                        mimeType: f.file.type,
                        name: f.file.name,
                        uploadedOn: new Date().toISOString(),
                      });
                    };
                    reader.readAsDataURL(f.file);
                  });
                }}
              />
            </div>
            {uploadingFiles && (
              <div className="flex flex-col gap-y-2 mt-4">
                <div className="flex text-neutrals-medium body_small_regular items-center">
                  <FileIcon className="m-2" width={16} height={16} strokeWidth="0.7" />
                  <div className="flex flex-col ml-2 w-full text-neutrals-high">
                    <p>{uploadingFiles?.name}</p>
                    {isCreatingDocument ? (
                      <Progress className="my-2" size="sm" value={100} striped animated />
                    ) : (
                      <div className='caption_small_regular text-neutrals-medium mt-3"'>Uploaded on {formatDate(uploadingFiles.uploadedOn)}</div>
                    )}
                  </div>
                  {!isCreatingDocument && (
                    <ActionIcon
                      variant="transparent"
                      className="!p-0 !m-0"
                      onClick={() => {
                        setConfiguratorDocument(null);
                        setUploadingFiles(null);
                      }}
                    >
                      <Image src="/icons/delete-03.svg" width={16} height={16} alt="delete" />
                    </ActionIcon>
                  )}
                </div>
              </div>
            )}
          </DrawerCard>
          <DrawerCard title="Vehicle Details" icon="car-02">
            <div className="flex flex-col gap-y-4">
              <Select showLabel placeholder="Model Type" withOptionsDivider items={modelTypeOptions} value={modelType} onOptionSubmit={value => setModelType(value)} searchable />
              <Select showLabel placeholder="Model Line" withOptionsDivider items={modelLineOptions} value={modelLine} onOptionSubmit={value => setModelLine(value)} searchable />
              <Select showLabel placeholder="Exterior Color" items={extColorOptions} withOptionsDivider value={exteriorColor} onOptionSubmit={value => setExteriorColor(value)} searchable />
              <Select showLabel placeholder="Interior Color" items={intColorOptions} withOptionsDivider value={interiorColor} onOptionSubmit={value => setInteriorColor(value)} searchable />
              <DatePicker
                target={
                  <div className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2" onClick={() => open()}>
                    <span className="text-neutrals-high font-normal text-[12px] leading-[18px]">Estimated Delivery Date</span>
                    <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
                  </div>
                }
                placeholder="Estimated Delivery Date"
                withIcon
                withBorder
                inForm
                value={estimatedDeliveryDateValue}
                onChange={date => setEstimatedDeliveryDateValue(date as DateValue)}
              />
            </div>
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useNewStockOrder = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = <NewStockOrder opened={opened} onClose={close} />;

  return { opened, open, close, drawerRef };
};
