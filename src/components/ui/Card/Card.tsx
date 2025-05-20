import { Button, Card as ChakraCard } from "@chakra-ui/react"
import Image from "next/image";
import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  width?: string;
  height?: string;
  cardImage?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  header,
  body,
  footer,
  className,
  titleClassName,
  descriptionClassName,
  width,
  height,
  cardImage,
}) => {
  return (
    <ChakraCard.Root width={width} height={height} className={`${className} relative`}>
      <ChakraCard.Body gap="2">
        <ChakraCard.Title marginTop="2" className={titleClassName}>{title}</ChakraCard.Title>
        <ChakraCard.Description>
          <span className={`${descriptionClassName} absolute z-20`}>{description}</span>
        </ChakraCard.Description>
        {cardImage}
      </ChakraCard.Body>
      <ChakraCard.Footer justifyContent="flex-end">
      </ChakraCard.Footer>
    </ChakraCard.Root>
  )
}

export default Card;