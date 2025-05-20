import { NumInput } from "@/components/ui/NumInput/NumInput";
import { TxtInput } from "@/components/ui/TxtInput/text-input";
import { Button } from "@mantine/core";
import { useState } from "react";

interface IOrderedRetail {
  orderNumber?: string;
  onConfirm: (value: string) => void;
}

export const OrderedRetail: React.FC<IOrderedRetail> = ({ onConfirm, ...props }) => {
  const [orderNumber, setOrderNumber] = useState<string>(props?.orderNumber ?? '');

  return (
    <div className="flex flex-col gap-y-6 !w-full overflow-y-hidden items-start max-h-[450px]">
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 !w-full items-start">
        <TxtInput
          placeholder="Order No"
          className="!w-full"
          rightSection={<></>}
          onChange={(e) => setOrderNumber(e.currentTarget.value)}
          value={orderNumber}
          wrapperClassname="items-start w-full"
          hideLabel={false}
        />
      </div>
      <div className="pb-4 w-full px-3">
        <Button
          variant="unstyled"
          className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]"
          onClick={() => {
            onConfirm(orderNumber);
          }}
        >
          <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
        </Button>
      </div>
    </div>
  )
};