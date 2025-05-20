import Image from "next/image"

interface IEmptyOrder {
  message: string
  action: React.ReactNode;
}

export const EmptyOrder: React.FC<IEmptyOrder> = ({ message, action }) => {
  return (
    <div className="flex flex-col gap-y-8 items-center justify-center text-center w-[252px] h-[192px]"> 
      <Image src="/icons/empty-order.svg" width={56} height={56} alt="Empty Order" />
      <p className="body_small_regular">{message}</p>
      <div className="h-full w-full">{action}</div>
    </div>
  );
};