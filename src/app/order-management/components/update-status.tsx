'use client';

import { ActionIcon, Button, Group, Popover, Text } from "@mantine/core"
import { IOrder } from '@/app/types';
import { DrawerCard } from "./drawer-card";
import { TxtInput } from "./text-input";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import { Select } from "@/components/ui/Select/Select";
import { CONTRACT_STATUSES, ORDER_STATUSES, VEHICLE_STATUSES } from "@/utils/common";

interface IUpdateStatus {
  order: IOrder;
}

export const UpdateStatusPopover: React.FC<IUpdateStatus> = () => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover width={400} position="top" withArrow shadow="md" trapFocus classNames={{ dropdown: 'p-0'}} closeOnClickOutside={false} opened={opened}>
      <Popover.Target>
        <Button
          className="bg-brand-primary text-white py-[14px] px-[22px] h-full w-full rounded-none hover:bg-brand-primary"
          variant="unstyled"
          leftSection={<Image src="/icons/car-update-secondary.svg" alt="chevron" width={16} height={16} />}
          onClick={() => open()}
        >
          <p className="caption_semibold">Update Status</p>
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="flex flex-col gap-y-4">
        <div className="flex flex-col bg-white">
          <div className="bg-neutrals-background-surface p-4">
            <div className="flex flex-row gap-x-2 items-center relative">
              <Image src="/icons/car-update.svg" alt="car" width={24} height={24} />
              <p className="body_small_semibold">Update Status</p>
              <ActionIcon className="bg-transparent mr-auto hover:bg-transparent absolute right-0" onClick={() => close()}>
                <Image src="/icons/cancel-01.svg" alt="cancel" width={24} height={24} />
              </ActionIcon>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 p-4">
            <TxtInput
              placeholder="Date"
            />
            <Select
              placeholder="Vehicle Status"
              items={
                ["All",...VEHICLE_STATUSES].map(d => ({
                  value: d,
                  label: d
                }))
              }
            />
            <Select
              placeholder="Order Status"
              items={["All",...ORDER_STATUSES].map(d => ({
                value: d,
                label: d
              }))}
            />
            <Select
              placeholder="Contract Status"
              items={["All",...CONTRACT_STATUSES].map(d => ({
                value: d,
                label: d
              }))}
            />
            <TxtInput
              placeholder="Contract No"
            />
          </div>
          <div className="flex flex-col items-center w-full h-full px-3 pb-3"> 
            <Button className="bg-brand-primary py-3 px-[22px] h-full w-full rounded-none hover:bg-brand-primary" onClick={() => close()}>
              <p className="body_regular_semibold">Confirm</p>
            </Button>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}