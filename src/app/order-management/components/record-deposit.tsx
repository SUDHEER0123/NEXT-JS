'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps, FileInput } from "@mantine/core";
import { NumInput } from "./num-input";
import { TxtInput } from "./text-input";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { IContact, IContract, IOrder, IVehicle } from '@/app/types';
import { useAppDataStore } from "@/app/app.store";

interface IRecordDeposit extends DrawerProps {
  order: IOrder;
  vehicle?: IVehicle;
  contact?: IContact;
  contract?: IContract;
}

export const RecordDeposit: React.FC<IRecordDeposit> = ({ opened, onClose, order, vehicle, contact, contract }) => {
  const { modelTypeUid } = vehicle ?? {};
  const { lastName, firstName } = contact ?? {};
  const { contractNumber, value } = contract ?? {};
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
          <div className="flex flex-row bg-neutrals-background-surface p-2 h-auto w-full">
            <Image src="/images/car-01.svg" width={184} height={123} alt="car" />
            <div className="flex flex-col gap-y-3 w-full">
              <p className="text-lg font-medium text-neutrals-high">{displayName ?? ''}</p>
              <div className="flex flex-row gap-x-6">
                <div className="flex flex-col text-[12px] leading-[18px] font-normal text-neutrals-high">
                  <p>Name:</p>
                  <p>Order No:</p>
                  <p>Contract No:</p>
                  <p>Invoice Value:</p>
                </div>
                <div className="flex flex-col text-[12px] leading-[18px] font-normal text-neutrals-medium">
                  <p>{`${firstName} ${lastName}`}</p>
                  <p>{order?.uid}</p>
                  <p>{contractNumber}</p>
                  <p>{value}</p>
                </div>
              </div>
            </div>
          </div>
          <DrawerCard title="Additional Details" icon="license-draft">
            <div className="flex flex-col gap-y-4">
              <NumInput
                placeholder="Deposit Amount"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
              />
              <TxtInput
                placeholder="Date of Deposit Taken"
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

export const useRecordDeposit = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <RecordDeposit opened={opened} onClose={close} {...props} />
  );

  return { opened, open, close, drawerRef };
};