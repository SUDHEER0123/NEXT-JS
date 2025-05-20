import { Overlay } from "@mantine/core";
import React from "react";

interface IImageOverlay {
  image: React.ReactElement;
}

export const ImageOverlay: React.FC<IImageOverlay> = ({ image }) => {
  return (
    <div>
      {image}
      <Overlay
        color={'rgba(255, 235, 235, 1'}
        w="100%"
        h="100%"
      />
    </div>
  );
}