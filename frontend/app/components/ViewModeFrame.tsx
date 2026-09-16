"use client";

import { Box } from "@chakra-ui/react";
import { useViewMode } from "../contexts/ViewModeContext";

export default function ViewModeFrame({ children }: { children: React.ReactNode }) {
  const { mode } = useViewMode();

  if (mode === "mobile") {
    return (
      <Box
        maxW="390px"
        mx="auto"
        my={{ base: "0", md: "6" }}
        borderWidth={{ base: "0", md: "1px" }}
        borderColor="pink.200"
        borderRadius={{ base: "0", md: "2xl" }}
        boxShadow={{ base: "none", md: "lg" }}
        overflow="hidden"
        bg="var(--bijyou-bg)"
        minH="100vh"
      >
        {children}
      </Box>
    );
  }

  if (mode === "desktop") {
    return (
      <Box maxW="1100px" mx="auto" minW={{ base: "1100px", xl: "auto" }} overflowX="auto">
        {children}
      </Box>
    );
  }

  // auto: 実際の画面サイズにそのまま追従する（通常のレスポンシブ）
  return <>{children}</>;
}
