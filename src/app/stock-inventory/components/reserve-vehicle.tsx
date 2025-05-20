'use client';

import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import React from "react";
import { Slideover } from "@/components/Slideover/Slideover";
import { DrawerCard } from "@/components/ui/drawer-card";
import { Select } from "@/components/ui/Select/Select";
import { IStockInventory } from "../stock-inventory";
import { DateValue } from "@mantine/dates";
import { NumInput } from "@/components/ui/NumInput/NumInput";

interface IReserveVehicle extends UseReserveVehicleProps, DrawerProps {
}

interface UseReserveVehicleProps {
  vehicle?: IStockInventory;
  onReserve?: (vehicleId: string, reservedBy: string, reservationDate: string, depositAmt: number) => void;
  onClose: () => void;
}

export const ReserveVehicle: React.FC<IReserveVehicle> = ({ opened, onClose, vehicle, onReserve }) => {
  const [reservedBy, setReservedBy] = React.useState<string>('');
  const [reservationDate, setReservationDate] = React.useState<string>('');
  const [depositAmt, setDepositAmt] = React.useState<number>();
  const [reservedType, setReserveType] = React.useState<string>();

  return (
    <Slideover
      title="Reserve Vehicle"
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
            onClick={() => {
              vehicle && onReserve && onReserve(
                vehicle.id,
                reservedBy,
                reservationDate,
                depositAmt ?? 0
              );
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
      <div className="flex flex-col gap-y-4 w-full h-full">
        <div className="flex flex-col gap-y-4 grow overflow-y-auto overflow-x-hidden h-full p-2">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex gap-x-4 bg-gradient-7 p-4 relative">
              <Image src={`/images/${vehicle?.vehicleImage}.svg`} width={127} height={70} alt={`${vehicle?.id}`} />
              <div className="absolute bottom-0 right-0">
                <Image src="/images/pattern-stock-vehicle.svg" width={260} height={158} alt="pattern" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-8">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col">
                      <span className="caption_small_regular text-neutrals-medium">Exterior Colour</span>
                      <span className="caption_semibold text-neutrals-high">{vehicle?.exteriorColor}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="caption_small_regular text-neutrals-medium">Interior Colour</span>
                      <span className="caption_semibold text-neutrals-high">{vehicle?.interiorColor}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col">
                      <span className="caption_small_regular text-neutrals-medium">VIN</span>
                      <span className="caption_semibold text-neutrals-high">{vehicle?.vin}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="caption_small_regular text-neutrals-medium">Location</span>
                      <span className="caption_semibold text-neutrals-high">{vehicle?.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DrawerCard title="Reservation Details" icon="garage">
            <div className="flex flex-col gap-y-4">
              <Select
                key="Prospect"
                placeholder="Select Prospect"
                items={[ 'Kim Jun Ki', 'Kim Ji-woo', 'Jung Soo-hyun', 'Jin Yae Park'].map(v => (
                  {
                    value: v,
                    label: v,
                    icon: (
                      <Image
                        src={`/images/${v}.svg`}
                        width={32}
                        height={32}
                        alt="avatar"
                      />
                    ),
                  }
                ))}
                onOptionSubmit={(value) => setReservedBy(value)}
                withIcon
              />
              <DatePicker
                target={(
                  <div className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2" onClick={() => open()}>
                    <span className="text-neutrals-high body_small_regular">
                      Reservation Date
                    </span>
                    <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
                  </div>
                )}
                placeholder="Reservation Date"
                withIcon
                withBorder
                inForm
                onChange={(date) => setReservationDate(new Date(date as DateValue as Date).toISOString())}
                type="default"
              />
              <Select
                key="Reservation Type"
                placeholder="Reservation Type"
                hoverplaceholder="Reservation Type"
                items={[ 'Reserved', 'Reserved with Deposit' ].map(v => (
                  {
                    value: v,
                    label: v,
                  }
                ))}
                onOptionSubmit={(value) => setReserveType(value)}
              />
              {reservedType === "Reserved with Deposit" && (
                <>
                  <NumInput
                    placeholder="Deposit Amount"
                    value={depositAmt}
                    onChange={(value) => setDepositAmt(parseFloat(value.toString()))}
                    rightSection={<p className="text-neutrals-medium caption_regular">KRW</p>}
                  />
                  <div className="mt-2">
                    <DropSelectFile
                      subtitle="Upload or drag and drop receipt   here"
                    />
                  </div>
                </>
              )}
            </div>
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useReserveVehicle = (props: UseReserveVehicleProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <ReserveVehicle
      opened={opened}
      onClose={() => {
        props.onClose && props.onClose()
        close();
      }}
      vehicle={props.vehicle}
      onReserve={props.onReserve}
    />
  );

  return { opened, open, close, drawerRef };
};