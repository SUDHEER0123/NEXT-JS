'use client';

import { ImageGallery2 } from "@/components/ImageGallery2";
import clsx from "clsx";
import ReactImageGallery from "react-image-gallery";

interface IGarage {
  
}

export const MiddleGarage: React.FC<IGarage> = ({
}) => {
  const garageItems = [
    {
      label: 'Model',
      value: 'DB12 Coupe'
    },
    {
      label: 'Year',
      value: '2021'
    },
    {
      label: 'Exterior Color',
      value: 'Green'
    },
    {
      label: 'Interior Color',
      value: '736729'
    },
    {
      label: 'License Plate',
      value: '43나6748'
    },
    {
      label: 'VIN Number',
      value: 'WP0AD2Y16PSA47391'
    }
  ];

  const carImages = [
    {
      original: "/images/dbs.png",
    },
    {
      original: "/images/dbs.png",
    }
  ];

  return (
    <div className="flex flex-col items-center w-full h-full mt-8">
      <ImageGallery2 items={carImages} />
      <div className="flex flex-col gap-y-1 w-full px-3">
        {garageItems.map((garageItem, idx) => (
          <div key={garageItem.label} className={clsx("flex justify-between p-3", idx !== garageItems.length - 1 && "border-b-[2px] border-b-neutrals-background-shading")}>
            <p className="body_small_semibold text-neutrals-high">{garageItem.label}</p>
            <p className="body_small_regular text-neutrals-high">{garageItem.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
};