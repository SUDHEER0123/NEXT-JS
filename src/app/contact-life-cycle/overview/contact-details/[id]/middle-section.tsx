import { Tab } from "@/app/types";
import { AlertIcon } from "@/assets/icons";
import { Tabs, useTabs } from "@/components/Tab/Tab";
import { Button } from "@mantine/core";
import Image from "next/image";
import { MiddleOverview } from "./views/middle/overview";
import { MiddleGarage } from "./views/middle/garage";
import { MiddleDocuments } from "./views/middle/documents";
import { MiddleActivities } from "./views/middle/activities";
import { PaginatedDiv } from "./views/paginated-div";
import { VehicleAlert } from "./views/middle/vehicle-alerts";
import { useState } from "react";
import clsx from "clsx";

export const MiddleSection: React.FC = () => {
  const [showAlerts, setShowAlerts] = useState(false);

  const tabs: Tab[] = [
    {
      label: "Overview",
      value: "overview",
      component: <MiddleOverview />
    },
    {
      label: "Garage",
      value: "garage",
      component: <MiddleGarage />
    },
    {
      label: "Documents",
      value: "documents",
      component: <MiddleDocuments />
    },
    {
      label: "Activities",
      value: "activities",
      component: <MiddleActivities />
    }
  ];

  const { activeTab, setActiveTab } = useTabs({ tabs, defaultTab: 'overview' });

  const vehicleAlerts = [
    {
      title: 'DB12 Coupe has an open campaign 1',
      description: 'Aston Martin Lagonda of Seoul (Aston Martin) is recalling certain 2022-2023 DB12 vehicles. The front passenger seat occupancy sensor mat may degrade over time, potentially leading to a failure in detecting a passenger in the front seat, which could increase the risk of injury in a crash.',
    },
    {
      title: 'DB12 Coupe has an open campaign 2',
      description: 'Aston Martin Lagonda of Seoul (Aston Martin) is recalling certain 2022-2023 DB12 vehicles. The front passenger seat occupancy sensor mat may degrade over time, potentially leading to a failure in detecting a passenger in the front seat, which could increase the risk of injury in a crash.',
    }
  ]

  return (
    <div className="flex-1 grow border-b-[1px] border-b-neutrals-low relative">
      <div className="bg-white px-4">
        <Tabs
          className="bg-white"
          tabClassName="lg:px-4 2xl:px-8"
          onTabChange={(tab: string) => setActiveTab(tab)}
          tabs={tabs}
          activeTab={activeTab}
        />
      </div>

      {tabs?.find(tab => tab.value === activeTab)?.component}
      
      <div className="flex items-center w-full justify-between absolute bottom-0">
        <div className="w-full">
          {showAlerts && (
            <PaginatedDiv
              className="border-l-4 border-l-brand-secondary bg-brand-secondary_ext_2"
              items={
                vehicleAlerts?.map((vehicleAlert, idx) => (
                  <VehicleAlert
                    key={idx}
                    title={vehicleAlert.title}
                    description={vehicleAlert.description}
                  />
                ))
              }
            />
          )}
          <div className="flex items-center gap-x-2 bg-neutrals-high justify-between">
            <div className="flex items-center gap-x-2 p-4">
              <AlertIcon className="text-brand-secondary" width={24} height={24} />
              <p className="body_small_semibold text-neutrals-background-default">Vehicle Alerts</p>
              <p className="body_small_semibold text-neutrals-low">{vehicleAlerts?.length ?? 0}</p>
            </div>

            <Button variant="transparent" onClick={() => setShowAlerts(!showAlerts)}>
              <Image
                src="/icons/keyboard_arrow_down-white.svg"
                width={16}
                height={16}
                alt="alert"
                className={clsx(
                  !showAlerts && 'rotate-180 transform duration-300',
                  showAlerts && 'rotate-0 transform duration-300'
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};