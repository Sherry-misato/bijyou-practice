"use client";

import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import Ornament from "./Ornament";

type Props = {
  emoji: string;
  frenchSubtitle: string;
  title: string;
  description: string;
};

export default function PageHeader({ emoji, frenchSubtitle, title, description }: Props) {
  return (
    <Box
      className="bijyou-fade-in"
      mb="7"
      p={{ base: "5", md: "7" }}
      borderRadius="3xl"
      position="relative"
      overflow="hidden"
      bg="linear-gradient(135deg, #fff0f5 0%, #fdf1f4 45%, #fbe9f0 100%)"
      borderWidth="1px"
      borderColor="pink.100"
      boxShadow="0 8px 24px -12px rgba(217, 124, 160, 0.35)"
    >
      <Text position="absolute" top="3" right="4" fontSize="2xl" opacity="0.7">
        🎀
      </Text>
      <Stack gap="2">
        <Text
          className="font-display"
          fontSize="sm"
          fontStyle="italic"
          color="pink.400"
          letterSpacing="0.08em"
        >
          {emoji} {frenchSubtitle}
        </Text>
        <Heading className="font-display" fontSize={{ base: "3xl", md: "4xl" }} color="pink.700">
          {title}
        </Heading>
        <Ornament />
        <Text color="gray.600" fontSize="sm" maxW="560px">
          {description}
        </Text>
      </Stack>
    </Box>
  );
}
