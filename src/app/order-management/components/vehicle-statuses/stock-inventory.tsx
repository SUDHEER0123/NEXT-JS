import { TxtInput } from "@/components/ui/TxtInput/text-input";
import { Button } from "@mantine/core";

interface IStockInventory {}

export const StockInventory: React.FC<IStockInventory> = (props) => {
  return (
    <div className="flex flex-col gap-y-6 !w-full overflow-y-hidden items-start max-h-[450px]">
      <div className="pb-4 w-full px-3">
        <Button
          variant="unstyled"
          className="bg-brand-primary rounded-none hover:bg-brand-primary w-full h-[48px] py-[12px] px-[22px]"
        >
          <p className="body_regular_semibold text-neutrals-background-default">Confirm</p>
        </Button>
      </div>
    </div>
  )
};