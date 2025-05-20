import { ActionIcon, Button, Tooltip } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import { CollapsibleDiv } from "./views/collapsible-div";

const actionItems = [
  {
    icon: "/icons/call.svg",
    label: "Log Call",
  },
  {
    icon: "/icons/maps-location-02.svg",
    label: "Log Event Attendance",
  },
  {
    icon: "/icons/car-02.svg",
    label: "Log Test Drive",
  },
  {
    icon: "/icons/more-horizontal.svg",
    className: "bg-neutrals-background-shading hover:bg-neutrals-background-shading",
    label: "More",
  }
];

const aboutItems = [
  {
    label: 'Email',
    value: 'hongsuck@email.com'
  },
  {
    label: 'Phone Number',
    value: '+82-11-2345-6789'
  },
  {
    label: 'Sales Consultant',
    value: 'Guk Kyu'
  },
  {
    label: 'Last Contacted',
    value: 'Wed 28 Aug, 2024'
  }
];

const addressesItems = [
  {
    label: 'Address Line 1',
    value: 'Apt. 102-304'
  },
  {
    label: 'Address Line 2',
    value: 'Sajik-ro-3-gil 23'
  },
  {
    label: 'City',
    value: 'Jongno-gu'
  },
  {
    label: 'Province',
    value: 'Seoul'
  },
  {
    label: 'Postal Code',
    value: '30174'
  },
  {
    label: 'Country',
    value: 'South Korea'
  }
]

export const LeftSection: React.FC = () => {
  return (
    <div className="flex flex-col bg-white flex-1 grow border-[1px] border-neutrals-low">
      
      {/* Header */}
      <div className="flex items-center gap-x-2 border-b-[1px] border-b-brand-primary h-fit p-3 bg-contact-header relative">
        <Image src="/icons/contact-profile.svg" width={72} height={72} alt="contact-profile" />
        <Image src="/images/contact-header-pattern.svg" width={270} height={140} alt="contact-header-pattern" className="absolute right-0" />
        <div className="flex flex-col">
          <div className="flex gap-x-2 items-center">
            <p className="sub_heading_3_semibold">Hong Suck-Chin</p>
            <Image src="/icons/clipboard.svg" width={24} height={24} alt="clipboard" />
          </div>
          <p className="text-neutrals-medium body_small_regular">+82-11-2345-6789</p>
          <div className="flex gap-x-2 items-center">
            <p className="text-neutrals-medium body_small_regular">hongsuck@email.com</p>
            <Image src="/icons/copy-01.svg" width={18} height={18} alt="copy" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 px-3">
        <div className="flex items-center justify-between w-full">
          {actionItems.map((item, index) => (
            <Tooltip
              arrowSize={10}
              arrowPosition="center"
              label={item.label}
              key={item.label}
              withArrow
              className="px-3 py-2 rounded-none"
              classNames={{ tooltip: 'caption_xs_regular text-neutrals-background-default'}}
              position="bottom"
            >
              <ActionIcon key={index} variant="transparent" className={clsx(
                "border-[1px] border-neutrals-low rounded-full p-4 h-full w-auto",
                item.className
              )}>
                <Image src={item.icon} width={20} height={20} alt={item.label} />
              </ActionIcon>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="pt-2">
        <CollapsibleDiv
          icon={<Image src="/icons/user.svg" width={20} height={20} alt="user" />}
          title="About The Contact"
        >
          <div className="flex flex-col gap-y-1">
            {aboutItems.map((aboutItem, idx) => (
              <div key={aboutItem.label} className={clsx("flex justify-between p-3", idx !== aboutItems.length - 1 && "border-b-[2px] border-b-neutrals-background-shading")}>
                <p className="caption_semibold text-neutrals-high">{aboutItem.label}</p>
                <p className="caption_regular text-neutrals-high">{aboutItem.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleDiv>
      </div>
        
      {/* Addresses */}
      <div className="pt-2">
        <CollapsibleDiv
          icon={<Image src="/icons/location-03.svg" width={20} height={20} alt="user" />}
          title="Addresses"
        >
          <div className="flex gap-x-1 p-3">
            <div className="py-2 px-[14px] bg-brand-primary text-white caption_semibold w-fit">
              Home
            </div>
            <div className="py-2 px-[14px] bg-neutrals-background-shading text-neutrals-high caption_regular w-fit">
              Work
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            {addressesItems.map((addressItem, idx) => (
              <div key={addressItem.label} className={clsx("flex justify-between p-3", idx !== addressesItems.length - 1 && "border-b-[2px] border-b-neutrals-background-shading")}>
                <p className="caption_semibold text-neutrals-high">{addressItem.label}</p>
                <p className="caption_regular text-neutrals-high">{addressItem.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleDiv>
      </div>

      {/* Communication Preferences */}
      <div className="py-4 bg-white">
        <CollapsibleDiv
          icon={<Image src="/icons/mail-02.svg" width={20} height={20} alt="user" />}
          title="Communication Preferences"
        >
          <div className="flex flex-col gap-y-2 pt-4 px-3">
            <p className="caption_semibold text-neutrals-high">Marketing & Promotions</p>
            <div className="flex gap-x-1 w-full">
              
              <div className="flex items-center text-center justify-center bg-neutrals-background-shading text-neutrals-high caption_small_regular p-2 min-h-[32px] min-w-[71px] grow">
                Phone
              </div>

              <div className="flex items-center text-center justify-center bg-neutrals-background-shading text-neutrals-high caption_small_regular p-2 min-h-[32px] min-w-[71px] grow">
                SMS
              </div>

              <div className="flex items-center text-center justify-center gap-x-2 bg-brand-primary p-2 h-auto min-h-[32px] min-w-[71px] grow">
                <div className="bg-brand-secondary p-1 rounded-full">
                  <Image src="/icons/check.svg" width={6} height={4.5} alt="check" />
                </div>
                <p className="text-white caption_small_regular">Email</p>
              </div>

              <div className="flex items-center text-center justify-center gap-x-2 bg-brand-primary p-2 h-auto min-h-[32px] min-w-[71px] grow">
                <div className="bg-brand-secondary p-1 rounded-full">
                  <Image src="/icons/check.svg" width={6} height={4.5} alt="check" />
                </div>
                <p className="text-white caption_small_regular">Kakao</p>
              </div>

            </div>
          </div>
          <div className="flex flex-col gap-y-2 pt-4 px-3">
            <p className="caption_semibold text-neutrals-high">Service & Workshop</p>
            <div className="flex gap-x-1 w-full">
              
              <div className="flex items-center text-center justify-center bg-neutrals-background-shading text-neutrals-high caption_small_regular p-2 min-h-[32px] min-w-[71px] grow">
                Phone
              </div>

              <div className="flex items-center text-center justify-center bg-neutrals-background-shading text-neutrals-high caption_small_regular p-2 min-h-[32px] min-w-[71px] grow">
                SMS
              </div>

              <div className="flex items-center text-center justify-center gap-x-2 bg-brand-primary p-2 h-auto min-h-[32px] min-w-[71px] grow">
                <div className="bg-brand-secondary p-1 rounded-full">
                  <Image src="/icons/check.svg" width={6} height={4.5} alt="check" />
                </div>
                <p className="text-white caption_small_regular">Email</p>
              </div>

              <div className="flex items-center text-center justify-center gap-x-2 bg-brand-primary p-2 h-auto min-h-[32px] min-w-[71px] grow">
                <div className="bg-brand-secondary p-1 rounded-full">
                  <Image src="/icons/check.svg" width={6} height={4.5} alt="check" />
                </div>
                <p className="text-white caption_small_regular">Kakao</p>
              </div>

            </div>
          </div>
        </CollapsibleDiv>
      </div>
    </div>
  )
};