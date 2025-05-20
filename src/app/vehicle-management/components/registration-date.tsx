import { DatePicker, useDatePicker } from "@/components/ui/DatePicker/DatePicker";
import { Button } from "@mantine/core";
import Image from "next/image";

interface IRegistrationDate {}

export const RegistrationDate: React.FC<IRegistrationDate> = () => {
  const { opened, open, close } = useDatePicker();

  return (
    <DatePicker
      target={(
        <div className="flex flex-row items-center gap-x-2 cursor-pointer" onClick={() => open()}>
          <span className="body_small_regular">
            Registration Date
          </span>
          <Image src="/icons/arrow_bold.svg" width={20} height={20} alt="arrow" />
        </div>
      )}
      opened={opened}
      footer={
        <div className="flex flex-row items-end gap-x-4 self-end">
          <Button variant="unstyled" onClick={() => close()} className="bg-white text-neutrals-high hover:text-neutrals-high hover:bg-white rounded-none h-[40px] w-auto py-2.5 px-6">
            <p className="body_small_semibold">Cancel</p>
          </Button>
          <Button variant="unstyled" onClick={() => close()} className="bg-brand-primary hover:bg-brand-primary rounded-none h-[40px] w-auto py-2.5 px-6">
            <p className="body_small_semibold">Confirm</p>
          </Button>
        </div>
      }
    />
  );
}