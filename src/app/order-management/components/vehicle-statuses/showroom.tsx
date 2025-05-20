import { Select } from "@/components/ui/Select/Select";
import { Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IShowroom {
  specificDestination?: boolean;
  onConfirm: (val: string) => void;
}

const schema = z.object({
  showroomDestination: z.string().min(1, "Please select a destination"),
});

type FormData = z.infer<typeof schema>;

export const Showroom: React.FC<IShowroom> = ({ onConfirm, specificDestination }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    onConfirm(data.showroomDestination);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-6 w-full overflow-y-hidden items-start max-h-[450px] !w-full"
    >
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 !w-full items-start">
        {!specificDestination && (
          <Controller
            name="showroomDestination"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Showroom Destination"
                items={[
                  { label: "Seoul", value: "Seoul" },
                  { label: "Suwon", value: "Suwon" },
                ]}
                value={field.value}
                onOptionSubmit={field.onChange}
              />
            )}
          />
        )}
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