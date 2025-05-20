'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "../drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import WideInput from "@/components/ui/WideInput/WideInput";
import { TxtInput } from "./text-input";
import { NumInput } from "../num-input";
import Image from "next/image";
import { useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { Select } from "@/components/ui/Select/Select";

interface INewRetailOrder extends DrawerProps {
}

export const NewRetailOrder: React.FC<INewRetailOrder> = ({ opened, onClose }) => {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [selected, setSelected] = useState<Date>();
  const [discount, setDiscount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customer, setCustomer] = useState('');
  const [salesConsultant, setSalesConsultant] = useState('');
  const [location, setLocation] = useState('');
  const [stockVehicle, setStockVehicle] = useState('');
  const [financePartner, setFinancePartner] = useState('');
  const [modelType, setModelType] = useState('');
  const [modelLine, setModelLine] = useState('');
  const [exteriorColor, setExteriorColor] = useState('');
  const [interiorColor, setInteriorColor] = useState('');
  
  return (
    <Drawer
      title="New Retail Order"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4 grow p-4 overflow-y-auto">
          <DrawerCard title="Extended Contact Details" icon="user">
            <div className="flex flex-col gap-y-4">
              <Select
                key="Customer"
                placeholder="Customer"
                hoverplaceholder="Find and select a customer"
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
                withIcon
                onOptionSubmit={(val) => setCustomer(val)}
                value={customer}
                searchable
              />
              <Select
                placeholder="Sales Consultant"
                hoverplaceholder="Find and select Sales Consultant"
                items={[ 'Baek Hyun', 'Kim Ji-woo', 'Jin Yae Park'].map(v => (
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
                    )
                  }
                ))}
                withIcon
                onOptionSubmit={(val) => setSalesConsultant(val)}
                value={salesConsultant}
                searchable
              />
              <Select
                placeholder="Location"
                hoverplaceholder="Find and select Location"
                items={[ 'Suwon', 'Seoul'].map(v => (
                  {
                    value: v,
                    label: v,
                  }
                ))}
                withOptionsDivider
                onOptionSubmit={(val) => setLocation(val)}
                value={location}
                searchable
              />
              <TxtInput
                placeholder="Contract No"
                key="Contract No"
              />
            </div>
          </DrawerCard>
          <DrawerCard title="Car Configuration" icon="car-02">
            <div className="flex flex-col gap-y-4">
              <div>
                <p className="text-neutrals-high text-base font-normal tracking-[0.01em]">Please enter vehicle configurator 10 digits code</p>
                <WideInput className="!text-neutrals-high w-full" length={10} />
              </div>
              <DropSelectFile subtitle="Upload or drag your Car Configurator Document" />
            </div>
          </DrawerCard>
          <DrawerCard title="Vehicle Details" icon="car-02">
            <div className="flex flex-col gap-y-4">
              <Select
                placeholder="Model Type"
                withOptionsDivider
                items={[
                  { value: 'DBX', label: 'DBX' },
                  { value: 'Vantage', label: 'Vantage' },
                  { value: 'DB11', label: 'DB11' },
                  { value: 'DBS', label: 'DBS' },
                  { value: 'Rapide', label: 'Rapide' },
                  { value: 'Valhalla', label: 'Valhalla' },
                  { value: 'Valkyrie', label: 'Valkyrie' },
                ]}
                onOptionSubmit={(val) => setModelType(val)}
                value={modelType}
              />
              <Select
                placeholder="Model Line"
                withOptionsDivider
                items={[
                  { value: 'DBX', label: 'DBX' },
                  { value: 'Vantage', label: 'Vantage' },
                  { value: 'DB11', label: 'DB11' },
                  { value: 'DBS', label: 'DBS' },
                  { value: 'Rapide', label: 'Rapide' },
                  { value: 'Valhalla', label: 'Valhalla' },
                  { value: 'Valkyrie', label: 'Valkyrie' },
                ]}
                onOptionSubmit={(val) => setModelLine(val)}
                value={modelLine}
              />
              <Select
                placeholder="Exterior Color"
                items={[
                  { value: 'Black', label: 'Black' },
                  { value: 'White', label: 'White' },
                  { value: 'Red', label: 'Red' },
                ]}
                withOptionsDivider
                onOptionSubmit={(val) => setExteriorColor(val)}
                value={exteriorColor}
              />
              <Select
                placeholder="Interior Color"
                items={[
                  { value: 'Black', label: 'Black' },
                  { value: 'White', label: 'White' },
                  { value: 'Red', label: 'Red' },
                ]}
                withOptionsDivider
                onOptionSubmit={(val) => setInteriorColor(val)}
                value={interiorColor}
              />
              <NumInput
                placeholder="Vehicle Price"
                key="Vehicle_Price"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
                onChange={(val) => setVehiclePrice(val.toString())}
                value={vehiclePrice}
              />
              <NumInput
                placeholder="Option Price"
                key="Option_Price"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
                onChange={(val) => setOptionPrice(val.toString())}
                value={optionPrice}
              />
              <NumInput
                placeholder="Total Price"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
                onChange={(val) => setTotalPrice(val.toString())}
                value={totalPrice}
              />
              <DatePicker
                target={(
                  <div className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2" onClick={() => open()}>
                    <span className="text-neutrals-high font-normal text-[12px] leading-[18px]">
                      Estimated Delivery Date
                    </span>
                    <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
                  </div>
                )}
                placeholder="Estimated Delivery Date"
                withIcon
                withBorder
                inForm
              />
            </div>
          </DrawerCard>
          <DrawerCard title="Payment Method" icon="credit-card">
            <div className="flex flex-col gap-y-4">
              <Select
                placeholder="Payment Method"
                items={[
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Credit Card', label: 'Credit Card' },
                  { value: 'Finance Partner', label: 'Finance Partner' },
                ]}
                key="Select Payment Method"
                onOptionSubmit={(val) => setPaymentMethod(val)}
                value={paymentMethod}
              />
              {paymentMethod === 'Finance Partner' && (
                <Select
                  placeholder="Select Finance Partner"
                  items={[
                    { value: 'Bank 1', label: 'Bank 1' },
                    { value: 'Bank 2', label: 'Bank 2' },
                    { value: 'Bank 3', label: 'Bank 3' },
                  ]}
                  key="Select Finance Partner"
                  onOptionSubmit={(val) => setFinancePartner(val)}
                  value={financePartner}
                />
              )}
            </div>
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

export const useNewRetailOrder = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <NewRetailOrder opened={opened} onClose={close} />
  );

  return { opened, open, close, drawerRef };
};