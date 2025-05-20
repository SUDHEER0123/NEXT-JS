'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "../drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { NumInput } from "../num-input";
import { TxtInput } from "./text-input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Select } from "@/components/ui/Select/Select";

interface INewStockPurchase extends DrawerProps {
}

export const NewStockPurchase: React.FC<INewStockPurchase> = ({ opened, onClose }) => {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customer, setCustomer] = useState('');
  const [salesConsultant, setSalesConsultant] = useState('');
  const [location, setLocation] = useState('');
  const [stockVehicle, setStockVehicle] = useState('');
  const [financePartner, setFinancePartner] = useState('');

  useEffect(() => {
    setTotalPrice(parseFloat(vehiclePrice || '0') + parseFloat(optionPrice || '0') - parseFloat(discount || '0'));
  },[vehiclePrice, optionPrice, discount]);

  return (
    <Drawer
      title="New Stock Purchase"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4 grow p-4">
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
                items={['Suwon', 'Seoul'].map(v => (
                  {
                    value: v,
                    label: v,
                  }
                ))}
                withOptionsDivider
                onOptionSubmit={(val) => setLocation(val)}
                value={location}
              />
              <TxtInput
                placeholder="Contract No"
                key="Contract No"
              />
            </div>
          </DrawerCard>
          <DrawerCard title="Vehicle Details" icon="car-02">
            <div className="flex flex-col gap-y-4">
              <Select
                placeholder="Stock Vehicle"
                key="Stock Vehicle"
                hoverplaceholder="Find and select a Stock Vehicle"
                showIconWhenClosed={false}
                items={[
                  {
                    value: 'DB12 Coupe',
                    label: (
                      <div className="flex flex-col">
                        <span className="caption_regular text-neutrals-high">DB12 Coupe</span>
                        <div className="flex flex-row gap-x-1">
                          <span className="caption_small_regular text-neutrals-high">VIN:</span>
                          <span className="caption_small_regular text-neutrals-medium">WP0AD2Y13NSA59933</span>
                        </div>
                      </div>
                    ),
                    extraRightSection: (
                      <div className="flex flex-row gap-x-1 items-center bg-indications-bg_success_soft rounded-full py-1 px-2">
                        <Image src="/icons/agreement-brand-primary.svg" width={14} height={14} alt="agreement" />
                        <p className="caption_small_semibold text-brand-primary">RESERVED</p>
                      </div>
                    ),
                    data: {
                      'Model Type': 'DB12',
                      'Model Line': 'DB12 Coupe',
                      VIN: 'WP0AD2Y13NSA59933',
                      'Exterior Color': 'Green',
                      'Interior Color': 'Black'
                    },
                    icon: (
                      <Image
                        src={`/images/db12-coupe.svg`}
                        width={60}
                        height={40}
                        alt="db12-coupe"
                      />
                    )
                  },
                  {
                    value: 'DB12 Volante',
                    label: (
                      <div className="flex flex-col">
                        <span className="caption_regular text-neutrals-high">DB12 Volante</span>
                        <div className="flex flex-row gap-x-1">
                          <span className="caption_small_regular text-neutrals-high">VIN:</span>
                          <span className="caption_small_regular text-neutrals-medium">WP0AD2Y13NSA59933</span>
                        </div>
                      </div>
                    ),
                    data: {
                      'Model Type': 'DB12',
                      'Model Line': 'DB12 Volante',
                      VIN: 'WP0AD2Y13NSA59933',
                      'Exterior Color': 'Black',
                      'Interior Color': 'Black'
                    },
                    icon: (
                      <Image
                        src={`/images/db12-volante.svg`}
                        width={60}
                        height={40}
                        alt="db12-volante"
                      />
                    )
                  },
                  {
                    value: 'Vantage',
                    label: (
                      <div className="flex flex-col">
                        <span className="caption_regular text-neutrals-high">Vantage</span>
                        <div className="flex flex-row gap-x-1">
                          <span className="caption_small_regular text-neutrals-high">VIN:</span>
                          <span className="caption_small_regular text-neutrals-medium">WP0AD2Y13NSA59933</span>
                        </div>
                      </div>
                    ),
                    data: {
                      'Model Type': 'Vantage',
                      'Model Line': 'Vantage',
                      VIN: 'WP0AD2Y13NSA59933',
                      'Exterior Color': 'Yellow',
                      'Interior Color': 'Black'
                    },
                    icon: (
                      <Image
                        src={`/images/vantage.svg`}
                        width={60}
                        height={40}
                        alt="vantage"
                      />
                    )
                  }
                ]}
                withIcon
                withOptionsDivider
                value={stockVehicle}
                onOptionSubmit={(val) => setStockVehicle(val)}
                showData
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
                placeholder="Discount"
                key="Discount"
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
                onChange={(val) => setDiscount(val.toString())}
                value={discount}
              />
              <NumInput
                placeholder="Total Price"
                key="Total_Price"
                disabled
                rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
                value={totalPrice}
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

export const useNewStockPurchase = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <NewStockPurchase opened={opened} onClose={close} />
  );

  return { opened, open, close, drawerRef };
};