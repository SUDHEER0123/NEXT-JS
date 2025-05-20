'use client';

import { IContact, ILead, IProspect, IVehicle } from "@/app/types";
import { ActionMenu } from "@/components/ActionMenu/action-menu";
import Image from "next/image";
import { actionMenuItems } from "./content";
import { useRouter } from 'next/navigation';
import { Avatar } from "@mantine/core";
import { useAppDataStore } from "@/app/app.store";

interface IContactCard {
  contact: IContact;
  vehicles: IVehicle[];
  leads: ILead[];
  prospects: IProspect[];
}

export const ContactCard: React.FC<IContactCard> = ({ contact, vehicles, leads, prospects }) => {
  const router = useRouter();
  const { users, modelTypes } = useAppDataStore();
  const { type } = contact ?? {};

  const salesConsultant = users?.find(user => user?.uid === contact?.ownerUserUid);
  const vehicleDetails = vehicles?.find(v => v?.contactUid === contact?.uid);
  const vehicleInterestLeads = leads?.find(l => l.contactUid === contact.uid)?.vehicleInterest?.[0];
  const vehicleInterestProspects = prospects?.find(p => p.contactUid === contact.uid)?.vehicleInterest?.[0];

  const modelTypeUid = vehicleDetails?.modelTypeUid;
  const modelType = modelTypes?.find(m => m?.uid === modelTypeUid);

  return (
    <div className="border-[0.5px] border-neutrals-low min-w-[183px] h-full relative" key={contact.uid}>
      <div className="flex flex-col w-full h-full">
        {/*Top*/}
        <div className="flex items-start gap-x-1 bg-neutrals-background-surface p-1.5 border-b-[0.5px]">
          <Avatar src={contact.avatar} size={24} />
          <div className="flex flex-col">
            {/*Badge*/}
            {contact?.status === 'VIP' && (
              <div className="flex gap-x-1 items-center bg-gradient-6 rounded-full w-fit h-auto text-brand-secondary_ext_1 caption_xs_semibold py-0.5 px-1">
                <Image src="/icons/honor.svg" width={8} height={8} alt="honor" />
                VVIP
              </div>
            )}
            {contact?.status !== 'VIP' && (
              <div className="flex gap-x-1 items-center bg-neutrals-background-shading rounded-full w-fit h-auto text-neutrals-medium caption_xs_semibold py-0.5 px-1">
                <Image src="/icons/honor-gray.svg" width={8} height={8} alt="honor-gray" />
                STANDARD
              </div>
            )}
            <span className="text-neutrals-high caption_semibold">
              {`${contact?.firstName} ${contact?.lastName} `}
            </span>
            <span className="text-neutrals-medium caption_small_regular">
              {contact?.mobileNo?.phoneNumber}
            </span>
          </div>
          <div className="absolute right-0 top-0">
            <ActionMenu
              actionMenuItems={actionMenuItems}
              onOptionSubmit={(option) => {
                const actionItem = actionMenuItems.find(a => a.title === option)?.modal;

                switch(actionItem) {
                  case 'viewContact':
                    router.push(`/contact-life-cycle/overview/contact-details/${contact.uid}`);
                    return;
                  default:
                    return;
                }
              }}
            />
          </div>
        </div>
        {/*Bottom*/}
        <div className="flex flex-col gap-y-2 p-1.5">
          <span className="text-brand-primary caption_regular">{modelType?.type}</span>
          <div className="flex gap-x-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col">
                <span className="text-neutrals-high caption_small_semibold">Model</span>
                <span className="text-neutrals-medium caption_small_regular">{modelType?.line}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutrals-high caption_small_semibold">Sales Consultant</span>
                <span className="text-neutrals-medium caption_small_regular">{`${salesConsultant?.firstName} ${salesConsultant?.lastName}`}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutrals-high caption_small_semibold">Color</span>
                <span className="text-neutrals-medium caption_small_regular">{modelType?.extColor?.[0]?.color}</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col">
                <span className="text-neutrals-high caption_small_semibold">License Plate</span>
                <span className="text-neutrals-medium caption_small_regular">{vehicleDetails?.licensePlate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutrals-high caption_small_semibold">Year</span>
                <span className="text-neutrals-medium caption_small_regular">{vehicleDetails?.year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};