'use client';

import { LicenseDraftIcon } from "@/assets/icons";
import clsx from "clsx";
import { useState } from "react";

interface IConsent {
  title: string;
  description: string;
  status: 'Accepted' | 'Rejected' | 'Out-of-Date';
}

export const Consent: React.FC<IConsent> = ({ title, description, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-2">
        <LicenseDraftIcon width={18} height={18} alt="license-draft" className="text-neutrals-high" />
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex justify-between gap-x-2">
            <p className="caption_regular text-neutrals-high">
              {title}
            </p>

            <div className={
              clsx(
                "py-1 px-1.5 h-fit",
                status === 'Accepted' && "bg-indications-bg_success_soft",
                status === 'Rejected' && "bg-indications-bg_error_soft",
                status === 'Out-of-Date' && "bg-indications-bg_warning_soft"
              )}
            >
              <p className={
                clsx(
                  "caption_small_bold",
                  status === 'Accepted' && "text-brand-primary",
                  status === 'Rejected' && "text-indications-red",
                  status === 'Out-of-Date' && "text-indications-warning"
                )}
              >
                {status}
              </p>
            </div>
          </div>

          {isExpanded && (
            <div className="bg-neutrals-background-surface border-[1px] border-neutrals-low p-2 rounded-md">
              <p className="caption_small_regular text-neutrals-high">{description}</p>
            </div>
          )}
          <p className="text-brand-primary caption_small_semibold cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Read Less':'Read More'}</p>
        </div>
      </div>
    </div>
 );
};
 