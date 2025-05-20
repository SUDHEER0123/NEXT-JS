import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import { TxtInput } from "@/components/ui/TxtInput/text-input";
import { Button } from "@mantine/core";
import { DateValue } from "@mantine/dates";
import Image from "next/image";
import { useState } from "react";

interface IStorageBeforeCustom {
  onConfirm: () => void;
}

export const StorageBeforeCustom: React.FC<IStorageBeforeCustom> = (props) => {
  return (
    <div className="flex flex-col gap-y-6 w-full overflow-y-hidden items-center max-h-[450px] min-w-full">
      <div className="pb-4 w-full px-3">
        <Button
          variant="unstyled"
          className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]"
          onClick={() => {
            props.onConfirm();
          }}
        >
          <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
        </Button>
      </div>
    </div>
  )
};