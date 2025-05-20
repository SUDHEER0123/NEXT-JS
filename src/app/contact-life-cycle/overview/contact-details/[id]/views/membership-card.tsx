'use client';

import { Button } from "@mantine/core";
import Image from "next/image";

interface IMembershipCard {

}

export const MembershipCard: React.FC<IMembershipCard> = ({

}) => {
  return (
    <div className="p-3 w-full h-full">
      {/* Membership Card */}
      <div className="flex flex-col items-center w-full">
        <div className="bg-membership shadow-subtle-shadow2 relative rounded-t-md max-w-[296px] max-h-[137px] w-full">
          <Image src="/images/membership-rect.svg" width={296} height={137} alt="membership-rect" className="absolute" />

          <div className="flex flex-col justify-between h-full">
            
            <div className="flex p-2 gap-x-2">
              <Image src="/images/membership-logo.svg" width={32} height={32} alt="membership-logo" />
              <div className="flex flex-col">
                <p className="caption_small_regular text-neutrals-low">Membership Subscription Level</p>
                <p className="body_small_semibold text-neutrals-background-default">Silver</p>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 mt-auto w-full">
              <div className="flex flex-col">
                <p className="caption_xs_regular text-neutrals-low">Your Points</p>
                <p className="body_regular text-neutrals-background-default">200 Points</p>
              </div>

              <div className="self-end">
                <Button variant="transparent" className="rounded-none py-1 px-2 bg-gradient-7 border-[0.5px] border-[#828585] mr-auto self-end shadow-[0px 0px 12px 0px rgba(0, 0, 0, 0.25)] backdrop-blur-[12px] h-auto">
                <p className="caption_small_semibold text-neutrals-background-default h-[15px]">Manage Points</p>
                </Button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-neutrals-high py-1 rounded-b-md max-w-[296px] w-full">
          <p className="caption_small_regular text-neutrals-background-default px-3">View Benefits</p>
          <Button variant="transparent" className="p-0 pr-2">
            <Image src="/icons/chevron-right.svg" width={20} height={20} alt="arrow-right" />
          </Button>
        </div>
      </div>
      
      <div className="w-full grow">
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-x-6">
            <p className="caption_semibold text-brand-primary">4</p>
            <p className="caption_regular text-neutrals-high">Coupons</p>
          </div>
          <Button variant="transparent" className="rounded-none py-1 px-2 bg-neutrals-background-shading h-auto">
            <p className="text-brand-primary caption_small_semibold">Manage</p>
          </Button>
        </div>

        <div className="border-b-[1px] border-b-neutrals-low" />

        <div className="flex items-center justify-between py-2">
          <div className="flex gap-x-6">
            <p className="caption_semibold text-brand-primary">2</p>
            <p className="caption_regular text-neutrals-high">Passes</p>
          </div>
          <Button variant="transparent" className="rounded-none py-1 px-2 bg-neutrals-background-shading h-auto">
            <p className="text-brand-primary caption_small_semibold">Manage</p>
          </Button>
        </div>
      </div>
    </div>
  );
}