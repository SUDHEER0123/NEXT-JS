'use client';

import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ICustomerHandover {
  onConfirm: (files: { date: Date; file: File }[]) => void;
}

// Zod schema validation
const schema = z.object({
  handoverFiles: z
    .array(
      z.object({
        date: z.date(),
        file: z.instanceof(File),
        name: z.string(),
      })
    )
    .min(1, "Please upload at least one file."),
});

type FormData = z.infer<typeof schema>;

export const CustomerHandover: React.FC<ICustomerHandover> = ({ onConfirm }) => {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      handoverFiles: [],
    },
  });

  const onSubmit = (data: FormData) => {
    onConfirm(data.handoverFiles);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-6 w-full overflow-y-hidden items-center max-h-[450px] min-w-full"
    >
      <div className="flex flex-col gap-y-6 overflow-y-auto px-4 w-full">
        <Controller
          name="handoverFiles"
          control={control}
          render={({ field }) => (
            <DropSelectFile
              title="Upload or drag and drop your Handover Document"
              value={field.value}
              onChange={field.onChange}
              maxUploads={5}
              supportedFormats={["pdf", "jpg", "jpeg", "png"]}
              maxFileSize="5MB"
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
