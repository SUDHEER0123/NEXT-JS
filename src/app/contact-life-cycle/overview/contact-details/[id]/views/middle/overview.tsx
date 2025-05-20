import { TrashIcon } from "@/assets/icons";
import { SalesAvatar } from "@/components/SalesAvatar";
import { ActionIcon, Button } from "@mantine/core";
import Image from "next/image";

interface IMiddleOverview {
}

export const MiddleOverview: React.FC<IMiddleOverview> = () => {
  return (
    <>
      <div className="flex gap-x-8 px-4 py-3">
          <div className="flex flex-col">
            <p className="text-neutrals-medium caption_regular">Create Date</p>
            <p className="text-neutrals-high body_regular_semibold">Sat 1 Jun, 2024</p>
          </div>
          <div className="flex flex-col">
            <p className="text-neutrals-medium caption_regular">Last Activity Date</p>
            <p className="text-neutrals-high body_regular_semibold">Wed 28 Aug, 2024</p>
          </div>
      </div>

      {/* Garage */}
      <div className="m-3 bg-neutrals-background-default border-[1px] border-neutrals-low shadow-order-card">
        <div className="bg-white px-4 py-3">
        <p className="body_small_semibold text-neutrals-high">GARAGE</p>
      </div>

      {/* Header */}
      <div className="mx-3 mb-3 pt-3 py-1.5 px-3 bg-neutrals-background-default border-[1px] border-neutrals-low shadow-order-card relative bg-neutrals-background-shading relative">
        <Image src="/images/garage-pattern.svg" alt="garage" width={300} height={74} className="absolute right-0" />
        <Image src="/images/car_img.svg" alt="car" width={100} height={66} />
        <div className="absolute top-3 right-3">
          <SalesAvatar lastName="Baek" firstName="Hyun" avatar="/images/Baek Hyun.svg" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start px-4 pb-4">
      <p className="body_regular_semibold text-neutrals-high mb-3">DB12 Coupe</p>

      <div className="flex gap-x-4">
      <div className="flex flex-row space-x-4 text-xxs min-w-max">
      <div className="flex flex-col space-y-0.5 items-start">
          <span className="caption_small_regular text-neutrals-high">Exterior Color:</span>
          <span className="caption_small_regular text-neutrals-highr">VIN:</span>
          <span className="caption_small_regular text-neutrals-high">License Plate:</span>
      </div>
      <div className="flex flex-col space-y-0.5 items-start">
          <span className="caption_small_regular text-neutrals-medium">Green</span>
          <span className="caption_small_regular text-neutrals-medium">WP0AD2Y13NSA59933</span>
          <span className="caption_small_regular text-neutrals-medium">43나6748</span>
      </div>
      </div>
      <div className="flex flex-row space-x-4 text-xxs min-w-max">
          <div className="flex flex-col space-y-0.5 items-start">
          <span className="caption_small_regular text-neutrals-high">Interior Color:</span>
          <span className="caption_small_regular text-neutrals-highr">Year:</span>
          </div>
          <div className="flex flex-col space-y-0.5 items-start">
          <span className="caption_small_regular text-neutrals-medium">Green</span>
          <span className="caption_small_regular text-neutrals-medium">2021</span>
          </div>
      </div>
      </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t-[0.5px] border-t-neutrals-low pt-2 px-2 pb-1">

      <div className="flex gap-x-1 items-center">
      <Image src="/icons/location-03.svg" width={12} height={12} alt="location" />
      <p className="caption_regular">Aston Martin Suwon</p>
      </div>

      <div className="flex gap-x-1 self-end">
        <Button className="bg-neutrals-high rounded-none px-1 hover:bg-neutrals-high h-[24px]">
            <div className="flex gap-x-1 h-fit">
            <Image src="/icons/tools.svg" width={16} height={16} alt="plus" />
            <p className="caption_small_semibold text-indications-bg_warning_soft">Service Due</p>
            </div>
        </Button>
        <Button className="bg-brand-secondary rounded-none px-1 hover:bg-brand-secondary h-[24px]">
            <div className="flex gap-x-1 h-fit">
            <Image src="/icons/megaphone-02.svg" width={16} height={16} alt="plus" />
            <p className="caption_small_semibold text-neutrals-high">Open Campaign</p>
            </div>
        </Button>
        <ActionIcon variant="transparent" className="!h-[20px]">
            <TrashIcon width={16} height={16} className="text-neutrals-high !h-[20px]" />
        </ActionIcon>
      </div>

      </div>
      </div>

      {/* New Opportunity */}
      <div className="m-3 bg-neutrals-background-default border-[1px] border-neutrals-low shadow-order-card">
        <div className="bg-white px-4 py-3">
        <p className="body_small_semibold text-neutrals-high">NEW OPPORTUNITY</p>
      </div>

      {/* Content */}
      <div className="flex items-center justify-between bg-gradient-7 mx-3 mb-3 p-2 relative">
        <Image src="/images/new-opp-pattern.svg" width={230} height={118} alt="new-opp-pattern" className="absolute right-0" />

        <div className="flex flex-col items-center">
        <Image src="/images/car-image-02.svg" width={172} height={94} alt="car-image-02" />
        <div className="bg-neutrals-background-default rounded-full border-[0.5px] border-neutrals-low py-[2px] px-1.5 absolute bottom-3">
            <p className="caption_xs_semibold text-neutrals-high">Opportunity No: 0123</p>
        </div>
      </div>

      <div className="flex gap-x-4 mr-4">
        <div className="flex flex-col gap-y-3">
            <div>
            <p className="caption_small_regular text-neutrals-medium">Model</p>
            <p className="caption_semibold text-neutrals-high">DBX707</p>
            </div>

            <div>
            <p className="caption_small_regular text-neutrals-medium">Est. Close Date</p>
            <p className="caption_semibold text-neutrals-high">Thu, 19 Sep 2024</p>
            </div>
        </div>

        <div>
            <p className="caption_small_regular text-neutrals-medium">Pipeline Status</p>
            <p className="body_large_semibold bg-gradient-6 bg-clip-text text-transparent">Offer Made</p>
        </div>
      </div>

      <ActionIcon variant="transparent" className="!h-[20px] absolute bottom-1 right-1">
        <TrashIcon width={16} height={16} className="text-neutrals-high !h-[20px]" />
      </ActionIcon> 

      </div>
      </div>

      {/* Recent Activities */}
      <div className="m-3 bg-neutrals-background-default border-[1px] border-neutrals-low shadow-order-card">
      <div className="bg-white px-4 py-3">
      <p className="body_small_semibold text-neutrals-high">RECENT ACTIVITIES</p>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start px-4 pb-4">
      <div className="flex items-center justify-between w-full border-b-[1px] border-b-neutrals-background-shading">
      <div className="flex flex-col border-b-[1px] border-b-neutrals-background-shading py-3 w-full">
          <p className="caption_regular text-neutrals-high">
          Service Booking
          </p>
          <p className="caption_small_regular text-neutrals-medium">
          Wed 28 Aug, 2024
          </p>
      </div>
      <div>
          <TrashIcon width={20} height={20} />
      </div>
      </div>

      <div className="flex items-center justify-between w-full border-b-[1px] border-b-neutrals-background-shading">
      <div className="flex flex-col py-3 w-full">
          <p className="caption_regular text-neutrals-high">
          Attended an event
          </p>
          <p className="caption_small_regular text-neutrals-medium">
          Wed 28 Aug, 2024
          </p>
      </div>
      <div>
          <TrashIcon width={20} height={20} />
      </div>
      </div>

      <div className="flex items-center justify-between w-full">
      <div className="flex flex-col pt-3">
          <p className="caption_regular text-neutrals-high">
          Attended an event
          </p>
          <p className="caption_small_regular text-neutrals-medium">
          Wed 28 Aug, 2024
          </p>
      </div>

      <div>
          <TrashIcon width={20} height={20} />
      </div>
      </div>

      </div>
      </div>
    </>
  )
};

