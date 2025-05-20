import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from "@/assets/icons";
import { ActionIcon } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import ReactImageGallery, { ReactImageGalleryProps } from "react-image-gallery";

interface IImageGallery2 extends ReactImageGalleryProps {
}

export const ImageGallery2: React.FC<IImageGallery2> = ({ items, ...props }) => {
  const [page, setPage] = useState(1);
  const imageGalleryRef = useRef<ReactImageGallery>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > items.length) return;

    setPage(newPage);
    
    imageGalleryRef.current?.slideToIndex(newPage - 1);
  };

  return (
    <div className="flex flex-col gap-y-2 items-center">
      <ReactImageGallery
        ref={imageGalleryRef}
        items={items}
        lazyLoad
        disableThumbnailScroll
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
      />
      <div className="flex items-center gap-x-3">
        <ActionIcon variant="transparent" onClick={() => handlePageChange(page - 1)}>
          <KeyboardArrowLeftIcon className="text-neutrals-high" />
        </ActionIcon>

        {Array.from({ length: items.length }, (_, idx) => (
          <div className="flex gap-x-2.5 items-center">
            <div className={clsx(
              "py-1 px-2.5 cursor-pointer", 
                idx === page - 1 && "bg-brand-primary",
                idx !== page - 1 && "bg-transparent",
              )}
              onClick={() => handlePageChange(idx + 1)}
            >
              <p className={clsx(
                  "body_regular_semibold",
                  idx === page - 1 && "text-neutrals-background-default",
                  idx !== page - 1 && "text-neutrals-high",
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