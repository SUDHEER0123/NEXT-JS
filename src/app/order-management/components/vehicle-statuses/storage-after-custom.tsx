import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { NumInput } from "@/components/ui/NumInput/NumInput";
import { Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

interface IStorageAfterCustom {
  onConfirm: (
    actCustomClearanceDate: Date,
    customsClearanceCost: string | number,
    transportationCost: string | number
  ) => void;
}

const schema = z.object({
  actCustomClearanceDate: z.date({ required_error: "Clearance date is required" }),
  customsClearanceCost: z.number().nonnegative("Must be a positive number"),
  transportationCost: z.number().nonnegative("Must be a positive number"),
});

type FormData = z.infer<typeof schema>;

export const StorageAfterCustom: React.FC<IStorageAfterCustom> = ({ onConfirm }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    onConfirm(
      data.actCustomClearanceDate,
      data.customsClearanceCost,
      data.transportationCost
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-6 w-full overflow-y-hidden items-center max-h-[450px] min-w-full"
    >
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 w-full">
        <Controller
          name="actCustomClearanceDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              target={
                <div className="flex flex-row items-center justify-between gap-x-2 cursor-pointer border-b border-b-neutrals-low pb-2">
                  <span className="text-neutrals-high font-normal text-[12px] leading-[18px]">
                    Estimated Delivery Date
                  </span>
                  <Image src="/icons/calendar-04.svg" alt="calendar" width={24} height={24} />
                </div>
              }
              placeholder="Custom Clearance Date"
              withIcon
              withBorder
              inForm
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="customsClearanceCost"
          control={control}
          render={({ field }) => (
            <NumInput
              placeholder="Customs Clearance Cost"
              className="w-full"
              wrapperClassname="w-full items-start"
              rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
              value={field.value}
              onChange={(val) => field.onChange(Number(val))}
            />
          )}
        />

        <Controller
          name="transportationCost"
          control={control}
          render={({ field }) => (
            <NumInput
              placeholder="Transportation Cost"
              className="w-full"
              wrapperClassname="w-full items-start"
              rightSection={<p className="text-xxs text-neutrals-medium">KRW</p>}
              value={field.value}
              onChange={(val) => field.onChange(Number(val))}
            />
          )}
        />
      </div>

      <div className="pb-4 w-full px-3">
        <Button
          type="submit"
          variant="unstyled"
          className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]"
        >
          <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
        </Button>
      </div>
    </form>
  );
};
