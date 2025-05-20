import { Button } from "@mantine/core";
import Image from "next/image";
import clsx from "clsx";

interface IOrderTitle {
  title: string;
  count: number;
  onAddOrder: () => void;
}

export const OrderTitle: React.FC<IOrderTitle> = ({ title, count, onAddOrder }) => {

  return (
    <>
      <div className="flex flex-row gap-x-1 items-center pl-1.5">
        <p className="font-medium text-neutrals-high">{title}</p>
        <p
          className={clsx(
            "bg-neutrals-low text-sm py-0.5 px-2",
            count === 0 && "!bg-neutrals-background-surface !text-neutrals-medium"
          )}
        >
          {count}
        </p>
        <Button
          leftSection={
            <Image src="/icons/add-01.svg" alt="plus" width={18} height={18} />
          }
          variant="default"
          className="rounded-none bg-neutrals-background-shading h-[28px] ml-auto py-1.5 px-2 text-xs"
          onClick={() => onAddOrder()}
        >
          Order
        </Button>
      </div>
    </>
  );
};