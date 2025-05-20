import { TxtInput } from "@/components/ui/TxtInput/text-input";
import { Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IPtsByHq {
  onConfirm: (vin: string) => void;
}

const formSchema = z.object({
  vin: z.string().min(1, "VIN is required"),
});

type FormData = z.infer<typeof formSchema>;

export const PtsByHq: React.FC<IPtsByHq> = ({ onConfirm }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    onConfirm(data.vin);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-6 w-full overflow-y-hidden items-start max-h-[450px] !w-full"
    >
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 !w-full items-start">
        <Controller
          name="vin"
          control={control}
          render={({ field }) => (
            <TxtInput
              placeholder="VIN"
              wrapperClassname="w-full !items-start"
              className="w-full"
              {...field}
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
