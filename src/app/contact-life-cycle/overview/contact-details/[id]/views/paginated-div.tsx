import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from "@/assets/icons";
import { ActionIcon } from "@mantine/core";
import clsx from "clsx";
import React, { HTMLProps, useState } from "react";

interface IPaginatedDiv extends HTMLProps<HTMLDivElement> {
  items: React.ReactNode[];
}

export const PaginatedDiv: React.FC<IPaginatedDiv> = ({
  items,
  className,
}) => {
  const [page, setPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (items ?? []).length) return;

    setPage(newPage);
  };

  return (
    <div className={clsx("flex flex-col gap-y-2", className)}>
      {items?.find((_, idx) => idx === page - 1)}
      <div className="flex items-center px-8 pb-4">
        <ActionIcon variant="transparent" onClick={() => handlePageChange(page - 1)}>
          <KeyboardArrowLeftIcon className="text-neutrals-high" />
        </ActionIcon>

        {Array.from({ length: items.length }, (_, idx) => (
          <div className="flex gap-x-1 items-center">
            <div className={clsx(
              "py-1 px-2.5 cursor-pointer", 
                idx === page - 1 && "bg-brand-secondary",
                idx !== page - 1 && "bg-transparent",
              )}
              onClick={() => handlePageChange(idx + 1)}
            >
              <p className={clsx(
                  "caption_semibold text-neutrals-high",
                )}
              >
                {idx + 1}
              </p>
            </div>
          </div>
        ))}

        <ActionIcon variant="transparent" onClick={() => handlePageChange(page + 1)}>
          <KeyboardArrowRightIcon className="text-neutrals-high" />
        </ActionIcon>
      </div>
    </div>
  );
}