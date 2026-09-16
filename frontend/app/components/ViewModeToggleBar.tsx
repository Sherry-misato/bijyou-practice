"use client";

import { Box, HStack, Button, Text } from "@chakra-ui/react";
import { useViewMode } from "../contexts/ViewModeContext";

const OPTIONS: { value: "auto" | "mobile" | "desktop"; label: string }[] = [
  { value: "auto", label: "自動" },
  { value: "mobile", label: "スマホ表示" },
  { value: "desktop", label: "PC表示" },
];

export default function ViewModeToggleBar() {
  const { mode, setMode } = useViewMode();

  return (
    <Box bg="pink.700" py="1.5">
      <HStack maxW="1100px" mx="auto" px="4" justify="flex-end" gap="2">
        <Text fontSize="xs" color="whiteAlpha.800" mr="1">
          表示切替：
        </Text>
        {OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            size="xs"
            variant={mode === opt.value ? "solid" : "ghost"}
            bg={mode === opt.value ? "white" : "transparent"}
            color={mode === opt.value ? "pink.700" : "whiteAlpha.900"}
            _hover={{ bg: mode === opt.value ? "white" : "whiteAlpha.300" }}
            onClick={() => setMode(opt.value)}
            borderRadius="full"
          >
            {opt.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
}
