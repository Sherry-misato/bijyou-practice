"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ViewModeProvider } from "./contexts/ViewModeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ViewModeProvider>{children}</ViewModeProvider>
    </ChakraProvider>
  );
}
