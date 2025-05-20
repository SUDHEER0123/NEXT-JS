import { Avatar } from "@mantine/core";
import Image from "next/image";

interface SalesAvatarProps {
  firstName: string;
  lastName: string;
  avatar: string;
  jobTitle?: string;
}

export const SalesAvatar: React.FC<SalesAvatarProps> = ({ firstName, lastName, avatar, jobTitle }) => {
  return (
    <div className="flex flex-col items-start gap-y-2 border-[1px] border-neutrals-low bg-agent-order shadow-subtle-shadow2 py-2 pl-2 pr-6 w-fit relative min-w-[110px] min-h-[97px]">
      <Avatar src={avatar} size={40} />
      <div className="flex flex-col">
        <p className="text-neutrals-high caption_semibold">{`${firstName} ${lastName}`}</p>
        <p className="caption_small_regular text-neutrals-medium">{jobTitle ?? "Sales Consultant"}</p>
      </div>
      <Image src="/images/triangle.svg" width={16} height={16} alt="triangle" className="absolute top-0 right-0" />
    </div>
  );
}