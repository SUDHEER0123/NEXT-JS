import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IUnderPDI {
  onConfirm: (files: { file: File; date: Date }[]) => void;
}

const schema = z.object({
  pdiImages: z
    .array(z.object({ file: z.instanceof(File), date: z.date(), name: z.string() }))
    .min(1, "Please upload at least one image"),
});

type FormData = z.infer<typeof schema>;

export const UnderPDI: React.FC<IUnderPDI> = ({ onConfirm }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    onConfirm(data.pdiImages);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-3 w-[360px] overflow-y-hidden items-start max-h-[450px] px-4"
    >
      <Controller
        name="pdiImages"
        control={control}
        render={({ field }) => (
          <DropSelectFile
            title="Drag and Drop or Upload up to 30 PDI Images."
            accept="image/*"
            titleClassName="caption_regular text-neutrals-high"
            supportedFormats={["jpg", "jpeg", "png"]}
            maxFileSize="2MB"
            imageOnly
            imagesOnTop
            customImage="/icons/file-attachment-02.svg"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Button
        type="submit"
        variant="unstyled"
        className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px] mb-4"
      >
        <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
      </Button>
    </form>
  );
};
