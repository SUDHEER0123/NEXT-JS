'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, DrawerProps, Group, ScrollAreaAutosize } from "@mantine/core";
import { NumInput } from "./num-input";
import { TxtInput } from "./text-input";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { IContact, IContract, IOrder, IUser, IVehicle } from '@/app/types';
import { formatNumberWithCommas } from "@/utils/common";
import { useAppDataStore } from "@/app/app.store";

interface IRecordPayment extends DrawerProps {
  order: IOrder;
  vehicle?: IVehicle;
  contract?: IContract;
  contact?: IContact;
  salesConsultant?: IUser;
}

export const RecordPayment: React.FC<IRecordPayment> = ({ opened, onClose, order, vehicle, contract, contact, salesConsultant }) => {
  const { modelTypeUid } = vehicle ?? {};
  const { lastName, firstName } = contact ?? {};
  const { contractNumber, value } = contract ?? {};
  const { depositPrice } = order ?? {};
  const { modelTypes } = useAppDataStore();
  
  const { 
    displayName,
    line
  } = modelTypes?.find(m => m.uid === modelTypeUid) ?? {}

  return (
    <Drawer
      title="Deposit Taken"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4 grow p-4 overflow-y-auto">
          <DrawerCard title="Contract Details" icon="contracts-02">
            <div className="flex flex-col gap-y-4 pb-2">
              <div className="flex flex-row space-x-1">
                <Image src="/icons/car-02.svg" width={20} height={20} alt="car" />
                <p className="text-sm text-neutrals-high font-medium">Vehicle: </p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <Image src="/images/car-03.svg" width={102} height={68} alt="car" />
                <p className="text-sm font-normal text-neutrals-high">{displayName}</p>
              </div>
              <Divider />
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/contracts-02.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Contract Number</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{contractNumber}</p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2 justify-between">
                <div className="flex flex-row space-x-2">
                  <Image src="/icons/contracts-02.svg" width={20} height={20} alt="car" />
                  <p className="text-sm font-medium text-neutrals-high">Assigned Sales Consultant</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-neutrals-high">{`${salesConsultant?.firstName} ${salesConsultant?.lastName}`}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex flex-row items-center space-x-2 justify-between">
                  <div className="flex flex-row space-x-2">
                    <Image src="/icons/invoice-04.svg" width={20} height={20} alt="car" />
                    <p className="text-sm font-medium text-neutrals-high">Contract Value</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-neutrals-high">{formatNumberWithCommas(value)}</p>
                  </div>
                </div>  
                <div className="flex flex-row items-center space-x-2 justify-between">
                  <div className="flex flex-row space-x-2 ml-[1.7rem]">
                    <p className="text-sm font-medium text-neutrals-high">Open Balance</p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-neutrals-high">{formatNumberWithCommas((value || 0) - depositPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          </DrawerCard>
          <ScrollAreaAutosize maw="auto" classNames={{ thumb: "!bg-brand-primary" }}>
            <div className="flex flex-row gap-x-2">
              <div className="flex flex-col border-l-2 border-l-brand-primary pl-3 py-3 pr-16 bg-white border shadow-subtle-shadow2 border-neutrals-low min-w-[170px]">
                <p className="font-medium text-[12px] leading-[18px] tracking-[0.02em]">{formatNumberWithCommas(10000000)}</p>
                <p className="font-normal text-xxs text-neutrals-medium">Thu, 21 Nov 2024</p>
              </div>
              <div className="flex flex-col border-l-2 border-l-brand-primary pl-3 py-3 pr-16 bg-white border shadow-subtle-shadow2 border-neutrals-low min-w-[175px]">
                <p className="font-medium text-[12px] leading-[18px] tracking-[0.02em]">{formatNumberWithCommas(10000000)}</p>
                <p className="font-normal text-xxs text-neutrals-medium">Thu, 21 Nov 2024</p>
              </div>
              <div className="flex flex-col border-l-2 border-l-brand-primary pl-3 py-3 pr-16 bg-white border shadow-subtle-shadow2 border-neutrals-low min-w-[175px]">
                <p className="font-medium text-[12px] leading-[18px] tracking-[0.02em]">{formatNumberWithCommas(10000000)}</p>
                <p className="font-normal text-xxs text-neutrals-medium">Thu, 21 Nov 2024</p>
              </div>
            </div>
          </ScrollAreaAutosize>
          <DrawerCard title="Add Payment" icon="money-receive-03">
            <div className="flex flex-col gap-y-4">
              <NumInput
                placeholder="Deposit"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
              />
              <TxtInput
                placeholder="Payment Date"
              />
            </div>
          </DrawerCard>
          <DrawerCard title="Upload Receipt" icon="file-attachment" childrenClassName="!pt-0">
            <DropSelectFile subtitle="Upload or drag and drop receipt here" />
          </DrawerCard>
        </div>
        <div>
        <div className="flex sticky">
          <Button className="w-[250px] h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={onClose}>
            <p className="text-neutrals-background-default text-base">
              Cancel
            </p>
          </Button>
            <Button
              className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
              onClick={onClose}
              variant="transparent"
            >
              <p className="text-neutrals-background-default text-base">
                Confirm
              </p>
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export const useRecordPayment = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <RecordPayment opened={opened} onClose={close} {...props} />
  );

  return { opened, open, close, drawerRef };
};