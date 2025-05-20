import { MegaphoneIcon } from "@/assets/icons";
import { CollapsibleText } from "../collapsible-txt";

interface IVehicleAlert {
  title?: string;
  description?: string;
}

export const VehicleAlert: React.FC<IVehicleAlert> = ({
  title,
  description,
  ...props
}) => {
  return (
    <div key={title} className="flex gap-x-4 items-start p-4">
      <MegaphoneIcon className="text-neutrals-high" width={24} height={24} />
      <CollapsibleText title={title} description={description} />
    </div>
  );
}