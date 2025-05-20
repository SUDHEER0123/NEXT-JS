'use client';

import { ActionIcon, Button, Divider } from "@mantine/core"
import Image from "next/image"
import { useState } from "react";
import clsx from "clsx";
import { useUniversalLookup } from "./UniversalLookup";
import { useVehicleStatus } from "@/app/order-management/components/vehicle-status";
import { useOrdersStore } from "@/app/order-management/store/orders.store";
import { useStockInventory } from "@/app/stock-inventory/stock-inventory";

interface IFloatingWidget {}

const widgets: { icon: string, label: string, action: string }[] = [
  { icon: "car-update-white", label: "Vehicle and Order Tracker", action: "vehicleOrderTracker" },
  { icon: "searching", label: "Universal Lookup", action: "lookup" },
  { icon: "car-search", label: "Manage Stock Inventory", action: "manageStockInventory" }
];

export const FloatingWidget: React.FC<IFloatingWidget> = () => {
  const [expanded, setExpanded] = useState(false);
  const { open: openUniversalLookup, close: closeUniversalLookUp, modalRef: universalLookUpModalRef } = useUniversalLookup({});
  const { orders } = useOrdersStore();
  const { open: openVehicleStatus, modalRef: updateVehicleStatusRef } = useVehicleStatus({ order: orders[0] });
  const { open: openStockInventory, close: closeStockInventory, modalRef: stockInventoryRef } = useStockInventory({});

  const handleAction = (action: string) => {
    switch (action) {
      case "vehicleOrderTracker":
        openVehicleStatus();
        break;
      case "updateOrderTracker":
        break;
      case "manageStockInventory":
        openStockInventory();
        break;
      case "lookup":
        openUniversalLookup();
        break;
      case "expand":
        setExpanded(!expanded);
        break;
      default:
        break;
    }
  };

  return (
    <div className="absolute bottom-10 right-0 bg-brand-primary">
      {universalLookUpModalRef}
      {updateVehicleStatusRef}
      {stockInventoryRef}
      {widgets.map(widget => (
        <div key={widget.icon}>
          <ActionIcon
            key={widget.icon}
            variant="unstyled"
            className={clsx(
              "h-[48px] bg-transparent hover:bg-transparent",
              !expanded && "w-[44px]",
              expanded && "w-fit px-4 py-2" 
            )}
            onClick={() => handleAction(widget.action)}
          >
            <div className="flex items-center gap-x-2">
              <Image src={`/icons/${widget.icon}.svg`} width={20} height={20} alt={widget.label} />
              {expanded && (
                <p className="caption_regular text-neutrals-background-default">{widget.label}</p>
              )}
            </div>
          </ActionIcon>
          <div className="bg-shading-shading h-[1px]" />
        </div>
      ))}
      <ActionIcon
        key="expand"
        variant="unstyled"
        className={clsx(
          "h-[48px] bg-transparent hover:bg-transparent",
          !expanded && "w-[44px]",
          expanded && "w-fit px-4 py-2" 
        )}
        onClick={() => handleAction("expand")}
      >
        <div className="flex gap-x-1">
          <Image
            src={`/icons/chevron-secondary.svg`}
            width={20}
            height={20}
            alt="expand"
            className={clsx(
              expanded && "rotate-180 transform duration-300",
              !expanded && "rotate-0 transform duration-300"
            )}
          />
        </div>
      </ActionIcon>
    </div>
  )
}