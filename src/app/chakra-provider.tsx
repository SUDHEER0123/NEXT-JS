"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

export default function ChakraProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChakraProvider value={theme}>{children}</ChakraProvider>;
}
