'use client';

import { NumInput } from "@/components/ui/NumInput/NumInput";
import { Select } from "@/components/ui/Select/Select";
import { Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IOrderedStock {
  onConfirm: (contractNo: string) => void;
  isLoading?: boolean;
  contractNo: string;
  inventoryLocation: string;
}

// Zod schema for validation
const schema = z.object({
  contractNo: z.string().min(1, "Contract No is required"),
  inventoryLocation: z.string().min(1, "Inventory Location is required"),
});

type FormData = z.infer<typeof schema>;

export const OrderedStock: React.FC<IOrderedStock> = ({
  onConfirm,
  isLoading,
  contractNo,
  inventoryLocation,
}) => {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractNo: contractNo ?? '',
      inventoryLocation: inventoryLocation ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    onConfirm(data.contractNo);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-6 !w-full overflow-y-hidden items-start max-h-[450px]"
    >
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 !w-full items-start">
        <Controller
          name="contractNo"
          control={control}
          render={({ field }) => (
            <NumInput
              placeholder="Contract No"
              className="!w-full"
              wrapperClassname="items-start"
              rightSection={<></>}
              thousandSeparator={false}
              {...field}
              onChange={(val) => field.onChange(val.toString())}
            />
          )}
        />
        <Controller
          name="inventoryLocation"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="Inventory Location"
              items={[
                { label: 'Stock', value: 'Stock' },
                { label: 'Demo', value: 'Demo' },
                { label: 'Showroom', value: 'Showroom' },
                { label: 'PR', value: 'PR' },
              ]}
              value={field.value}
              onOptionSubmit={field.onChange}
            />
          )}
        />
      </div>
      <div className="pb-4 w-full px-3">
        <Button
          type="submit"
          variant="unstyled"
          className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]"
          loading={isLoading}
        >
          <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
        </Button>
      </div>
    </form>
  );
};
