'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps, FileInput } from "@mantine/core";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { Contract, IContract } from "@/app/types";

interface UseUploadInvoiceProps {
  contract?: IContract;
}

interface IUploadInvoice extends UseUploadInvoiceProps {
  opened: boolean;
  onClose: () => void;
}

export const UploadInvoice: React.FC<IUploadInvoice> = ({ opened, onClose }) => {
  return (
    <Drawer
      title="Upload Invoice"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-y-4 h-[calc(100vh-3.75rem)]">
        <div className="flex flex-col gap-y-4 grow p-4 overflow-y-auto">
          <DrawerCard title="Invoice" icon="invoice-04">
            <DropSelectFile subtitle="Upload or drag and drop invoice here" />
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

export const useUploadInvoice = (props: UseUploadInvoiceProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <UploadInvoice opened={opened} onClose={close} contract={props.contract} />
  );

  return { opened, open, close, drawerRef };
};