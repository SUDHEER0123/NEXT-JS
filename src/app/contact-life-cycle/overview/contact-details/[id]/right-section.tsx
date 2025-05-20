'use client';

import Image from "next/image";
import { Consent } from "./views/consent";
import { CollapsibleDiv } from "./views/collapsible-div";
import { MembershipCard } from "./views/membership-card";
import { ActionIcon, Button } from "@mantine/core";
import { FileList } from "@/components/ui/Dropfile/views/file-list";
import { ChangeEvent, useRef, useState } from "react";
import { TrashIcon } from "@/assets/icons";

export const RightSection: React.FC = () => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachments((prevFiles) => {
        return [...prevFiles, file]
      });
    }
  };

  return (
    <div className="flex flex-col bg-white flex-1 grow border-[1px] border-neutrals-low">

      {/* Consent Overview */}
      <div>
        <CollapsibleDiv
          icon={<Image src="/icons/license.svg" width={20} height={20} alt="user" />}
          title="Consent Overview"
        >
          <div className="flex flex-col gap-y-3 p-3">
            <Consent
              title="This is a consent to agree of sharing personal data with a 3rd party"
              description="This is the customer statement provided during the booking. This is the customer statement provided during the booking. This is the customer statement provided during the booking. This is the customer statement provided during the booking. "
              status="Accepted"
            />
            <div className="border-b-[1px] border-neutrals-low" />
            <Consent
              title="This is a consent to agree of sharing personal data with a 3rd party"
              description="This is the customer statement provided during the booking. This is the customer statement provided during the booking. This is the customer statement provided during the booking. This is the customer statement provided during the booking. "
              status="Rejected"
            />
            <div className="border-b-[1px] border-neutrals-low" />
            <Consent
              title="This is a consent to agree of sharing personal data with a 3rd party"
              description="This is the customer statement provided during the booking. This is the customer statement provided during the booking. This is the customer statement provided during the booking. This is the customer statement provided during the booking. "
              status="Out-of-Date"
            />
          </div>
        </CollapsibleDiv>
      </div>
        
      {/* Digital Wallet */}
      <div className="pt-2">
        <CollapsibleDiv
          icon={<Image src="/icons/wallet.svg" width={20} height={20} alt="user" />}
          title="Digital Wallet"
          className="flex items-center justify-center"
        >
          <MembershipCard />
        </CollapsibleDiv>
      </div>

      {/* Attachments */}
      <div className="py-4 bg-white">
        <CollapsibleDiv
          icon={<Image src="/icons/file-attachment.svg" width={20} height={20} alt="user" />}
          title="Attachments"
          customAction={
            <>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              />
              <Button variant="transparent" className="ml-auto" onClick={handleButtonClick}>
                <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
                <p className="text-brand-primary">Add</p>
              </Button>
            </>
          }
        >
          <div className="px-4 py-3 ">
            <FileList
              files={attachments}
              disableFileView
              disableFileRename
              showActionButtonsBg={false}
              customDeleteIcon={
                <TrashIcon className="text-neutrals-high" width={20} height={20} />
              }
            />
          </div>
        </CollapsibleDiv>
      </div>
    </div>
  )
}