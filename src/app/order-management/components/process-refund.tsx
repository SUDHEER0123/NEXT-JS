'use client';

import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { OrderDetails } from "./order-details";
import { Slideover } from "@/components/Slideover/Slideover";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { IOrder } from "@/app/types";
import { useOrdersStore } from "../store/orders.store";

interface IProcessRefund extends DrawerProps {
}

export const ProcessRefund: React.FC<IProcessRefund> = ({ opened, onClose }) => {
  const { selectedOrder } = useOrdersStore();

  return (
    <Slideover
      title="Process Refund"
      open={opened}
      onClose={onClose}
      footer={
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
      }
    >
      <div className="flex flex-col gap-y-4 px-1 py-4">
        <div className="flex flex-col gap-y-4 grow overflow-y-auto">
          <OrderDetails orderData={selectedOrder} type={selectedOrder.type} hideRefund={true} />
          <DrawerCard title="Refund Details" icon="money-exchange-02">
            <div className="flex flex-col gap-y-4">
              <DatePicker
                target={(
                  <div className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2" onClick={() => open()}>
                    <span className="text-neutrals-high font-normal text-[12px] leading-[18px]">
                      Refund Date
                    </span>
                    <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
                  </div>
                )}
                placeholder="Refund Date"
                withIcon
                withBorder
                inForm
                type="default"
              />
              <NumInput
                placeholder="Refund Amount"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
              />
              <DropSelectFile title="Upload Refund Receipt" subtitle="Upload or drag and drop receipt here" />
            </div>
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useProcessRefund = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <ProcessRefund opened={opened} onClose={close} {...props} />
  );

  return { opened, open, close, drawerRef };
};