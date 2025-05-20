'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "../../order-management/components/drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { Contract, IContract } from "@/app/types";
import { Slideover } from "@/components/Slideover/Slideover";
import Image from "next/image";
import { Contracts02Icon, ContractsIcon, FileIcon, InvoiceIcon, MentoringIcon, Money03Icon } from "@/assets/icons";
import { formatNumberWithCommas } from "@/utils/common";

interface IManageContracts extends UseManageContractsProps, DrawerProps {
}

interface UseManageContractsProps {
  contract?: IContract;
}

export const ManageContracts: React.FC<IManageContracts> = ({ opened, onClose }) => {
  return (
    <Slideover
      title="Manage Customer Contracts"
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
              onClose();
            }}
            variant="transparent"
          >
            <p className="text-neutrals-background-default text-base">
              Confirm
            </p>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-y-4 h-full">
        <div className="flex flex-col gap-y-4 grow px-1 py-3 overflow-y-auto">
          <DrawerCard title="Order Details" icon="contracts-02">
            <div className="flex flex-col gap-y-4 items-start">
              <div className="flex gap-x-1">
                <Image src="/icons/car-02.svg" width={20} height={20} alt="car-02" />
                <p className="body_small_semibold text-neutrals-high">Vehicle</p>
                <div className="absolute top-16 right-10">
                  <Image src="/images/car-03.svg" width={150} height={100} alt="car" />
                </div>
              </div>
              <div className="flex flex-col gap-y-1 items-start w-full">
                <p className="body_large_semibold text-neutrals-high">DBS 770 Ultimate Coupe</p>
                <div className="h-[0.5px] w-full bg-neutrals-low mt-12" />
              </div>
              <div className="flex flex-col gap-y-4 w-full">
                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <FileIcon width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Order Number</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">32433</p>
                </div>

                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <ContractsIcon  width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Contract Number</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">1234</p>
                </div>

                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <Money03Icon width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Open Balance</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">{formatNumberWithCommas(10000000)}</p>
                </div>
              </div>
            </div>
          </DrawerCard>
          <DrawerCard title="Contract Documents" icon="invoice-04">
            <div className="flex flex-col gap-y-2">
              <p className="body_small_semibold text-neutrals-high">Digital Contract</p>
              <div className="flex gap-x-12 bg-neutrals-background-shading p-4 items-center">
                <Image src="/images/digital-contract.svg" width={200} height={84} alt="digital-contract" />
                <Button
                  className="bg-brand-primary hover:bg-brand-primary text-neutrals-background-default hover:text-neutrals-background-default rounded-none py-2.5 px-4 h-full"
                  variant="unstyled"
                >
                  <p className="caption_semibold">View Contract</p>
                </Button>
              </div>
              <div className="pt-2">
                <DropSelectFile
                  subtitle="Upload or drag and drop your Physical Contract here"
                  customImage="/images/invoice-03.svg"
                  label="Physical Contract"
                />
              </div>
            </div>
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useManageContracts = (props: UseManageContractsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <ManageContracts opened={opened} onClose={close} contract={props.contract} />
  );

  return { opened, open, close, drawerRef };
};